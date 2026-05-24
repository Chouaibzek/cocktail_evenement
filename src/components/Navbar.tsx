import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo4.png'
import { useAuth } from '../hooks/useAuth'

const navLinks = [
  { label: 'ACCUEIL', to: '/' },
  { label: 'LA CARTE', to: '/carte' },
  { label: 'RÉSERVATION', to: '/reservation' },
  { label: 'GALERIE', to: '/galerie' },
  { label: 'CONTACT', to: '/contact' },
]

const linkStyle = { fontSize: '0.65rem', letterSpacing: '0.2em' }

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream">
      <div className="flex items-center justify-between px-8 md:px-12 lg:px-16 py-5">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src={logo} alt="" style={{ height: '72px', width: 'auto', mixBlendMode: 'multiply' }} />
          <span className="font-display text-charcoal tracking-wide" style={{ fontSize: '1.05rem' }}>
            Cocktails by Sara
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          {navLinks.map(link => (
            <li key={link.label}>
              <Link
                to={link.to}
                className="font-body text-charcoal no-underline transition-colors duration-200 hover:text-accent"
                style={linkStyle}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop — Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* Connecté */
            <>
              <span className="font-body text-charcoal" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                {profile?.prenom || user.email}
              </span>
              {profile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="font-body text-accent no-underline transition-colors duration-200 hover:text-charcoal"
                  style={linkStyle}
                >
                  ADMIN
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="font-body text-charcoal border border-charcoal bg-transparent transition-colors duration-200 hover:bg-charcoal hover:text-cream cursor-pointer"
                style={{ ...linkStyle, padding: '0.6rem 1.25rem' }}
              >
                DÉCONNEXION
              </button>
            </>
          ) : (
            /* Non connecté */
            <>
              <Link
                to="/login"
                className="font-body text-charcoal no-underline transition-colors duration-200 hover:text-accent"
                style={linkStyle}
              >
                CONNEXION
              </Link>
              <Link
                to="/register"
                className="font-body text-charcoal border border-charcoal no-underline transition-colors duration-200 hover:bg-charcoal hover:text-cream"
                style={{ ...linkStyle, padding: '0.6rem 1.25rem' }}
              >
                INSCRIPTION
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden bg-transparent border-none cursor-pointer text-charcoal p-1"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-charcoal/10 px-8 py-6 flex flex-col gap-6">
          {navLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              className="font-body text-charcoal no-underline"
              style={linkStyle}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ borderTop: '1px solid rgba(26,23,20,0.1)', paddingTop: '1rem' }} className="flex flex-col gap-4">
            {user ? (
              <>
                <span className="font-body text-charcoal" style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                  {profile?.prenom || user.email}
                </span>
                {profile?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="font-body text-accent no-underline"
                    style={linkStyle}
                    onClick={() => setMenuOpen(false)}
                  >
                    ADMIN
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="font-body text-charcoal border border-charcoal bg-transparent text-center cursor-pointer"
                  style={{ ...linkStyle, padding: '0.75rem 1.5rem' }}
                >
                  DÉCONNEXION
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-body text-charcoal no-underline"
                  style={linkStyle}
                  onClick={() => setMenuOpen(false)}
                >
                  CONNEXION
                </Link>
                <Link
                  to="/register"
                  className="font-body text-charcoal border border-charcoal no-underline text-center"
                  style={{ ...linkStyle, padding: '0.75rem 1.5rem' }}
                  onClick={() => setMenuOpen(false)}
                >
                  INSCRIPTION
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
