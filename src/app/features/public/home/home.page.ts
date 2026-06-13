import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home">
      <nav class="home-nav">
        <div class="nav-inner">
          <a routerLink="/" class="nav-brand">
            <div class="brand-icon">
              <img src="assets/logo.svg" alt="Precosquin Logo" class="h-full w-full object-contain rounded-full" />
            </div>
            <span>Precosquin</span>
          </a>
          <div class="nav-links">
            <a routerLink="/inscripcion" class="btn btn-primary btn-sm">Inscribirme</a>
            <a routerLink="/auth/login" class="btn btn-ghost btn-sm">Acceder</a>
          </div>
        </div>
      </nav>

      <section class="hero">
        <div class="hero-content">
          <div class="hero-badge">Festival Folclórico 2026</div>
          <h1 class="hero-title">
            Precosquin<br/>
            <span class="text-brand">Pirámides</span>
          </h1>
          <p class="hero-description">
            Participá en uno de los festivales folclóricos más importantes de la región.
            Inscribí tu propuesta musical o artística y formá parte de esta gran experiencia.
          </p>
          <div class="hero-actions">
            <a routerLink="/inscripcion" class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
              </svg>
              Inscribirme Ahora
            </a>
            <a routerLink="/auth/login" class="btn btn-outline btn-lg">Panel de Gestión</a>
          </div>
        </div>
        <div class="hero-visual">
          <div class="visual-card card-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
            </svg>
            <span>Música</span>
          </div>
          <div class="visual-card card-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            <span>Danza</span>
          </div>
          <div class="visual-card card-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            </svg>
            <span>Folclore</span>
          </div>
        </div>
      </section>

      <section class="invitation-section">
        <div class="invitation-card">
          <div class="invitation-logos">
            <img src="assets/logo.svg" alt="Precosquin Puerto Pirámides" class="invitation-logo" />
            <div class="invitation-divider"></div>
            <img src="assets/MUNI-LOGO2.svg" alt="Comisión de Fomento Puerto Pirámides" class="invitation-logo" />
          </div>
          
          <h2 class="invitation-title">INVITACIÓN OFICIAL</h2>
          <h3 class="invitation-subtitle">COMUNIDAD DE PUERTO PIRÁMIDES</h3>
          
          <p class="invitation-description">
            Tenemos el agrado de invitar a usted al <strong>Lanzamiento Oficial del Pre-Cosquín 2027 – Sede Puerto Pirámides</strong>.
          </p>
          
          <div class="event-details">
            <div class="event-detail">
              <div class="detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">CUÁNDO:</span>
                <span class="detail-value">Sábado 13 de junio de 2026</span>
              </div>
            </div>
            
            <div class="event-detail">
              <div class="detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12,6 12,12 16,14"></polyline>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">HORA:</span>
                <span class="detail-value">11:00 hs.</span>
              </div>
            </div>
            
            <div class="event-detail">
              <div class="detail-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21,10c0,7-9,13-9,13s-9-6-9-13a9,9,0,0,1,18,0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div class="detail-content">
                <span class="detail-label">DÓNDE:</span>
                <span class="detail-value">Primera Bajada al Mar de Puerto Pirámides</span>
                <span class="detail-note">(En caso de mal tiempo, en el Hotel Rayentray)</span>
              </div>
            </div>
          </div>
          
          <div class="invitation-note">
            <p>El evento está previsto realizarse en la Primera Bajada al Mar, siempre que las condiciones climáticas lo permitan. En caso de mal tiempo, la actividad se desarrollará en las instalaciones del Hotel Rayentray.</p>
          </div>
          
          <div class="invitation-message">
            <p>Su presencia será de gran importancia para acompañar este acontecimiento cultural y turístico que representa una valiosa oportunidad para promover y fortalecer el desarrollo artístico de nuestra comunidad y toda la región.</p>
          </div>
          
          <div class="invitation-closing">
            <p>Esperamos contar con su distinguida presencia.</p>
            <p class="invitation-call">¡Acompáñennos a celebrar nuestra cultura!</p>
          </div>
        </div>
      </section>
      
      <section class="info-section">
        <div class="info-grid">
          <div class="info-card">
            <div class="info-icon info-icon-music">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
              </svg>
            </div>
            <h3>Categoría Música</h3>
            <p>Solista vocal, solista instrumental, conjunto folclórico, coral y bandas típicas.</p>
          </div>
          <div class="info-card">
            <div class="info-icon info-icon-dance">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3>Categoría Danza</h3>
            <p>Malambo, chamamé, chacarera, zamba, milonga y danzas folclóricas.</p>
          </div>
          <div class="info-card">
            <div class="info-icon info-icon-contract">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/>
              </svg>
            </div>
            <h3>Inscripción Rápida</h3>
            <p>Completá el formulario online, recibí tu contrato por email y firmalo digitalmente.</p>
          </div>
        </div>
      </section>

      <footer class="home-footer">
        <div class="sponsors-section">
          <img src="assets/MUNI-LOGO2.svg" alt="Municipalidad" class="sponsor-logo" />
          <img src="assets/rayentray.png" alt="Rayentray" class="sponsor-logo" />
          <img src="assets/hidro.jpeg" alt="Hidro" class="sponsor-logo" />
        </div>
        
        <div class="footer-inner">
          <div class="footer-left">
            <div class="footer-brand">
              <div class="brand-icon-sm">
                <img src="assets/logo.svg" alt="Precosquin" class="brand-logo-img" />
              </div>
              <span>Precosquin Pirámides</span>
            </div>
            <p class="footer-copy">&copy; {{ currentYear }} Festival Folclórico. Todos los derechos reservados.</p>
          </div>
          
          <div class="footer-right">
            <p class="social-label">Seguinos en:</p>
            <div class="social-section">
              <a href="https://www.instagram.com/precosquinpuertopiramides?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a href="https://www.youtube.com/@PreCosquinPuertoPirámides" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .home {
      min-height: 100vh;
      background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/assets/home-background.jpg') no-repeat center center fixed; /* Imagen de fondo con overlay */
      background-size: cover;
      color: #fff;
      font-family: var(--font-sans);
    }

    .home-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .nav-inner {
      max-width: 1440px; /* Aumentar ancho para pantallas grandes */
      margin: 0 auto;
      padding: var(--space-4) var(--space-6);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      text-decoration: none;
      color: #fff;
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
    }

    .brand-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .brand-icon img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .hero {
      max-width: 1440px; /* Aumentar ancho para pantallas grandes */
      margin: 0 auto;
      padding: 8rem var(--space-6) 4rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-12);
      align-items: center;
      min-height: 100vh;
    }

    @media (min-width: 1024px) {
      .hero {
        padding: 10rem var(--space-16) 6rem; /* Más padding para escritorio */
      }

      .hero-title {
        font-size: 4.5rem; /* Título más grande en escritorio */
      }
    }

    .hero-badge {
      display: inline-block;
      padding: var(--space-1) var(--space-3);
      background: rgba(99, 102, 241, 0.2);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--brand-300);
      margin-bottom: var(--space-6);
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: var(--weight-extrabold);
      line-height: 1.1;
      color: #fff;
      margin-bottom: var(--space-6);
    }

    .text-brand {
      color: var(--brand-400);
    }

    .hero-description {
      font-size: var(--text-lg);
      color: #94a3b8;
      line-height: var(--leading-relaxed);
      margin-bottom: var(--space-8);
      max-width: 500px;
    }

    .hero-actions {
      display: flex;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .hero-visual {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      align-items: center;
    }

    .visual-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-6);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(8px);
      font-weight: var(--weight-medium);
      animation: float 3s ease-in-out infinite;
    }

    .card-1 { animation-delay: 0s; }
    .card-2 { animation-delay: 0.5s; }
    .card-3 { animation-delay: 1s; }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .invitation-section {
      max-width: 1440px;
      margin: 0 auto;
      padding: var(--space-16) var(--space-6);
    }

    .invitation-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%);
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-2xl);
      padding: var(--space-10);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.1);
      backdrop-filter: blur(10px);
    }

    .invitation-logos {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-6);
      margin-bottom: var(--space-8);
    }

    .invitation-logo {
      height: 80px;
      width: auto;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

    .invitation-divider {
      width: 2px;
      height: 60px;
      background: linear-gradient(to bottom, transparent, var(--brand-400), transparent);
    }

    .invitation-title {
      font-size: 2rem;
      font-weight: var(--weight-extrabold);
      text-align: center;
      color: var(--brand-400);
      margin: 0 0 var(--space-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    }

    .invitation-subtitle {
      font-size: 1.5rem;
      font-weight: var(--weight-bold);
      text-align: center;
      color: #e2e8f0;
      margin: 0 0 var(--space-8);
    }

    .invitation-description {
      font-size: 1.125rem;
      color: #94a3b8;
      text-align: center;
      line-height: var(--leading-relaxed);
      margin: 0 0 var(--space-8);
    }

    .event-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
      margin-bottom: var(--space-8);
    }

    .event-detail {
      display: flex;
      align-items: flex-start;
      gap: var(--space-4);
      padding: var(--space-5);
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-xl);
      border-left: 4px solid var(--brand-400);
    }

    .detail-icon {
      width: 48px;
      height: 48px;
      background: rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--brand-400);
      flex-shrink: 0;
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
    }

    .detail-label {
      font-size: var(--text-sm);
      font-weight: var(--weight-bold);
      color: var(--brand-400);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .detail-value {
      font-size: 1.125rem;
      font-weight: var(--weight-semibold);
      color: #f1f5f9;
    }

    .detail-note {
      font-size: var(--text-sm);
      color: #64748b;
      font-style: italic;
    }

    .invitation-note {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: var(--radius-lg);
      padding: var(--space-5);
      margin-bottom: var(--space-6);
    }

    .invitation-note p {
      margin: 0;
      color: #fbbf24;
      line-height: var(--leading-relaxed);
    }

    .invitation-message {
      margin-bottom: var(--space-6);
    }

    .invitation-message p {
      font-size: 1.0625rem;
      color: #cbd5e1;
      line-height: var(--leading-relaxed);
      text-align: center;
      margin: 0;
    }

    .invitation-closing {
      text-align: center;
    }

    .invitation-closing p {
      font-size: 1.125rem;
      color: #cbd5e1;
      margin: 0 0 var(--space-2);
    }

    .invitation-call {
      font-size: 1.25rem;
      font-weight: var(--weight-bold);
      color: var(--brand-400);
      margin-top: var(--space-4);
      text-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
    }

    .info-section {
      max-width: 1440px; /* Aumentar ancho para pantallas grandes */
      margin: 0 auto;
      padding: var(--space-16) var(--space-6);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-6);
    }

    .info-card {
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.9) 100%);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: var(--radius-xl);
      padding: var(--space-8);
      transition: transform var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
    }

    .info-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.4);
      box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15);
    }

    .info-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .info-icon-music { background: rgba(99, 102, 241, 0.2); color: var(--brand-400); }
    .info-icon-dance { background: rgba(245, 158, 11, 0.2); color: var(--warning-400); }
    .info-icon-contract { background: rgba(34, 197, 94, 0.2); color: var(--success-400); }

    .info-card h3 {
      font-size: var(--text-lg);
      font-weight: var(--weight-semibold);
      color: #e2e8f0;
      margin-bottom: var(--space-2);
    }

    .info-card p {
      color: #94a3b8;
      font-size: var(--text-sm);
      line-height: var(--leading-relaxed);
    }

    .home-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: var(--space-6);
    }

    .sponsors-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-8);
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .sponsor-logo {
      height: 80px;
      width: 160px;
      object-fit: contain;
    }

    .footer-inner {
      max-width: 1440px; /* Aumentar ancho para pantallas grandes */
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-6);
    }

    .footer-left {
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-3);
    }

    .social-label {
      font-size: var(--text-sm);
      color: #94a3b8;
      font-weight: var(--weight-medium);
    }

    .social-section {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-3) var(--space-4);
      background: rgba(255, 255, 255, 0.08);
      border-radius: var(--radius-lg);
      color: #fff;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      font-weight: var(--weight-semibold);
    }

    .brand-icon-sm {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .brand-logo-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .footer-copy {
      color: #64748b;
      font-size: var(--text-sm);
    }

    @media (max-width: 1024px) {
      .hero {
        grid-template-columns: 1fr;
        padding-top: 6rem;
        min-height: auto;
      }

      .hero-visual {
        display: none;
      }

      .info-grid {
        grid-template-columns: 1fr;
      }

      .hero-title {
        font-size: 2.5rem;
      }

      .invitation-card {
        padding: var(--space-6);
      }

      .invitation-logos {
        flex-direction: column;
        gap: var(--space-4);
      }

      .invitation-divider {
        width: 60px;
        height: 2px;
        background: linear-gradient(to right, transparent, var(--brand-400), transparent);
      }

      .invitation-title {
        font-size: 1.5rem;
      }

      .invitation-subtitle {
        font-size: 1.125rem;
      }

      .footer-inner {
        flex-direction: column;
        gap: var(--space-6);
        text-align: center;
      }

      .footer-left {
        align-items: center;
      }

      .footer-right {
        align-items: center;
      }

      .social-section {
        flex-direction: column;
        width: 100%;
      }

      .social-link {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 640px) {
      .hero-actions {
        flex-direction: column;
      }

      .hero-actions .btn {
        width: 100%;
        justify-content: center;
      }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2);
      padding: 0.625rem 1.25rem;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      border-radius: var(--radius-lg);
      border: none;
      cursor: pointer;
      text-decoration: none;
      transition: all var(--transition-fast);
    }

    .btn-sm { padding: 0.5rem 1rem; font-size: var(--text-sm); }
    .btn-lg { padding: 0.75rem 1.5rem; font-size: var(--text-base); }

    .btn-primary {
      background: var(--brand-600);
      color: #fff;
    }
    .btn-primary:hover { background: var(--brand-700); }

    .btn-ghost {
      background: transparent;
      color: #cbd5e1;
    }
    .btn-ghost:hover { color: #fff; background: rgba(255, 255, 255, 0.08); }

    .btn-outline {
      background: transparent;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .btn-outline:hover { border-color: rgba(255, 255, 255, 0.4); background: rgba(255, 255, 255, 0.05); }
  `]
})
export class HomePageComponent {
  currentYear = new Date().getFullYear();
}
