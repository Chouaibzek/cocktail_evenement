import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const JOURS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MOIS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

function toYMD(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay()
  // Lundi = 0 … Dimanche = 6
  const offset = (firstDay + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function Reservation() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [unavailable, setUnavailable] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetch() {
      const [{ data: blocked }, { data: reserved }] = await Promise.all([
        supabase.from('disponibilites').select('date').eq('statut', 'bloque'),
        supabase.from('reservations').select('date').neq('statut', 'annulée'),
      ])
      setUnavailable(new Set<string>([
        ...(blocked ?? []).map((d: { date: string }) => d.date),
        ...(reserved ?? []).map((d: { date: string }) => d.date),
      ]))
    }
    fetch()
  }, [])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const handleDay = (day: number) => {
    const date = toYMD(year, month, day)
    const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (isPast || unavailable.has(date)) return
    if (!user) {
      navigate(`/login?redirect=/reservation/formulaire?date=${date}`)
    } else {
      navigate(`/reservation/formulaire?date=${date}`)
    }
  }

  const cells = buildCalendarDays(year, month)
  const todayYMD = toYMD(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main
        className="mx-auto"
        style={{
          maxWidth: '720px',
          paddingTop: '7rem',
          paddingBottom: '6rem',
          paddingLeft: 'clamp(1.25rem, 5vw, 3rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 3rem)',
        }}
      >
        {/* Header */}
        <div className="flex flex-col" style={{ gap: '1rem', marginBottom: '3rem' }}>
          <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
            — RÉSERVATION
          </p>
          <h1
            className="font-display italic text-charcoal m-0"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Choisissez une date
          </h1>
        </div>

        {/* Calendrier */}
        <div style={{ border: '1px solid rgba(26,23,20,0.12)', background: '#fff' }}>

          {/* Navigation mois */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(26,23,20,0.08)',
            }}
          >
            <button
              onClick={prevMonth}
              className="font-body text-charcoal bg-transparent border-none cursor-pointer"
              style={{ fontSize: '1.1rem', opacity: 0.5, padding: '0.25rem 0.5rem', lineHeight: 1 }}
            >
              ←
            </button>
            <span className="font-display italic text-charcoal" style={{ fontSize: '1.3rem' }}>
              {MOIS[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="font-body text-charcoal bg-transparent border-none cursor-pointer"
              style={{ fontSize: '1.1rem', opacity: 0.5, padding: '0.25rem 0.5rem', lineHeight: 1 }}
            >
              →
            </button>
          </div>

          {/* Jours de la semaine */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {JOURS.map(j => (
              <div
                key={j}
                className="font-body text-accent"
                style={{
                  textAlign: 'center',
                  fontSize: '0.58rem',
                  letterSpacing: '0.15em',
                  padding: '0.75rem 0',
                  borderBottom: '1px solid rgba(26,23,20,0.08)',
                }}
              >
                {j.toUpperCase()}
              </div>
            ))}
          </div>

          {/* Cellules */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} style={{ aspectRatio: '1', borderBottom: '1px solid rgba(26,23,20,0.05)', borderRight: i % 7 !== 6 ? '1px solid rgba(26,23,20,0.05)' : 'none' }} />
              }
              const ymd = toYMD(year, month, day)
              const isUnavailable = unavailable.has(ymd)
              const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())
              const isToday = ymd === todayYMD
              const disabled = isUnavailable || isPast

              return (
                <button
                  key={day}
                  onClick={() => !disabled && handleDay(day)}
                  className="font-body"
                  style={{
                    aspectRatio: '1',
                    border: 'none',
                    borderBottom: '1px solid rgba(26,23,20,0.05)',
                    borderRight: i % 7 !== 6 ? '1px solid rgba(26,23,20,0.05)' : 'none',
                    background: isUnavailable ? 'rgba(26,23,20,0.04)' : 'transparent',
                    color: disabled ? 'rgba(26,23,20,0.2)' : '#1A1714',
                    cursor: disabled ? 'default' : 'pointer',
                    fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
                    fontWeight: isToday ? 500 : 400,
                    position: 'relative',
                    transition: 'background 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = 'rgba(181,120,90,0.1)' }}
                  onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = isUnavailable ? 'rgba(26,23,20,0.04)' : 'transparent' }}
                >
                  {/* Point "aujourd'hui" */}
                  {isToday && (
                    <span style={{
                      position: 'absolute',
                      bottom: '15%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: '#B5785A',
                    }} />
                  )}
                  {day}
                </button>
              )
            })}
          </div>
        </div>

        {/* Légende */}
        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(26,23,20,0.08)', display: 'inline-block' }} />
            <span className="font-body text-charcoal" style={{ fontSize: '0.7rem', opacity: 0.5 }}>Non disponible</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', background: 'rgba(181,120,90,0.1)', border: '1px solid rgba(181,120,90,0.3)', display: 'inline-block' }} />
            <span className="font-body text-charcoal" style={{ fontSize: '0.7rem', opacity: 0.5 }}>Disponible</span>
          </div>
        </div>

        <p className="font-body text-charcoal m-0" style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.4 }}>
          Appuyez sur un jour disponible pour démarrer votre demande.
        </p>
      </main>
    </div>
  )
}
