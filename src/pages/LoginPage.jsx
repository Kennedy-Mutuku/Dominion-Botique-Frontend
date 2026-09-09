import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo bq.png';

// ── Boutique photo imports ────────────────────────────────────────
import i_dera1     from '../assets/dera1.jpg';
import i_ladies    from '../assets/ladies.jpg';
import i_men10     from '../assets/men10.jpg';
import i_handbags  from '../assets/handbags.jpg';
import i_ladies4   from '../assets/ladies4.jpg';
import i_men6      from '../assets/men6.jpg';
import i_belt3     from '../assets/belt3.jpg';
import i_shoes     from '../assets/shoesladies.jpg';
import i_dera2     from '../assets/dera2.jpg';
import i_ladies6   from '../assets/ladies6.jpg';
import i_men4      from '../assets/men4.jpg';
import i_lshoes    from '../assets/ladies shoes.jpg';
import i_adies9    from '../assets/adies9.jpg';
import i_men1      from '../assets/men 1.jpg';
import i_belt2     from '../assets/belt2.jpg';
import i_lshoss    from '../assets/ladies shoss.jpg';
import i_ladies2   from '../assets/ladies2.jpg';
import i_men7      from '../assets/men7.jpg';
import i_shirt4    from '../assets/shirt4.jpg';
import i_menshoes  from '../assets/men shoes.jpg';
import i_ladies3   from '../assets/ladies3.jpg';
import i_men9      from '../assets/men9.jpg';
import i_belt1     from '../assets/belt 1.jpg';
import i_menshoes2 from '../assets/men shoes 2.jpg';
import i_ladies7   from '../assets/ladies7.jpg';
import i_men3      from '../assets/men3.jpg';
import i_menshos   from '../assets/men shos.jpg';
import i_ladies9   from '../assets/ladies9.jpg';

// ── Slide data: photo + category label + name ─────────────────────
const SLIDES = [
  { img: i_dera1,     cat: 'Designer Collection', name: 'Evening Elegance'    },
  { img: i_ladies,    cat: 'Ladies Fashion',       name: 'New Arrivals'        },
  { img: i_men10,     cat: 'Menswear',             name: 'Premium Suits'       },
  { img: i_handbags,  cat: 'Accessories',           name: 'Handbag Edit'        },
  { img: i_ladies4,   cat: 'Ladies Fashion',        name: 'Casual Chic'         },
  { img: i_men6,      cat: 'Menswear',              name: 'Smart Casual'        },
  { img: i_belt3,     cat: 'Accessories',           name: 'Belt Collection'     },
  { img: i_shoes,     cat: 'Footwear',              name: 'Ladies Heels'        },
  { img: i_dera2,     cat: 'Designer Collection',   name: 'Signature Pieces'    },
  { img: i_ladies6,   cat: 'Ladies Fashion',        name: 'Glamour Series'      },
  { img: i_men4,      cat: 'Menswear',              name: 'Office Essentials'   },
  { img: i_lshoes,    cat: 'Footwear',              name: 'Pumps & Heels'       },
  { img: i_adies9,    cat: 'Ladies Fashion',        name: 'Floral Collection'   },
  { img: i_men1,      cat: 'Menswear',              name: 'Classic Shirts'      },
  { img: i_belt2,     cat: 'Accessories',           name: 'Leather Belts'       },
  { img: i_lshoss,    cat: 'Footwear',              name: 'Shoe Collection'     },
  { img: i_ladies2,   cat: 'Ladies Fashion',        name: 'Evening Gowns'       },
  { img: i_men7,      cat: 'Menswear',              name: 'Weekend Wear'        },
  { img: i_shirt4,    cat: 'Formal Wear',           name: 'Dress Shirts'        },
  { img: i_menshoes,  cat: 'Footwear',              name: 'Oxford Shoes'        },
  { img: i_ladies3,   cat: 'Ladies Fashion',        name: 'Spring Collection'   },
  { img: i_men9,      cat: 'Menswear',              name: 'Tailored Fits'       },
  { img: i_belt1,     cat: 'Accessories',           name: 'Classic Leather'     },
  { img: i_menshoes2, cat: 'Footwear',              name: 'Premium Leather'     },
  { img: i_ladies7,   cat: 'Ladies Fashion',        name: 'Bold & Beautiful'    },
  { img: i_men3,      cat: 'Menswear',              name: 'Casual Essentials'   },
  { img: i_menshos,   cat: 'Footwear',              name: 'Loafers Edit'        },
  { img: i_ladies9,   cat: 'Ladies Fashion',        name: 'Style Icons'         },
];

const KB  = ['lp-kb0', 'lp-kb1', 'lp-kb2', 'lp-kb3'];
const SLIDE_MS = 5400;
const FADE_MS  = 1300;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Slideshow ──────────────────────────────────────────────────
  const ref     = useRef({ curr: 0, prev: null });
  const [curr,     setCurr]    = useState(0);
  const [prev,     setPrev]    = useState(null);
  const [progKey,  setProgKey] = useState(0);

  // ── Login ──────────────────────────────────────────────────────
  const [step,     setStep]     = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [userErr,  setUserErr]  = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [shake,    setShake]    = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const next = (ref.current.curr + 1) % SLIDES.length;
      ref.current.prev = ref.current.curr;
      ref.current.curr = next;
      setPrev(ref.current.prev);
      setCurr(next);
      setProgKey(k => k + 1);
    }, SLIDE_MS);
    return () => clearInterval(id);
  }, []);

  const handleContinue = (e) => {
    e.preventDefault();
    const t = username.trim();
    if (t !== 'User' && t !== 'Admin') { setUserErr('Unknown username'); return; }
    setUserErr(''); setStep(2);
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const r = login(username.trim(), password);
    if (r.success) { navigate(username.trim() === 'Admin' ? '/admin' : '/'); }
    else { setPassErr('Incorrect password'); setShake(true); setTimeout(() => setShake(false), 650); }
  };

  const slide   = SLIDES[curr];
  const thumbs  = [1, 2, 3, 4].map(o => SLIDES[(curr + o) % SLIDES.length]);
  const counter = String(curr + 1).padStart(2, '0');

  return (
    <div className="lp-root">

      {/* ══ Background Slideshow ══ */}
      <div className="lp-bg">
        {prev !== null && (
          <img
            key={`out-${prev}`} src={SLIDES[prev].img} alt=""
            className="lp-img lp-out"
            onAnimationEnd={() => setPrev(null)}
          />
        )}
        <img
          key={`in-${curr}`} src={slide.img} alt=""
          className={`lp-img lp-in ${KB[curr % 4]}`}
        />
      </div>

      {/* ══ Overlays ══ */}
      <div className="lp-ov-base"  /> {/* base dark tint */}
      <div className="lp-ov-left"  /> {/* left darkens for text */}
      <div className="lp-ov-right" /> {/* right darkens for card */}
      <div className="lp-ov-bot"   /> {/* bottom gradient for thumbs */}
      <div className="lp-ov-top"   /> {/* top vignette */}

      {/* ══ Progress bar (top) ══ */}
      <div className="lp-prog-track">
        <div key={progKey} className="lp-prog-bar" />
      </div>

      {/* ══ Layout ══ */}
      <div className="lp-layout">

        {/* ── Left: brand + slide text + thumbs ── */}
        <div className="lp-left" style={{ opacity: mounted ? 1 : 0, transition: 'opacity .8s ease .1s' }}>

          {/* Brand mark — top */}
          <div className="lp-mark">
            <img src={logo} alt="" className="lp-mark-logo" />
            <div className="lp-mark-sep" />
            <span className="lp-mark-label">Management Portal</span>
          </div>

          {/* Slide text — bottom of left panel, animates in per slide */}
          <div className="lp-bottom-left">
            <div key={`txt-${curr}`} className="lp-txt-block">
              {/* Accent dash — like video's yellow line */}
              <div className="lp-dash" />
              {/* Category (slides in first) */}
              <p className="lp-cat">{slide.cat}</p>
              {/* Big title (slides in after, like the video) */}
              <h1 className="lp-title">{slide.name}</h1>
            </div>

            {/* Thumbnail strip — next 4 photos, slide in from right */}
            <div key={`th-${curr}`} className="lp-thumbs">
              {thumbs.map((t, i) => (
                <div
                  key={i}
                  className="lp-thumb"
                  style={{ animationDelay: `${0.08 + i * 0.09}s` }}
                >
                  <img src={t.img} alt="" className="lp-thumb-img" />
                  <div className="lp-thumb-veil">
                    <span className="lp-thumb-cat">{t.cat}</span>
                    <span className="lp-thumb-name">{t.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide counter — bottom right of left panel */}
            <div className="lp-counter">
              <span className="lp-cnt-n">{counter}</span>
              <span className="lp-cnt-s"> / </span>
              <span className="lp-cnt-t">{String(SLIDES.length).padStart(2,'0')}</span>
            </div>
          </div>
        </div>

        {/* ── Right: login card ── */}
        <div className="lp-right">

          {/* Mobile-only logo */}
          <div className="lp-mob-head">
            <img src={logo} alt="" className="lp-mob-logo" />
            <h2 className="lp-mob-title">Nyakoe Fassions</h2>
            <div className="lp-mob-rule">
              <span className="lp-rl" /><Heart size={7} className="lp-heart" /><span className="lp-rl" />
            </div>
          </div>

          {/* Glass card */}
          <div
            className="lp-card"
            style={{
              opacity:    mounted ? 1 : 0,
              transform:  mounted ? 'translateY(0) scale(1)' : 'translateY(26px) scale(0.97)',
              transition: 'opacity .9s ease .5s, transform .9s cubic-bezier(.16,1,.3,1) .5s',
            }}
          >
            <div className="lp-ch">
              <p className="lp-eyebrow">Welcome back</p>
              <h3 className="lp-ctitle">
                {step === 1 ? 'Sign In' : 'Enter Password'}
              </h3>
              <p className="lp-csub">
                {step === 1 ? 'Enter your username to continue' : `Signing in as · ${username}`}
              </p>
            </div>

            <form onSubmit={step === 1 ? handleContinue : handleSignIn} className="lp-form">

              {/* Username */}
              <div className="lp-field">
                <label className="lp-lbl">Username</label>
                {step === 2 ? (
                  <div className="lp-chip">
                    <div className="lp-chip-av"><User size={11} /></div>
                    <span className="lp-chip-name">{username}</span>
                    <button type="button" className="lp-chip-btn"
                      onClick={() => { setStep(1); setPassword(''); setPassErr(''); }}>
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="lp-iw">
                    <User size={15} className="lp-ii" />
                    <input type="text" value={username} autoFocus className="lp-i"
                      placeholder="Enter your username"
                      onChange={e => { setUsername(e.target.value); setUserErr(''); }} />
                  </div>
                )}
                {userErr && <p className="lp-err"><span className="lp-ed" />{userErr}</p>}
              </div>

              {/* Password */}
              {step === 2 && (
                <div className="lp-field lp-field-in">
                  <label className="lp-lbl">Password</label>
                  <div className={`lp-iw ${shake ? 'lp-shake' : ''}`}>
                    <Lock size={15} className="lp-ii" />
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={password} autoFocus className="lp-i"
                      placeholder="••••••••"
                      onChange={e => { setPassword(e.target.value); setPassErr(''); }}
                    />
                    <button type="button" className="lp-eye" onClick={() => setShowPw(v => !v)}>
                      {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {passErr && <p className="lp-err"><span className="lp-ed" />{passErr}</p>}
                </div>
              )}

              <button type="submit" className="lp-btn">
                <span>{step === 1 ? 'Continue' : 'Sign In'}</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <p className="lp-cf">Nyakoe Fassions · Private Access</p>
          </div>
        </div>
      </div>

      {/* ══ Styles ══ */}
      <style>{`
        /* ─ Root ─ */
        .lp-root {
          position: relative; min-height: 100vh; width: 100%;
          overflow: hidden; background: #060608; display: flex;
        }

        /* ─ Background slideshow ─ */
        .lp-bg { position: absolute; inset: 0; z-index: 0; }

        .lp-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center center;
        }
        .lp-in {
          z-index: 2;
          animation:
            lp-fadein ${FADE_MS}ms ease-out forwards,
            lp-kb0 ${SLIDE_MS + FADE_MS * 2}ms ease-out forwards;
        }
        .lp-out { z-index: 1; animation: lp-fadeout ${FADE_MS}ms ease-in forwards; }

        /* Ken Burns — 4 direction variants */
        .lp-kb0 { animation-name: lp-fadein, lp-kb0; }
        .lp-kb1 { animation-name: lp-fadein, lp-kb1; }
        .lp-kb2 { animation-name: lp-fadein, lp-kb2; }
        .lp-kb3 { animation-name: lp-fadein, lp-kb3; }

        @keyframes lp-fadein  { from { opacity:0; } to { opacity:1; } }
        @keyframes lp-fadeout { from { opacity:1; } to { opacity:0; } }

        @keyframes lp-kb0 {
          from { transform: scale(1.00) translate(  0%,   0%  ); }
          to   { transform: scale(1.12) translate( -2%,  -1.5%); }
        }
        @keyframes lp-kb1 {
          from { transform: scale(1.05) translate(  2%,   1%  ); }
          to   { transform: scale(1.15) translate( -1%,  -2%  ); }
        }
        @keyframes lp-kb2 {
          from { transform: scale(1.00) translate( -2%,   1%  ); }
          to   { transform: scale(1.13) translate(1.5%,  -2%  ); }
        }
        @keyframes lp-kb3 {
          from { transform: scale(1.08) translate(  0%,   2%  ); }
          to   { transform: scale(1.16) translate( -2%,  -1%  ); }
        }

        /* ─ Overlays ─ */
        .lp-ov-base {
          position: absolute; inset: 0; z-index: 3;
          background: rgba(0,0,0,.42);
        }
        .lp-ov-left {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(
            to right,
            rgba(0,0,0,.65) 0%,
            rgba(0,0,0,.28) 45%,
            transparent 65%
          );
        }
        .lp-ov-right {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(
            to left,
            rgba(0,0,0,.85) 0%,
            rgba(0,0,0,.55) 35%,
            transparent 60%
          );
        }
        .lp-ov-bot {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(to top, rgba(0,0,0,.80) 0%, transparent 45%);
        }
        .lp-ov-top {
          position: absolute; inset: 0; z-index: 4;
          background: linear-gradient(to bottom, rgba(0,0,0,.50) 0%, transparent 18%);
        }

        /* ─ Progress bar ─ */
        .lp-prog-track {
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; z-index: 30;
          background: rgba(255,255,255,.07);
        }
        .lp-prog-bar {
          height: 100%;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          animation: lp-prog ${SLIDE_MS}ms linear forwards;
        }
        @keyframes lp-prog { from { width:0%; } to { width:100%; } }

        /* ─ Layout ─ */
        .lp-layout {
          position: relative; z-index: 10;
          display: flex; width: 100%; min-height: 100vh;
        }

        /* ══ Left panel ══ */
        .lp-left {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 58%;
          padding: 2.5rem 3rem;
          pointer-events: none;
        }
        @media (min-width: 1024px) { .lp-left { display: flex; } }

        /* Brand mark */
        .lp-mark { display: flex; align-items: center; gap: .9rem; }
        .lp-mark-logo {
          height: 40px; width: auto;
          filter: brightness(0) invert(1); opacity: .75;
        }
        .lp-mark-sep { width:1px; height:1.6rem; background:rgba(255,255,255,.18); }
        .lp-mark-label {
          font-size: 9px; font-weight: 700;
          letter-spacing: .38em; text-transform: uppercase;
          color: rgba(255,255,255,.32);
        }

        /* Bottom of left panel */
        .lp-bottom-left {
          display: flex; flex-direction: column; gap: 1.2rem;
        }

        /* ── Slide text block (re-animates on each slide) ── */
        .lp-txt-block {
          animation: lp-txt-enter .55s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes lp-txt-enter {
          from { opacity:0; transform: translateX(-32px); }
          to   { opacity:1; transform: translateX(0); }
        }

        /* Accent dash (mimics video's amber line) */
        .lp-dash {
          width: 32px; height: 2px;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          border-radius: 2px;
          margin-bottom: .65rem;
          animation: lp-dash-in .4s ease both;
        }
        @keyframes lp-dash-in {
          from { width: 0; opacity: 0; }
          to   { width: 32px; opacity: 1; }
        }

        /* Category text */
        .lp-cat {
          font-size: 11px; font-weight: 700;
          letter-spacing: .35em; text-transform: uppercase;
          color: rgba(255,255,255,.55);
          margin-bottom: .5rem;
          animation: lp-txt-enter .55s cubic-bezier(.16,1,.3,1) .05s both;
        }

        /* Big title — exactly like the video */
        .lp-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(2.2rem, 3.8vw, 4.4rem);
          font-weight: 900;
          line-height: 1.0;
          letter-spacing: .03em;
          text-transform: uppercase;
          color: rgba(255,255,255,.95);
          margin: 0;
          animation: lp-txt-enter .6s cubic-bezier(.16,1,.3,1) .12s both;
        }

        /* ── Thumbnail strip ── */
        .lp-thumbs {
          display: flex; gap: .65rem;
          overflow: visible;
        }

        .lp-thumb {
          position: relative;
          width: 110px; height: 145px;
          border-radius: .75rem;
          overflow: hidden;
          flex-shrink: 0;
          cursor: default;
          animation: lp-thumb-in .5s cubic-bezier(.16,1,.3,1) both;
          box-shadow: 0 8px 24px rgba(0,0,0,.5);
        }
        @keyframes lp-thumb-in {
          from { opacity:0; transform: translateX(28px) scale(0.92); }
          to   { opacity:1; transform: translateX(0)    scale(1); }
        }

        .lp-thumb-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          transition: transform .4s ease;
        }
        .lp-thumb:hover .lp-thumb-img { transform: scale(1.06); }

        .lp-thumb-veil {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.82) 0%, transparent 55%);
          display: flex; flex-direction: column;
          justify-content: flex-end;
          padding: .6rem .55rem;
          gap: .15rem;
        }
        .lp-thumb-cat {
          font-size: 7px; font-weight: 700;
          letter-spacing: .2em; text-transform: uppercase;
          color: rgba(255,255,255,.45);
        }
        .lp-thumb-name {
          font-size: 9px; font-weight: 800;
          letter-spacing: .06em; text-transform: uppercase;
          color: rgba(255,255,255,.88);
          line-height: 1.2;
        }

        /* ── Slide counter (video: "01", "02"...) ── */
        .lp-counter {
          display: flex; align-items: baseline; gap: .3rem;
        }
        .lp-cnt-n {
          font-family: Georgia, serif;
          font-size: 3rem; font-weight: 300; line-height: 1;
          color: rgba(255,255,255,.60);
          letter-spacing: .05em;
        }
        .lp-cnt-s {
          font-size: 11px;
          color: rgba(255,255,255,.22);
          letter-spacing: .08em;
        }
        .lp-cnt-t {
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,.22);
          letter-spacing: .06em;
        }

        /* ══ Right panel ══ */
        .lp-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 1.75rem 1.25rem;
          min-height: 100vh;
        }
        @media (min-width: 1024px) { .lp-right { width: 42%; padding: 2.5rem; } }

        /* Mobile logo */
        .lp-mob-head {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 1024px) { .lp-mob-head { display: none; } }
        .lp-mob-logo {
          height: 48px; width: auto;
          filter: brightness(0) invert(1); opacity: .8;
          margin-bottom: .65rem;
        }
        .lp-mob-title {
          font-family: Georgia, serif;
          font-size: 1.15rem; font-weight: 300;
          letter-spacing: .22em; text-transform: uppercase;
          color: rgba(255,255,255,.88);
          margin-bottom: .4rem;
        }
        .lp-mob-rule { display: flex; align-items: center; gap: .4rem; }
        .lp-rl { display: block; width: 30px; height: 1px; background: rgba(251,113,133,.5); }
        .lp-heart { color: #fb7185; fill: #fb7185; flex-shrink: 0; }

        /* ── Glass card ── */
        .lp-card {
          width: 100%; max-width: 390px;
          background: rgba(4,4,8,.62);
          backdrop-filter: blur(32px);
          -webkit-backdrop-filter: blur(32px);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 1.5rem;
          padding: 2rem 1.85rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.025) inset,
            0 32px 64px rgba(0,0,0,.7),
            0 0 80px rgba(244,63,94,.06);
        }

        .lp-ch { margin-bottom: 1.5rem; }
        .lp-eyebrow {
          font-size: 8.5px; font-weight: 700;
          letter-spacing: .42em; text-transform: uppercase;
          color: #f43f5e; margin-bottom: .35rem;
        }
        .lp-ctitle {
          font-family: Georgia, serif;
          font-size: 1.5rem; font-weight: 300;
          letter-spacing: .04em;
          color: rgba(255,255,255,.92); margin-bottom: .3rem;
        }
        .lp-csub { font-size: 11px; color: rgba(255,255,255,.24); }

        .lp-form { display: flex; flex-direction: column; gap: .85rem; }
        .lp-field { display: flex; flex-direction: column; }
        .lp-field-in { animation: lp-field-slide .4s cubic-bezier(.16,1,.3,1); }
        @keyframes lp-field-slide {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .lp-lbl {
          font-size: 8.5px; font-weight: 700;
          letter-spacing: .32em; text-transform: uppercase;
          color: rgba(255,255,255,.28); margin-bottom: .45rem;
        }

        /* Input */
        .lp-iw { position: relative; display: flex; align-items: center; }
        .lp-ii {
          position: absolute; left: .95rem;
          color: rgba(255,255,255,.22);
          pointer-events: none; transition: color .2s; flex-shrink: 0;
        }
        .lp-iw:focus-within .lp-ii { color: #f43f5e; }
        .lp-i {
          width: 100%;
          padding: .82rem 1rem .82rem 2.65rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: .875rem;
          color: rgba(255,255,255,.90); font-size: .875rem; outline: none;
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
          color: rgba(255,255,255,.22); background: none; border: none;
          cursor: pointer; display: flex; align-items: center;
          transition: color .2s; padding: 0;
        }
        .lp-eye:hover { color: rgba(255,255,255,.55); }

        /* Locked chip */
        .lp-chip {
          display: flex; align-items: center; gap: .55rem;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: .875rem; padding: .72rem .95rem;
        }
        .lp-chip-av {
          width: 1.45rem; height: 1.45rem;
          background: rgba(244,63,94,.18); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #f43f5e; flex-shrink: 0;
        }
        .lp-chip-name { flex:1; font-size:.875rem; font-weight:700; color:rgba(255,255,255,.86); }
        .lp-chip-btn {
          font-size:8.5px; font-weight:700; letter-spacing:.18em;
          text-transform:uppercase; color:#f43f5e;
          background:none; border:none; cursor:pointer; transition:color .2s; padding:0;
        }
        .lp-chip-btn:hover { color:#fb7185; }

        /* Error */
        .lp-err {
          display:flex; align-items:center; gap:.3rem;
          margin-top:.38rem; font-size:11px; font-weight:600; color:#f43f5e;
        }
        .lp-ed { display:inline-block; width:4px; height:4px; background:#f43f5e; border-radius:50%; flex-shrink:0; }

        /* Submit */
        .lp-btn {
          display:flex; align-items:center; justify-content:center; gap:.45rem;
          width:100%; padding:.88rem 1rem;
          background: linear-gradient(135deg, #f43f5e 0%, #c026d3 100%);
          color:#fff; font-size:10.5px; font-weight:700;
          letter-spacing:.22em; text-transform:uppercase;
          border:none; border-radius:.875rem; cursor:pointer; margin-top:.1rem;
          box-shadow: 0 8px 26px rgba(244,63,94,.28);
          transition: transform .2s, box-shadow .2s, filter .2s;
        }
        .lp-btn:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(244,63,94,.45); filter:brightness(1.08); }
        .lp-btn:active { transform:scale(.97); }

        .lp-cf {
          margin-top:1.3rem; padding-top:1rem;
          border-top:1px solid rgba(255,255,255,.05);
          text-align:center; font-size:8.5px; letter-spacing:.2em;
          text-transform:uppercase; color:rgba(255,255,255,.12);
        }

        /* ─ Keyframes ─ */
        @keyframes lp-shake {
          0%,100% { transform:translateX(0); }
          18%     { transform:translateX(-8px); }
          36%     { transform:translateX(8px); }
          54%     { transform:translateX(-5px); }
          72%     { transform:translateX(5px); }
        }
        .lp-shake { animation:lp-shake .55s ease-out; }

        /* Mobile thumbnail strip (shown below card) */
        @media (max-width: 1023px) {
          .lp-mob-thumbs-strip {
            display: flex; gap: .5rem; overflow-x: auto;
            padding: .75rem 1.25rem 1.25rem;
            scrollbar-width: none;
          }
          .lp-mob-thumbs-strip::-webkit-scrollbar { display: none; }
        }
      `}</style>

      {/* Mobile thumbnail strip below card */}
      <div
        className="lp-mob-thumbs-strip"
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          zIndex: 20, display: 'none',
        }}
      >
        {/* Shown via CSS on mobile only */}
      </div>
    </div>
  );
}
