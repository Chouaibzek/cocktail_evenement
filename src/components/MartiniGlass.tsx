import { useEffect, useState } from 'react'

export default function MartiniGlass() {
  const [scrollRatio, setScrollRatio] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return
      const ratio = Math.min(1, Math.max(0, window.scrollY / maxScroll))
      setScrollRatio(ratio)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Bowl SVG coordinates: rim at y=50, tip at y=178 → height = 128 units
  const BOWL_TOP = 50
  const BOWL_TIP = 178
  const BOWL_HEIGHT = BOWL_TIP - BOWL_TOP

  // liquidY moves from BOWL_TIP (empty) to BOWL_TOP (full) as scroll increases
  const liquidY = BOWL_TIP - scrollRatio * BOWL_HEIGHT

  return (
    <div className="relative flex items-center justify-center">
      {/* Background circle */}
      <div
        className="absolute rounded-full bg-circle"
        style={{ width: '420px', height: '420px' }}
      />

      <svg
        viewBox="0 0 200 290"
        width="320"
        height="320"
        className="relative z-10"
        aria-label="Verre à martini"
        role="img"
      >
        <defs>
          {/* Clip to the bowl triangle so liquid stays inside */}
          <clipPath id="bowl-clip">
            <polygon points="10,50 190,50 100,178" />
          </clipPath>
        </defs>

        {/* Liquid fill — revealed from bottom to top as scroll increases */}
        <g clipPath="url(#bowl-clip)">
          <rect
            x="0"
            y={liquidY}
            width="200"
            height="300"
            fill="rgba(181, 120, 90, 0.22)"
            style={{ transition: 'y 0.05s linear' }}
          />
        </g>

        {/* Bowl left edge */}
        <line
          x1="10" y1="50"
          x2="100" y2="178"
          stroke="#1A1714"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Bowl right edge */}
        <line
          x1="190" y1="50"
          x2="100" y2="178"
          stroke="#1A1714"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Rim ellipse */}
        <ellipse
          cx="100" cy="50"
          rx="90" ry="10"
          fill="none"
          stroke="#1A1714"
          strokeWidth="1.5"
        />

        {/* Stem */}
        <line
          x1="100" y1="178"
          x2="100" y2="248"
          stroke="#1A1714"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Base */}
        <line
          x1="55" y1="248"
          x2="145" y2="248"
          stroke="#1A1714"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
