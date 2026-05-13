'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Skull, Flame, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [ritualActive, setRitualActive] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.push('/')
    })
  }, [])

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')
    setSuccess('')
    setRitualActive(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        if (data.user) {
          // Create profile row
          await supabase.from('profiles').upsert({
            id: data.user.id,
            username: email.split('@')[0],
            updated_at: new Date().toISOString(),
          })
        }
        setSuccess('Invocación completada. Revisa tu correo para confirmar.')
        setRitualActive(false)
      }
    } catch (err: any) {
      setError(err.message || 'Error en el ritual.')
      setRitualActive(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Special+Elite&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blood:     #7a0000;
          --blood-lt:  #b01020;
          --teal:      #1a6b5a;
          --teal-lt:   #2aaa88;
          --paper:     #c8b89a;
          --night:     #03040a;
          --night-mid: #080a12;
          --gold:      #b8922a;
        }

        html, body { height: 100%; }

        body {
          background-color: var(--night);
          font-family: 'Crimson Text', Georgia, serif;
          color: var(--paper);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-image:
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(122,0,0,0.04) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
        }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: var(--night); }
        ::-webkit-scrollbar-thumb { background: var(--blood); }

        /* ═══ PAGE WRAPPER ═══ */
        .spn-login-page {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px;
          position: relative;
          overflow: hidden;
        }

        /* ═══ SIGIL / SUMMONING CIRCLE ═══ */
        .spn-sigil-wrap {
          position: relative;
          width: 320px;
          height: 320px;
          margin-bottom: -140px;
          z-index: 0;
          pointer-events: none;
        }
        .spn-sigil-svg {
          width: 100%;
          height: 100%;
        }
        .spn-ring-outer {
          transform-origin: 160px 160px;
          animation: rotateSlowCW 40s linear infinite;
        }
        .spn-ring-inner {
          transform-origin: 160px 160px;
          animation: rotateSlowCCW 28s linear infinite;
        }
        .spn-ring-active .spn-ring-outer {
          animation: rotateSlowCW 8s linear infinite;
        }
        .spn-ring-active .spn-ring-inner {
          animation: rotateSlowCCW 6s linear infinite;
        }
        .spn-rune-group {
          transform-origin: 160px 160px;
          animation: rotateSlowCCW 60s linear infinite;
        }

        @keyframes rotateSlowCW  { from { transform: rotate(0deg); }   to { transform: rotate(360deg); } }
        @keyframes rotateSlowCCW { from { transform: rotate(0deg); }   to { transform: rotate(-360deg); } }
        @keyframes flameGlow {
          0%,100% { opacity: 0.35; }
          50%      { opacity: 0.7; }
        }
        @keyframes sigilPulse {
          0%,100% { opacity: 0.12; }
          50%      { opacity: 0.28; }
        }
        @keyframes portalOpen {
          0%   { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes flicker { 0%,93%,100%{opacity:.35}96%{opacity:.08} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .spn-sigil-center-glow {
          animation: sigilPulse 3s ease-in-out infinite;
        }
        .spn-rune-text {
          font-family: 'Cinzel', serif;
          animation: flameGlow 2.5s ease-in-out infinite;
        }

        /* ═══ CARD ═══ */
        .spn-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 400px;
          background: linear-gradient(160deg, rgba(10,12,20,0.98), rgba(6,7,14,1));
          border: 1px solid rgba(122,0,0,0.25);
          border-top: 2px solid rgba(122,0,0,0.55);
          padding: 36px 32px 30px;
          animation: portalOpen 0.5s ease-out;
        }
        .spn-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(176,16,32,0.5), transparent);
        }

        /* ═══ TITLE ═══ */
        .spn-title-wrap {
          text-align: center;
          margin-bottom: 28px;
        }
        .spn-skull-icon {
          display: block;
          margin: 0 auto 14px;
          color: rgba(176,16,32,0.7);
          filter: drop-shadow(0 0 12px rgba(122,0,0,0.5));
        }
        .spn-card-title {
          font-family: 'Cinzel', serif;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--paper);
          text-shadow: 0 0 20px rgba(200,184,154,0.12);
          margin-bottom: 5px;
        }
        .spn-card-sub {
          font-family: 'Special Elite', monospace;
          font-size: 9px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(200,184,154,0.25);
        }

        /* ═══ TAB SWITCHER ═══ */
        .spn-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 1px solid rgba(122,0,0,0.2);
          margin-bottom: 26px;
        }
        .spn-tab {
          background: none;
          border: none;
          padding: 9px 0;
          font-family: 'Cinzel', serif;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(200,184,154,0.28);
          cursor: pointer;
          transition: all 0.22s;
          position: relative;
        }
        .spn-tab.active {
          color: rgba(200,184,154,0.75);
          background: rgba(122,0,0,0.1);
        }
        .spn-tab.active::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: rgba(176,16,32,0.65);
        }
        .spn-tab:hover:not(.active) { color: rgba(200,184,154,0.45); }

        /* ═══ FORM ═══ */
        .spn-form { display: flex; flex-direction: column; gap: 16px; }

        .spn-field { display: flex; flex-direction: column; gap: 6px; }
        .spn-label {
          font-family: 'Cinzel', serif;
          font-size: 7.5px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(42,170,136,0.45);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .spn-input-wrap { position: relative; }
        .spn-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(200,184,154,0.2);
          pointer-events: none;
        }
        .spn-input {
          width: 100%;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(122,0,0,0.2);
          border-bottom-color: rgba(122,0,0,0.4);
          color: var(--paper);
          font-family: 'Crimson Text', serif;
          font-size: 15px;
          padding: 10px 40px 10px 36px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          letter-spacing: 0.03em;
        }
        .spn-input:focus {
          border-color: rgba(122,0,0,0.5);
          background: rgba(0,0,0,0.55);
        }
        .spn-input::placeholder { color: rgba(200,184,154,0.14); font-style: italic; }
        .spn-pw-toggle {
          position: absolute;
          right: 11px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(200,184,154,0.22);
          cursor: pointer;
          padding: 2px;
          transition: color 0.2s;
          display: flex;
        }
        .spn-pw-toggle:hover { color: rgba(200,184,154,0.5); }

        /* ═══ MESSAGES ═══ */
        .spn-error {
          background: rgba(122,0,0,0.1);
          border: 1px solid rgba(122,0,0,0.3);
          border-left: 2px solid var(--blood-lt);
          padding: 9px 12px;
          font-family: 'Special Elite', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(176,16,32,0.9);
        }
        .spn-success {
          background: rgba(26,107,90,0.1);
          border: 1px solid rgba(42,170,136,0.2);
          border-left: 2px solid var(--teal-lt);
          padding: 9px 12px;
          font-family: 'Special Elite', monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(42,170,136,0.85);
        }

        /* ═══ SUBMIT ═══ */
        .spn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(90deg, #5a0000, #7a0010);
          border: 1px solid rgba(122,0,0,0.6);
          color: rgba(200,184,154,0.82);
          font-family: 'Cinzel', serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: 4px;
        }
        .spn-submit:hover:not(:disabled) {
          background: linear-gradient(90deg, #7a0000, #9a0014);
          box-shadow: 0 0 28px rgba(122,0,0,0.28);
        }
        .spn-submit:disabled { opacity: 0.25; cursor: not-allowed; }

        /* ═══ DIVIDER ═══ */
        .spn-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 4px 0;
        }
        .spn-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }
        .spn-divider-text {
          font-family: 'Cinzel', serif;
          font-size: 7px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(200,184,154,0.18);
        }

        /* ═══ GOOGLE BUTTON ═══ */
        .spn-google-btn {
          width: 100%;
          padding: 12px;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(200,184,154,0.1);
          color: rgba(200,184,154,0.45);
          font-family: 'Cinzel', serif;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.25s;
        }
        .spn-google-btn:hover:not(:disabled) {
          border-color: rgba(200,184,154,0.22);
          color: rgba(200,184,154,0.65);
          background: rgba(200,184,154,0.04);
        }
        .spn-google-btn:disabled { opacity: 0.2; cursor: not-allowed; }

        /* ═══ GOOGLE ICON ═══ */
        .spn-g-icon { width: 14px; height: 14px; flex-shrink: 0; opacity: 0.6; }

        /* ═══ RITUAL STATUS ═══ */
        .spn-ritual-text {
          font-family: 'Special Elite', monospace;
          font-size: 8.5px;
          letter-spacing: 0.38em;
          color: rgba(176,16,32,0.5);
          text-transform: uppercase;
          text-align: center;
          margin-top: 12px;
          animation: flicker 2s step-end infinite;
        }

        /* ═══ FOOTER ═══ */
        .spn-footer {
          margin-top: 36px;
          font-family: 'Special Elite', monospace;
          font-size: 8.5px;
          letter-spacing: 0.22em;
          color: rgba(200,184,154,0.15);
          text-transform: uppercase;
          text-align: center;
        }
      `}</style>

      <div className="spn-login-page">

        {/* SUMMONING CIRCLE SVG */}
        <div className="spn-sigil-wrap">
          <svg
            className={`spn-sigil-svg${ritualActive ? ' spn-ring-active' : ''}`}
            viewBox="0 0 320 320"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7a0000" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7a0000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Center glow */}
            <circle className="spn-sigil-center-glow" cx="160" cy="160" r="90" fill="url(#centerGlow)" />

            {/* Outer rotating ring */}
            <g className="spn-ring-outer">
              <circle cx="160" cy="160" r="148" fill="none" stroke="rgba(122,0,0,0.35)" strokeWidth="0.75" />
              <circle cx="160" cy="160" r="145" fill="none" stroke="rgba(122,0,0,0.12)" strokeWidth="0.4" />
              {/* Tick marks on outer ring */}
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180
                const isLong = i % 3 === 0
                const r1 = isLong ? 140 : 143
                const r2 = 148
                return (
                  <line
                    key={i}
                    x1={160 + r1 * Math.cos(angle)}
                    y1={160 + r1 * Math.sin(angle)}
                    x2={160 + r2 * Math.cos(angle)}
                    y2={160 + r2 * Math.sin(angle)}
                    stroke={isLong ? 'rgba(122,0,0,0.55)' : 'rgba(122,0,0,0.2)'}
                    strokeWidth={isLong ? '0.9' : '0.5'}
                  />
                )
              })}
              {/* Rune letters on outer ring */}
              {['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ'].map((r, i) => {
                const angle = (i * 30 - 90) * Math.PI / 180
                return (
                  <text
                    key={i}
                    x={160 + 134 * Math.cos(angle)}
                    y={160 + 134 * Math.sin(angle)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9"
                    fill="rgba(122,0,0,0.6)"
                    fontFamily="serif"
                    className="spn-rune-text"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >{r}</text>
                )
              })}
            </g>

            {/* Middle rotating ring (CCW) */}
            <g className="spn-ring-inner">
              <circle cx="160" cy="160" r="118" fill="none" stroke="rgba(122,0,0,0.28)" strokeWidth="0.6" strokeDasharray="4 6" />
              <circle cx="160" cy="160" r="112" fill="none" stroke="rgba(122,0,0,0.15)" strokeWidth="0.4" />
              {/* Pentagon */}
              {Array.from({ length: 5 }).map((_, i) => {
                const a1 = ((i * 72 - 90) * Math.PI) / 180
                const a2 = (((i + 1) * 72 - 90) * Math.PI) / 180
                return (
                  <line
                    key={i}
                    x1={160 + 112 * Math.cos(a1)}
                    y1={160 + 112 * Math.sin(a1)}
                    x2={160 + 112 * Math.cos(a2)}
                    y2={160 + 112 * Math.sin(a2)}
                    stroke="rgba(122,0,0,0.3)"
                    strokeWidth="0.7"
                  />
                )
              })}
              {/* Pentagon star lines */}
              {[[0,2],[1,3],[2,4],[3,0],[4,1]].map(([a, b], i) => {
                const ang1 = ((a * 72 - 90) * Math.PI) / 180
                const ang2 = ((b * 72 - 90) * Math.PI) / 180
                return (
                  <line
                    key={i}
                    x1={160 + 112 * Math.cos(ang1)}
                    y1={160 + 112 * Math.sin(ang1)}
                    x2={160 + 112 * Math.cos(ang2)}
                    y2={160 + 112 * Math.sin(ang2)}
                    stroke="rgba(122,0,0,0.18)"
                    strokeWidth="0.5"
                  />
                )
              })}
            </g>

            {/* Inner static circle */}
            <circle cx="160" cy="160" r="80" fill="none" stroke="rgba(42,170,136,0.12)" strokeWidth="0.5" strokeDasharray="2 8" />
            <circle cx="160" cy="160" r="68" fill="none" stroke="rgba(122,0,0,0.2)" strokeWidth="0.5" />

            {/* Cardinal rune dots */}
            {[0, 90, 180, 270].map((deg, i) => {
              const rad = (deg * Math.PI) / 180
              return (
                <circle
                  key={i}
                  cx={160 + 80 * Math.cos(rad)}
                  cy={160 + 80 * Math.sin(rad)}
                  r="3"
                  fill="rgba(122,0,0,0.45)"
                />
              )
            })}

            {/* Cross lines through center */}
            <line x1="160" y1="80" x2="160" y2="240" stroke="rgba(122,0,0,0.1)" strokeWidth="0.4" />
            <line x1="80" y1="160" x2="240" y2="160" stroke="rgba(122,0,0,0.1)" strokeWidth="0.4" />

            {/* Center small circle */}
            <circle cx="160" cy="160" r="8" fill="rgba(122,0,0,0.25)" stroke="rgba(122,0,0,0.5)" strokeWidth="0.7" />
            <circle cx="160" cy="160" r="3" fill="rgba(176,16,32,0.6)" />
          </svg>
        </div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="spn-card"
        >
          {/* Title */}
          <div className="spn-title-wrap">
            <Skull size={26} className="spn-skull-icon" />
            <div className="spn-card-title">
              {mode === 'login' ? 'Identificar Cazador' : 'Invocar Cazador'}
            </div>
            <div className="spn-card-sub">
              {mode === 'login' ? 'Acceso al Diario' : 'Registro en el Círculo'}
            </div>
          </div>

          {/* Tabs */}
          <div className="spn-tabs">
            <button className={`spn-tab${mode === 'login' ? ' active' : ''}`} onClick={() => { setMode('login'); setError(''); setSuccess('') }}>
              Acceder
            </button>
            <button className={`spn-tab${mode === 'register' ? ' active' : ''}`} onClick={() => { setMode('register'); setError(''); setSuccess('') }}>
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form className="spn-form" onSubmit={handleEmailAuth}>
            {/* Email */}
            <div className="spn-field">
              <label className="spn-label">
                <Mail size={10} />
                Correo
              </label>
              <div className="spn-input-wrap">
                <Mail size={14} className="spn-input-icon" />
                <input
                  type="email"
                  className="spn-input"
                  placeholder="cazador@winchester.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="spn-field">
              <label className="spn-label">
                <Lock size={10} />
                Contraseña
              </label>
              <div className="spn-input-wrap">
                <Lock size={14} className="spn-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="spn-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={6}
                />
                <button type="button" className="spn-pw-toggle" onClick={() => setShowPassword(v => !v)}>
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error / Success */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="spn-error">
                  ⚠ {error}
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="spn-success">
                  ✓ {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button type="submit" className="spn-submit" disabled={loading}>
              {loading
                ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Invocando...</>
                : <><Flame size={13} style={{ color: 'rgba(200,100,0,0.7)' }} /> {mode === 'login' ? 'Abrir el Sello' : 'Completar el Ritual'}</>
              }
            </button>
          </form>

          {/* Ritual loading text */}
          {loading && (
            <p className="spn-ritual-text">Abriendo el portal...</p>
          )}

          {/* Divider */}
          <div className="spn-divider" style={{ margin: '20px 0 16px' }}>
            <div className="spn-divider-line" />
            <span className="spn-divider-text">o continúa con</span>
            <div className="spn-divider-line" />
          </div>

          {/* Google */}
          <button className="spn-google-btn" onClick={handleGoogle} disabled={googleLoading} type="button">
            {googleLoading
              ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite', color: 'rgba(200,184,154,0.4)' }} />
              : (
                <svg className="spn-g-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="rgba(200,184,154,0.5)"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="rgba(200,184,154,0.4)"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="rgba(200,184,154,0.4)"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="rgba(200,184,154,0.4)"/>
                </svg>
              )
            }
            {googleLoading ? 'Conectando...' : 'Acceder con Google'}
          </button>
        </motion.div>

        {/* Footer */}
        <div className="spn-footer">
          El Diario del Cazador · Saving people, hunting things
        </div>
      </div>
    </>
  )
}
