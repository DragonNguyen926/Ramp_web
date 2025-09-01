import React, { useEffect, useRef, useState, useMemo } from 'react'

const MeetTheCrew = () => {
  const constellationRef = useRef(null)
  const codeRainRef = useRef(null)
  const navbarRef = useRef(null)
  const navLinksRef = useRef(null)
  const navToggleRef = useRef(null)
  const rampCrewTextRef = useRef(null)

  // Center cards when there’s no overflow
  const crewScrollRef = useRef(null)
  const [centerCards, setCenterCards] = useState(false)

  const [theme, setTheme] = useState('aurora')
  const [crewMembers, setCrewMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE = (() => {
    const base = import.meta?.env?.VITE_API_URL || 'http://localhost:5174'
    console.log('VITE_API_URL from env:', import.meta?.env?.VITE_API_URL)
    console.log('Selected API_BASE:', base)
    return base.endsWith('/') ? base.slice(0, -1) : base
  })()

  /* ================= THEME ================= */
  const cycleTheme = () => {
    const themes = ['aurora', 'monochrome']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved && ['aurora', 'monochrome'].includes(saved)) {
      setTheme(saved)
      document.documentElement.setAttribute('data-theme', saved)
    } else {
      document.documentElement.setAttribute('data-theme', 'aurora')
    }
  }, [])

  useEffect(() => {
    const el = rampCrewTextRef.current
    if (!el) return
    const onClick = () => cycleTheme()
    const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cycleTheme() } }
    el.addEventListener('click', onClick)
    el.addEventListener('keydown', onKey)
    return () => { el.removeEventListener('click', onClick); el.removeEventListener('keydown', onKey) }
  }, [theme])

  /* ================= DATA FETCH ================= */
  useEffect(() => {
    const API = `${API_BASE}/api/members`
    ;(async () => {
      try {
        const res = await fetch(API, { credentials: 'include' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()

        // Always coerce group name to string; accept multiple possible keys
        const getGroupName = (m) => {
          const v =
            m.display_group ??
            m.display_groups ??
            m.group_name ??
            m.group?.name ?? ''
          return typeof v === 'string' ? v : (v == null ? '' : String(v))
        }

        const normalized = (Array.isArray(data) ? data : []).map((m, i) => ({
          id: m.id ?? i,
          display_name: m.display_name ?? m.first_name ?? m.name ?? 'Unnamed',
          // role intentionally not used anymore
          display_group: getGroupName(m),
          position: m.position ?? null,  // 👈 NEW: use this on the card
          bio: m.bio ?? null,
          created_at: m.created_at ?? null,
        }))

        setCrewMembers(normalized)
      } catch (e) {
        console.error('Error fetching members', e)
        setError('Could not load crew. Try again later.')
      } finally {
        setLoading(false)
      }
    })()
  }, [API_BASE])

  /* ================= TEAM BUCKETS (includes “All Members”) ================= */
  const groupBuckets = useMemo(() => {
    const map = new Map()
    const canon = (s) => s.trim().toLowerCase()

    for (const m of crewMembers) {
      const nameRaw = (m.display_group ?? '').toString()
      const pretty = nameRaw.trim()
      if (!pretty) continue
      const key = canon(pretty)
      if (!map.has(key)) map.set(key, { name: pretty, members: [] })
      map.get(key).members.push(m)
    }

    const arr = Array.from(map.values())
    // Put Board first if present
    const i = arr.findIndex(b => /board/i.test(b.name))
    if (i > 0) { const [b] = arr.splice(i, 1); arr.unshift(b) }

    // Add All Members at the end
    if (crewMembers.length > 0) {
      arr.push({ name: 'All Members', members: crewMembers })
    }

    return arr
  }, [crewMembers])

  const [teamIndex, setTeamIndex] = useState(0)

  // Default to Board if present, else All Members, else first bucket
  useEffect(() => {
    if (groupBuckets.length === 0) return
    const idxBoard = groupBuckets.findIndex(b => /board/i.test(b.name))
    if (idxBoard >= 0) setTeamIndex(idxBoard)
    else {
      const idxAll = groupBuckets.findIndex(b => b.name === 'All Members')
      setTeamIndex(idxAll >= 0 ? idxAll : 0)
    }
  }, [groupBuckets])

  const cycleTeam = () => {
    if (groupBuckets.length === 0) return
    setTeamIndex((prev) => (prev + 1) % groupBuckets.length)
  }

  const currentBucket = groupBuckets[teamIndex] || null
  const currentTeamName = currentBucket?.name ?? '—'
  const visibleMembers = currentBucket?.members ?? []

  /* ================= EFFECTS & ANIMATIONS ================= */
  useEffect(() => {
    function createConstellation() {
      const constellation = constellationRef.current
      if (!constellation) return
      constellation.innerHTML = ''
      const stars = []
      const numStars = 50
      for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div')
        star.className = 'star'
        star.style.left = Math.random() * 100 + '%'
        star.style.top = Math.random() * 100 + '%'
        star.style.animationDelay = Math.random() * 3 + 's'
        constellation.appendChild(star)
        stars.push({ element: star, x: parseFloat(star.style.left), y: parseFloat(star.style.top) })
      }
      const onMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 100
        const mouseY = (e.clientY / window.innerHeight) * 100
        stars.forEach((star) => {
          const d = Math.hypot(mouseX - star.x, mouseY - star.y)
          if (d < 15) { star.element.style.transform = 'scale(1.5)'; star.element.style.boxShadow = '0 0 10px var(--accent)' }
          else { star.element.style.transform = 'scale(1)'; star.element.style.boxShadow = 'none' }
        })
      }
      document.addEventListener('mousemove', onMouseMove)
      return () => document.removeEventListener('mousemove', onMouseMove)
    }

    function createCodeRain() {
      const codeRain = codeRainRef.current
      if (!codeRain) return
      const chars = ['0','1','{','}','(',')','<','>','/','*','+','-','=',';','const','let','var','function','return','if','else','for','while','class','import','export','async','await','try','catch','console.log']
      const interval = setInterval(() => {
        if (Math.random() > 0.85) {
          const ch = document.createElement('div')
          ch.className = 'code-char'
          ch.textContent = chars[Math.floor(Math.random() * chars.length)]
          ch.style.left = Math.random() * 100 + '%'
          ch.style.animationDuration = Math.random() * 3 + 2 + 's'
          ch.style.fontSize = Math.random() * 8 + 10 + 'px'
          codeRain.appendChild(ch)
          setTimeout(() => ch.remove(), 5000)
        }
      }, 200)
      return () => clearInterval(interval)
    }

    function setupScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
            observer.unobserve(entry.target)
          }
        })
      }, { threshold: 0.1 })
      document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    function setupMobileNav() {
      const navToggle = navToggleRef.current
      const navLinks = navLinksRef.current
      if (!navToggle || !navLinks) return
      const onClick = () => { navLinks.classList.toggle('active'); navToggle.classList.toggle('active') }
      navToggle.addEventListener('click', onClick)
      const links = navLinks.querySelectorAll('.nav-link')
      links.forEach((link) =>
        link.addEventListener('click', () => { navLinks.classList.remove('active'); navToggle.classList.remove('active') })
      )
      return () => {
        navToggle.removeEventListener('click', onClick)
        links.forEach((l) => l.replaceWith(l.cloneNode(true)))
      }
    }

    function setupNavbarScroll() {
      const navbar = navbarRef.current
      if (!navbar) return
      const onScroll = () => {
        if (window.scrollY > 100) { navbar.style.background = 'rgba(11, 15, 26, 0.95)'; navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)' }
        else { navbar.style.background = 'rgba(11, 15, 26, 0.9)'; navbar.style.boxShadow = 'none' }
      }
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }

    function setupSmoothScroll() {
      const handler = (e) => {
        const a = e.target.closest('a[href^="#"]')
        if (!a) return
        const target = document.querySelector(a.getAttribute('href'))
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
      }
      document.addEventListener('click', handler)
      return () => document.removeEventListener('click', handler)
    }

    const cleanups = []
    const c1 = createConstellation(); if (typeof c1 === 'function') cleanups.push(c1)
    const c2 = setupScrollAnimations(); if (typeof c2 === 'function') cleanups.push(c2)
    const c3 = createCodeRain(); if (typeof c3 === 'function') cleanups.push(c3)
    const c4 = setupMobileNav(); if (typeof c4 === 'function') cleanups.push(c4)
    const c5 = setupNavbarScroll(); if (typeof c5 === 'function') cleanups.push(c5)
    const c6 = setupSmoothScroll(); if (typeof c6 === 'function') cleanups.push(c6)

    return () => cleanups.forEach((fn) => fn && fn())
  }, [crewMembers])

  // Force-show newly rendered cards whenever team changes
  useEffect(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('#crew .fade-in-up').forEach(el => el.classList.add('animate'))
    })
  }, [teamIndex, visibleMembers.length])

  // Also after initial load
  useEffect(() => {
    if (!loading && !error && crewMembers.length > 0) {
      requestAnimationFrame(() => {
        document.querySelectorAll('.fade-in-up').forEach(el => el.classList.add('animate'))
      })
    }
  }, [loading, error, crewMembers])

  // Center cards when no horizontal overflow
  useEffect(() => {
    const sc = crewScrollRef.current
    if (!sc) return

    const measure = () => {
      const noOverflow = sc.scrollWidth <= sc.clientWidth + 1
      setCenterCards(noOverflow)
    }

    const raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    const t = setTimeout(measure, 0)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t)
      window.removeEventListener('resize', measure)
    }
  }, [teamIndex, visibleMembers.length])

  return (
    <div>
      {/* NAV */}
      <nav className="navbar" ref={navbarRef}>
        <div className="nav-brand">
          <span className="nav-logo">RAMP</span>
        </div>
        <div className="nav-links" ref={navLinksRef}>
          <a href="/" className="nav-link">Home</a>
          <a href="#crew" className="nav-link">Meet the Crew</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <div className="nav-toggle" ref={navToggleRef}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="section" id="hero">
        <div className="aurora-bg"></div>
        <div className="constellation" ref={constellationRef}></div>
        <div className="code-rain" ref={codeRainRef}></div>

        <div className="ramp-logo-bg">
          <span
            className="ramp-crew-text"
            ref={rampCrewTextRef}
            role="button"
            tabIndex={0}
            aria-label="Change theme"
          >
            RAMP CREW
          </span>
        </div>

        <div className="hero">
          <h1 className="hero-subtitle fade-in-up stagger-1">
           Roadrunner Advancing Modern Programming
          </h1>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-dot"></div>
        </div>
      </section>

      {/* CREW SECTION */}
      <section className="section" id="crew">
        <div className="aurora-bg"></div>

        <div className="crew-container">
          {/* Click to cycle teams (includes “All Members”) */}
          <h2
            className="section-title fade-in-up"
            role="button"
            tabIndex={0}
            onClick={cycleTeam}
            onKeyDown={(e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); cycleTeam(); } }}
            title="Click to switch team"
            style={{ userSelect: 'none', cursor: groupBuckets.length>1 ? 'pointer' : 'default' }}
          >
            Our Team — {currentTeamName}
          </h2>

          <p className="section-description fade-in-up stagger-1">
            Click the title to cycle teams.
          </p>

          {/* Cards */}
          <div
            className="crew-scroll-container"
            ref={crewScrollRef}
            style={{ overflowX: 'auto', paddingBottom: 8 }}
          >
            <div
              className="crew-scroll-grid"
              key={currentTeamName}
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'nowrap',
                width: '100%',
                justifyContent: centerCards ? 'center' : 'flex-start',
              }}
            >
              {loading && (
                <div className="glass-card fade-in-up stagger-1" style={{minWidth: 300}}>
                  Loading members…
                </div>
              )}

              {!loading && error && (
                <div className="glass-card fade-in-up stagger-1" style={{minWidth: 300}}>
                  {error}
                </div>
              )}

              {!loading && !error && visibleMembers.length === 0 && (
                <div className="glass-card fade-in-up stagger-1" style={{minWidth: 300}}>
                  No members in {currentTeamName}.
                </div>
              )}

              {!loading && !error && visibleMembers.map((member, index) => {
                const meta = [member.position, member.display_group].filter(Boolean).join(' · ')
                return (
                  <div
                    key={`${currentTeamName}-${member.id ?? index}`}
                    className={`glass-card fade-in-up stagger-${(index % 4) + 1}`}
                    style={{ minWidth: 280, maxWidth: 360 }}
                  >
                    <div className="crew-card-header">
                      <div className="crew-avatar">
                        {(member.display_name || '?').charAt(0)}
                      </div>
                      <div className="crew-info">
                        <h3 className="crew-name">{member.display_name || 'Unnamed'}</h3>
                        {/* 👇 Position replaces role */}
                        {meta && <p className="crew-role">{meta}</p>}
                      </div>
                    </div>
                    {member.bio && (
                      <p className="crew-description">{member.bio}</p>
                    )}
                    <div className="crew-skills">
                      <span className="skill-tag">JavaScript</span>
                      <span className="skill-tag">React</span>
                      <span className="skill-tag">Python</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="scroll-hint">
            <span className="scroll-arrow">←</span>
            Scroll to explore more crew members
            <span className="scroll-arrow">→</span>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="section" id="contact">
        <div className="aurora-bg"></div>
        <div className="contact-section">
          <div className="fade-in-up">
            <h2 className="section-title">Want to Join Us?</h2>
            <p className="section-description" style={{ textAlign: 'left' }}>
              Interested in becoming part of the RAMP crew? We're always looking for passionate developers.
            </p>
          </div>
          <div className="contact-links fade-in-up stagger-1">
          <a href="mailto:ramp@csub.edu" className="contact-link">
              <div className="contact-icon">✉️</div>
              <div>
                <div style={{ fontWeight: 600 }}>Email</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>dnguyen71@csub.edu</div>
              </div>
            </a>
            <a href="https://www.instagram.com/weare.ramp/" className="contact-link">
              <div className="contact-icon">💻</div>
              <div>
                <div style={{ fontWeight: 600 }}>Instagram</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Follow Us On IG</div>
              </div>
            </a>
            <a href="https://discord.com/invite/eAK5hxBcFq?fbclid=PAZXh0bgNhZW0CMTEAAaed07fcR9ZyfUmIkhfyzPJgTQ2oGeZemmIq_a9eoOA7PYyRBnlx-lq82dhPyw_aem_3FecAonBKW2AyhTCRc8jFg" className="contact-link">
              <div className="contact-icon">💬</div>
              <div>
                <div style={{ fontWeight: 600 }}>Discord</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>Join our server</div>
              </div>
            </a>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', width: '100%', textAlign: 'center', color: 'var(--muted)' }}>
          © RAMP 2025. Roadrunner Advancing Modern Programming.
        </div>
      </section>
    </div>
  )
}

export default MeetTheCrew
