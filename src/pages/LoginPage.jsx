import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo bq.png';

// ── All boutique photos ──────────────────────────────────────────────
import i_dera1     from '../assets/dera1.jpg';
import i_ladies    from '../assets/ladies.jpg';
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

const SLIDES = [
  { img: i_dera1,     cat: 'Designer Collection', name: 'Evening Elegance'  },
  { img: i_ladies,    cat: 'Ladies Fashion',       name: 'New Arrivals'      },
  { img: i_handbags,  cat: 'Accessories',           name: 'Handbag Edit'      },
  { img: i_ladies4,   cat: 'Ladies Fashion',        name: 'Casual Chic'       },
  { img: i_men6,      cat: 'Menswear',              name: 'Smart Casual'      },
  { img: i_belt3,     cat: 'Accessories',           name: 'Belt Collection'   },
  { img: i_shoes,     cat: 'Footwear',              name: 'Ladies Heels'      },
  { img: i_dera2,     cat: 'Designer Collection',   name: 'Signature Pieces'  },
  { img: i_ladies6,   cat: 'Ladies Fashion',        name: 'Glamour Series'    },
  { img: i_men4,      cat: 'Menswear',              name: 'Office Essentials' },
  { img: i_lshoes,    cat: 'Footwear',              name: 'Pumps & Heels'     },
  { img: i_adies9,    cat: 'Ladies Fashion',        name: 'Floral Collection' },
  { img: i_men1,      cat: 'Menswear',              name: 'Classic Shirts'    },
  { img: i_belt2,     cat: 'Accessories',           name: 'Leather Belts'     },
  { img: i_lshoss,    cat: 'Footwear',              name: 'Shoe Collection'   },
  { img: i_ladies2,   cat: 'Ladies Fashion',        name: 'Evening Gowns'     },
  { img: i_men7,      cat: 'Menswear',              name: 'Weekend Wear'      },
  { img: i_shirt4,    cat: 'Formal Wear',           name: 'Dress Shirts'      },
  { img: i_menshoes,  cat: 'Footwear',              name: 'Oxford Shoes'      },
  { img: i_ladies3,   cat: 'Ladies Fashion',        name: 'Spring Collection' },
  { img: i_men9,      cat: 'Menswear',              name: 'Tailored Fits'     },
  { img: i_belt1,     cat: 'Accessories',           name: 'Classic Leather'   },
  { img: i_menshoes2, cat: 'Footwear',              name: 'Premium Leather'   },
  { img: i_ladies7,   cat: 'Ladies Fashion',        name: 'Bold & Beautiful'  },
  { img: i_men3,      cat: 'Menswear',              name: 'Casual Essentials' },
  { img: i_menshos,   cat: 'Footwear',              name: 'Loafers Edit'      },
  { img: i_ladies9,   cat: 'Ladies Fashion',        name: 'Style Icons'       },
];

const N           = SLIDES.length;   // 28
const INTERVAL_MS = 5000;
const SLIDE_MS    = 850;

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  /* ── Carousel state ── */
  const [startIdx,  setStartIdx]  = useState(0);
  const [slideKey,  setSlideKey]  = useState(0);
  const [labelsKey, setLabelsKey] = useState(0);
  const [thumbsKey, setThumbsKey] = useState(0);
  const [progKey,   setProgKey]   = useState(0);
  const sliding = useRef(false);

  /* ── Login state ── */
  const [step,     setStep]     = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [userErr,  setUserErr]  = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [shake,    setShake]    = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const advance = useCallback(() => {
    if (sliding.current) return;
    sliding.current = true;
    setSlideKey(k => k + 1);                       // fire strip slide

    setTimeout(() => {
      setStartIdx(i  => (i  + 1) % N);
      setProgKey (p  => p  + 1);
      setLabelsKey(l => l  + 1);
      setThumbsKey(t => t  + 1);
      sliding.current = false;
    }, SLIDE_MS);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(id);
  }, [advance]);

  /* ── Login handlers ── */
  const handleContinue = (e) => {
    e.preventDefault();
    const t = username.trim();
    if (t !== 'User' && t !== 'Admin') { setUserErr('Unknown username'); return; }
    setUserErr(''); setStep(2);
  };
  const handleSignIn = (e) => {
    e.preventDefault();
    const r = login(username.trim(), password);
    if (r.success) navigate(username.trim() === 'Admin' ? '/admin' : '/');
    else { setPassErr('Incorrect password'); setShake(true); setTimeout(() => setShake(false), 650); }
  };

  /* ── Derived photo sets ── */
  // Strip:   3 panels (left 2 visible + 1 incoming during slide)
  const strip  = [0, 1, 2].map(i => SLIDES[(startIdx + i) % N]);
  // Labels:  the 2 currently visible large photos
  const labels = [0, 1].map(i => SLIDES[(startIdx + i) % N]);
  // Thumbs: 5 photos — 4 visible + 1 entering from right (right-to-left conveyor)
  const thumbs = [2, 3, 4, 5, 6].map(i => SLIDES[(startIdx + i) % N]);

  const counter = String(startIdx + 1).padStart(2, '0');

  /* ── Mobile: single photo crossfade ── */
  const [mobCurr, setMobCurr] = useState(0);
  const [mobPrev, setMobPrev] = useState(null);
  useEffect(() => {
    const id = setInterval(() => {
      setMobPrev(mobCurr);
      setMobCurr(c => (c + 1) % N);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [mobCurr]);

  return (
    <div className="lp-root">

      {/* ══════════════════════ DESKTOP (≥1024px) ══════════════════════ */}

      {/* Progress bar — full width top */}
      <div className="lp-prog-track">
        <div key={progKey} className="lp-prog-fill" />
      </div>

      {/* ── LEFT: 2 full-height sliding portrait photos ── */}
      <div className="lp-left">

        {/* Sliding strip — 3 photos wide, 2 visible */}
        <div key={slideKey} className="lp-strip">
          {strip.map((s, i) => (
            <div key={i} className="lp-panel">
              <img src={s.img} alt={s.name} className="lp-panel-img" />
            </div>
          ))}
        </div>

        {/* Local vignette overlays (stay inside left section) */}
        <div className="lp-ov-top" />
        <div className="lp-ov-bot-left" />
        <div className="lp-ov-ledge" />


      </div>

      {/* ── RIGHT: Black panel — brand + login + thumbs ── */}
      <div className="lp-right">

        {/* ① Brand — top */}
        <div
          className="lp-brand"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-12px)', transition: 'opacity .9s ease .15s, transform .9s ease .15s' }}
        >
          <img src={logo} alt="" className="lp-brand-logo" />
          <div className="lp-brand-rule">
            <span className="lp-rl" />
            <Heart size={8} className="lp-heart" />
            <span className="lp-rl" />
          </div>
          <h1 className="lp-brand-title">Nyakoe Fassions</h1>
          <p className="lp-brand-sub">Timeless Style, Just For You</p>
        </div>

        {/* ② Login — middle (flex-grows to fill space) */}
        <div className="lp-login-wrap">
          <div
            className="lp-card"
            style={{
              opacity:    mounted ? 1 : 0,
              transform:  mounted ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
              transition: 'opacity .9s ease .4s, transform .9s cubic-bezier(.16,1,.3,1) .4s',
            }}
          >
            <div className="lp-ch">
              <p className="lp-eyebrow">Welcome back</p>
              <h3 className="lp-ctitle">{step === 1 ? 'Sign In' : 'Enter Password'}</h3>
              <p className="lp-csub">{step === 1 ? 'Enter your username to continue' : `Signing in as · ${username}`}</p>
            </div>

            <form onSubmit={step === 1 ? handleContinue : handleSignIn} className="lp-form">
              <div className="lp-field">
                <label className="lp-lbl">Username</label>
                {step === 2 ? (
                  <div className="lp-chip">
                    <div className="lp-chip-av"><User size={11} /></div>
                    <span className="lp-chip-name">{username}</span>
                    <button type="button" className="lp-chip-btn"
                      onClick={() => { setStep(1); setPassword(''); setPassErr(''); }}>Change</button>
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

              {step === 2 && (
                <div className="lp-field lp-field-in">
                  <label className="lp-lbl">Password</label>
                  <div className={`lp-iw ${shake ? 'lp-shake' : ''}`}>
                    <Lock size={15} className="lp-ii" />
                    <input type={showPw ? 'text' : 'password'} value={password} autoFocus className="lp-i"
                      placeholder="••••••••"
                      onChange={e => { setPassword(e.target.value); setPassErr(''); }} />
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

        {/* ③ Thumbnail strip — bottom, right-to-left conveyor */}
        <div
          className="lp-thumbs-wrap"
          style={{ opacity: mounted ? 1 : 0, transition: 'opacity .8s ease .6s' }}
        >
          <p className="lp-thumbs-label">Up Next ›</p>
          <div className="lp-thumbs-outer">
            <div key={thumbsKey} className="lp-thumbs-strip">
              {thumbs.map((s, i) => (
                <div key={i} className="lp-thumb">
                  <img src={s.img} alt={s.name} className="lp-thumb-img" />
                  <div className="lp-thumb-veil">
                    <span className="lp-thumb-name">{s.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════ MOBILE / TABLET (<1024px) ══════════════ */}

      <div className="lp-mob-root">
        {/* Full-screen crossfading photo */}
        <div className="lp-mob-bg">
          {mobPrev !== null && (
            <img key={`mp-${mobPrev}`} src={SLIDES[mobPrev].img} alt=""
              className="lp-mob-img lp-mob-out" onAnimationEnd={() => setMobPrev(null)} />
          )}
          <img key={`mc-${mobCurr}`} src={SLIDES[mobCurr].img} alt=""
            className="lp-mob-img lp-mob-in" />
        </div>

        {/* Overlays */}
        <div className="lp-mob-ov" />

        {/* Progress bar */}
        <div className="lp-prog-track lp-prog-mob">
          <div key={`mp-${progKey}`} className="lp-prog-fill" />
        </div>

        {/* Brand */}
        <div className="lp-mob-brand">
          <img src={logo} alt="" className="lp-mob-logo" />
          <div className="lp-mob-rule">
            <span className="lp-rl" /><Heart size={7} className="lp-heart" /><span className="lp-rl" />
          </div>
          <h2 className="lp-mob-title">Nyakoe Fassions</h2>
        </div>

        {/* Login card */}
        <div className="lp-mob-card-wrap">
          <div className="lp-card lp-mob-card">
            <div className="lp-ch">
              <p className="lp-eyebrow">Welcome back</p>
              <h3 className="lp-ctitle">{step === 1 ? 'Sign In' : 'Enter Password'}</h3>
              <p className="lp-csub">{step === 1 ? 'Enter your username to continue' : `Signing in as · ${username}`}</p>
            </div>

            <form onSubmit={step === 1 ? handleContinue : handleSignIn} className="lp-form">
              <div className="lp-field">
                <label className="lp-lbl">Username</label>
                {step === 2 ? (
                  <div className="lp-chip">
                    <div className="lp-chip-av"><User size={11} /></div>
                    <span className="lp-chip-name">{username}</span>
                    <button type="button" className="lp-chip-btn"
                      onClick={() => { setStep(1); setPassword(''); setPassErr(''); }}>Change</button>
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

              {step === 2 && (
                <div className="lp-field lp-field-in">
                  <label className="lp-lbl">Password</label>
                  <div className={`lp-iw ${shake ? 'lp-shake' : ''}`}>
                    <Lock size={15} className="lp-ii" />
                    <input type={showPw ? 'text' : 'password'} value={password} autoFocus className="lp-i"
                      placeholder="••••••••"
                      onChange={e => { setPassword(e.target.value); setPassErr(''); }} />
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

        {/* Mobile thumbnails — right-to-left conveyor strip */}
        <div className="lp-mob-thumbs-outer">
          <div key={`mt-${thumbsKey}`} className="lp-mob-thumbs-strip">
            {thumbs.map((s, i) => (
              <div key={i} className="lp-mob-thumb">
                <img src={s.img} alt={s.name} className="lp-thumb-img" />
                <div className="lp-thumb-veil">
                  <span className="lp-thumb-name">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ Styles ══ */}
      <style>{`

        /* ─────────────────────────────────────────────────────────
           ROOT
        ───────────────────────────────────────────────────────── */
        .lp-root {
          min-height: 100vh;
          width: 100%;
          background: #05050a;
          overflow: hidden;
        }

        /* ─────────────────────────────────────────────────────────
           PROGRESS BAR
        ───────────────────────────────────────────────────────── */
        .lp-prog-track {
          position: fixed; top: 0; left: 0; right: 0;
          height: 3px; z-index: 100;
          background: rgba(255,255,255,.06);
        }
        .lp-prog-fill {
          height: 100%;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          animation: lp-prog ${INTERVAL_MS}ms linear forwards;
        }
        @keyframes lp-prog { from{width:0%} to{width:100%} }

        /* ─────────────────────────────────────────────────────────
           DESKTOP LAYOUT (≥ 1024 px)
        ───────────────────────────────────────────────────────── */
        /* Hide mobile version on desktop */
        .lp-mob-root { display: none; }

        /* Root becomes a flex row on desktop */
        @media (min-width: 1024px) {
          .lp-root {
            display: flex;
            flex-direction: row;
            height: 100vh;
          }
          .lp-mob-root { display: none !important; }
        }

        /* ── Left photo section ── */
        .lp-left {
          display: none;                 /* hidden on mobile, flex on desktop */
          position: relative;
          overflow: hidden;
          flex: 0 0 calc(100vw * 2 / 3);
          height: 100vh;
        }
        @media (min-width: 1024px) { .lp-left { display: block; } }

        /* Sliding strip — 3 photos × (100vw/3) = 100vw total width */
        .lp-strip {
          display: flex;
          width: 100vw;               /* 3 × 33.33vw */
          height: 100%;
          animation: lp-slide ${SLIDE_MS}ms cubic-bezier(.77,0,.18,1) forwards;
        }
        @keyframes lp-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100vw / 3)); }
        }

        /* Individual photo panel */
        .lp-panel {
          flex: 0 0 calc(100vw / 3);
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .lp-panel + .lp-panel {
          border-left: 1px solid rgba(255,255,255,.07);
        }
        .lp-panel-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
          animation: lp-zoom 9s ease-in-out infinite alternate;
        }
        @keyframes lp-zoom {
          from { transform: scale(1.00); }
          to   { transform: scale(1.06); }
        }

        /* Local overlays inside left section */
        .lp-ov-top, .lp-ov-bot-left, .lp-ov-ledge {
          position: absolute; inset: 0; pointer-events: none; z-index: 3;
        }
        .lp-ov-top     { background: linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 16%); }
        .lp-ov-bot-left{ background: linear-gradient(to top,    rgba(0,0,0,.70) 0%, transparent 38%); }
        .lp-ov-ledge   { background: linear-gradient(to right,  rgba(0,0,0,.40) 0%, transparent 10%); }

        /* Photo labels layer */
        .lp-labels {
          position: absolute; bottom: 0; left: 0;
          width: calc(100vw * 2 / 3);  /* exactly the 2 visible panels */
          display: flex;
          z-index: 8;
          pointer-events: none;
        }
        .lp-label {
          flex: 0 0 calc(100vw / 3);
          padding: 4rem 1.4rem 1.6rem;
          display: flex; flex-direction: column; gap: .26rem;
          background: linear-gradient(to top, rgba(0,0,0,.85) 0%, rgba(0,0,0,.35) 50%, transparent 100%);
          animation: lp-label-up .65s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes lp-label-up {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .lp-ldash {
          display: block; width: 26px; height: 2px; border-radius: 2px;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          margin-bottom: .4rem;
        }
        .lp-lcat {
          font-size: 9px; font-weight: 700; letter-spacing: .36em;
          text-transform: uppercase; color: rgba(255,255,255,.48);
        }
        .lp-lname {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1rem, 1.55vw, 1.4rem);
          font-weight: 700; letter-spacing: .04em;
          text-transform: uppercase; color: rgba(255,255,255,.94);
          line-height: 1.1;
        }

        /* Slide counter — bottom-left of left section */
        .lp-counter {
          position: absolute; bottom: 1.5rem; left: 1.5rem;
          z-index: 10;
          display: flex; align-items: baseline; gap: .28rem;
        }
        .lp-cnt-n {
          font-family: Georgia, serif; font-size: 2.4rem;
          font-weight: 300; line-height: 1;
          color: rgba(255,255,255,.55); letter-spacing: .06em;
        }
        .lp-cnt-s { font-size: 10px; color: rgba(255,255,255,.22); }
        .lp-cnt-t { font-size: 11px; font-weight: 600; color: rgba(255,255,255,.22); }

        /* ── Right black panel ── */
        .lp-right {
          display: none;               /* hidden on mobile */
          flex: 0 0 calc(100vw / 3);
          height: 100vh;
          background: #060609;
          border-left: 1px solid rgba(255,255,255,.06);
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .lp-right { display: flex; } }

        /* ① Brand block */
        .lp-brand {
          flex-shrink: 0;
          display: flex; flex-direction: column; align-items: center;
          padding: 2rem 1.5rem 1.25rem;
          width: 100%;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }
        .lp-brand-logo {
          height: 44px; width: auto;
          filter: brightness(0) invert(1); opacity: .80;
          margin-bottom: .55rem;
        }
        .lp-brand-rule {
          display: flex; align-items: center; gap: .4rem; margin-bottom: .45rem;
        }
        .lp-rl { display: block; width: 26px; height: 1px; background: rgba(251,113,133,.45); }
        .lp-heart { color: #fb7185; fill: #fb7185; flex-shrink: 0; }
        .lp-brand-title {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(.95rem, 1.4vw, 1.25rem);
          font-weight: 300; letter-spacing: .22em;
          text-transform: uppercase; color: rgba(255,255,255,.90);
          text-align: center; margin-bottom: .25rem;
        }
        .lp-brand-sub {
          font-size: 8px; font-weight: 700; letter-spacing: .38em;
          text-transform: uppercase; color: rgba(255,255,255,.28);
          text-align: center;
        }

        /* ② Login wrapper — takes all space between brand and thumbs */
        .lp-login-wrap {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          width: 100%; padding: 1rem 1.25rem;
          overflow-y: auto;
        }

        /* ③ Thumbnails section */
        .lp-thumbs-wrap {
          flex-shrink: 0;
          width: 100%;
          padding: .85rem 1rem 1.1rem;
          border-top: 1px solid rgba(255,255,255,.05);
        }
        .lp-thumbs-label {
          font-size: 8px; font-weight: 700; letter-spacing: .38em;
          text-transform: uppercase; color: rgba(255,255,255,.25);
          margin-bottom: .55rem; padding-left: .1rem;
        }
        /* Outer clip — shows exactly 4 of the 5 thumbs */
        .lp-thumbs-outer {
          overflow: hidden;
          width: 100%;
        }
        /* Strip — 5 equal panels, slides left by 1 panel on each advance */
        .lp-thumbs-strip {
          display: flex;
          width: 125%; /* 5 thumbs × 20% = 100% of strip = 125% of container */
          animation: lp-thumb-slide ${SLIDE_MS}ms cubic-bezier(.77,0,.18,1) forwards;
        }
        @keyframes lp-thumb-slide {
          from { transform: translateX(0); }
          to   { transform: translateX(-20%); } /* shift left 1 of 5 panels */
        }
        .lp-thumb {
          flex: 0 0 20%; /* 1/5 of strip = 1/4 of container */
          padding-right: .5rem;
          box-sizing: border-box;
          position: relative; border-radius: .55rem;
          overflow: hidden; aspect-ratio: 3/4;
          box-shadow: 0 4px 16px rgba(0,0,0,.55);
          border: 1px solid rgba(255,255,255,.06);
        }
        .lp-thumb:last-child { padding-right: 0; }
        .lp-thumb-img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          transition: transform .4s ease;
          display: block;
        }
        .lp-thumb:hover .lp-thumb-img { transform: scale(1.07); }
        .lp-thumb-veil {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,.78) 0%, transparent 55%);
          display: flex; align-items: flex-end;
          padding: .4rem .35rem;
        }
        .lp-thumb-name {
          font-size: 7.5px; font-weight: 800; letter-spacing: .06em;
          text-transform: uppercase; color: rgba(255,255,255,.85);
          line-height: 1.2; display: block;
        }

        /* ── Login card (shared desktop + mobile) ── */
        .lp-card {
          width: 100%;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 1.1rem;
          padding: 1.6rem 1.5rem;
          box-shadow: 0 0 0 1px rgba(255,255,255,.025) inset, 0 20px 50px rgba(0,0,0,.5);
        }
        .lp-ch { margin-bottom: 1.3rem; }
        .lp-eyebrow {
          font-size: 8px; font-weight: 700; letter-spacing: .44em;
          text-transform: uppercase; color: #f43f5e; margin-bottom: .3rem;
        }
        .lp-ctitle {
          font-family: Georgia, serif; font-size: 1.35rem;
          font-weight: 300; letter-spacing: .04em;
          color: rgba(255,255,255,.92); margin-bottom: .25rem;
        }
        .lp-csub { font-size: 11px; color: rgba(255,255,255,.24); }
        .lp-form { display:flex; flex-direction:column; gap:.78rem; }
        .lp-field { display:flex; flex-direction:column; }
        .lp-field-in { animation: lp-field-in .4s cubic-bezier(.16,1,.3,1); }
        @keyframes lp-field-in { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .lp-lbl {
          font-size: 8px; font-weight:700; letter-spacing:.34em;
          text-transform:uppercase; color:rgba(255,255,255,.28); margin-bottom:.4rem;
        }
        .lp-iw { position:relative; display:flex; align-items:center; }
        .lp-ii {
          position:absolute; left:.88rem; color:rgba(255,255,255,.22);
          pointer-events:none; transition:color .2s; flex-shrink:0;
        }
        .lp-iw:focus-within .lp-ii { color:#f43f5e; }
        .lp-i {
          width:100%; padding:.75rem .9rem .75rem 2.5rem;
          background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.08);
          border-radius:.72rem; color:rgba(255,255,255,.90); font-size:.875rem; outline:none;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .lp-i::placeholder { color:rgba(255,255,255,.16); }
        .lp-i:focus {
          border-color:rgba(244,63,94,.5); background:rgba(255,255,255,.09);
          box-shadow:0 0 0 3px rgba(244,63,94,.10);
        }
        .lp-eye {
          position:absolute; right:.86rem; color:rgba(255,255,255,.22);
          background:none; border:none; cursor:pointer;
          display:flex; align-items:center; transition:color .2s; padding:0;
        }
        .lp-eye:hover { color:rgba(255,255,255,.55); }
        .lp-chip {
          display:flex; align-items:center; gap:.5rem;
          background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
          border-radius:.72rem; padding:.65rem .9rem;
        }
        .lp-chip-av {
          width:1.4rem; height:1.4rem; border-radius:50%;
          background:rgba(244,63,94,.18); display:flex; align-items:center;
          justify-content:center; color:#f43f5e; flex-shrink:0;
        }
        .lp-chip-name { flex:1; font-size:.875rem; font-weight:700; color:rgba(255,255,255,.86); }
        .lp-chip-btn {
          font-size:8px; font-weight:700; letter-spacing:.18em;
          text-transform:uppercase; color:#f43f5e;
          background:none; border:none; cursor:pointer; transition:color .2s; padding:0;
        }
        .lp-chip-btn:hover { color:#fb7185; }
        .lp-err {
          display:flex; align-items:center; gap:.28rem; margin-top:.35rem;
          font-size:11px; font-weight:600; color:#f43f5e;
        }
        .lp-ed { display:inline-block; width:4px; height:4px; background:#f43f5e; border-radius:50%; flex-shrink:0; }
        .lp-btn {
          display:flex; align-items:center; justify-content:center; gap:.42rem;
          width:100%; padding:.8rem 1rem;
          background:linear-gradient(135deg,#f43f5e 0%,#c026d3 100%);
          color:#fff; font-size:10px; font-weight:700; letter-spacing:.24em;
          text-transform:uppercase; border:none; border-radius:.72rem; cursor:pointer;
          margin-top:.08rem; box-shadow:0 8px 26px rgba(244,63,94,.28);
          transition:transform .2s, box-shadow .2s, filter .2s;
        }
        .lp-btn:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(244,63,94,.46); filter:brightness(1.08); }
        .lp-btn:active { transform:scale(.97); }
        .lp-cf {
          margin-top:1.1rem; padding-top:.9rem;
          border-top:1px solid rgba(255,255,255,.05); text-align:center;
          font-size:8px; letter-spacing:.2em; text-transform:uppercase;
          color:rgba(255,255,255,.12);
        }
        @keyframes lp-shake {
          0%,100%{transform:translateX(0)} 18%{transform:translateX(-8px)}
          36%{transform:translateX(8px)} 54%{transform:translateX(-5px)} 72%{transform:translateX(5px)}
        }
        .lp-shake { animation:lp-shake .55s ease-out; }

        /* ─────────────────────────────────────────────────────────
           MOBILE / TABLET (<1024px)
        ───────────────────────────────────────────────────────── */
        .lp-mob-root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .lp-mob-root  { display: none !important; }
          .lp-prog-mob  { display: none !important; }
        }

        /* Full-screen background photo */
        .lp-mob-bg { position: absolute; inset: 0; z-index: 0; }
        .lp-mob-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
        }
        .lp-mob-in  { z-index:2; animation: lp-mob-fadein 1.2s ease forwards; }
        .lp-mob-out { z-index:1; animation: lp-mob-fadeout 1.2s ease forwards; }
        @keyframes lp-mob-fadein  { from{opacity:0} to{opacity:1} }
        @keyframes lp-mob-fadeout { from{opacity:1} to{opacity:0} }

        .lp-mob-ov {
          position: absolute; inset: 0; z-index: 3;
          background:
            linear-gradient(to bottom, rgba(0,0,0,.60) 0%, rgba(0,0,0,.20) 30%,rgba(0,0,0,.20) 60%, rgba(0,0,0,.80) 100%);
        }

        .lp-prog-mob {
          position: absolute; top: 0; left: 0; right: 0; z-index: 10;
        }

        /* Mobile brand */
        .lp-mob-brand {
          position: relative; z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          padding: 2.5rem 1.5rem .75rem;
        }
        .lp-mob-logo {
          height: 44px; width: auto;
          filter: brightness(0) invert(1); opacity: .82; margin-bottom: .5rem;
        }
        .lp-mob-rule {
          display: flex; align-items: center; gap: .35rem; margin-bottom: .35rem;
        }
        .lp-mob-title {
          font-family: Georgia, serif; font-size: 1.1rem; font-weight: 300;
          letter-spacing: .22em; text-transform: uppercase;
          color: rgba(255,255,255,.90);
        }

        /* Mobile card */
        .lp-mob-card-wrap {
          position: relative; z-index: 10;
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: .5rem 1.25rem;
        }
        .lp-mob-card {
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          background: rgba(4,4,10,.65) !important;
        }

        /* Mobile thumb outer clip */
        .lp-mob-thumbs-outer {
          position: relative; z-index: 10;
          overflow: hidden;
          padding: .5rem 1.1rem 1.25rem;
        }
        /* Strip — 5 panels, shows 4, slides left by 1 */
        .lp-mob-thumbs-strip {
          display: flex;
          width: 125%;
          animation: lp-thumb-slide ${SLIDE_MS}ms cubic-bezier(.77,0,.18,1) forwards;
        }
        .lp-mob-thumb {
          flex: 0 0 20%;
          padding-right: .45rem;
          box-sizing: border-box;
          border-radius: .5rem; overflow: hidden;
          aspect-ratio: 2/3; position: relative;
          box-shadow: 0 4px 14px rgba(0,0,0,.5);
          border: 1px solid rgba(255,255,255,.08);
        }
        .lp-mob-thumb:last-child { padding-right: 0; }
      `}</style>
    </div>
  );
}
