import Navbar from '../components/Navbar'
import testVideo from '../assets/video/visu_test_video.mp4'

export default function Home() {
  return (
    <div>
      <Navbar />

      <section
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Vidéo de fond */}
        <video
          src={testVideo}
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Overlay dégradé bas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(26,23,20,0.72) 0%, rgba(26,23,20,0.18) 55%, transparent 100%)',
          }}
        />

        {/* Contenu */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            padding: '0 clamp(2rem, 6vw, 6rem) clamp(3rem, 7vh, 5rem)',
            maxWidth: '780px',
          }}
        >
          <p
            className="font-body text-cream m-0"
            style={{ fontSize: '0.65rem', letterSpacing: '0.28em', opacity: 0.7, marginBottom: '1.25rem' }}
          >
            — MIXOLOGIE ÉVÉNEMENTIELLE
          </p>

          <h1
            className="font-display italic text-cream m-0"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: 1.06, marginBottom: '1.5rem' }}
          >
            L'art du<br />
            cocktail,<br />
            à votre image.
          </h1>

          <p
            className="font-body text-cream m-0 leading-relaxed"
            style={{ fontSize: '0.95rem', opacity: 0.7, maxWidth: '22rem', marginBottom: '2rem' }}
          >
            Mariages, anniversaires, soirées privées — Sara compose des
            cartes sur-mesure et anime votre bar avec l'élégance d'un palace.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            <a
              href="/reservation"
              className="font-body text-cream no-underline transition-colors duration-200 hover:bg-accent"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                padding: '1rem 2rem',
                display: 'inline-block',
                border: '1px solid rgba(245,237,227,0.5)',
              }}
            >
              RÉSERVER UNE DATE
            </a>
            <a
              href="/carte"
              className="font-body text-cream no-underline transition-colors duration-200 hover:text-accent self-center"
              style={{ fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.8 }}
            >
              DÉCOUVRIR LA CARTE &rsaquo;
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
