import { useState } from 'react'
import Navbar from '../components/Navbar'
import CocktailCard from '../components/CocktailCard'
import { cocktails, categories } from '../data/cocktails'
import type { Categorie } from '../data/cocktails'

export default function Catalogue() {
  const [filtre, setFiltre] = useState<Categorie | 'Tous'>('Tous')

  const cocktailsFiltres = filtre === 'Tous'
    ? cocktails
    : cocktails.filter(c => c.categorie === filtre)

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <main
        className="px-8 md:px-12 lg:px-24 mx-auto"
        style={{ maxWidth: '1200px', paddingTop: '8rem', paddingBottom: '6rem' }}
      >
        {/* Header */}
        <div className="flex flex-col" style={{ gap: '1rem', marginBottom: '3.5rem' }}>
          <p
            className="font-body text-accent m-0"
            style={{ fontSize: '0.65rem', letterSpacing: '0.28em' }}
          >
            — LA CARTE
          </p>
          <h1
            className="font-display italic text-charcoal m-0"
            style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1 }}
          >
            Nos créations
          </h1>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap" style={{ gap: '0.75rem', marginBottom: '3rem' }}>
          {(['Tous', ...categories] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setFiltre(cat)}
              className="font-body cursor-pointer transition-colors duration-200"
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                padding: '0.5rem 1.25rem',
                border: '1px solid',
                borderColor: filtre === cat ? '#1A1714' : 'rgba(26,23,20,0.25)',
                background: filtre === cat ? '#1A1714' : 'transparent',
                color: filtre === cat ? '#F5EDE3' : '#1A1714',
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Grille de cartes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {cocktailsFiltres.map(cocktail => (
            <CocktailCard key={cocktail.id} cocktail={cocktail} />
          ))}
        </div>
      </main>
    </div>
  )
}
