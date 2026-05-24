import type { Cocktail } from '../data/cocktails'

interface Props {
  cocktail: Cocktail
}

export default function CocktailCard({ cocktail }: Props) {
  return (
    <article
      className="bg-cream flex flex-col overflow-hidden"
      style={{
        border: '1px solid rgba(26, 23, 20, 0.12)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(-4px)'
        el.style.boxShadow = '0 12px 32px rgba(26, 23, 20, 0.1)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Image */}
      <div style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
        <img
          src={cocktail.image}
          alt={cocktail.nom}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            display: 'block',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col" style={{ padding: '1.5rem', gap: '0.75rem', flexGrow: 1 }}>
        {/* Category */}
        <span
          className="font-body text-accent"
          style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}
        >
          {cocktail.categorie.toUpperCase()}
        </span>

        {/* Name */}
        <h3
          className="font-display italic text-charcoal m-0"
          style={{ fontSize: '1.5rem', lineHeight: 1.1 }}
        >
          {cocktail.nom}
        </h3>

        {/* Description */}
        <p
          className="font-body text-charcoal m-0 leading-relaxed"
          style={{ fontSize: '0.85rem', opacity: 0.7, flexGrow: 1 }}
        >
          {cocktail.description}
        </p>

        {/* Price */}
        <p
          className="font-body text-charcoal m-0"
          style={{ fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.5, paddingTop: '0.5rem', borderTop: '1px solid rgba(26,23,20,0.1)' }}
        >
          {cocktail.prix}
        </p>
      </div>
    </article>
  )
}
