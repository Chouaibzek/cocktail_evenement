import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'

type ReservationStatut = 'en_attente' | 'confirmée' | 'annulée'

type Reservation = {
  id: string
  date: string
  nb_invites: number
  message: string
  lieu_evenement: string
  type_evenement: string
  statut: ReservationStatut
  client_id: string
  profiles: { nom: string; prenom: string; telephone: string } | null
}

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAY_NAMES   = ['LUN','MAR','MER','JEU','VEN','SAM','DIM']

const STATUT_COLORS: Record<ReservationStatut, string> = {
  en_attente: '#B5785A',
  confirmée:  '#2d7a4f',
  annulée:    'rgba(26,23,20,0.3)',
}
const STATUT_LABELS: Record<ReservationStatut, string> = {
  en_attente: 'EN ATTENTE',
  confirmée:  'CONFIRMÉE',
  annulée:    'ANNULÉE',
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function Admin() {
  const { profile, loading } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab]               = useState<'reservations' | 'calendrier'>('reservations')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set())
  const [loadingData, setLoadingData]   = useState(true)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  // Redirect if not admin once auth is resolved
  useEffect(() => {
    if (!loading && profile?.role !== 'admin') navigate('/')
  }, [loading, profile, navigate])

  useEffect(() => {
    if (profile?.role === 'admin') fetchAll()
  }, [profile])

  async function fetchAll() {
    setLoadingData(true)
    await Promise.all([fetchReservations(), fetchBlockedDates()])
    setLoadingData(false)
  }

  async function fetchReservations() {
    const { data } = await supabase
      .from('reservations')
      .select('*, profiles(nom, prenom, telephone)')
      .order('date', { ascending: true })
    if (data) setReservations(data as Reservation[])
  }

  async function fetchBlockedDates() {
    const { data } = await supabase
      .from('disponibilites')
      .select('date')
      .eq('statut', 'bloque')
    if (data) setBlockedDates(new Set(data.map((d: { date: string }) => d.date)))
  }

  async function updateStatut(id: string, statut: ReservationStatut) {
    await supabase.from('reservations').update({ statut }).eq('id', id)
    setReservations(prev => prev.map(r => r.id === id ? { ...r, statut } : r))
  }

  async function toggleDate(dateStr: string) {
    const hasReservation = reservations.some(
      r => r.date === dateStr && r.statut !== 'annulée'
    )
    if (hasReservation) return

    if (blockedDates.has(dateStr)) {
      await supabase.from('disponibilites').delete().eq('date', dateStr)
      setBlockedDates(prev => { const s = new Set(prev); s.delete(dateStr); return s })
    } else {
      await supabase.from('disponibilites').upsert({ date: dateStr, statut: 'bloque' })
      setBlockedDates(prev => new Set([...prev, dateStr]))
    }
  }

  // ── Calendar grid ──────────────────────────────────────────────
  const { year, month } = calMonth
  const startOffset  = (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0
  const daysInMonth  = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const today    = new Date()
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate())
  const reservedDates = new Set(
    reservations.filter(r => r.statut !== 'annulée').map(r => r.date)
  )

  const shiftMonth = (delta: number) =>
    setCalMonth(p => {
      const d = new Date(p.year, p.month + delta)
      return { year: d.getFullYear(), month: d.getMonth() }
    })

  // ── Loading / access guard ─────────────────────────────────────
  if (loading || loadingData) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <main style={{ paddingTop: '8rem', display: 'flex', justifyContent: 'center' }}>
          <p className="font-body text-charcoal" style={{ opacity: 0.5 }}>Chargement…</p>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main
        className="px-8 md:px-12 lg:px-24 mx-auto"
        style={{ maxWidth: '1200px', paddingTop: '8rem', paddingBottom: '6rem' }}
      >
        {/* Header */}
        <div className="flex flex-col" style={{ gap: '0.75rem', marginBottom: '3rem' }}>
          <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
            — ADMINISTRATION
          </p>
          <h1
            className="font-display italic text-charcoal m-0"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.1 }}
          >
            Tableau de bord
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid rgba(26,23,20,0.15)', marginBottom: '2.5rem' }}>
          {(['reservations', 'calendrier'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="font-body bg-transparent border-none cursor-pointer"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                padding: '0.75rem 1.5rem',
                marginBottom: '-1px',
                borderBottom: tab === t ? '2px solid #B5785A' : '2px solid transparent',
                color: tab === t ? '#B5785A' : 'rgba(26,23,20,0.5)',
                transition: 'color 0.15s',
              }}
            >
              {t === 'reservations' ? `RÉSERVATIONS (${reservations.length})` : 'CALENDRIER'}
            </button>
          ))}
        </div>

        {/* ── Tab Réservations ── */}
        {tab === 'reservations' && (
          <div className="flex flex-col" style={{ gap: '1rem' }}>
            {reservations.length === 0 ? (
              <p className="font-body text-charcoal" style={{ opacity: 0.4, fontSize: '0.9rem' }}>
                Aucune réservation pour le moment.
              </p>
            ) : reservations.map(r => (
              <div
                key={r.id}
                style={{
                  border: '1px solid rgba(26,23,20,0.12)',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '1rem 2rem',
                  alignItems: 'start',
                }}
              >
                {/* Infos cliente */}
                <div className="flex flex-col" style={{ gap: '0.3rem' }}>
                  <span className="font-body text-accent" style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>
                    CLIENTE
                  </span>
                  <span className="font-body text-charcoal" style={{ fontSize: '0.95rem', fontWeight: 500 }}>
                    {r.profiles?.prenom} {r.profiles?.nom}
                  </span>
                  <span className="font-body text-charcoal" style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                    {r.profiles?.telephone}
                  </span>
                </div>

                {/* Infos événement */}
                <div className="flex flex-col" style={{ gap: '0.3rem' }}>
                  <span className="font-body text-accent" style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}>
                    ÉVÉNEMENT
                  </span>
                  <span className="font-body text-charcoal" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {new Date(r.date + 'T00:00:00').toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  <span className="font-body text-charcoal" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    {r.type_evenement} · {r.nb_invites} invités
                  </span>
                  <span className="font-body text-charcoal" style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                    {r.lieu_evenement}
                  </span>
                  {r.message && (
                    <span className="font-body text-charcoal" style={{ fontSize: '0.8rem', opacity: 0.5, fontStyle: 'italic' }}>
                      "{r.message}"
                    </span>
                  )}
                </div>

                {/* Statut */}
                <div className="flex flex-col items-end" style={{ gap: '0.6rem' }}>
                  <span
                    className="font-body"
                    style={{
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      color: STATUT_COLORS[r.statut],
                      padding: '0.3rem 0.75rem',
                      border: `1px solid ${STATUT_COLORS[r.statut]}`,
                    }}
                  >
                    {STATUT_LABELS[r.statut]}
                  </span>
                  <select
                    value={r.statut}
                    onChange={e => updateStatut(r.id, e.target.value as ReservationStatut)}
                    className="font-body text-charcoal bg-cream"
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.4rem 0.6rem',
                      border: '1px solid rgba(26,23,20,0.25)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="en_attente">En attente</option>
                    <option value="confirmée">Confirmée</option>
                    <option value="annulée">Annulée</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab Calendrier ── */}
        {tab === 'calendrier' && (
          <div className="flex flex-col" style={{ gap: '2rem', maxWidth: '680px' }}>

            {/* Légende */}
            <div className="flex" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { bg: 'rgba(181,120,90,0.15)', border: '1px solid #B5785A',           label: 'Réservé' },
                { bg: 'rgba(26,23,20,0.07)',   border: '1px solid rgba(26,23,20,0.3)', label: 'Bloqué' },
                { bg: 'transparent',           border: '1px solid rgba(26,23,20,0.12)',label: 'Disponible' },
              ].map(({ bg, border, label }) => (
                <div key={label} className="flex items-center" style={{ gap: '0.5rem' }}>
                  <div style={{ width: '14px', height: '14px', background: bg, border }} />
                  <span className="font-body text-charcoal" style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Navigation mois */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => shiftMonth(-1)}
                className="font-body text-charcoal bg-transparent border-none cursor-pointer hover:text-accent"
                style={{ fontSize: '1.1rem', padding: '0.25rem 0.75rem' }}
              >
                ←
              </button>
              <span className="font-display italic text-charcoal" style={{ fontSize: '1.5rem' }}>
                {MONTH_NAMES[month]} {year}
              </span>
              <button
                onClick={() => shiftMonth(1)}
                className="font-body text-charcoal bg-transparent border-none cursor-pointer hover:text-accent"
                style={{ fontSize: '1.1rem', padding: '0.25rem 0.75rem' }}
              >
                →
              </button>
            </div>

            {/* En-têtes jours */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {DAY_NAMES.map(d => (
                <div
                  key={d}
                  className="font-body text-accent text-center"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.15em', padding: '0.4rem 0' }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grille jours */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
              {cells.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />
                const dateStr   = toDateStr(year, month, day)
                const isReserved = reservedDates.has(dateStr)
                const isBlocked  = blockedDates.has(dateStr)
                const isToday    = dateStr === todayStr

                let bg     = 'transparent'
                let border = '1px solid rgba(26,23,20,0.1)'
                if (isReserved)      { bg = 'rgba(181,120,90,0.15)'; border = '1px solid #B5785A' }
                else if (isBlocked)  { bg = 'rgba(26,23,20,0.07)';   border = '1px solid rgba(26,23,20,0.25)' }

                return (
                  <div
                    key={dateStr}
                    onClick={() => toggleDate(dateStr)}
                    title={
                      isReserved ? 'Date réservée — non modifiable'
                      : isBlocked ? 'Cliquer pour débloquer'
                      : 'Cliquer pour bloquer'
                    }
                    style={{
                      background: bg,
                      border,
                      padding: '0.5rem 0.25rem',
                      textAlign: 'center',
                      cursor: isReserved ? 'default' : 'pointer',
                      transition: 'background 0.15s',
                      minHeight: '52px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                    }}
                  >
                    <span
                      className="font-body"
                      style={{
                        fontSize: '0.85rem',
                        color: isToday ? '#B5785A' : 'rgba(26,23,20,0.8)',
                        fontWeight: isToday ? 600 : 400,
                      }}
                    >
                      {day}
                    </span>
                    {isReserved && (
                      <span style={{ fontSize: '0.45rem', letterSpacing: '0.08em', color: '#B5785A', fontFamily: 'DM Sans, sans-serif' }}>
                        RÉSERVÉ
                      </span>
                    )}
                    {isBlocked && !isReserved && (
                      <span style={{ fontSize: '0.45rem', letterSpacing: '0.08em', color: 'rgba(26,23,20,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                        BLOQUÉ
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <p className="font-body text-charcoal m-0" style={{ fontSize: '0.75rem', opacity: 0.4 }}>
              Cliquez sur un jour pour basculer son statut entre disponible et bloqué. Les jours réservés ne peuvent pas être modifiés.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
