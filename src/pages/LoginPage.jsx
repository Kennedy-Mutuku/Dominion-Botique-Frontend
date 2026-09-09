import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo bq.png';
import carouselVideo from '../assets/carousel.mp4';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const videoRef = useRef(null);

  const [step, setStep]           = useState(1);
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [userErr, setUserErr]     = useState('');
  const [passErr, setPassErr]     = useState('');
  const [shake, setShake]         = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    const t = username.trim();
    if (t !== 'User' && t !== 'Admin') { setUserErr('Unknown username'); return; }
    setUserErr('');
    setStep(2);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const result = login(username.trim(), password);
    if (result.success) {
      navigate(username.trim() === 'Admin' ? '/admin' : '/');
    } else {
      setPassErr('Incorrect password');
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  /* ─── decorative tags ─── */
  const tags = ['Elegance', 'Curated', 'Boutique', 'Premium', 'Bespoke'];

  return (
    <div className="lp-root">

      {/* ══ Video ══ */}
      <video
        ref={videoRef}
        autoPlay muted loop playsInline
        onCanPlay={() => setVideoReady(true)}
        className="lp-video"
        style={{ opacity: videoReady ? 1 : 0 }}
      >
        <source src={carouselVideo} type="video/mp4" />
      </video>

      {/* ══ Gradient overlays ══ */}
      <div className="lp-ov-right" />   {/* darkens right panel for readability */}
      <div className="lp-ov-vignette" /> {/* top + bottom vignette */}
      <div className="lp-ov-noise" />   {/* subtle film grain texture */}

      {/* ══ Layout ══ */}
      <div className="lp-layout">

        {/* ── Left brand panel (desktop only) ── */}
        <aside className="lp-brand" style={{ '--delay': '0.2s' }}>
          <header className="lp-brand-top">
            <img src={logo} alt="Logo" className="lp-brand-logo" />
            <div className="lp-brand-divider" />
            <span className="lp-brand-portal-label">Management Portal</span>
          </header>

          <div className="lp-brand-center">
            {/* Decorative rule */}
            <div className="lp-rule">
              <span className="lp-rule-line" />
              <Heart size={9} className="lp-rule-heart" />
              <span className="lp-rule-line" />
            </div>

            <h1 className="lp-headline">
              Nyakoe<br />
              <em className="lp-headline-em">Fassions</em>
            </h1>

            <p className="lp-tagline">Timeless Style, Just For You</p>

            {/* Floating badge row */}
            <div className="lp-tags">
              {tags.map((tag, i) => (
                <span
                  key={tag}
                  className="lp-tag"
                  style={{ animationDelay: `${i * 0.35}s` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <footer className="lp-brand-footer">
            © 2025 Nyakoe Fassions · All rights reserved
          </footer>
        </aside>

        {/* ── Right login panel ── */}
        <section className="lp-panel" style={{ '--delay': '0.5s' }}>

          {/* Mobile-only brand header */}
          <div className="lp-mobile-brand">
            <img src={logo} alt="Logo" className="lp-mobile-logo" />
            <h2 className="lp-mobile-title">Nyakoe Fassions</h2>
            <div className="lp-rule lp-rule-center">
              <span className="lp-rule-line" />
              <Heart size={7} className="lp-rule-heart" />
              <span className="lp-rule-line" />
            </div>
          </div>

          {/* Glass card */}
          <div className="lp-card" style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
            transition: `opacity 0.9s ease var(--delay), transform 0.9s cubic-bezier(0.16,1,0.3,1) var(--delay)`,
          }}>

            {/* Card heading */}
            <div className="lp-card-head">
              <p className="lp-card-eyebrow">Welcome back</p>
              <h3 className="lp-card-title">
                {step === 1 ? 'Sign In' : 'Enter Password'}
              </h3>
              <p className="lp-card-sub">
                {step === 1
                  ? 'Enter your username to continue'
                  : `Signing in as · ${username}`}
              </p>
            </div>

            <form
              onSubmit={step === 1 ? handleContinue : handleSignIn}
              className="lp-form"
            >
              {/* Username field */}
              <div className="lp-field">
                <label className="lp-label">Username</label>

                {step === 2 ? (
                  <div className="lp-locked-chip">
                    <div className="lp-chip-avatar">
                      <User size={11} />
                    </div>
                    <span className="lp-chip-name">{username}</span>
                    <button
                      type="button"
                      onClick={() => { setStep(1); setPassword(''); setPassErr(''); }}
                      className="lp-chip-change"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="lp-input-wrap">
                    <User size={15} className="lp-input-icon" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setUserErr(''); }}
                      placeholder="Enter your username"
                      autoFocus
                      className="lp-input"
                    />
                  </div>
                )}

                {userErr && <p className="lp-error"><span className="lp-error-dot" />{userErr}</p>}
              </div>

              {/* Password field — animates in */}
              {step === 2 && (
                <div className="lp-field lp-field-slide">
                  <label className="lp-label">Password</label>
                  <div className={`lp-input-wrap ${shake ? 'lp-shake' : ''}`}>
                    <Lock size={15} className="lp-input-icon" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPassErr(''); }}
                      placeholder="••••••••"
                      autoFocus
                      className="lp-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      className="lp-eye-btn"
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {passErr && <p className="lp-error"><span className="lp-error-dot" />{passErr}</p>}
                </div>
              )}

              {/* Submit */}
              <button type="submit" className="lp-submit">
                <span>{step === 1 ? 'Continue' : 'Sign In'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Card footer */}
            <p className="lp-card-footer">Nyakoe Fassions · Private Access</p>
          </div>
        </section>
      </div>

      {/* ══ All styles ══ */}
      <style>{`
        /* ─ Root ─ */
        .lp-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #000;
          display: flex;
        }

        /* ─ Video ─ */
        .lp-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
          transition: opacity 1.4s ease;
        }

        /* ─ Overlays ─ */
        .lp-ov-right {
          position: absolute; inset: 0; z-index: 1;
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.25) 0%,
            rgba(0,0,0,0.55) 50%,
            rgba(0,0,0,0.88) 100%
          );
        }
        .lp-ov-vignette {
          position: absolute; inset: 0; z-index: 2;
          background:
            linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 30%),
            linear-gradient(to top,    rgba(0,0,0,0.65) 0%, transparent 35%);
        }
        .lp-ov-noise {
          position: absolute; inset: 0; z-index: 3;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* ─ Layout ─ */
        .lp-layout {
          position: relative; z-index: 10;
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        /* ─ Left brand panel ─ */
        .lp-brand {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 58%;
          padding: 3rem 3.5rem;
          opacity: 0;
          transform: translateY(18px);
          animation: lp-fadein 1s cubic-bezier(0.16,1,0.3,1) var(--delay, 0s) forwards;
        }
        @media (min-width: 1024px) { .lp-brand { display: flex; } }

        .lp-brand-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .lp-brand-logo {
          height: 44px;
          width: auto;
          filter: brightness(0) invert(1);
          opacity: 0.75;
        }
        .lp-brand-divider {
          width: 1px; height: 2rem;
          background: rgba(255,255,255,0.18);
        }
        .lp-brand-portal-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .lp-brand-center { flex: 1; display: flex; flex-direction: column; justify-content: center; }

        .lp-rule {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.75rem;
        }
        .lp-rule-center { justify-content: center; margin-bottom: 0.75rem; }
        .lp-rule-line {
          display: block;
          width: 40px; height: 1px;
          background: rgba(251,113,133,0.55);
        }
        .lp-rule-heart { color: #fb7185; fill: #fb7185; flex-shrink: 0; }

        .lp-headline {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3rem, 5vw, 5.5rem);
          font-weight: 300;
          line-height: 1.05;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.92);
          margin-bottom: 1.25rem;
        }
        .lp-headline-em {
          font-style: italic;
          color: #fda4af;
          background: linear-gradient(135deg, #f43f5e, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-tagline {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.30);
          margin-bottom: 2.5rem;
        }

        /* floating tags */
        .lp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .lp-tag {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          padding: 0.4rem 0.85rem;
          border: 1px solid rgba(255,255,255,0.10);
          color: rgba(255,255,255,0.35);
          border-radius: 999px;
          animation: lp-float 3s ease-in-out infinite alternate;
        }

        .lp-brand-footer {
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.15);
        }

        /* ─ Right panel ─ */
        .lp-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 2rem 1.25rem;
          min-height: 100vh;
          opacity: 0;
          animation: lp-fadein 1s cubic-bezier(0.16,1,0.3,1) var(--delay, 0s) forwards;
        }
        @media (min-width: 1024px) { .lp-panel { width: 42%; padding: 3rem 2.5rem; } }

        /* ─ Mobile brand ─ */
        .lp-mobile-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.75rem;
        }
        @media (min-width: 1024px) { .lp-mobile-brand { display: none; } }
        .lp-mobile-logo {
          height: 52px; width: auto;
          filter: brightness(0) invert(1);
          opacity: 0.80;
          margin-bottom: 0.75rem;
        }
        .lp-mobile-title {
          font-family: Georgia, serif;
          font-size: 1.25rem;
          font-weight: 300;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.88);
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }

        /* ─ Glass card ─ */
        .lp-card {
          width: 100%;
          max-width: 400px;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 1.5rem;
          padding: 2.25rem 2rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.03) inset,
            0 30px 60px rgba(0,0,0,0.6),
            0 0 80px rgba(244,63,94,0.06);
        }

        /* card inner */
        .lp-card-head { margin-bottom: 1.75rem; }
        .lp-card-eyebrow {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: #f43f5e;
          margin-bottom: 0.4rem;
        }
        .lp-card-title {
          font-family: Georgia, serif;
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.92);
          margin-bottom: 0.35rem;
        }
        .lp-card-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 0.02em;
        }

        /* form */
        .lp-form { display: flex; flex-direction: column; gap: 1rem; }
        .lp-field { display: flex; flex-direction: column; }
        .lp-field-slide { animation: lp-slide 0.4s cubic-bezier(0.16,1,0.3,1); }
        .lp-label {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.30);
          margin-bottom: 0.5rem;
        }

        /* input */
        .lp-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .lp-input-icon {
          position: absolute;
          left: 1rem;
          color: rgba(255,255,255,0.25);
          pointer-events: none;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .lp-input-wrap:focus-within .lp-input-icon { color: #f43f5e; }
        .lp-input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 0.875rem;
          color: rgba(255,255,255,0.92);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lp-input::placeholder { color: rgba(255,255,255,0.18); }
        .lp-input:focus {
          border-color: rgba(244,63,94,0.5);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(244,63,94,0.10);
        }
        .lp-eye-btn {
          position: absolute;
          right: 1rem;
          color: rgba(255,255,255,0.25);
          transition: color 0.2s;
          background: none; border: none; cursor: pointer;
          display: flex; align-items: center;
        }
        .lp-eye-btn:hover { color: rgba(255,255,255,0.55); }

        /* locked chip */
        .lp-locked-chip {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 0.875rem;
          padding: 0.75rem 1rem;
        }
        .lp-chip-avatar {
          width: 1.5rem; height: 1.5rem;
          background: rgba(244,63,94,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #f43f5e;
          flex-shrink: 0;
        }
        .lp-chip-name {
          flex: 1;
          font-size: 0.875rem;
          font-weight: 700;
          color: rgba(255,255,255,0.88);
        }
        .lp-chip-change {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f43f5e;
          background: none; border: none; cursor: pointer;
          transition: color 0.2s;
          padding: 0;
        }
        .lp-chip-change:hover { color: #fb7185; }

        /* error */
        .lp-error {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.4rem;
          font-size: 11px;
          font-weight: 600;
          color: #f43f5e;
        }
        .lp-error-dot {
          display: inline-block;
          width: 4px; height: 4px;
          background: #f43f5e;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* submit button */
        .lp-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem 1rem;
          background: linear-gradient(135deg, #f43f5e 0%, #c026d3 100%);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          border: none;
          border-radius: 0.875rem;
          cursor: pointer;
          margin-top: 0.25rem;
          box-shadow: 0 8px 24px rgba(244,63,94,0.28);
          transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
        }
        .lp-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(244,63,94,0.42);
          filter: brightness(1.08);
        }
        .lp-submit:active { transform: scale(0.97); }

        /* card footer */
        .lp-card-footer {
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.15);
        }

        /* shake animation */
        .lp-shake { animation: lp-shake 0.5s ease-out; }

        /* ─ Keyframes ─ */
        @keyframes lp-fadein {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-slide {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-shake {
          0%,100% { transform: translateX(0); }
          18%     { transform: translateX(-8px); }
          36%     { transform: translateX(8px); }
          54%     { transform: translateX(-5px); }
          72%     { transform: translateX(5px); }
        }
        @keyframes lp-float {
          from { transform: translateY(0);    opacity: 0.35; }
          to   { transform: translateY(-7px); opacity: 0.65; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
