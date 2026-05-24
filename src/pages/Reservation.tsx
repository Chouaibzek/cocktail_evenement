import { useEffect, useRef, useState } from 'react'
import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import { createViewMonthGrid } from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Reservation() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set())
  const unavailableRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    async function fetchUnavailable() {
      const [{ data: blocked }, { data: reserved }] = await Promise.all([
        supabase.from('disponibilites').select('date').eq('statut', 'bloque'),
        supabase.from('reservations').select('date').neq('statut', 'annulée'),
      ])
      const dates = new Set<string>([
        ...(blocked  ?? []).map((d: { date: string }) => d.date),
        ...(reserved ?? []).map((d: { date: string }) => d.date),
      ])
      setUnavailableDates(dates)
      unavailableRef.current = dates
    }
    fetchUnavailable()
  }, [])

  const calendar = useCalendarApp({
    views: [createViewMonthGrid()],
    locale: 'fr-FR',
    events: [],
    calendars: {
      indisponible: {
        colorName: 'indisponible',
        lightColors: {
          main:        'rgba(26,23,20,0.35)',
          container:   'rgba(26,23,20,0.07)',
          onContainer: 'rgba(26,23,20,0.4)',
        },
      },
    },
    callbacks: {
      onClickDate(date: string) {
        if (unavailableRef.current.has(date)) return
        if (!user) {
          navigate(`/login?redirect=/reservation/formulaire?date=${date}`)
        } else {
          navigate(`/reservation/formulaire?date=${date}`)
        }
      },
    },
  })

  // Inject unavailable dates as events once data is loaded
  useEffect(() => {
    if (unavailableDates.size === 0) return
    calendar?.events.set(
      [...unavailableDates].map(date => ({
        id:         `unavailable-${date}`,
        title:      'Non disponible',
        start:      `${date} 00:00`,
        end:        `${date} 23:59`,
        calendarId: 'indisponible',
      }))
    )
  }, [unavailableDates])

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <style>{`
        .sx__month-grid-day.is-leading-or-trailing {
          pointer-events: none;
        }
        .sx__month-grid-day.is-leading-or-trailing .sx__month-grid-day__header-date {
          visibility: hidden;
        }
        .sx__month-grid-day:not(.is-leading-or-trailing) {
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .sx__month-grid-day:not(.is-leading-or-trailing):hover {
          background: rgba(181, 120, 90, 0.08);
        }
        .sx__month-grid-day.sx__selected-day {
          background: rgba(181, 120, 90, 0.15);
        }
        .sx__calendar-wrapper {
          background: transparent;
          border: 1px solid rgba(26, 23, 20, 0.12);
        }
        .sx__month-grid-day__header-day-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #B5785A;
        }
        /* Mobile */
        .sx__calendar-wrapper {
          min-width: 0 !important;
          width: 100% !important;
        }
        .sx__month-grid {
          min-width: 0 !important;
        }
        .sx__month-grid-day {
          min-width: 0 !important;
          overflow: hidden;
        }
        @media (max-width: 480px) {
          .sx__month-grid-day__header-date {
            font-size: 0.7rem;
          }
          .sx__month-grid-day__header-day-name {
            font-size: 0.55rem;
            letter-spacing: 0.05em;
          }
          .sx__event-title {
            font-size: 0.55rem;
          }
        }
      `}</style>

      <main
        className="mx-auto"
        style={{
          maxWidth: '1200px',
          paddingTop: '7rem',
          paddingBottom: '6rem',
          paddingLeft: 'clamp(1.25rem, 5vw, 6rem)',
          paddingRight: 'clamp(1.25rem, 5vw, 6rem)',
        }}
      >
        <div className="flex flex-col" style={{ gap: '1rem', marginBottom: '3rem' }}>
          <p className="font-body text-accent m-0" style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}>
            — RÉSERVATION
          </p>
          <h1
            className="font-display italic text-charcoal m-0"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Choisissez une date
          </h1>
        </div>

        <ScheduleXCalendar calendarApp={calendar} />

        <p className="font-body text-charcoal m-0" style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.5 }}>
          Cliquez sur un jour disponible pour démarrer votre demande de réservation.
        </p>
      </main>
    </div>
  )
}
