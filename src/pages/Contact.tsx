import { useState } from "react";
import Navbar from "../components/Navbar";

const CONTACT_EMAIL = "cocktails_bySara@gmail.com";

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,4 12,13 22,4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid rgba(26,23,20,0.25)",
  padding: "0.75rem 0",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  color: "#1A1714",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message de ${form.nom} via le site`);
    const body = encodeURIComponent(
      `Nom : ${form.nom}\nEmail : ${form.email}\n\nMessage :\n${form.message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="bg-cream" style={{ minHeight: "100vh" }}>
      <Navbar />

      <div
        className="px-8 md:px-12 lg:px-24"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: "10rem",
          paddingBottom: "6rem",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "5rem" }}>
          <p
            className="font-body text-accent m-0"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.28em",
              marginBottom: "1.25rem",
            }}
          >
            — CONTACT
          </p>
          <h1
            className="font-display italic text-charcoal m-0"
            style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)", lineHeight: 1.06 }}
          >
            Parlons de
            <br />
            votre événement.
          </h1>
        </div>

        {/* Two columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(3rem, 8vw, 8rem)",
            alignItems: "start",
          }}
        >
          {/* Left — Informations */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "3rem" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <p
                className="font-body text-charcoal m-0"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  opacity: 0.45,
                }}
              >
                INFORMATIONS
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-body text-charcoal no-underline hover:text-accent transition-colors duration-200"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                }}
              >
                <span className="text-accent">
                  <MailIcon />
                </span>
                {CONTACT_EMAIL}
              </a>

              <a
                href="tel:+32487430044"
                className="font-body text-charcoal no-underline hover:text-accent transition-colors duration-200"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                }}
              >
                <span className="text-accent">
                  <PhoneIcon />
                </span>
                0487430044
              </a>
            </div>

            {/* Séparateur */}
            <div
              style={{
                width: "2rem",
                height: "1px",
                background: "rgba(26,23,20,0.15)",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <p
                className="font-body text-charcoal m-0"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  opacity: 0.45,
                }}
              >
                RÉSEAUX SOCIAUX
              </p>

              <a
                href="https://www.instagram.com/cocktails_bySara"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-charcoal no-underline hover:text-accent transition-colors duration-200"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                }}
              >
                <span className="text-accent">
                  <InstagramIcon />
                </span>
                @cocktails_bySara
              </a>

              <a
                href="https://www.tiktok.com/@cocktails_bySara"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-charcoal no-underline hover:text-accent transition-colors duration-200"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.9rem",
                }}
              >
                <span className="text-accent">
                  <TikTokIcon />
                </span>
                @cocktails_bySara
              </a>
            </div>

            {/* Zone d'intervention */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "2rem",
                  height: "1px",
                  background: "rgba(26,23,20,0.15)",
                }}
              />
              <p
                className="font-body text-charcoal m-0"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.22em",
                  opacity: 0.45,
                }}
              >
                ZONE D'INTERVENTION
              </p>
              <p
                className="font-body text-charcoal m-0 leading-relaxed"
                style={{ fontSize: "0.9rem", opacity: 0.65 }}
              >
                Bruxelles & ses environs.
              </p>
            </div>
          </div>

          {/* Right — Formulaire */}
          <div>
            <p
              className="font-body text-charcoal m-0"
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.22em",
                opacity: 0.45,
                marginBottom: "2rem",
              }}
            >
              MESSAGE RAPIDE
            </p>

            {sent ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <p
                  className="font-display italic text-charcoal m-0"
                  style={{ fontSize: "1.5rem" }}
                >
                  Merci, à très vite.
                </p>
                <p
                  className="font-body text-charcoal m-0"
                  style={{ fontSize: "0.85rem", opacity: 0.6 }}
                >
                  Votre client mail s'est ouvert avec votre message pré-rempli.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({ nom: "", email: "", message: "" });
                  }}
                  className="font-body text-accent bg-transparent border-none cursor-pointer p-0 hover:text-charcoal transition-colors duration-200"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textAlign: "left",
                    marginTop: "0.5rem",
                  }}
                >
                  ENVOYER UN AUTRE MESSAGE
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <div>
                  <label
                    className="font-body text-charcoal"
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      opacity: 0.5,
                      marginBottom: "0.5rem",
                    }}
                  >
                    NOM
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    value={form.nom}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, nom: e.target.value }))
                    }
                    style={inputStyle}
                    className="font-body"
                  />
                </div>

                <div>
                  <label
                    className="font-body text-charcoal"
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      opacity: 0.5,
                      marginBottom: "0.5rem",
                    }}
                  >
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                    style={inputStyle}
                    className="font-body"
                  />
                </div>

                <div>
                  <label
                    className="font-body text-charcoal"
                    style={{
                      display: "block",
                      fontSize: "0.65rem",
                      letterSpacing: "0.18em",
                      opacity: 0.5,
                      marginBottom: "0.5rem",
                    }}
                  >
                    MESSAGE
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Décrivez votre événement..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    style={{
                      ...inputStyle,
                      resize: "none",
                      borderBottom: "none",
                      border: "1px solid rgba(26,23,20,0.25)",
                      padding: "0.75rem",
                    }}
                    className="font-body"
                  />
                </div>

                <button
                  type="submit"
                  className="font-body bg-charcoal text-cream hover:bg-accent transition-colors duration-200 cursor-pointer border-none"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    padding: "1rem 2rem",
                    alignSelf: "flex-start",
                  }}
                >
                  ENVOYER &rsaquo;
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
