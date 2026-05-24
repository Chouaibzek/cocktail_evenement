import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      setServerError('Email ou mot de passe incorrect.')
      return
    }
    navigate(redirectTo)
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main
        className="px-8 mx-auto flex items-center justify-center"
        style={{ maxWidth: '480px', minHeight: '100vh', paddingTop: '6rem' }}
      >
        <div className="w-full flex flex-col" style={{ gap: '2.5rem' }}>

          {/* Header */}
          <div className="flex flex-col" style={{ gap: '0.75rem' }}>
            <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
              — CONNEXION
            </p>
            <h1 className="font-display italic text-charcoal m-0" style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>
              Bon retour
            </h1>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '1.25rem' }}>

            <div className="flex flex-col" style={{ gap: '0.4rem' }}>
              <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                EMAIL
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="font-body text-charcoal bg-cream w-full"
                style={{
                  border: '1px solid rgba(26,23,20,0.25)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              {errors.email && (
                <span className="font-body text-accent" style={{ fontSize: '0.75rem' }}>{errors.email.message}</span>
              )}
            </div>

            <div className="flex flex-col" style={{ gap: '0.4rem' }}>
              <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                MOT DE PASSE
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="font-body text-charcoal bg-cream w-full"
                style={{
                  border: '1px solid rgba(26,23,20,0.25)',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              {errors.password && (
                <span className="font-body text-accent" style={{ fontSize: '0.75rem' }}>{errors.password.message}</span>
              )}
            </div>

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
              {isSubmitting ? 'CONNEXION...' : 'SE CONNECTER'}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="font-body text-charcoal m-0 text-center" style={{ fontSize: '0.8rem', opacity: 0.6 }}>
            Pas encore de compte ?{' '}
            <Link
              to={`/register${redirectTo !== '/' ? `?redirect=${redirectTo}` : ''}`}
              className="text-charcoal hover:text-accent transition-colors duration-200"
              style={{ opacity: 1 }}
            >
              Créer un compte
            </Link>
          </p>

        </div>
      </main>
    </div>
  )
}
