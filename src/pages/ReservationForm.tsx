import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { sendReservationEmail, sendConfirmationEmail } from '../services/emailService'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'

const schema = z.object({
  nb_invites:     z.string().min(1, 'Champ requis'),
  lieu_evenement: z.string().min(2, 'Champ requis'),
  type_evenement: z.string().min(2, 'Champ requis'),
  message:        z.string().optional(),
})

type FormData = z.infer<typeof schema>

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ReservationForm() {
  const [searchParams] = useSearchParams()
  const { user, profile } = useAuth()
  const date = searchParams.get('date') || ''
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')

    if (!user) {
      setServerError('Vous devez être connecté pour envoyer une demande.')
      return
    }

    const nb = parseInt(data.nb_invites, 10)
    if (isNaN(nb) || nb < 1) {
      setServerError("Nombre d'invités invalide.")
      return
    }

    // 1. Sauvegarde dans Supabase
    const { error: dbError } = await supabase.from('reservations').insert({
      date,
      client_id:      user.id,
      nb_invites:     nb,
      lieu_evenement: data.lieu_evenement,
      type_evenement: data.type_evenement,
      message:        data.message ?? '',
      statut:         'en_attente',
    })

    if (dbError) {
      if (dbError.code === '23505') {
        setServerError('Cette date est déjà réservée. Veuillez en choisir une autre.')
      } else {
        setServerError(`Erreur : ${dbError.message}`)
      }
      return
    }

    // 2. Envoi emails (optionnel — ne bloque pas si non configuré)
    if (import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
      const emailParams = {
        client_nom:       profile?.nom ?? '',
        client_prenom:    profile?.prenom ?? '',
        client_email:     user.email ?? '',
        client_telephone: profile?.telephone ?? '',
        lieu_evenement:   data.lieu_evenement,
        type_evenement:   data.type_evenement,
        event_date:       formatDate(date),
        nb_invites:       nb,
        message:          data.message,
      }
      try {
        await Promise.all([
          sendReservationEmail(emailParams),   // notification à Sara
          sendConfirmationEmail(emailParams),  // confirmation à la cliente
        ])
      } catch {
        console.warn('Un email n\'a pas pu être envoyé, réservation enregistrée.')
      }
    }

    setSuccess(true)
  }

  if (!date) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <main className="px-8 mx-auto flex items-center justify-center" style={{ minHeight: '100vh' }}>
          <p className="font-body text-charcoal">
            Aucune date sélectionnée.{' '}
            <Link to="/reservation" className="text-accent">Retour au calendrier</Link>
          </p>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main className="px-8 mx-auto" style={{ maxWidth: '560px', paddingTop: '8rem', paddingBottom: '4rem' }}>

        {success ? (
          /* ── Confirmation ── */
          <div className="flex flex-col" style={{ gap: '1.5rem', animation: 'fadeUp 0.3s ease' }}>
            <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }`}</style>
            <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
              — DEMANDE ENVOYÉE
            </p>
            <h1 className="font-display italic text-charcoal m-0" style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>
              Merci {profile?.prenom} !
            </h1>
            <p className="font-body text-charcoal m-0 leading-relaxed" style={{ fontSize: '0.95rem', opacity: 0.7 }}>
              Votre demande pour le <strong>{formatDate(date)}</strong> a bien été reçue.
              Sara vous recontactera dans les plus brefs délais pour confirmer votre réservation.
            </p>
            <Link
              to="/reservation"
              className="font-body bg-charcoal text-cream no-underline hover:bg-accent transition-colors duration-200 text-center"
              style={{ fontSize: '0.65rem', letterSpacing: '0.2em', padding: '1rem 2rem', display: 'inline-block', marginTop: '0.5rem' }}
            >
              RETOUR AU CALENDRIER
            </Link>
          </div>
        ) : (
          /* ── Formulaire ── */
          <div className="flex flex-col" style={{ gap: '2.5rem' }}>

            {/* Header */}
            <div className="flex flex-col" style={{ gap: '0.75rem' }}>
              <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
                — RÉSERVATION
              </p>
              <h1 className="font-display italic text-charcoal m-0" style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>
                Votre demande
              </h1>
              <p className="font-display italic text-charcoal m-0" style={{ fontSize: '1.3rem', opacity: 0.7 }}>
                {formatDate(date)}
              </p>
            </div>

            {/* Récap profil */}
            {profile && (
              <div style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(26,23,20,0.12)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span className="font-body text-accent" style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>VOS COORDONNÉES</span>
                <span className="font-body text-charcoal" style={{ fontSize: '0.9rem' }}>
                  {profile.prenom} {profile.nom}
                </span>
                <span className="font-body text-charcoal" style={{ fontSize: '0.85rem', opacity: 0.6 }}>
                  {user?.email} · {profile.telephone}
                </span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col" style={{ gap: '1.5rem' }}>

              <div className="flex flex-col" style={{ gap: '0.4rem' }}>
                <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                  NOMBRE D'INVITÉS
                </label>
                <input
                  {...register('nb_invites')}
                  type="number"
                  min={1}
                  max={500}
                  placeholder="ex: 80"
                  className="font-body text-charcoal bg-cream w-full"
                  style={{ border: '1px solid rgba(26,23,20,0.25)', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none' }}
                />
                {errors.nb_invites && (
                  <span className="font-body text-accent" style={{ fontSize: '0.75rem' }}>{errors.nb_invites.message}</span>
                )}
              </div>

              <div className="flex flex-col" style={{ gap: '0.4rem' }}>
                <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                  TYPE D'ÉVÉNEMENT
                </label>
                <input
                  {...register('type_evenement')}
                  type="text"
                  placeholder="ex: Mariage, Anniversaire, Soirée d'entreprise..."
                  className="font-body text-charcoal bg-cream w-full"
                  style={{ border: '1px solid rgba(26,23,20,0.25)', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none' }}
                />
                {errors.type_evenement && (
                  <span className="font-body text-accent" style={{ fontSize: '0.75rem' }}>{errors.type_evenement.message}</span>
                )}
              </div>

              <div className="flex flex-col" style={{ gap: '0.4rem' }}>
                <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                  LIEU DE L'ÉVÉNEMENT
                </label>
                <input
                  {...register('lieu_evenement')}
                  type="text"
                  placeholder="ex: Salle des fêtes de Bruxelles, domicile..."
                  className="font-body text-charcoal bg-cream w-full"
                  style={{ border: '1px solid rgba(26,23,20,0.25)', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none' }}
                />
                {errors.lieu_evenement && (
                  <span className="font-body text-accent" style={{ fontSize: '0.75rem' }}>{errors.lieu_evenement.message}</span>
                )}
              </div>

              <div className="flex flex-col" style={{ gap: '0.4rem' }}>
                <label className="font-body text-charcoal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em' }}>
                  MESSAGE <span style={{ opacity: 0.4, textTransform: 'none', letterSpacing: 0 }}>(optionnel)</span>
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Précisions sur l'événement, demandes particulières..."
                  className="font-body text-charcoal bg-cream w-full"
                  style={{ border: '1px solid rgba(26,23,20,0.25)', padding: '0.75rem 1rem', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              {serverError && (
                <p className="font-body text-accent m-0" style={{ fontSize: '0.8rem' }}>{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="font-body bg-charcoal text-cream w-full transition-colors duration-200 hover:bg-accent"
                style={{ fontSize: '0.65rem', letterSpacing: '0.2em', padding: '1rem', border: 'none', cursor: isSubmitting ? 'wait' : 'pointer' }}
              >
                {isSubmitting ? 'ENVOI EN COURS...' : 'ENVOYER MA DEMANDE'}
              </button>

              <Link
                to="/reservation"
                className="font-body text-charcoal no-underline hover:text-accent transition-colors duration-200 text-center"
                style={{ fontSize: '0.7rem', opacity: 0.5 }}
              >
                ← Choisir une autre date
              </Link>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
