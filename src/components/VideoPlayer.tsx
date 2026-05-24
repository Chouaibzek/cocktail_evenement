import { useState } from 'react'

interface Props {
  src?: string
  embedUrl?: string
  poster?: string
}

export default function VideoPlayer({ src, embedUrl, poster }: Props) {
  const [playing, setPlaying] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#1A1714', overflow: 'hidden' }}>

      {!playing ? (
        /* Poster + bouton Play */
        <button
          onClick={() => setPlaying(true)}
          aria-label="Lire la vidéo"
          style={{ all: 'unset', display: 'block', width: '100%', height: '100%', cursor: 'pointer', position: 'relative' }}
        >
          {poster && (
            <img src={poster} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.3)' }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245,237,227,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" style={{ marginLeft: '3px' }}>
                <polygon points="5,3 18,10 5,17" fill="#1A1714" />
              </svg>
            </div>
          </div>
        </button>
      ) : src ? (
        <video
          src={src}
          poster={poster}
          controls
          autoPlay
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : embedUrl ? (
        <iframe
          src={`${embedUrl}?autoplay=1&rel=0`}
          title="Vidéo de présentation"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      ) : null}
    </div>
  )
}
