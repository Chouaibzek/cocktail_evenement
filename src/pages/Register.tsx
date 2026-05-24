import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const schema = z.object({
  prenom: z.string().min(2, 'Minimum 2 caractères'),
  nom: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(10, 'Numéro invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

const fields: { name: keyof FormData; label: string; type?: string; autoComplete?: string }[] = [
  { name: 'prenom',          label: 'PRÉNOM',          autoComplete: 'given-name' },
  { name: 'nom',             label: 'NOM',             autoComplete: 'family-name' },
  { name: 'email',           label: 'EMAIL',           type: 'email',    autoComplete: 'email' },
  { name: 'telephone',       label: 'TÉLÉPHONE',       type: 'tel',      autoComplete: 'tel' },
  { name: 'password',        label: 'MOT DE PASSE',    type: 'password', autoComplete: 'new-password' },
  { name: 'confirmPassword', label: 'CONFIRMER LE MOT DE PASSE', type: 'password', autoComplete: 'new-password' },
]

export default function Register() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (signUpError || !authData.user) {
      setServerError(signUpError?.message || 'Erreur lors de la création du compte.')
      return
    }

    // Mise à jour du profil avec les informations personnelles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
      })

    if (profileError) {
      setServerError('Compte créé mais erreur lors de la sauvegarde du profil.')
      return
    }

    navigate(redirectTo)
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main
        className="px-8 mx-auto"
        style={{ maxWidth: '520px', paddingTop: '8rem', paddingBottom: '4rem' }}
      >
        <div className="w-full flex flex-col" style={{ gap: '2.5rem' }}>

          {/* Header */}
          <div className="flex flex-col" style={{ gap: '0.75rem' }}>
            <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
              — INSCRIPTION
            </p>
            <h1 className="font-display italic text-charcoal m-0" style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>
              Créer un compte
            </h1>
            <p className="font-body text-charcoal m-0" style={{ fontSize: '0.85rem', opacity: 0.6 }}>
              Vos informations seront pré-remplies à chaque réservation.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '1.25rem' }}>
            {fields.map(field => (
              <div key={field.name} className="flex flex-col" style={{ gap: '0.4rem' }}>
                <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                  {field.label}
                </label>
                <input
                  {...register(field.name)}
                  type={field.type || 'text'}
                  autoComplete={field.autoComplete}
                  className="font-body text-charcoal bg-cream w-full"
                  style={{
                    border: '1px solid rgba(26,23,20,0.25)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
                {errors[field.name] && (
                  <span className="font-body text-accent" style={{ fontSize: '0.75rem' }}>
                    {errors[field.name]?.message}
                  </span>
                )}
              </div>
            ))}

            {serverError && (
              <p className="font-body text-accent m-0" style={{ fontSize: '0.8rem' }}>{serverError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="font-body bg-charcoal text-cream w-full transition-colors duration-200 hover:bg-accent"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                padding: '1rem',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                marginTop: '0.5rem',
              }}
            >
              {isSubmitting ? 'CRÉATION...' : 'CRÉER MON COMPTE'}
            </button>
          </form>

          {/* Lien connexion */}
          <p className="font-body text-charcoal m-0 text-center" style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            Déjà un compte ?{' '}
            <Link
              to={`/login${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
              className="text-charcoal hover:text-accent transition-colors duration-200"
              style={{ opacity: 1 }}
            >
              Se connecter
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}
