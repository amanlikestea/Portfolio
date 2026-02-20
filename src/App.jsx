import { useState, useEffect, useRef } from 'react'
import './App.css'
import backgroundImage from './assets/Background.jpg'
import profilePicture from './assets/amanProfile.jpeg'
import cognizantLogo from './assets/Cognizant.jpeg'
import resumePdf from './assets/KumarAman.resume.pdf'
import chatWithPdfImage from './assets/chatwithpdf.png'

function App() {
  const containerRef = useRef(null)
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then default to 'dark'
    const savedTheme = localStorage.getItem('portfolio-theme')
    return savedTheme || 'dark'
  })

  const [currentView, setCurrentView] = useState('portfolio') // 'portfolio' or 'resume'
  const [selectedProject, setSelectedProject] = useState(null)
  const [copied, setCopied] = useState(false)
  const [auraEnabled, setAuraEnabled] = useState(() => {
    const savedAuraState = localStorage.getItem('portfolio-aura-enabled')
    return savedAuraState === null ? true : savedAuraState === 'true'
  })

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('portfolio-aura-enabled', String(auraEnabled))
  }, [auraEnabled])

  useEffect(() => {
    // Close modal on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedProject) {
        setSelectedProject(null)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedProject])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return undefined
    }

    let frameId = null
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const applyCursorPosition = () => {
      container.style.setProperty('--cursor-x', `${mouseX}px`)
      container.style.setProperty('--cursor-y', `${mouseY}px`)
      frameId = null
    }

    const handlePointerMove = (event) => {
      mouseX = event.clientX
      mouseY = event.clientY
      if (!frameId) {
        frameId = window.requestAnimationFrame(applyCursorPosition)
      }
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    applyCursorPosition()

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [])

  useEffect(() => {
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!supportsHover) {
      return undefined
    }

    const tiltCards = Array.from(document.querySelectorAll('.glass-tilt'))
    const listeners = []

    tiltCards.forEach((card) => {
      const handleMove = (event) => {
        const rect = card.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const offsetX = (event.clientX - centerX) / (rect.width / 2)
        const offsetY = (event.clientY - centerY) / (rect.height / 2)
        const maxTilt = 3

        card.style.setProperty('--tilt-x', `${(offsetY * -maxTilt).toFixed(2)}deg`)
        card.style.setProperty('--tilt-y', `${(offsetX * maxTilt).toFixed(2)}deg`)
        card.style.setProperty('--glow-x', `${event.clientX - rect.left}px`)
        card.style.setProperty('--glow-y', `${event.clientY - rect.top}px`)
      }

      const handleLeave = () => {
        card.style.setProperty('--tilt-x', '0deg')
        card.style.setProperty('--tilt-y', '0deg')
      }

      card.addEventListener('pointermove', handleMove)
      card.addEventListener('pointerleave', handleLeave)
      listeners.push(
        [card, 'pointermove', handleMove],
        [card, 'pointerleave', handleLeave]
      )
    })

    return () => {
      listeners.forEach(([element, eventName, listener]) => {
        element.removeEventListener(eventName, listener)
      })
    }
  }, [currentView, selectedProject])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  const toggleAura = () => {
    setAuraEnabled(prevState => !prevState)
  }

  const handleResumeClick = (e) => {
    e.preventDefault()
    setCurrentView('resume')
  }

  const handleAboutClick = (e) => {
    e.preventDefault()
    setCurrentView('portfolio')
  }

  const getCurrentDate = () => {
    const today = new Date()
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December']
    const day = today.getDate()
    const month = months[today.getMonth()]
    const year = today.getFullYear()
    return `${day} ${month} ${year}`
  }

  const [projects] = useState([
    {
      id: 1,
      title: "Chat with Documents and Websites",
      date: getCurrentDate(),
      words: "320 words",
      description: "A versatile Streamlit web application for conversational interactions with PDFs and websites using advanced NLP and OpenAI GPT-3.",
      thumbnail: chatWithPdfImage,
      detailedDescription: `Chat with Documents and Websites is an innovative Streamlit application that enables users to engage in natural conversations with both PDF documents and website content. 

The application features two distinct modes: "Chat with Website" and "Chat with PDFs", allowing users to seamlessly switch between different content sources. In PDF mode, users can upload documents and have the application extract text using PyPDF2, while Website mode dynamically fetches content from URLs for real-time conversations.

Powered by OpenAI's GPT-3 model and LangChain libraries, the app creates intelligent vector stores from document chunks, enabling accurate information retrieval and context-aware responses. The intuitive chat interface provides an immersive conversational experience, making it easy to explore and interact with textual content.

Built with modern Python technologies including Streamlit, LangChain, and OpenAI integration, this project demonstrates advanced NLP capabilities and provides a user-friendly platform for document and web content interaction.`,
      codeSnippet: `# Streamlit app for Chat with Documents and Websites
import streamlit as st
from langchain_openai import ChatOpenAI
from langchain_community.vectorstores import FAISS
from PyPDF2 import PdfReader

# Initialize OpenAI model
llm = ChatOpenAI(model_name="gpt-3.5-turbo")

# PDF Text Extraction
def extract_text_from_pdf(pdf_file):
    pdf_reader = PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    return text

# Create vector store from documents
def create_vector_store(text_chunks):
    embeddings = OpenAIEmbeddings()
    vector_store = FAISS.from_texts(text_chunks, embeddings)
    return vector_store

# Chat interface
st.title("Chat with Documents and Websites 🤖📄")
mode = st.selectbox("Choose mode:", ["Chat with PDFs", "Chat with Website"])`,
      githubLink: "https://github.com/CosmicAman/Chat-with-Documents-and-Website",
      technologies: ["Python", "Streamlit", "OpenAI GPT-3", "LangChain", "PyPDF2", "NLP"],
      features: [
        "Multi-modal chat interface",
        "PDF text extraction",
        "Website content fetching",
        "Vector store creation",
        "AI-powered responses",
        "Real-time conversations"
      ],
      liveDemo: null
    },
    {
      id: 2,
      title: "Project Title 2",
      date: getCurrentDate(),
      words: "1200 words",
      description: "Another exciting project description. Showcase your skills and creativity through your work.",
      thumbnail: "https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=Project+2",
      detailedDescription: "Detailed description for project 2.",
      githubLink: "https://github.com/yourusername/project2",
      technologies: ["React", "JavaScript", "CSS"],
      features: [
        "Feature 1",
        "Feature 2",
        "Feature 3"
      ],
      liveDemo: null
    }
  ])

  const [experiences] = useState([
    {
      id: 1,
      company: "Cognizant",
      role: "Programer Analyst trainee",
      description: "Developed and maintained web applications using modern technologies.",
      startYear: 2025,
      isCurrent: true,
      location: "Kolkata, India",
      logoSrc: cognizantLogo
    },
    // {
    //   id: 2,
    //   company: "Company Name 2",
    //   role: "ML Engineer",
    //   description: "Built machine learning models and deployed them to production.",
    //   startYear: 2022,
    //   endYear: 2023,
    //   isCurrent: false,
    //   location: "San Francisco, CA",
    //   logo: "🤖"
    // },
    // {
    //   id: 3,
    //   company: "Company Name 3",
    //   role: "Data Analyst",
    //   description: "Analyzed large datasets and created visualizations for business insights.",
    //   startYear: 2021,
    //   endYear: 2022,
    //   isCurrent: false,
    //   location: "New York, NY",
    //   logo: "📊"
    // }
  ])

  const [certifications] = useState([
    {
      id: 1,
      title: "How google does machine learning",
      issuer: "Coursera",
      year: "2024",
      credentialUrl: "https://www.coursera.org/account/accomplishments/verify/R3U441R3VXX8",
      logo: "🎓"
    },
    // {
    //   id: 2,
    //   title: "Certification Name 2",
    //   issuer: "Issuing Organization",
    //   year: "2024",
    //   credentialUrl: "#",
    //   logo: "📜"
    // }
  ])

  const getExperienceDateRange = (exp) => {
    if (!exp.startYear) {
      return ''
    }
    const endLabel = exp.isCurrent ? 'present' : exp.endYear
    return `${exp.startYear} - ${endLabel}`
  }

  return (
    <div
      ref={containerRef}
      className={`portfolio-container ${theme === 'light' ? 'light-theme' : ''} ${auraEnabled ? '' : 'aura-disabled'}`}
    >
      {/* Background Image */}
      <div 
        className="background-artwork" 
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="dark-overlay"></div>

      {/* Header */}
      <header className="header">
        <div className="header-left" onClick={handleAboutClick}>
          <span className="logo-icon">&lt;/&gt;</span>
          <span className="logo-name">Aman Kumar</span>
        </div>
        <nav className="header-nav">
          <a href="#about" onClick={handleAboutClick}>About</a>
          <a href="#resume" onClick={handleResumeClick}>Resume</a>
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
          <button
            className="theme-toggle aura-toggle"
            onClick={toggleAura}
            aria-label={auraEnabled ? 'Turn off aura light' : 'Turn on aura light'}
            title={auraEnabled ? 'Turn off aura light' : 'Turn on aura light'}
          >
            {auraEnabled ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2a7 7 0 0 1 4 12.8A5 5 0 0 0 14 19h-4a5 5 0 0 0-2-4.2A7 7 0 0 1 12 2z"></path>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6"></path>
                <path d="M10 22h4"></path>
                <path d="M12 2a7 7 0 0 1 4 12.8A5 5 0 0 0 14 19h-4a5 5 0 0 0-2-4.2A7 7 0 0 1 12 2z"></path>
                <line x1="4" y1="4" x2="20" y2="20"></line>
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {currentView === 'portfolio' ? (
          <>
            {/* Profile Section */}
            <section className="profile-section">
              <div className="profile-picture-container">
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="profile-picture"
                />
              </div>
              <h1 className="profile-name">Aman Kumar</h1>
              <p className="profile-roles">AI/ML | WebDev | Data Analytics </p>
              
              {/* Social Media Links */}
              <div className="social-links">
                <a 
                  href="https://github.com/CosmicAman" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/in/aman-kumar-aa0557234/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a
                  href="mailto:your-email@gmail.com"
                  className="social-link"
                  aria-label="Email"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8l-8 5-8-5zm8 3L4 6h16l-8 5z" />
                  </svg>
                </a>
              </div>
            </section>

            {/* Recent Projects Section */}
            <section className="recent-section">
              <h2 className="recent-heading">Recent</h2>
              <div className="projects-grid">
                {projects.map((project) => (
                  <article 
                    key={project.id} 
                    className="project-card glass-tilt"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="project-thumbnail">
                      <img src={project.thumbnail} alt={project.title} />
                    </div>
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <div className="project-meta">
                        <span>{project.date}</span>
                        <span>•</span>
                        <span>{project.words}</span>
                      </div>
                      <p className="project-description">{project.description}</p>
                    </div>
                  </article>
                ))}
              </div>

              {/* Project Modal */}
              {selectedProject && (
                <div 
                  className="project-modal-overlay"
                  onClick={() => setSelectedProject(null)}
                >
                  <div 
                    className="project-modal glass-tilt"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button 
                      className="modal-close-btn"
                      onClick={() => setSelectedProject(null)}
                      aria-label="Close modal"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </button>
                    
                    <div className="modal-header">
                      <div className="modal-header-top">
                        <div className="modal-thumbnail-container">
                          <img 
                            src={selectedProject.thumbnail} 
                            alt={selectedProject.title}
                            className="modal-thumbnail"
                          />
                        </div>
                        <div className="modal-header-content">
                          <h2 className="modal-title">{selectedProject.title}</h2>
                          <div className="modal-meta">
                            <span className="meta-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                              {selectedProject.date}
                            </span>
                            <span className="meta-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                              </svg>
                              {selectedProject.words}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-content">
                      {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                        <div className="modal-technologies">
                          <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="M2 17l10 5 10-5"></path>
                              <path d="M2 12l10 5 10-5"></path>
                            </svg>
                            Technologies
                          </h3>
                          <div className="tech-tags">
                            {selectedProject.technologies.map((tech, index) => (
                              <span key={index} className="tech-tag">{tech}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="modal-description">
                        <h3>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                          </svg>
                          About
                        </h3>
                        <p>{selectedProject.detailedDescription}</p>
                      </div>

                      {selectedProject.features && selectedProject.features.length > 0 && (
                        <div className="modal-features">
                          <h3>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                            Key Features
                          </h3>
                          <ul className="features-list">
                            {selectedProject.features.map((feature, index) => (
                              <li key={index} className="feature-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="modal-links-section">
                        {selectedProject.liveDemo && (
                          <div className="modal-link-item">
                            <a 
                              href={selectedProject.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="demo-link-btn"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                              View Live Demo
                            </a>
                          </div>
                        )}

                        {selectedProject.githubLink && (
                          <div className="modal-github-section">
                            <h3>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              GitHub Repository
                            </h3>
                            <div className="github-link-container">
                              <a 
                                href={selectedProject.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="github-link-text"
                              >
                                {selectedProject.githubLink}
                              </a>
                              <button
                                onClick={() => copyToClipboard(selectedProject.githubLink)}
                                className="copy-btn"
                                aria-label="Copy GitHub link"
                              >
                                {copied ? (
                                  <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    <span>Copy</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : (
          <>
            {/* Resume Page */}
            <div className="resume-page">
              <div className="resume-header-container">
                <h1 className="resume-title">Resume</h1>
                <a 
                  href={resumePdf}
                  download="KumarAman_resume.pdf"
                  className="download-resume-btn"
                  aria-label="Download Resume"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download Resume</span>
                </a>
              </div>
              
              {/* Author Section */}
              <section className="resume-author-section">
                <div className="resume-author-content">
                  <div className="resume-profile-picture-container">
                    <img 
                      src={profilePicture} 
                      alt="Aman Kumar" 
                      className="resume-profile-picture"
                    />
                  </div>
                  <div className="resume-author-info">
                    <h2 className="resume-author-name">Aman Kumar</h2>
                    <p className="resume-author-title">Software Engineer and Developer. AI/ML | WebDev | Data Analytics</p>
                    <p className="resume-author-description">Unity is power but a 100 sheeps can't kill a wolf. <br /> "I am the WOLF"
                    </p>
                    <div className="resume-social-links">
                      <a 
                        href="https://github.com/CosmicAman" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resume-social-link"
                        aria-label="GitHub"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                      <a 
                        href="https://www.linkedin.com/in/aman-kumar-aa0557234/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="resume-social-link"
                        aria-label="LinkedIn"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a
                        href="mailto:aman7480nano@gmail.com"
                        className="resume-social-link"
                        aria-label="Email"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8l-8 5-8-5zm8 3L4 6h16l-8 5z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Experience Section */}
              <section className="resume-experience-section">
                <h2 className="resume-experience-heading">Experience</h2>
                <div className="resume-divider"></div>
                
                {/* Table Headers */}
                <div className="resume-table-headers">
                  <div className="resume-header-cell">Company</div>
                  <div className="resume-header-cell">Role</div>
                  <div className="resume-header-cell">Description</div>
                  <div className="resume-header-cell">Date</div>
                  <div className="resume-header-cell">Location</div>
                </div>

                {/* Experience Entries */}
                <div className="resume-experience-list">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="resume-experience-item glass-tilt">
                      <div className="resume-experience-logo">
                        <div className="resume-logo-container" title={exp.company}>
                          {exp.logoSrc ? (
                            <img
                              className="resume-company-logo"
                              src={exp.logoSrc}
                              alt={`${exp.company} logo`}
                              loading="lazy"
                              title={exp.company}
                            />
                          ) : (
                            exp.logo
                          )}
                          <span className="logo-tooltip">{exp.company}</span>
                        </div>
                      </div>
                      <div className="resume-experience-role">{exp.role}</div>
                      <div className="resume-experience-description">{exp.description}</div>
                      <div className="resume-experience-date">{getExperienceDateRange(exp)}</div>
                      <div className="resume-experience-location">{exp.location}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications Section */}
              <section className="resume-experience-section">
                <h2 className="resume-experience-heading">Certifications</h2>
                <div className="resume-divider"></div>

                <div className="resume-table-headers">
                  <div className="resume-header-cell">Logo</div>
                  <div className="resume-header-cell">Title</div>
                  <div className="resume-header-cell">Issuer</div>
                  <div className="resume-header-cell">Year</div>
                  <div className="resume-header-cell">Credential</div>
                </div>

                <div className="resume-experience-list">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="resume-experience-item glass-tilt">
                      <div className="resume-experience-logo">
                        <div className="resume-logo-container">
                          {cert.id === 1 ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 48 48"
                              width="32"
                              height="32"
                            >
                              <path
                                fill="#FFC107"
                                d="M43.6 20.5H42V20H24v8h11.3C33.9 31.7 29.4 35 24 35 16.8 35 11 29.2 11 22S16.8 9 24 9c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.6 3.3 29.6 1 24 1 11.8 1 2 10.8 2 23s9.8 22 22 22c12.1 0 21-8.5 21-21 0-1.3-.1-2.2-.4-3.5z"
                              />
                              <path
                                fill="#FF3D00"
                                d="M6.3 14.7l6.6 4.8C14.6 15.3 18.9 12 24 12c3.3 0 6.3 1.2 8.6 3.3l5.7-5.7C34.6 3.3 29.6 1 24 1 16 1 9.1 5.4 6.3 14.7z"
                              />
                              <path
                                fill="#4CAF50"
                                d="M24 45c5.3 0 10.2-1.8 13.9-5.1l-6.4-5.4C29.9 35.8 27.1 37 24 37 18.6 37 14.1 33.7 12.7 28.5l-6.5 5C8.9 40.6 15.9 45 24 45z"
                              />
                              <path
                                fill="#1976D2"
                                d="M43.6 20.5H42V20H24v8h11.3c-.7 2.3-2.1 4.2-3.9 5.5l6.4 5.4C40.5 36.4 43 31.4 43 24c0-1.3-.1-2.2-.4-3.5z"
                              />
                            </svg>
                          ) : (
                            cert.logo
                          )}
                        </div>
                      </div>
                      <div className="resume-experience-role">{cert.title}</div>
                      <div className="resume-experience-description">{cert.issuer}</div>
                      <div className="resume-experience-date">{cert.year}</div>
                      <div className="resume-experience-location">
                        {cert.credentialUrl && cert.credentialUrl !== "#" ? (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default App
