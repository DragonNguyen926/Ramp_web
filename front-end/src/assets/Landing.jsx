
 import React, { useEffect, useRef, useState } from 'react'
 import { Link } from 'react-router-dom'


export default function Landing() {
  const constellationRef = useRef(null)
  const codeRainRef = useRef(null)
  const heroTitleRef = useRef(null)
  const navLinksRef = useRef(null)
  const navToggleRef = useRef(null)
  const navbarRef = useRef(null)
  const rampTextRef = useRef(null)
  const [theme, setTheme] = useState('aurora')

  // Theme cycling function - now only cycles between aurora and monochrome
  const cycleTheme = () => {
    const themes = ['aurora', 'monochrome']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['aurora', 'monochrome'].includes(savedTheme)) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'aurora')
    }
  }, [])

  // Add event listener to RAMP text
  useEffect(() => {
    const rampText = rampTextRef.current
    if (!rampText) return

    const handleClick = () => cycleTheme()
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        cycleTheme()
      }
    }

    rampText.addEventListener('click', handleClick)
    rampText.addEventListener('keydown', handleKeyDown)
    
    return () => {
      rampText.removeEventListener('click', handleClick)
      rampText.removeEventListener('keydown', handleKeyDown)
    }
  }, [theme])

  // ===== helpers from your <script> (converted to React) =====
  useEffect(() => {
    // Constellation
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
        stars.push({
          element: star,
          x: parseFloat(star.style.left),
          y: parseFloat(star.style.top),
        })
      }
      const onMouseMove = (e) => {
        const mouseX = (e.clientX / window.innerWidth) * 100
        const mouseY = (e.clientY / window.innerHeight) * 100
        stars.forEach((star) => {
          const distance = Math.hypot(mouseX - star.x, mouseY - star.y)
          if (distance < 15) {
            star.element.style.transform = 'scale(1.5)'
            star.element.style.boxShadow = '0 0 10px var(--accent)'
          } else {
            star.element.style.transform = 'scale(1)'
            star.element.style.boxShadow = 'none'
          }
        })
      }
      document.addEventListener('mousemove', onMouseMove)
      return () => document.removeEventListener('mousemove', onMouseMove)
    }

    // Hero title word-by-word reveal
    function animateHeroTitle() {
      const title = heroTitleRef.current
      if (!title) return
      const text = title.textContent
      const words = text.split(' ')
      title.innerHTML = ''
      words.forEach((word, i) => {
        const span = document.createElement('span')
        span.textContent = word + ' '
        span.style.opacity = '0'
        span.style.transform = 'translateY(30px)'
        span.style.display = 'inline-block'
        span.style.transition = 'all 0.8s ease'
        span.style.transitionDelay = i * 0.1 + 's'
        title.appendChild(span)
      })
      setTimeout(() => {
        title.querySelectorAll('span').forEach((span) => {
          span.style.opacity = '1'
          span.style.transform = 'translateY(0)'
        })
      }, 500)
    }

    // Scroll reveal
    function setupScrollAnimations() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate')
            }
          })
        },
        { threshold: 0.1 },
      )
      document.querySelectorAll('.fade-in-up').forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    // Code rain
    function createCodeRain() {
      const codeRain = codeRainRef.current
      if (!codeRain) return
      const codeChars = [
        '0','1','{','}','(',')','<','>','/','*','+','-','=',';','const','let','var','function','return','if','else','for','while','class','import','export','async','await','try','catch','console.log'
      ]
      const interval = setInterval(() => {
        if (Math.random() > 0.85) {
          const codeChar = document.createElement('div')
          codeChar.className = 'code-char'
          codeChar.textContent = codeChars[Math.floor(Math.random() * codeChars.length)]
          codeChar.style.left = Math.random() * 100 + '%'
          codeChar.style.animationDuration = Math.random() * 3 + 2 + 's'
          codeChar.style.fontSize = Math.random() * 8 + 10 + 'px'
          codeRain.appendChild(codeChar)
          setTimeout(() => codeChar.remove(), 5000)
        }
      }, 200)
      return () => clearInterval(interval)
    }

    // Mobile nav toggle
    function setupMobileNav() {
      const navToggle = navToggleRef.current
      const navLinks = navLinksRef.current
      if (!navToggle || !navLinks) return
      const onClick = () => {
        navLinks.classList.toggle('active')
        navToggle.classList.toggle('active')
      }
      navToggle.addEventListener('click', onClick)
      const links = navLinks.querySelectorAll('.nav-link')
      links.forEach((link) =>
        link.addEventListener('click', () => {
          navLinks.classList.remove('active')
          navToggle.classList.remove('active')
        }),
      )
      return () => {
        navToggle.removeEventListener('click', onClick)
        links.forEach((l) => l.replaceWith(l.cloneNode(true))) // quick cleanup
      }
    }

    // Navbar on scroll
    function setupNavbarScroll() {
      const navbar = navbarRef.current
      if (!navbar) return
      const onScroll = () => {
        if (window.scrollY > 100) {
          navbar.style.background = 'rgba(11, 15, 26, 0.95)'
          navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)'
        } else {
          navbar.style.background = 'rgba(11, 15, 26, 0.9)'
          navbar.style.boxShadow = 'none'
        }
      }
      window.addEventListener('scroll', onScroll)
      return () => window.removeEventListener('scroll', onScroll)
    }

    // Smooth scroll for anchor links
    function setupSmoothScroll() {
      const handler = (e) => {
        const a = e.target.closest('a[href^="#"]')
        if (!a) return
        const target = document.querySelector(a.getAttribute('href'))
        if (target) {
          e.preventDefault()
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
      document.addEventListener('click', handler)
      return () => document.removeEventListener('click', handler)
    }

    // init + cleanup
    const cleanups = []
    const c1 = createConstellation(); if (typeof c1 === 'function') cleanups.push(c1)
    animateHeroTitle()
    const c2 = setupScrollAnimations(); if (typeof c2 === 'function') cleanups.push(c2)
    const c3 = createCodeRain(); if (typeof c3 === 'function') cleanups.push(c3)
    const c4 = setupMobileNav(); if (typeof c4 === 'function') cleanups.push(c4)
    const c5 = setupNavbarScroll(); if (typeof c5 === 'function') cleanups.push(c5)
    const c6 = setupSmoothScroll(); if (typeof c6 === 'function') cleanups.push(c6)

    return () => cleanups.forEach((fn) => fn && fn())
  }, [])

  return (
    <div>
      {/* NAV */}
      <nav className="navbar" ref={navbarRef}>
      <div className="nav-brand">
          <span className="nav-logo">RAMP</span>
        </div>
        <div className="nav-links" ref={navLinksRef}>
          <a href="#hero" className="nav-link">Home</a>
          <a href="#what-is-ramp" className="nav-link">About</a>
          <a href="#contact-form" className="nav-link">Join</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <div className="nav-toggle" ref={navToggleRef}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="section" id="hero">
        <div className="aurora-bg"></div>
        <div className="constellation" ref={constellationRef}></div>

        <div className="ramp-logo-bg">
          <span 
            className="ramp-text" 
            ref={rampTextRef}
            role="button"
            tabIndex={0}
            aria-label="Change theme"
          >
              RAMP
          </span>
        </div>

        <div className="code-rain" ref={codeRainRef}></div>

        <div className="tech-icons">
          <div className="tech-icon" style={{ top: '20%', left: '10%', animationDelay: '0s' }}>⚛️</div>
          <div className="tech-icon" style={{ top: '30%', right: '15%', animationDelay: '1s' }}>🐍</div>
          <div className="tech-icon" style={{ top: '60%', left: '20%', animationDelay: '2s' }}>💻</div>
          <div className="tech-icon" style={{ top: '70%', right: '25%', animationDelay: '3s' }}>🚀</div>
          <div className="tech-icon" style={{ top: '40%', left: '70%', animationDelay: '4s' }}>⚡</div>
          <div className="tech-icon" style={{ top: '80%', left: '60%', animationDelay: '2.5s' }}>🔥</div>
        </div>

        <div className="hero">
          <h1 className="hero-title" id="heroTitle" ref={heroTitleRef}>
            Roadrunner Advancing Modern Programming
          </h1>
       
          <div className="hero-buttons fade-in-up stagger-2">
          <Link to="/meet-the-crew" className="btn btn-primary">Meet the Crew</Link>
          <a href="https://rampclub.netlify.app/" className="btn btn-secondary">
  RAMP CLUB
</a>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-dot"></div>
        </div>
      </section>

      {/* SECTION 2: WHAT IS RAMP */}
      <section className="section" id="what-is-ramp">
        <div className="aurora-bg"></div>
        <div className="what-is-ramp">
          <h2 className="section-title fade-in-up">What is RAMP</h2>
          <p className="section-description fade-in-up stagger-1">
            We're a community of passionate CSUB students who believe in learning through building.
            Together, we create real projects that make a difference.
          </p>

          <div className="value-cards">
            <div className="glass-card fade-in-up stagger-1">
              <div className="card-icon">👥</div>
              <h3 className="card-title">We build together</h3>
              <p className="card-description">Collaborative development with peers who share your passion for technology</p>
            </div>
            <div className="glass-card fade-in-up stagger-2">
              <div className="card-icon">🚀</div>
              <h3 className="card-title">We learn by shipping</h3>
              <p className="card-description">Real projects with real impact, not just classroom exercises</p>
            </div>
            <div className="glass-card fade-in-up stagger-3">
              <div className="card-icon">📈</div>
              <h3 className="card-title">We help each other grow</h3>
              <p className="card-description">Mentorship and support from fellow students and industry professionals</p>
            </div>
          </div>

          <h3 className="section-title fade-in-up" style={{ fontSize: '2.5rem', marginTop: '3rem' }}>
            Why choose RAMP?
          </h3>

          <div className="feature-grid">
            <div className="glass-card fade-in-up stagger-1">
              <h3 className="card-title">Real Projects → Real Resumes</h3>
              <p className="card-description">Build portfolio-worthy projects that employers actually want to see</p>
            </div>
            <div className="glass-card fade-in-up stagger-2">
              <h3 className="card-title">Teamwork & Mentorship</h3>
              <p className="card-description">Learn from peers and get guidance from experienced developers</p>
            </div>
            <div className="glass-card fade-in-up stagger-3">
              <h3 className="card-title">Hackathons & Workshops</h3>
              <p className="card-description">Regular events to sharpen your skills and explore new technologies</p>
            </div>
            <div className="glass-card fade-in-up stagger-4">
              <h3 className="card-title">Portfolios that speak for you</h3>
              <p className="card-description">Showcase your work with professional portfolios that stand out</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONTACT FORM */}
      <section className="section" id="contact-form">
        <div className="aurora-bg"></div>
        <div className="contact-form">
          <h2 className="section-title fade-in-up">Start your journey with RAMP</h2>
          <p className="section-description fade-in-up stagger-1">
            Leave your info and we'll reach out to connect you with projects and peers.
          </p>

          <div className="glass-card fade-in-up stagger-2">
            <form id="contactForm" onSubmit={(e) => {
              e.preventDefault()
              const btn = e.currentTarget.querySelector('button')
              const orig = btn.textContent
              btn.style.transform = 'scale(0.95)'
              btn.textContent = 'Joining...'
              setTimeout(() => {
                btn.style.transform = 'scale(1)'
                btn.textContent = 'Welcome to RAMP! 🚀'
                btn.style.background = 'linear-gradient(45deg, var(--brand-2), #FB7185)'
              }, 1000)
              setTimeout(() => {
                btn.textContent = orig
                btn.style.background = 'linear-gradient(45deg, var(--btn-bg-1), var(--btn-bg-2))'
              }, 3000)
            }}>
              <div className="form-field">
                <input type="text" className="form-input" placeholder="Full Name" required />
              </div>
              <div className="form-field">
                <input type="email" className="form-input" placeholder="CSUB Email" required />
              </div>
              <div className="form-field">
                <input type="text" className="form-input" placeholder="Major/Year" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Join RAMP</button>
            </form>

            {/* floating orbs */}
            <div className="floating-orb" style={{ top: '20%', right: '10%', animationDelay: '0s' }}></div>
            <div className="floating-orb" style={{ top: '60%', left: '15%', animationDelay: '1s' }}></div>
            <div className="floating-orb" style={{ top: '80%', right: '20%', animationDelay: '2s' }}></div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CONTACT */}
      <section className="section" id="contact">
        <div className="aurora-bg"></div>
        <div className="contact-section">
          <div className="fade-in-up">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-description" style={{ textAlign: 'left' }}>
              Want to collaborate or sponsor us? We'd love to talk and explore how we can work together
              to advance modern programming at CSUB.
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