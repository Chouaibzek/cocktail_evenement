import { useState, useEffect, useCallback } from 'react'
import Navbar from '../components/Navbar'
import visu1 from '../assets/gallerie/visu_1.jpg'
import visu2 from '../assets/gallerie/visu_2.jpg'
import visu3 from '../assets/gallerie/visu_3.jpg'
import visu4 from '../assets/gallerie/visu_4.jpg'
import visu5 from '../assets/gallerie/visu_5.jpg'

const events = [
  { id: 1, src: visu1, title: 'Soirée Privée', lieu: 'Paris 8e', annee: '2024' },
  { id: 2, src: visu2, title: "Cocktail d'Entreprise", lieu: 'La Défense', annee: '2024' },
  { id: 3, src: visu3, title: 'Mariage', lieu: 'Château de Vaux', annee: '2023' },
  { id: 4, src: visu4, title: 'Lancement de Produit', lieu: 'Opéra Garnier', annee: '2024' },
  { id: 5, src: visu5, title: 'Anniversaire', lieu: 'Rooftop Paris', annee: '2023' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function Galerie() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const openLightbox = (id: number) => setLightbox(id)
  const closeLightbox = () => setLightbox(null)

  const navigate = useCallback((dir: 1 | -1) => {
    if (lightbox === null) return
    const idx = events.findIndex(e => e.id === lightbox)
    const next = (idx + dir + events.length) % events.length
    setLightbox(events[next].id)
  }, [lightbox])

  useEffect(() => {
    if (lightbox === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, navigate])

  // Swipe sur mobile
  useEffect(() => {
    if (lightbox === null) return
    let startX = 0
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX }
    const onTouchEnd = (e: TouchEvent) => {
      const diff = startX - e.changedTouches[0].clientX
      if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1)
    }
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [lightbox, navigate])

  const active = lightbox !== null ? events.find(e => e.id === lightbox) : null

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main
        className="mx-auto"
        style={{
          maxWidth: '1200px',
          paddingTop: '7rem',
          paddingBottom: '6rem',
          paddingLeft: isMobile ? '1.5rem' : 'clamp(2rem, 6vw, 6rem)',
          paddingRight: isMobile ? '1.5rem' : 'clamp(2rem, 6vw, 6rem)',
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col"
          style={{
            gap: '1rem',
            marginBottom: isMobile ? '2.5rem' : '4rem',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p
            className="font-body text-accent m-0"
            style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}
          >
            — NOS ÉVÉNEMENTS
          </p>
          <h1
            className="font-display italic text-charcoal m-0"
            style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            L'album
          </h1>
          <p
            className="font-body text-charcoal m-0"
            style={{ fontSize: '0.85rem', opacity: 0.55, maxWidth: '420px', lineHeight: 1.7 }}
          >
            Chaque événement est une histoire. Voici quelques instants capturés au fil de nos collaborations.
          </p>
        </div>

        {/* Grid — desktop éditorial / mobile colonne */}
        {isMobile ? (
          <MobileGrid visible={visible} onOpen={openLightbox} />
        ) : (
          <DesktopGrid visible={visible} onOpen={openLightbox} />
        )}

        {/* Counter */}
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'flex-end',
            opacity: visible ? 0.35 : 0,
            transition: 'opacity 0.7s ease 0.6s',
          }}
        >
          <span className="font-body text-charcoal" style={{ fontSize: '0.65rem', letterSpacing: '0.2em' }}>
            {events.length} ÉVÉNEMENTS
          </span>
        </div>
      </main>

      {/* Lightbox */}
      {active && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(26,23,20,0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

          {/* Close */}
          <button
            onClick={closeLightbox}
            className="font-body text-cream cursor-pointer bg-transparent border-none"
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              fontSize: '0.65rem',
              letterSpacing: '0.2em',
              opacity: 0.7,
              padding: '0.5rem',
              zIndex: 1,
            }}
          >
            FERMER ✕
          </button>

          {/* Prev — caché sur mobile (swipe à la place) */}
          {!isMobile && (
            <button
              onClick={e => { e.stopPropagation(); navigate(-1) }}
              className="font-body text-cream cursor-pointer bg-transparent border-none"
              style={{
                position: 'absolute',
                left: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.5rem',
                opacity: 0.4,
                transition: 'opacity 0.2s',
                padding: '1rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
            >
              ←
            </button>
          )}

          {/* Next — caché sur mobile */}
          {!isMobile && (
            <button
              onClick={e => { e.stopPropagation(); navigate(1) }}
              className="font-body text-cream cursor-pointer bg-transparent border-none"
              style={{
                position: 'absolute',
                right: '1.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.5rem',
                opacity: 0.4,
                transition: 'opacity 0.2s',
                padding: '1rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
            >
              →
            </button>
          )}

          {/* Image + caption */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
              width: isMobile ? '100vw' : 'auto',
              maxWidth: isMobile ? '100vw' : '80vw',
              maxHeight: '85vh',
              padding: isMobile ? '0 1rem' : 0,
            }}
          >
            <img
              key={active.id}
              src={active.src}
              alt={active.title}
              style={{
                maxWidth: '100%',
                maxHeight: isMobile ? '60vh' : '72vh',
                objectFit: 'contain',
                animation: 'fadeIn 0.3s ease',
              }}
            />
            <div style={{ textAlign: 'center' }}>
              <p
                className="font-display italic text-cream m-0"
                style={{ fontSize: isMobile ? '1.2rem' : '1.4rem', marginBottom: '0.3rem' }}
              >
                {active.title}
              </p>
              <p
                className="font-body text-cream m-0"
                style={{ fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.5 }}
              >
                {active.lieu} — {active.annee}
              </p>
            </div>
          </div>

          {/* Indicateur de position + navigation mobile */}
          <div
            style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {/* Flèches tap sur mobile */}
            {isMobile && (
              <div style={{ display: 'flex', gap: '2rem' }}>
                <button
                  onClick={e => { e.stopPropagation(); navigate(-1) }}
                  className="font-body text-cream bg-transparent border-none cursor-pointer"
                  style={{ fontSize: '1.3rem', opacity: 0.6, padding: '0.5rem 1rem' }}
                >
                  ←
                </button>
                <button
                  onClick={e => { e.stopPropagation(); navigate(1) }}
                  className="font-body text-cream bg-transparent border-none cursor-pointer"
                  style={{ fontSize: '1.3rem', opacity: 0.6, padding: '0.5rem 1rem' }}
                >
                  →
                </button>
              </div>
            )}

            {/* Pills */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {events.map(e => (
                <button
                  key={e.id}
                  onClick={ev => { ev.stopPropagation(); setLightbox(e.id) }}
                  style={{
                    width: e.id === active.id ? '1.5rem' : '0.4rem',
                    height: '0.4rem',
                    background: '#F5EDE3',
                    opacity: e.id === active.id ? 0.9 : 0.3,
                    border: 'none',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Desktop : grille éditoriale asymétrique ───────────────────────────────

type GridProps = { visible: boolean; onOpen: (id: number) => void }

function DesktopGrid({ visible, onOpen }: GridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '1rem',
      }}
    >
      <GalleryItem event={events[0]} style={{ gridColumn: '1 / 8', gridRow: '1 / 3', aspectRatio: '4/5' }}  delay={100} visible={visible} onOpen={onOpen} />
      <GalleryItem event={events[1]} style={{ gridColumn: '8 / 13', gridRow: '1 / 2', aspectRatio: '16/9' }} delay={200} visible={visible} onOpen={onOpen} />
      <GalleryItem event={events[2]} style={{ gridColumn: '8 / 13', gridRow: '2 / 3', aspectRatio: '16/9' }} delay={300} visible={visible} onOpen={onOpen} />
      <GalleryItem event={events[3]} style={{ gridColumn: '1 / 7',  gridRow: '3 / 4', aspectRatio: '3/2' }}  delay={400} visible={visible} onOpen={onOpen} />
      <GalleryItem event={events[4]} style={{ gridColumn: '7 / 13', gridRow: '3 / 4', aspectRatio: '3/2' }}  delay={500} visible={visible} onOpen={onOpen} />
    </div>
  )
}

// ─── Mobile : deux colonnes avec hauteurs alternées ────────────────────────

function MobileGrid({ visible, onOpen }: GridProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Première image : pleine largeur, format portrait */}
      <GalleryItem
        event={events[0]}
        style={{ width: '100%', aspectRatio: '4/3' }}
        delay={100}
        visible={visible}
        onOpen={onOpen}
      />

      {/* Deux images côte à côte */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <GalleryItem event={events[1]} style={{ aspectRatio: '3/4' }} delay={200} visible={visible} onOpen={onOpen} />
        <GalleryItem event={events[2]} style={{ aspectRatio: '3/4' }} delay={300} visible={visible} onOpen={onOpen} />
      </div>

      {/* Deux images côte à côte inversées */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '0.75rem' }}>
        <GalleryItem event={events[3]} style={{ aspectRatio: '2/3' }} delay={400} visible={visible} onOpen={onOpen} />
        <GalleryItem event={events[4]} style={{ aspectRatio: '2/3' }} delay={500} visible={visible} onOpen={onOpen} />
      </div>
    </div>
  )
}

// ─── Item ──────────────────────────────────────────────────────────────────

type GalleryItemProps = {
  event: typeof events[0]
  style: React.CSSProperties
  delay: number
  visible: boolean
  onOpen: (id: number) => void
}

function GalleryItem({ event, style, delay, visible, onOpen }: GalleryItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
      onClick={() => onOpen(event.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={event.src}
        alt={event.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.6s ease',
        }}
      />

      {/* Overlay dégradé */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(26,23,20,0.65) 0%, transparent 55%)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Caption au hover */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '1rem 1rem 0.85rem',
          transform: hovered ? 'translateY(0)' : 'translateY(6px)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        <p
          className="font-display italic text-cream m-0"
          style={{ fontSize: '1rem', marginBottom: '0.15rem' }}
        >
          {event.title}
        </p>
        <p
          className="font-body text-cream m-0"
          style={{ fontSize: '0.58rem', letterSpacing: '0.18em', opacity: 0.7 }}
        >
          {event.lieu} — {event.annee}
        </p>
      </div>
    </div>
  )
}
