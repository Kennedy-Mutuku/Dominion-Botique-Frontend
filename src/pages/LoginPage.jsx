import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo bq.png';
import dominionLogo from '../assets/dominion softwares main logo.png';

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
  const [startIdx, setStartIdx] = useState(0);
  const [progKey,  setProgKey]  = useState(0);
  const sliding     = useRef(false);
  const startIdxRef = useRef(0);

  /* ── Big panel crossfade state ── */
  const mkPanels = (idx) => [0, 1].map(i => SLIDES[(idx+i)%N]);
  const [currPanels,   setCurrPanels]   = useState(() => mkPanels(0));
  const [prevPanels,   setPrevPanels]   = useState(null);
  const [panelFadeKey, setPanelFadeKey] = useState(0);

  /* ── Thumb crossfade state ── */
  const mkThumbs = (idx) => [2,3,4,5].map(i => SLIDES[(idx+i)%N]);
  const [currThumbs,   setCurrThumbs]   = useState(() => mkThumbs(0));
  const [prevThumbs,   setPrevThumbs]   = useState(null);
  const [thumbFadeKey, setThumbFadeKey] = useState(0);

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

    const curIdx = startIdxRef.current;
    const newIdx = (curIdx + 1) % N;
    startIdxRef.current = newIdx;

    // Big panel crossfade
    setPrevPanels(mkPanels(curIdx));
    setCurrPanels(mkPanels(newIdx));
    setPanelFadeKey(k => k + 1);

    // Thumb crossfade
    setPrevThumbs(mkThumbs(curIdx));
    setCurrThumbs(mkThumbs(newIdx));
    setThumbFadeKey(k => k + 1);

    setStartIdx(newIdx);
    setProgKey(p => p + 1);

    // Release lock + clear prev layers after animations finish
    setTimeout(() => {
      setPrevPanels(null);
      setPrevThumbs(null);
      sliding.current = false;
    }, 2100);
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

      {/* ── LEFT: 2 full-height crossfading portrait photos ── */}
      <div className="lp-left">

        {currPanels.map((s, i) => (
          <div key={i} className="lp-panel">
            {/* Old photo fades out — continuing the wave from thumbs (thumbs end at 0.42s) */}
            {prevPanels && (
              <img key={`pout-${panelFadeKey}-${i}`}
                src={prevPanels[i].img} alt=""
                className="lp-panel-img lp-img-out"
                style={{ animationDelay: `${0.56 + (1-i)*0.14}s` }}
              />
            )}
            {/* New photo fades in after brief black gap */}
            <img key={`pin-${panelFadeKey}-${i}`}
              src={s.img} alt={s.name}
              className="lp-panel-img lp-img-in"
              style={{ animationDelay: `${0.56 + (1-i)*0.14 + 0.42}s` }}
            />
          </div>
        ))}

        {/* Local vignette overlays */}
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
          <p className="lp-thumbs-label">Up Next</p>
          <div className="lp-thumbs">
            {currThumbs.map((s, i) => (
              <div key={i} className="lp-thumb">
                {/* Old photo — wave starts right (i=3), flows left */}
                {prevThumbs && (
                  <img
                    key={`out-${thumbFadeKey}-${i}`}
                    src={prevThumbs[i].img} alt=""
                    className="lp-thumb-img lp-img-out"
                    style={{ animationDelay: `${(3-i)*0.14}s` }}
                  />
                )}
                {/* New photo — fades in after brief black gap */}
                <img
                  key={`in-${thumbFadeKey}-${i}`}
                  src={s.img} alt={s.name}
                  className="lp-thumb-img lp-img-in"
                  style={{ animationDelay: `${(3-i)*0.14 + 0.42}s` }}
                />
                <div className="lp-thumb-veil">
                  <span className="lp-thumb-name">{s.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ④ Powered By — bottom of right panel */}
        <div className="lp-powered">
          <a href="https://dominionsoftwares.org/" target="_blank" rel="noopener noreferrer" className="lp-powered-link">
            <img src={dominionLogo} alt="Dominion Softwares" className="lp-powered-logo" />
            <span>Dominion Softwares</span>
          </a>
          <span className="lp-powered-sep">·</span>
          <span className="lp-powered-tel">0740881485</span>
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

        {/* Mobile thumbnails — crossfade */}
        <div className="lp-mob-thumbs">
          {currThumbs.map((s, i) => (
            <div key={i} className="lp-mob-thumb">
              {prevThumbs && (
                <img key={`mout-${thumbFadeKey}-${i}`}
                  src={prevThumbs[i].img} alt=""
                  className="lp-thumb-img lp-img-out"
                  style={{ animationDelay: `${(3-i)*0.14}s` }}
                />
              )}
              <img key={`min-${thumbFadeKey}-${i}`}
                src={s.img} alt={s.name}
                className="lp-thumb-img lp-img-in"
                style={{ animationDelay: `${(3-i)*0.14 + 0.42}s` }}
              />
              <div className="lp-thumb-veil">
                <span className="lp-thumb-name">{s.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Powered By */}
        <div className="lp-powered lp-powered-mob">
          <a href="https://dominionsoftwares.org/" target="_blank" rel="noopener noreferrer" className="lp-powered-link">
            <img src={dominionLogo} alt="Dominion Softwares" className="lp-powered-logo" />
            <span>Dominion Softwares</span>
          </a>
          <span className="lp-powered-sep">·</span>
          <span className="lp-powered-tel">0740881485</span>
        </div>
      </div>

      {/* ══ Styles ══ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&display=swap');

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
        @media (min-width: 1024px) { .lp-left { display: flex; flex-direction: row; } }

        /* Individual photo panel — side by side, each 1/2 of left section */
        .lp-panel {
          flex: 1;
          height: 100%;
          overflow: hidden;
          position: relative;
        }
        .lp-panel + .lp-panel {
          border-left: 1px solid rgba(255,255,255,.07);
        }
        .lp-panel-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
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
          height: 62px; width: auto;
          filter: invert(1) drop-shadow(0 0 14px rgba(244,63,94,.55));
          margin-bottom: .75rem;
        }
        .lp-brand-rule {
          display: flex; align-items: center; gap: .55rem; margin-bottom: .6rem;
        }
        .lp-rl {
          display: block; flex: 1; max-width: 36px; height: 1px;
          background: linear-gradient(to right, transparent, rgba(244,63,94,.6));
        }
        .lp-rl + .lp-heart + .lp-rl {
          background: linear-gradient(to left, transparent, rgba(244,63,94,.6));
        }
        .lp-heart { color: #f43f5e; fill: #f43f5e; flex-shrink: 0; }
        .lp-brand-title {
          font-family: 'Cinzel', Georgia, serif;
          font-size: clamp(1rem, 1.45vw, 1.3rem);
          font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase;
          background: linear-gradient(135deg, #ffffff 0%, #fda4af 60%, #e879f9 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center; margin-bottom: .3rem;
          filter: drop-shadow(0 2px 12px rgba(244,63,94,.3));
        }
        .lp-brand-sub {
          font-size: 7.5px; font-weight: 700; letter-spacing: .55em;
          text-transform: uppercase; color: rgba(255,255,255,.35);
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
        .lp-thumbs {
          display: flex; gap: .5rem;
        }
        .lp-thumb {
          flex: 1; position: relative; border-radius: .55rem;
          overflow: hidden; aspect-ratio: 3/4;
          box-shadow: 0 4px 16px rgba(0,0,0,.55);
          border: 1px solid rgba(255,255,255,.06);
        }
        /* Crossfade keyframes — out snaps fast, brief black, then in fades */
        @keyframes lp-img-fadein  { from{opacity:0} to{opacity:1} }
        @keyframes lp-img-fadeout { from{opacity:1} to{opacity:0} }
        .lp-img-out { z-index:1; animation: lp-img-fadeout 0.38s ease-in  both; }
        .lp-img-in  { z-index:2; animation: lp-img-fadein  0.70s ease-out both; }
        .lp-thumb-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          display: block;
        }
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
          background: rgba(8,8,18,.82);
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 1.4rem;
          padding: 2rem 1.8rem 1.6rem;
          box-shadow:
            0 0 0 1px rgba(244,63,94,.08) inset,
            0 8px 60px rgba(0,0,0,.7),
            0 0 40px rgba(244,63,94,.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .lp-ch { margin-bottom: 1.6rem; text-align: center; }
        .lp-eyebrow {
          font-size: 9px; font-weight: 900; letter-spacing: .55em;
          text-transform: uppercase;
          background: linear-gradient(to right, #f43f5e, #e879f9);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: .6rem; display: block;
        }
        .lp-ctitle {
          font-family: Georgia, serif; font-size: 2.1rem;
          font-weight: 700; letter-spacing: .02em;
          color: #ffffff; margin-bottom: .4rem;
          text-shadow: 0 2px 20px rgba(244,63,94,.25);
        }
        .lp-csub {
          font-size: 12px; font-weight: 500;
          color: rgba(255,255,255,.55);
          letter-spacing: .03em;
        }
        .lp-form { display:flex; flex-direction:column; gap:.85rem; }
        .lp-field { display:flex; flex-direction:column; }
        .lp-field-in { animation: lp-field-in .4s cubic-bezier(.16,1,.3,1); }
        @keyframes lp-field-in { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
        .lp-lbl {
          font-size: 9px; font-weight:800; letter-spacing:.4em;
          text-transform:uppercase; color:rgba(255,255,255,.60);
          margin-bottom:.45rem; text-align: center;
        }
        .lp-iw { position:relative; display:flex; align-items:center; }
        .lp-ii {
          position:absolute; left:.88rem; color:rgba(255,255,255,.22);
          pointer-events:none; transition:color .2s; flex-shrink:0;
        }
        .lp-iw:focus-within .lp-ii { color:#f43f5e; }
        .lp-i {
          width:100%; padding:.8rem .9rem .8rem 2.6rem;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.14);
          border-radius:.8rem; color:#ffffff; font-size:.95rem; font-weight:500; outline:none;
          transition:border-color .2s, background .2s, box-shadow .2s;
        }
        .lp-i::placeholder { color:rgba(255,255,255,.28); font-weight:400; }
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
          display:flex; align-items:center; justify-content:center; gap:.5rem;
          width:100%; padding:.9rem 1rem;
          background:linear-gradient(135deg,#f43f5e 0%,#c026d3 100%);
          color:#fff; font-size:10px; font-weight:800; letter-spacing:.32em;
          text-transform:uppercase; border:none; border-radius:.9rem; cursor:pointer;
          margin-top:.3rem;
          box-shadow: 0 8px 26px rgba(244,63,94,.32), 0 0 0 1px rgba(255,255,255,.06) inset;
          transition:transform .2s, box-shadow .2s, filter .2s;
        }
        .lp-btn:hover { transform:translateY(-2px); box-shadow:0 16px 40px rgba(244,63,94,.50); filter:brightness(1.1); }
        .lp-btn:active { transform:scale(.97); }
        .lp-cf {
          margin-top:1.2rem; padding-top:1rem;
          border-top:1px solid rgba(255,255,255,.05); text-align:center;
          font-size:8px; letter-spacing:.28em; text-transform:uppercase;
          color:rgba(255,255,255,.14);
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
          height: 52px; width: auto;
          filter: invert(1) drop-shadow(0 0 10px rgba(244,63,94,.45));
          margin-bottom: .5rem;
        }
        .lp-mob-rule {
          display: flex; align-items: center; gap: .35rem; margin-bottom: .35rem;
        }
        .lp-mob-title {
          font-family: 'Cinzel', Georgia, serif; font-size: 1.15rem; font-weight: 700;
          letter-spacing: .22em; text-transform: uppercase;
          background: linear-gradient(135deg, #fff 0%, #fda4af 60%, #e879f9 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
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

        /* Powered By footer */
        .lp-powered {
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          gap: .55rem; flex-wrap: wrap;
          padding: .7rem 1rem .9rem;
          border-top: 1px solid rgba(255,255,255,.05);
        }
        .lp-powered-link {
          display: inline-flex; align-items: center; gap: .45rem;
          font-size: 8.5px; font-weight: 800; letter-spacing: .32em;
          text-transform: uppercase; color: rgba(255,255,255,.65);
          text-decoration: none; transition: color .2s;
        }
        .lp-powered-link:hover { color: #fb7185; }
        .lp-powered-logo {
          height: 16px; width: auto;
          filter: brightness(0) invert(1); opacity: .75;
        }
        .lp-powered-sep { color: rgba(255,255,255,.18); font-size: 10px; }
        .lp-powered-tel {
          font-size: 8.5px; font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase; color: rgba(255,255,255,.38);
        }
        /* Mobile powered by — sits above the dark overlay */
        .lp-powered-mob {
          position: relative; z-index: 10;
          border-top: 1px solid rgba(255,255,255,.08);
          background: rgba(0,0,0,.45); backdrop-filter: blur(12px);
        }

        /* Mobile thumb strip */
        .lp-mob-thumbs {
          position: relative; z-index: 10;
          display: flex; gap: .45rem;
          padding: .5rem 1.1rem 1.25rem;
        }
        .lp-mob-thumb {
          flex: 1; border-radius: .5rem; overflow: hidden;
          aspect-ratio: 2/3; position: relative;
          box-shadow: 0 4px 14px rgba(0,0,0,.5);
          border: 1px solid rgba(255,255,255,.08);
          animation: lp-thumb-fade 0.9s cubic-bezier(.16,1,.3,1) both;
        }
      `}</style>
    </div>
  );
}
