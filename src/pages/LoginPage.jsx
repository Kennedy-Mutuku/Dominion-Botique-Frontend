import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo bq.png';

// ── Every boutique photo ──────────────────────────────────────────
import p_ladies    from '../assets/ladies.jpg';
import p_ladies2   from '../assets/ladies2.jpg';
import p_ladies3   from '../assets/ladies3.jpg';
import p_ladies4   from '../assets/ladies4.jpg';
import p_ladies6   from '../assets/ladies6.jpg';
import p_ladies7   from '../assets/ladies7.jpg';
import p_ladies9   from '../assets/ladies9.jpg';
import p_adies9    from '../assets/adies9.jpg';
import p_dera1     from '../assets/dera1.jpg';
import p_dera2     from '../assets/dera2.jpg';
import p_men3      from '../assets/men3.jpg';
import p_men4      from '../assets/men4.jpg';
import p_men6      from '../assets/men6.jpg';
import p_men7      from '../assets/men7.jpg';
import p_men9      from '../assets/men9.jpg';
import p_men10     from '../assets/men10.jpg';
import p_men1      from '../assets/men 1.jpg';
import p_handbags  from '../assets/handbags.jpg';
import p_belt1     from '../assets/belt 1.jpg';
import p_belt2     from '../assets/belt2.jpg';
import p_belt3     from '../assets/belt3.jpg';
import p_shirt4    from '../assets/shirt4.jpg';
import p_shoes     from '../assets/shoesladies.jpg';
import p_lshoes    from '../assets/ladies shoes.jpg';
import p_lshoss    from '../assets/ladies shoss.jpg';
import p_menshoes  from '../assets/men shoes.jpg';
import p_menshoes2 from '../assets/men shoes 2.jpg';
import p_menshos   from '../assets/men shos.jpg';

// Curated order: fashion → accessories → menswear, repeating
const SLIDES = [
  p_dera1,   p_ladies,   p_men10,   p_handbags,
  p_ladies4, p_men6,     p_belt3,   p_shoes,
  p_dera2,   p_ladies6,  p_men4,    p_lshoes,
  p_adies9,  p_men1,     p_belt2,   p_lshoss,
  p_ladies2, p_men7,     p_shirt4,  p_menshoes,
  p_ladies3, p_men9,     p_belt1,   p_menshoes2,
  p_ladies7, p_men3,     p_menshos, p_ladies9,
];

// Ken Burns variant per slide (cycles through 4 directions)
const KB_CLASS = ['lp-kb0', 'lp-kb1', 'lp-kb2', 'lp-kb3'];
const SLIDE_MS  = 5400;   // time each image is fully shown
const FADE_MS   = 1300;   // crossfade duration

const LoginPage = () => {
  const navigate = useNavigate();
  const { login }  = useAuth();

  // ── Slideshow state ──────────────────────────────────────────────
  const slideRef = useRef({ curr: 0, prev: null });
  const [currIdx, setCurrIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(null);
  const [progKey, setProgKey] = useState(0); // restarts progress bar

  // ── Login form state ─────────────────────────────────────────────
  const [step,     setStep]     = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [userErr,  setUserErr]  = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [shake,    setShake]    = useState(false);
  const [mounted,  setMounted]  = useState(false);

  // Page enter animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Slideshow ticker
  useEffect(() => {
    const id = setInterval(() => {
      const next = (slideRef.current.curr + 1) % SLIDES.length;
      slideRef.current.prev = slideRef.current.curr;
      slideRef.current.curr = next;
      setPrevIdx(slideRef.current.prev);
      setCurrIdx(next);
      setProgKey(k => k + 1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────
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
      setTimeout(() => setShake(false), 650);
    }
  };

  const TAGS = ['Elegance', 'Curated', 'Boutique', 'Premium', 'Bespoke'];

  return (
    <div className="lp-root">

      {/* ══════════════════ Photo Slideshow ══════════════════ */}
      <div className="lp-show">
        {/* Outgoing photo fades out */}
        {prevIdx !== null && (
          <img
            key={`out-${prevIdx}`}
            src={SLIDES[prevIdx]}
            className="lp-img lp-img-out"
            alt=""
            onAnimationEnd={() => setPrevIdx(null)}
          />
        )}
        {/* Incoming photo fades in + Ken Burns */}
        <img
          key={`in-${currIdx}`}
          src={SLIDES[currIdx]}
          className={`lp-img lp-img-in ${KB_CLASS[currIdx % 4]}`}
          alt=""
        />
      </div>

      {/* ══════════════════ Overlays ══════════════════ */}
      {/* Right-side darkening so card is legible */}
      <div className="lp-ov-r" />
      {/* Top & bottom vignette */}
      <div className="lp-ov-tb" />
      {/* Left-side slight darkening for brand text */}
      <div className="lp-ov-l" />

      {/* Progress bar */}
      <div className="lp-prog-track">
        <div key={progKey} className="lp-prog-bar" />
      </div>

      {/* ══════════════════ Layout ══════════════════ */}
      <div className="lp-layout">

        {/* ── Left Brand Panel (desktop) ── */}
        <aside className="lp-brand" style={{ '--d': '0.25s' }}>

          <div className="lp-brand-top">
            <img src={logo} alt="" className="lp-b-logo" />
            <div className="lp-vsep" />
            <span className="lp-portal">Management Portal</span>
          </div>

          <div className="lp-brand-mid">
            <div className="lp-rule">
              <span className="lp-rl" />
              <Heart size={9} className="lp-h" />
              <span className="lp-rl" />
            </div>

            <h1 className="lp-hl">
              Nyakoe<br />
              <em className="lp-em">Fassions</em>
            </h1>

            <p className="lp-sub">Timeless Style, Just For You</p>

            <div className="lp-tags">
              {TAGS.map((tag, i) => (
                <span
                  key={tag}
                  className="lp-tag"
                  style={{ animationDelay: `${i * 0.45}s` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Slide position indicator */}
            <div className="lp-counter">
              <span className="lp-cnt-num">
                {String(currIdx + 1).padStart(2, '0')}
              </span>
              <span className="lp-cnt-sep">/</span>
              <span className="lp-cnt-total">{String(SLIDES.length).padStart(2, '0')}</span>
            </div>
          </div>

          <p className="lp-brand-ft">© 2025 Nyakoe Fassions · All rights reserved</p>
        </aside>

        {/* ── Right Login Panel ── */}
        <section className="lp-panel" style={{ '--d': '0.55s' }}>

          {/* Mobile brand header */}
          <div className="lp-mob">
            <img src={logo} alt="" className="lp-mob-logo" />
            <h2 className="lp-mob-title">Nyakoe Fassions</h2>
            <div className="lp-rule lp-rule-c">
              <span className="lp-rl" />
              <Heart size={7} className="lp-h" />
              <span className="lp-rl" />
            </div>
          </div>

          {/* Glass card */}
          <div
            className="lp-card"
            style={{
              opacity:    mounted ? 1 : 0,
              transform:  mounted ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.97)',
              transition: `opacity .9s ease var(--d), transform .9s cubic-bezier(.16,1,.3,1) var(--d)`,
            }}
          >
            {/* Card header */}
            <div className="lp-ch">
              <p className="lp-eyebrow">Welcome back</p>
              <h3 className="lp-ct">
                {step === 1 ? 'Sign In' : 'Enter Password'}
              </h3>
              <p className="lp-cs">
                {step === 1
                  ? 'Enter your username to continue'
                  : `Signing in as · ${username}`}
              </p>
            </div>

            <form
              onSubmit={step === 1 ? handleContinue : handleSignIn}
              className="lp-form"
            >
              {/* Username */}
              <div className="lp-field">
                <label className="lp-lbl">Username</label>

                {step === 2 ? (
                  <div className="lp-chip">
                    <div className="lp-chip-av"><User size={11} /></div>
                    <span className="lp-chip-name">{username}</span>
                    <button
                      type="button"
                      className="lp-chip-change"
                      onClick={() => { setStep(1); setPassword(''); setPassErr(''); }}
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="lp-iw">
                    <User size={15} className="lp-ii" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => { setUsername(e.target.value); setUserErr(''); }}
                      placeholder="Enter your username"
                      autoFocus
                      className="lp-i"
                    />
                  </div>
                )}
                {userErr && (
                  <p className="lp-err"><span className="lp-ed" />{userErr}</p>
                )}
              </div>

              {/* Password */}
              {step === 2 && (
                <div className="lp-field lp-field-in">
                  <label className="lp-lbl">Password</label>
                  <div className={`lp-iw ${shake ? 'lp-shake' : ''}`}>
                    <Lock size={15} className="lp-ii" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setPassErr(''); }}
                      placeholder="••••••••"
                      autoFocus
                      className="lp-i"
                    />
                    <button
                      type="button"
                      className="lp-eye"
                      onClick={() => setShowPw(v => !v)}
                    >
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {passErr && (
                    <p className="lp-err"><span className="lp-ed" />{passErr}</p>
                  )}
                </div>
              )}

              <button type="submit" className="lp-btn">
                <span>{step === 1 ? 'Continue' : 'Sign In'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="lp-cf">Nyakoe Fassions · Private Access</p>
          </div>
        </section>
      </div>

      {/* ══════════════════ All Styles ══════════════════ */}
      <style>{`
        /* ── Root ── */
        .lp-root {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #0a0a0a;
          display: flex;
        }

        /* ── Slideshow container ── */
        .lp-show {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        /* ── Slide images ── */
        .lp-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }

        /* Incoming: fade in */
        .lp-img-in {
          z-index: 2;
          animation:
            lp-fadein ${FADE_MS}ms ease-out forwards,
            lp-kb0 ${SLIDE_MS + FADE_MS * 2}ms ease-out forwards;
        }

        /* Outgoing: fade out */
        .lp-img-out {
          z-index: 1;
          animation: lp-fadeout ${FADE_MS}ms ease-in forwards;
        }

        /* Ken Burns variants — each has a different zoom origin & direction */
        .lp-kb0 { animation-name: lp-fadein, lp-kb0; }
        .lp-kb1 { animation-name: lp-fadein, lp-kb1; }
        .lp-kb2 { animation-name: lp-fadein, lp-kb2; }
        .lp-kb3 { animation-name: lp-fadein, lp-kb3; }

        @keyframes lp-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lp-fadeout {
          from { opacity: 1; }
          to   { opacity: 0; }
        }

        /* Pan + zoom – subtle cinematic movement */
        @keyframes lp-kb0 {
          from { transform: scale(1.00) translate( 0%,    0%  ); }
          to   { transform: scale(1.12) translate(-2%,   -1.5%); }
        }
        @keyframes lp-kb1 {
          from { transform: scale(1.06) translate( 2%,    1%  ); }
          to   { transform: scale(1.15) translate(-1.5%, -2%  ); }
        }
        @keyframes lp-kb2 {
          from { transform: scale(1.00) translate(-2%,    1%  ); }
          to   { transform: scale(1.13) translate( 1.5%, -2%  ); }
        }
        @keyframes lp-kb3 {
          from { transform: scale(1.08) translate( 0%,    2%  ); }
          to   { transform: scale(1.16) translate(-2%,   -1%  ); }
        }

        /* ── Overlays ── */
        .lp-ov-r {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(
            to left,
            rgba(0,0,0,.88) 0%,
            rgba(0,0,0,.72) 30%,
            rgba(0,0,0,.35) 60%,
            transparent    100%
          );
        }
        .lp-ov-tb {
          position: absolute; inset: 0; z-index: 4;
          background:
            linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 22%),
            linear-gradient(to top,    rgba(0,0,0,.60) 0%, transparent 30%);
        }
        .lp-ov-l {
          position: absolute; inset: 0; z-index: 3;
          background: linear-gradient(
            to right,
            rgba(0,0,0,.52) 0%,
            rgba(0,0,0,.18) 40%,
            transparent    70%
          );
        }

        /* ── Progress bar ── */
        .lp-prog-track {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,.08);
          z-index: 20;
        }
        .lp-prog-bar {
          height: 100%;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          animation: lp-progress ${SLIDE_MS}ms linear forwards;
          transform-origin: left;
        }
        @keyframes lp-progress {
          from { width: 0%; }
          to   { width: 100%; }
        }

        /* ── Main layout ── */
        .lp-layout {
          position: relative;
          z-index: 10;
          display: flex;
          width: 100%;
          min-height: 100vh;
        }

        /* ══ Left brand panel ══ */
        .lp-brand {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 56%;
          padding: 2.75rem 3.5rem;
          opacity: 0;
          animation: lp-enter .9s cubic-bezier(.16,1,.3,1) var(--d, .2s) forwards;
        }
        @media (min-width: 1024px) { .lp-brand { display: flex; } }

        .lp-brand-top {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .lp-b-logo {
          height: 42px; width: auto;
          filter: brightness(0) invert(1);
          opacity: .75;
        }
        .lp-vsep {
          width: 1px; height: 1.75rem;
          background: rgba(255,255,255,.18);
        }
        .lp-portal {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .38em;
          text-transform: uppercase;
          color: rgba(255,255,255,.32);
        }

        .lp-brand-mid {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 0;
        }

        /* Decorative rule */
        .lp-rule {
          display: flex;
          align-items: center;
          gap: .45rem;
          margin-bottom: 1.6rem;
        }
        .lp-rule-c { justify-content: center; margin-bottom: .6rem; }
        .lp-rl {
          display: block;
          width: 36px; height: 1px;
          background: rgba(251,113,133,.5);
        }
        .lp-h { color: #fb7185; fill: #fb7185; flex-shrink: 0; }

        /* Main heading */
        .lp-hl {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(3rem, 4.5vw, 5.5rem);
          font-weight: 300;
          line-height: 1.06;
          letter-spacing: .06em;
          color: rgba(255,255,255,.92);
          margin-bottom: 1.1rem;
        }
        .lp-em {
          font-style: italic;
          background: linear-gradient(135deg, #f43f5e 0%, #e879f9 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-sub {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .32em;
          text-transform: uppercase;
          color: rgba(255,255,255,.28);
          margin-bottom: 2.2rem;
        }

        /* Floating tags */
        .lp-tags {
          display: flex;
          flex-wrap: wrap;
          gap: .4rem;
          margin-bottom: 2rem;
        }
        .lp-tag {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .22em;
          text-transform: uppercase;
          padding: .35rem .8rem;
          border: 1px solid rgba(255,255,255,.10);
          color: rgba(255,255,255,.32);
          border-radius: 999px;
          animation: lp-float 3.2s ease-in-out infinite alternate;
        }
        @keyframes lp-float {
          from { transform: translateY(0);    opacity: .32; }
          to   { transform: translateY(-6px); opacity: .62; }
        }

        /* Slide counter */
        .lp-counter {
          display: flex;
          align-items: baseline;
          gap: .4rem;
        }
        .lp-cnt-num {
          font-family: Georgia, serif;
          font-size: 2rem;
          font-weight: 300;
          color: rgba(255,255,255,.55);
          letter-spacing: .04em;
          line-height: 1;
        }
        .lp-cnt-sep {
          font-size: 10px;
          color: rgba(255,255,255,.2);
          letter-spacing: .1em;
        }
        .lp-cnt-total {
          font-size: 11px;
          color: rgba(255,255,255,.22);
          letter-spacing: .08em;
        }

        .lp-brand-ft {
          font-size: 9px;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(255,255,255,.15);
        }

        /* ══ Right panel ══ */
        .lp-panel {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 1.75rem 1.25rem;
          min-height: 100vh;
          opacity: 0;
          animation: lp-enter .9s cubic-bezier(.16,1,.3,1) var(--d, .5s) forwards;
        }
        @media (min-width: 1024px) {
          .lp-panel { width: 44%; padding: 2.5rem 2.5rem; }
        }

        /* Mobile brand */
        .lp-mob {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) { .lp-mob { display: none; } }
        .lp-mob-logo {
          height: 50px; width: auto;
          filter: brightness(0) invert(1);
          opacity: .80;
          margin-bottom: .65rem;
        }
        .lp-mob-title {
          font-family: Georgia, serif;
          font-size: 1.2rem;
          font-weight: 300;
          letter-spacing: .22em;
          color: rgba(255,255,255,.88);
          text-transform: uppercase;
          margin-bottom: .4rem;
        }

        /* ── Glass card ── */
        .lp-card {
          width: 100%;
          max-width: 400px;
          background: rgba(5,5,8,.60);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 1.5rem;
          padding: 2rem 1.85rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.03) inset,
            0 32px 64px rgba(0,0,0,.65),
            0 0 90px rgba(244,63,94,.05);
        }

        /* Card header */
        .lp-ch { margin-bottom: 1.6rem; }
        .lp-eyebrow {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .4em;
          text-transform: uppercase;
          color: #f43f5e;
          margin-bottom: .35rem;
        }
        .lp-ct {
          font-family: Georgia, serif;
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: .04em;
          color: rgba(255,255,255,.92);
          margin-bottom: .3rem;
        }
        .lp-cs {
          font-size: 11px;
          color: rgba(255,255,255,.24);
        }

        /* Form */
        .lp-form { display: flex; flex-direction: column; gap: .9rem; }
        .lp-field { display: flex; flex-direction: column; }
        .lp-field-in { animation: lp-slide-in .4s cubic-bezier(.16,1,.3,1); }
        .lp-lbl {
          font-size: 8.5px;
          font-weight: 700;
          letter-spacing: .32em;
          text-transform: uppercase;
          color: rgba(255,255,255,.28);
          margin-bottom: .45rem;
        }

        /* Input wrapper */
        .lp-iw { position: relative; display: flex; align-items: center; }
        .lp-ii {
          position: absolute;
          left: .95rem;
          color: rgba(255,255,255,.22);
          pointer-events: none;
          transition: color .2s;
          flex-shrink: 0;
        }
        .lp-iw:focus-within .lp-ii { color: #f43f5e; }
        .lp-i {
          width: 100%;
          padding: .82rem 1rem .82rem 2.65rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: .875rem;
          color: rgba(255,255,255,.90);
          font-size: .875rem;
          outline: none;
          transition: border-color .2s, background .2s, box-shadow .2s;
        }
        .lp-i::placeholder { color: rgba(255,255,255,.16); }
        .lp-i:focus {
          border-color: rgba(244,63,94,.5);
          background: rgba(255,255,255,.07);
          box-shadow: 0 0 0 3px rgba(244,63,94,.10);
        }
        .lp-eye {
          position: absolute; right: .9rem;
          color: rgba(255,255,255,.22);
          background: none; border: none;
          cursor: pointer; display: flex; align-items: center;
          transition: color .2s;
          padding: 0;
        }
        .lp-eye:hover { color: rgba(255,255,255,.55); }

        /* Locked chip */
        .lp-chip {
          display: flex; align-items: center; gap: .55rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: .875rem;
          padding: .72rem .95rem;
        }
        .lp-chip-av {
          width: 1.45rem; height: 1.45rem;
          background: rgba(244,63,94,.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #f43f5e; flex-shrink: 0;
        }
        .lp-chip-name {
          flex: 1; font-size: .875rem; font-weight: 700;
          color: rgba(255,255,255,.86);
        }
        .lp-chip-change {
          font-size: 8.5px; font-weight: 700; letter-spacing: .18em;
          text-transform: uppercase; color: #f43f5e;
          background: none; border: none; cursor: pointer;
          transition: color .2s; padding: 0;
        }
        .lp-chip-change:hover { color: #fb7185; }

        /* Error */
        .lp-err {
          display: flex; align-items: center; gap: .3rem;
          margin-top: .4rem; font-size: 11px; font-weight: 600; color: #f43f5e;
        }
        .lp-ed {
          display: inline-block; width: 4px; height: 4px;
          background: #f43f5e; border-radius: 50%; flex-shrink: 0;
        }

        /* Submit */
        .lp-btn {
          display: flex; align-items: center; justify-content: center; gap: .45rem;
          width: 100%;
          padding: .88rem 1rem;
          background: linear-gradient(135deg, #f43f5e 0%, #c026d3 100%);
          color: #fff;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: .22em; text-transform: uppercase;
          border: none; border-radius: .875rem; cursor: pointer;
          margin-top: .15rem;
          box-shadow: 0 8px 26px rgba(244,63,94,.28);
          transition: transform .2s, box-shadow .2s, filter .2s;
        }
        .lp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(244,63,94,.45);
          filter: brightness(1.09);
        }
        .lp-btn:active { transform: scale(.97); }

        /* Card footer */
        .lp-cf {
          margin-top: 1.4rem;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(255,255,255,.05);
          text-align: center;
          font-size: 8.5px; letter-spacing: .2em;
          text-transform: uppercase;
          color: rgba(255,255,255,.13);
        }

        /* ── Keyframes ── */
        @keyframes lp-enter {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lp-slide-in {
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
        .lp-shake { animation: lp-shake .55s ease-out; }
      `}</style>
    </div>
  );
};

export default LoginPage;
