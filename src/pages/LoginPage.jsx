import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo bq.png';

// ── All boutique photos ────────────────────────────────────────────
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

// Curated order: alternate fashion types so adjacent panels look varied
const SLIDES = [
  { img: i_dera1,     cat: 'Designer Collection', name: 'Evening Elegance'  },
  { img: i_ladies,    cat: 'Ladies Fashion',       name: 'New Arrivals'      },
  { img: i_men10,     cat: 'Menswear',             name: 'Premium Suits'     },
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

const N = SLIDES.length;
const INTERVAL_MS = 5200; // time each set is shown
const SLIDE_MS    = 820;  // slide transition duration

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── Carousel state ──────────────────────────────────────────────
  // startIdx = index of the leftmost photo currently shown (before slide)
  const [startIdx,   setStartIdx]  = useState(0);
  const [slideKey,   setSlideKey]  = useState(0);  // changing key re-mounts track → restarts animation
  const [progKey,    setProgKey]   = useState(0);
  const [labelsKey,  setLabelsKey] = useState(0);  // restarts label entrance animation after slide
  const slidingRef = useRef(false);

  // ── Login state ──────────────────────────────────────────────────
  const [step,     setStep]     = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [userErr,  setUserErr]  = useState('');
  const [passErr,  setPassErr]  = useState('');
  const [shake,    setShake]    = useState(false);
  const [mounted,  setMounted]  = useState(false);

  useEffect(() => { const t = setTimeout(() => setMounted(true), 100); return () => clearTimeout(t); }, []);

  // Advance carousel: slide left, then update startIdx
  const advance = useCallback(() => {
    if (slidingRef.current) return;
    slidingRef.current = true;

    setSlideKey(k => k + 1); // triggers slide animation

    setTimeout(() => {
      setStartIdx(i => (i + 1) % N);
      setProgKey(p  => p + 1);
      setLabelsKey(l => l + 1); // fires label entrance animation after slide settles
      slidingRef.current = false;
    }, SLIDE_MS);
  }, []);

  useEffect(() => {
    const id = setInterval(advance, INTERVAL_MS);
    return () => clearInterval(id);
  }, [advance]);

  // ── Login handlers ───────────────────────────────────────────────
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

  // ── Compute 4 photos for the strip (3 visible + 1 incoming) ──────
  // Before the slide: photos [0,1,2] of the strip are visible
  // During/after slide: photo [1,2,3] are visible
  // After JS resets startIdx by 1, the new strip [0,1,2] matches what was [1,2,3]
  const photos = [0, 1, 2, 3].map(i => SLIDES[(startIdx + i) % N]);
  const counter = String(startIdx + 1).padStart(2, '0');

  return (
    <div className="lp-root">

      {/* ══ Progress bar ══ */}
      <div className="lp-prog-track">
        <div key={progKey} className="lp-prog-fill" />
      </div>

      {/* ══ Photo strip ══
          key=slideKey causes React to remount the track element,
          restarting the CSS slide animation from 0 each time.       */}
      <div className="lp-strip-wrap">
        <div key={slideKey} className="lp-strip">
          {photos.map((slide, i) => (
            <div key={i} className="lp-photo">
              <img
                src={slide.img}
                alt={slide.name}
                className="lp-photo-img"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ══ Labels layer — above overlays, fixed to panel bottoms ══
           key=labelsKey triggers the entrance animation after each slide  */}
      <div key={labelsKey} className="lp-labels-layer">
        {[0, 1, 2].map(i => {
          const slide = SLIDES[(startIdx + i) % N];
          return (
            <div key={i} className="lp-label-slot" style={{ animationDelay: `${i * 0.07}s` }}>
              <span className="lp-ldash" />
              <span className="lp-lcat">{slide.cat}</span>
              <span className="lp-lname">{slide.name}</span>
            </div>
          );
        })}
      </div>

      {/* ══ Global overlays (darken edges, center slightly) ══ */}
      <div className="lp-ov-top"    />
      <div className="lp-ov-bot"    />
      <div className="lp-ov-left"   />
      <div className="lp-ov-right"  />
      <div className="lp-ov-center" />  {/* soft dark veil behind the card */}

      {/* ══ Slide counter — bottom left ══ */}
      <div className="lp-counter" style={{ opacity: mounted ? 1 : 0, transition: 'opacity .8s ease .3s' }}>
        <span className="lp-cnt-n">{counter}</span>
        <span className="lp-cnt-s"> / </span>
        <span className="lp-cnt-t">{String(N).padStart(2, '0')}</span>
      </div>

      {/* ══ Login card — absolutely centered ══ */}
      <div className="lp-card-wrap">

        {/* Logo + brand (above card, always visible) */}
        <div
          className="lp-brand"
          style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(-14px)', transition: 'opacity .8s ease .2s, transform .8s ease .2s' }}
        >
          <img src={logo} alt="" className="lp-brand-logo" />
          <div className="lp-brand-rule">
            <span className="lp-rl" /><Heart size={8} className="lp-heart" /><span className="lp-rl" />
          </div>
          <h2 className="lp-brand-name">Nyakoe Fassions</h2>
          <p className="lp-brand-sub">Management Portal</p>
        </div>

        {/* Glass login card */}
        <div
          className="lp-card"
          style={{
            opacity:    mounted ? 1 : 0,
            transform:  mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
            transition: 'opacity .9s ease .45s, transform .9s cubic-bezier(.16,1,.3,1) .45s',
          }}
        >
          {/* Card header */}
          <div className="lp-ch">
            <p className="lp-eyebrow">Welcome back</p>
            <h3 className="lp-ctitle">{step === 1 ? 'Sign In' : 'Enter Password'}</h3>
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

      {/* ══ All Styles ══ */}
      <style>{`
        /* ─ Root ─ */
        .lp-root {
          position: relative;
          width: 100%; min-height: 100vh;
          overflow: hidden;
          background: #080810;
        }

        /* ─ Progress bar ─ */
        .lp-prog-track {
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px; z-index: 50;
          background: rgba(255,255,255,.07);
        }
        .lp-prog-fill {
          height: 100%;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          animation: lp-prog ${INTERVAL_MS}ms linear forwards;
        }
        @keyframes lp-prog { from{width:0%} to{width:100%} }

        /* ─ Photo strip wrapper ─ */
        .lp-strip-wrap {
          position: absolute; inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        /* ─ The sliding strip (4 panels) ─
             On desktop  : each panel = 100vw/3, strip = 4*(100vw/3) = 133.33vw
             On tablet   : each panel = 100vw/2, strip = 4*(100vw/2) = 200vw
             On mobile   : each panel = 100vw,   strip = 4*(100vw)   = 400vw
             Slide offset: one panel width = 25% of strip              */
        .lp-strip {
          position: absolute; inset: 0;
          display: flex;
          height: 100%;
          /* Desktop default */
          width: calc(100vw * 4 / 3);
          animation: lp-slide-desktop ${SLIDE_MS}ms cubic-bezier(.77,0,.18,1) forwards;
        }
        @keyframes lp-slide-desktop {
          from { transform: translateX(0); }
          to   { transform: translateX(calc(-100vw / 3)); }
        }

        @media (max-width: 1023px) {
          .lp-strip {
            width: 200vw;
            animation-name: lp-slide-tablet;
          }
          @keyframes lp-slide-tablet {
            from { transform: translateX(0); }
            to   { transform: translateX(-50vw); }
          }
        }

        @media (max-width: 639px) {
          .lp-strip {
            width: 400vw;
            animation-name: lp-slide-mobile;
          }
          @keyframes lp-slide-mobile {
            from { transform: translateX(0); }
            to   { transform: translateX(-100vw); }
          }
        }

        /* ─ Individual photo panel ─ */
        .lp-photo {
          position: relative;
          flex-shrink: 0;
          height: 100%;
          /* Desktop: 1/3 of viewport */
          width: calc(100vw / 3);
          overflow: hidden;
        }
        @media (max-width: 1023px) { .lp-photo { width: 50vw; } }
        @media (max-width: 639px)  { .lp-photo { width: 100vw; } }

        /* ─ Photo image — full body, top-aligned, subtle zoom ─ */
        .lp-photo-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;   /* shows head → feet, not crops from centre */
          display: block;
          animation: lp-zoom 8s ease-in-out infinite alternate;
        }
        @keyframes lp-zoom {
          from { transform: scale(1.00); }
          to   { transform: scale(1.06); }
        }

        /* Thin divider line between photo panels */
        .lp-photo + .lp-photo {
          border-left: 1px solid rgba(255,255,255,.06);
        }

        /* ─ Labels layer — sits above all overlays, below card ─ */
        .lp-labels-layer {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 18;          /* above overlays (z5), below card (z30) */
          display: flex;
          pointer-events: none;
        }
        /* Hidden on mobile/tablet — only on desktop 3-panel view */
        @media (max-width: 1023px) { .lp-labels-layer { display: none; } }

        /* Each slot aligns with its photo panel */
        .lp-label-slot {
          flex: 0 0 calc(100vw / 3);
          padding: 4.5rem 1.4rem 1.5rem;
          background: linear-gradient(to top,
            rgba(0,0,0,.88) 0%,
            rgba(0,0,0,.55) 40%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          gap: .28rem;
          /* Entrance: slides up from bottom + fades in */
          animation: lp-label-up .6s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes lp-label-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Accent dash — matches video's coloured line */
        .lp-ldash {
          display: block;
          width: 28px; height: 2px;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          border-radius: 2px;
          margin-bottom: .45rem;
        }

        /* Category text */
        .lp-lcat {
          font-size: 9px; font-weight: 700;
          letter-spacing: .36em; text-transform: uppercase;
          color: rgba(255,255,255,.50);
          line-height: 1;
        }

        /* Big bold name — like the video's large location text */
        .lp-lname {
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(1.05rem, 1.6vw, 1.45rem);
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
          color: rgba(255,255,255,.95);
          line-height: 1.1;
        }

        /* ─ Global overlays ─ */
        .lp-ov-top, .lp-ov-bot, .lp-ov-left, .lp-ov-right, .lp-ov-center {
          position: absolute; inset: 0; pointer-events: none; z-index: 5;
        }
        .lp-ov-top   { background: linear-gradient(to bottom, rgba(0,0,0,.55) 0%, transparent 14%); }
        .lp-ov-bot   { background: linear-gradient(to top,    rgba(0,0,0,.55) 0%, transparent 18%); }
        .lp-ov-left  { background: linear-gradient(to right,  rgba(0,0,0,.35) 0%, transparent 12%); }
        .lp-ov-right { background: linear-gradient(to left,   rgba(0,0,0,.35) 0%, transparent 12%); }
        /* Soft radial veil behind the centered login card */
        .lp-ov-center {
          background: radial-gradient(ellipse 55% 70% at 50% 50%, rgba(0,0,0,.48) 0%, transparent 100%);
        }

        /* ─ Slide counter ─ */
        .lp-counter {
          position: absolute; bottom: 1.5rem; left: 2rem;
          z-index: 20;
          display: flex; align-items: baseline; gap: .3rem;
        }
        .lp-cnt-n {
          font-family: Georgia, serif;
          font-size: 2.5rem; font-weight: 300; line-height: 1;
          color: rgba(255,255,255,.55); letter-spacing: .06em;
        }
        .lp-cnt-s { font-size: 10px; color: rgba(255,255,255,.22); }
        .lp-cnt-t { font-size: 11px; font-weight: 600; color: rgba(255,255,255,.22); letter-spacing: .06em; }

        /* ─ Login card wrapper — centred absolutely ─ */
        .lp-card-wrap {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 30;
          display: flex; flex-direction: column; align-items: center;
          width: 100%; max-width: 400px;
          padding: 0 1.25rem;
        }

        /* ─ Brand above card ─ */
        .lp-brand {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 1rem;
        }
        .lp-brand-logo {
          height: 48px; width: auto;
          filter: brightness(0) invert(1); opacity: .82;
          margin-bottom: .55rem;
        }
        .lp-brand-rule {
          display: flex; align-items: center; gap: .4rem; margin-bottom: .4rem;
        }
        .lp-rl { display: block; width: 28px; height: 1px; background: rgba(251,113,133,.5); }
        .lp-heart { color: #fb7185; fill: #fb7185; flex-shrink: 0; }
        .lp-brand-name {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 1.1rem; font-weight: 300;
          letter-spacing: .24em; text-transform: uppercase;
          color: rgba(255,255,255,.88); margin-bottom: .2rem;
        }
        .lp-brand-sub {
          font-size: 8px; font-weight: 700;
          letter-spacing: .4em; text-transform: uppercase;
          color: rgba(255,255,255,.3);
        }

        /* ─ Glass card ─ */
        .lp-card {
          width: 100%;
          background: rgba(4,4,10,.68);
          backdrop-filter: blur(36px);
          -webkit-backdrop-filter: blur(36px);
          border: 1px solid rgba(255,255,255,.10);
          border-radius: 1.4rem;
          padding: 1.85rem 1.75rem;
          box-shadow:
            0 0 0 1px rgba(255,255,255,.025) inset,
            0 28px 60px rgba(0,0,0,.75),
            0 0 80px rgba(244,63,94,.07);
        }

        .lp-ch { margin-bottom: 1.4rem; }
        .lp-eyebrow {
          font-size: 8px; font-weight: 700;
          letter-spacing: .44em; text-transform: uppercase;
          color: #f43f5e; margin-bottom: .32rem;
        }
        .lp-ctitle {
          font-family: Georgia, serif;
          font-size: 1.45rem; font-weight: 300;
          letter-spacing: .04em; color: rgba(255,255,255,.92); margin-bottom: .28rem;
        }
        .lp-csub { font-size: 11px; color: rgba(255,255,255,.24); }

        /* Form */
        .lp-form { display:flex; flex-direction:column; gap:.82rem; }
        .lp-field { display:flex; flex-direction:column; }
        .lp-field-in { animation: lp-field-drop .4s cubic-bezier(.16,1,.3,1); }
        @keyframes lp-field-drop {
          from { opacity:0; transform:translateY(-10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .lp-lbl {
          font-size:8px; font-weight:700; letter-spacing:.34em;
          text-transform:uppercase; color:rgba(255,255,255,.28); margin-bottom:.42rem;
        }

        /* Input */
        .lp-iw { position:relative; display:flex; align-items:center; }
        .lp-ii {
          position:absolute; left:.9rem;
          color:rgba(255,255,255,.22); pointer-events:none;
          transition:color .2s; flex-shrink:0;
        }
        .lp-iw:focus-within .lp-ii { color:#f43f5e; }
        .lp-i {
          width:100%;
          padding:.78rem .95rem .78rem 2.55rem;
          background:rgba(255,255,255,.055);
          border:1px solid rgba(255,255,255,.08);
          border-radius:.82rem;
          color:rgba(255,255,255,.90); font-size:.875rem; outline:none;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .lp-i::placeholder { color:rgba(255,255,255,.16); }
        .lp-i:focus {
          border-color:rgba(244,63,94,.5);
          background:rgba(255,255,255,.08);
          box-shadow:0 0 0 3px rgba(244,63,94,.10);
        }
        .lp-eye {
          position:absolute; right:.88rem; color:rgba(255,255,255,.22);
          background:none; border:none; cursor:pointer;
          display:flex; align-items:center; transition:color .2s; padding:0;
        }
        .lp-eye:hover { color:rgba(255,255,255,.55); }

        /* Locked chip */
        .lp-chip {
          display:flex; align-items:center; gap:.5rem;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.08);
          border-radius:.82rem; padding:.68rem .92rem;
        }
        .lp-chip-av {
          width:1.4rem; height:1.4rem; border-radius:50%;
          background:rgba(244,63,94,.18);
          display:flex; align-items:center; justify-content:center;
          color:#f43f5e; flex-shrink:0;
        }
        .lp-chip-name { flex:1; font-size:.875rem; font-weight:700; color:rgba(255,255,255,.86); }
        .lp-chip-btn {
          font-size:8px; font-weight:700; letter-spacing:.18em;
          text-transform:uppercase; color:#f43f5e;
          background:none; border:none; cursor:pointer; transition:color .2s; padding:0;
        }
        .lp-chip-btn:hover { color:#fb7185; }

        /* Error */
        .lp-err {
          display:flex; align-items:center; gap:.3rem;
          margin-top:.36rem; font-size:11px; font-weight:600; color:#f43f5e;
        }
        .lp-ed { display:inline-block; width:4px; height:4px; background:#f43f5e; border-radius:50%; flex-shrink:0; }

        /* Submit button */
        .lp-btn {
          display:flex; align-items:center; justify-content:center; gap:.42rem;
          width:100%; padding:.84rem 1rem;
          background:linear-gradient(135deg,#f43f5e 0%,#c026d3 100%);
          color:#fff; font-size:10px; font-weight:700;
          letter-spacing:.24em; text-transform:uppercase;
          border:none; border-radius:.82rem; cursor:pointer; margin-top:.1rem;
          box-shadow:0 8px 26px rgba(244,63,94,.28);
          transition:transform .2s, box-shadow .2s, filter .2s;
        }
        .lp-btn:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(244,63,94,.46); filter:brightness(1.08); }
        .lp-btn:active { transform:scale(.97); }

        /* Card footer */
        .lp-cf {
          margin-top:1.25rem; padding-top:.95rem;
          border-top:1px solid rgba(255,255,255,.05);
          text-align:center; font-size:8px; letter-spacing:.2em;
          text-transform:uppercase; color:rgba(255,255,255,.12);
        }

        /* Shake */
        @keyframes lp-shake {
          0%,100%{transform:translateX(0)} 18%{transform:translateX(-8px)}
          36%{transform:translateX(8px)} 54%{transform:translateX(-5px)} 72%{transform:translateX(5px)}
        }
        .lp-shake { animation:lp-shake .55s ease-out; }
      `}</style>
    </div>
  );
}
