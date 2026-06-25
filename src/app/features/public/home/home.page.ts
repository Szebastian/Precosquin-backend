import { Component, HostListener, signal, computed, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgStyle, NgClass } from '@angular/common';

interface NewsItem {
  id: number;
  category: string;
  title: string;
  image: string;        // URL de la imagen de fondo de la noticia destacada
  thumbType: 'img' | 'icon';
  thumbSrc: string;     // imagen o ícono SVG inline para el thumbnail
  thumbBg: string;      // clase css bg-blue | bg-gold | bg-gray
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgStyle, NgClass],
  template: `
    <div class="portal">
      <!-- HEADER PRINCIPAL -->
      <header class="portal-header">
        <div class="header-topbar">
          <div class="header-topbar-inner">
            <div class="header-topbar-left">
              <span class="topbar-info">PRE-COSQUÍN PUERTO PIRÁMIDES 2026</span>
            </div>
            <div class="header-topbar-right">
              <a href="https://www.instagram.com/precosquinpuertopiramides?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="topbar-social-icon" title="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/@PreCosquinPuertoPirámides" target="_blank" class="topbar-social-icon" title="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div class="header-inner">
          <div class="header-left">
            <img src="assets/img/logoballena.png" alt="Logo" class="header-logo" />
            <div class="header-divider"></div>
            <div class="header-brand-text">
              <span class="header-brand-subtitle">PRE-COSQUÍN</span>
              <span class="header-brand-title">Puerto Pirámides</span>
            </div>
          </div>
          
          <nav class="header-nav">
            <a href="#" class="nav-link active">Inicio</a>
            <a href="#" class="nav-link">Noticias</a>
            <a routerLink="/inscripcion" class="nav-link">Inscripciones</a>
            <a href="#" class="nav-link">Cronograma</a>
            <a href="#" class="nav-link">Documentos</a>
          </nav>
          
          <div class="header-right">
            <div class="search-box">
              <input type="text" placeholder="Buscar..." />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>
            </div>
            <a routerLink="/auth/login" class="btn btn-primary btn-sm login-btn">Acceder</a>
          </div>
        </div>
      </header>

      <!-- SECCIÓN PRINCIPAL (GRILLA CON CARRUSEL) -->
      <main class="portal-main">
        <div 
          class="news-grid"
          (mouseenter)="isPaused = true"
          (mouseleave)="isPaused = false"
        >
          
          <!-- Noticia Principal (Izquierda) — controlada por activeIndex -->
          <article
            class="featured-news"
            [ngStyle]="{ 'background-image': 'url(' + activeNews().image + ')' }"
          >
            <div class="featured-overlay"></div>
            <div class="featured-content featured-fade" [class.fade-in]="!isTransitioning()">
              <span class="news-category">{{ activeNews().category }}</span>
              <h1 class="featured-title">{{ activeNews().title }}</h1>
            </div>
            <!-- Indicadores de puntos -->
            <div class="carousel-dots">
              @for (item of newsItems; track item.id) {
                <button
                  class="dot"
                  [class.dot-active]="activeIndex() === $index"
                  (click)="selectNews($index)"
                  [attr.aria-label]="'Ver noticia ' + ($index + 1)"
                ></button>
              }
            </div>
          </article>

          <!-- Noticias Secundarias (Derecha) -->
          <aside class="secondary-news">
            @for (item of newsItems; track item.id; let i = $index) {
              <article
                class="news-item"
                [class.news-item-active]="activeIndex() === i"
                (click)="selectNews(i)"
                role="button"
                [attr.aria-label]="'Seleccionar: ' + item.title"
              >
                <div class="news-item-content">
                  <h3 class="news-item-title">{{ item.title }}</h3>
                </div>
                <div class="news-item-thumb" [ngClass]="item.thumbBg">
                  @if (item.thumbType === 'img') {
                    <img [src]="item.thumbSrc" [alt]="item.title" />
                  } @else {
                    <span [innerHTML]="item.thumbSrc"></span>
                  }
                </div>
              </article>
            }
          </aside>
        </div>
      </main>

      <!-- SCOREBOARD / CINTA INFERIOR -->
      <section class="portal-scoreboard">
        <div class="scoreboard-inner">
          <div class="score-item">
            <span class="score-label">MÚSICA</span>
            <span class="score-value">INSC. ABIERTAS</span>
          </div>
          <div class="score-divider"></div>
          <div class="score-item">
            <span class="score-label">DANZA</span>
            <span class="score-value">INSC. ABIERTAS</span>
          </div>
          <div class="score-divider"></div>
          <div class="score-item">
            <span class="score-label">FECHA EVENTO</span>
            <span class="score-value">5 y 6 SEPT</span>
          </div>
          <div class="score-divider"></div>
          <div class="score-item score-action">
            <a routerLink="/inscripcion" class="score-link">VER MÁS INFORMACIÓN</a>
          </div>
        </div>
      </section>
      
      <!-- FOOTER PRINCIPAL -->
      <footer class="portal-footer">
        <div class="footer-sponsors">
          <img src="assets/img/sponsors.png" alt="Sponsors Precosquin" class="sponsor-logo" />
        </div>
        
        <div class="footer-main">
          <div class="footer-brand">
            <img src="assets/img/logoballena.png" alt="Precosquin" class="footer-logo" />
            <div class="brand-text">
              <h4>Festival Folclórico</h4>
              <p>Puerto Pirámides, Chubut</p>
            </div>
          </div>
          
          <div class="footer-links">
            <a href="#">Contacto</a>
            <a href="#">Términos y Condiciones</a>
            <a href="#">Preguntas Frecuentes</a>
          </div>
          
          <div class="footer-social">
            <p>Seguinos en redes:</p>
            <div class="social-icons">
              <a href="https://www.instagram.com/precosquinpuertopiramides?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" class="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/@PreCosquinPuertoPirámides" target="_blank" class="social-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="footer-copyright">
          <p>&copy; {{ currentYear }} Precosquin Pirámides. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .portal {
      min-height: 100vh;
      background-color: var(--gray-50); /* Fondo claro beige */
      font-family: var(--font-sans);
      display: flex;
      flex-direction: column;
    }

    /* --- HEADER PRINCIPAL --- */
    .portal-header {
      background-color: var(--brand-200); /* Azul claro como en AFA */
      border-bottom: 2px solid var(--brand-500);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: var(--shadow-sm);
    }

    .header-topbar {
      background-color: rgba(0, 0, 0, 0.05); /* Tono ligeramente más oscuro */
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
      height: 32px;
      display: flex;
      align-items: center;
    }

    .header-topbar-inner {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--space-4);
    }

    .header-topbar-left {
      display: flex;
      align-items: center;
    }

    .topbar-info {
      font-size: 10px;
      font-weight: var(--weight-bold);
      color: var(--brand-800);
      letter-spacing: 0.08em;
    }

    .header-topbar-right {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .topbar-social-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 22px;
      border-radius: var(--radius-sm);
      background-color: var(--brand-900);
      color: white;
      transition: all var(--transition-fast);
    }

    .topbar-social-icon:hover {
      background-color: var(--brand-700);
      transform: scale(1.1);
    }

    .header-inner {
      max-width: 1200px;
      margin: 0 auto;
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--space-4);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      height: 100%;
    }

    .header-logo {
      height: 40px;
      width: auto;
      object-fit: contain;
    }

    .header-divider {
      width: 1px;
      height: 30px;
      background-color: var(--brand-500);
      opacity: 0.3;
    }

    .header-brand-text {
      display: flex;
      flex-direction: column;
      gap: 0;
      line-height: 1;
    }

    .header-brand-subtitle {
      font-size: 9px;
      font-weight: var(--weight-extrabold);
      color: var(--brand-600);
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .header-brand-title {
      font-family: var(--font-display);
      font-size: var(--text-base);
      font-weight: var(--weight-extrabold);
      color: var(--brand-900);
      letter-spacing: -0.01em;
      line-height: 1.15;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: var(--space-6);
      height: 100%;
    }

    .nav-link {
      font-size: var(--text-sm);
      font-weight: var(--weight-bold);
      color: var(--gray-800);
      text-transform: uppercase;
      text-decoration: none;
      height: 100%;
      display: flex;
      align-items: center;
      border-bottom: 3px solid transparent;
      transition: all var(--transition-fast);
    }

    .nav-link:hover, .nav-link.active {
      color: var(--brand-800);
      border-bottom-color: var(--brand-700);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box input {
      background: transparent;
      border: 1px solid var(--brand-300);
      border-radius: var(--radius-full);
      padding: 0.4rem 1rem;
      padding-right: 2.5rem;
      font-size: var(--text-sm);
      color: var(--gray-800);
      outline: none;
      width: 150px;
      transition: width var(--transition-base);
    }

    .search-box input:focus {
      width: 200px;
      border-color: var(--brand-500);
      background: rgba(255,255,255,0.5);
    }

    .search-box svg {
      position: absolute;
      right: 10px;
      color: var(--gray-600);
    }

    .login-btn {
      text-transform: uppercase;
      font-weight: var(--weight-bold);
    }

    /* --- SECCIÓN PRINCIPAL (GRILLA) --- */
    .portal-main {
      flex: 1;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: var(--space-6) var(--space-4);
    }

    .news-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-6);
      min-height: 500px;
    }

    /* Noticia Principal */
    .featured-news {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      padding: var(--space-8);
      box-shadow: var(--shadow-md);
      transition: transform var(--transition-base);
      cursor: pointer;
    }

    .featured-news:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .featured-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
    }

    .featured-content {
      position: relative;
      z-index: 10;
      color: white;
      max-width: 80%;
    }

    .news-category {
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      background-color: var(--brand-accent);
      color: var(--gray-900);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-sm);
      display: inline-block;
      margin-bottom: var(--space-3);
    }

    .featured-title {
      font-size: var(--text-3xl);
      color: white;
      line-height: 1.2;
      margin: 0;
    }

    /* Noticias Secundarias */
    .secondary-news {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .news-item {
      display: flex;
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      height: calc(33.333% - 0.7rem); /* 3 items equitativos */
      min-height: 120px;
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid var(--gray-200);
    }

    .news-item:hover {
      box-shadow: var(--shadow-md);
      transform: translateX(-4px);
      border-left: 4px solid var(--brand-500);
    }

    .news-item-content {
      flex: 1;
      padding: var(--space-4);
      display: flex;
      align-items: center;
    }

    .news-item-title {
      font-size: var(--text-base);
      font-family: var(--font-sans);
      font-weight: var(--weight-bold);
      color: var(--gray-800);
      line-height: 1.4;
      margin: 0;
    }

    .news-item-thumb {
      width: 120px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .news-item-thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: var(--space-2);
    }

    .bg-blue { 
      background-color: var(--brand-500); 
      background-image: url('/assets/img/simbolAzul.png');
      background-size: cover;
      background-position: center;
    }
    .bg-gold { 
      background-color: var(--brand-accent); 
      color: var(--gray-900) !important; 
      background-image: url('/assets/img/simbolMostaza.png');
      background-size: cover;
      background-position: center;
    }
    .bg-gray { background-color: var(--gray-300); color: var(--gray-700) !important; }

    /* Estado ACTIVO de la noticia secundaria seleccionada */
    .news-item-active {
      border-left: 4px solid var(--brand-600) !important;
      background-color: var(--brand-50) !important;
      box-shadow: var(--shadow-md);
    }

    .news-item-active .news-item-title {
      color: var(--brand-700);
    }

    /* Animación FADE del panel destacado */
    .featured-fade {
      transition: opacity 0.2s ease;
    }

    .featured-fade.fade-in {
      opacity: 1;
    }

    .featured-fade:not(.fade-in) {
      opacity: 0;
    }

    /* Puntos indicadores del carrusel */
    .carousel-dots {
      position: absolute;
      bottom: var(--space-4);
      right: var(--space-4);
      display: flex;
      gap: var(--space-2);
      z-index: 20;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.5);
      border: none;
      cursor: pointer;
      transition: all var(--transition-fast);
      padding: 0;
    }

    .dot-active {
      background-color: white;
      transform: scale(1.3);
    }

    .dot:hover:not(.dot-active) {
      background-color: rgba(255, 255, 255, 0.8);
    }

    /* --- SCOREBOARD --- */
    .portal-scoreboard {
      background-color: white;
      border-top: 1px solid var(--gray-200);
      border-bottom: 1px solid var(--gray-200);
      padding: var(--space-3) 0;
      margin-top: var(--space-8);
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }

    .scoreboard-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-6);
      padding: 0 var(--space-4);
      flex-wrap: wrap;
    }

    .score-item {
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }

    .score-label {
      font-size: var(--text-xs);
      color: var(--gray-500);
      font-weight: var(--weight-bold);
    }

    .score-value {
      font-size: var(--text-sm);
      color: var(--gray-900);
      font-weight: var(--weight-bold);
      font-family: var(--font-display);
    }

    .score-divider {
      width: 1px;
      height: 20px;
      background-color: var(--gray-300);
    }

    .score-link {
      background-color: var(--brand-accent);
      color: var(--gray-900);
      padding: 0.3rem 1rem;
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: var(--weight-bold);
      text-decoration: none;
      transition: opacity var(--transition-fast);
    }
    .score-link:hover { opacity: 0.8; }

    /* --- FOOTER PRINCIPAL --- */
    .portal-footer {
      margin-top: auto;
      background-color: var(--gray-100);
      border-top: 1px solid var(--gray-200);
      display: flex;
      flex-direction: column;
    }

    .footer-sponsors {
      background-color: white;
      padding: var(--space-6) var(--space-4);
      display: flex;
      justify-content: center;
      border-bottom: 1px solid var(--gray-200);
    }

    .footer-sponsors img {
      max-width: 1000px;
      width: 100%;
      height: auto;
      object-fit: contain;
    }

    .footer-main {
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      padding: var(--space-10) var(--space-4);
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: var(--space-8);
      align-items: center;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: var(--space-4);
    }

    .footer-logo {
      height: 60px;
      width: auto;
    }

    .brand-text h4 {
      margin: 0;
      color: var(--gray-900);
      font-size: var(--text-lg);
      font-weight: var(--weight-bold);
    }

    .brand-text p {
      margin: 0;
      color: var(--gray-500);
      font-size: var(--text-sm);
    }

    .footer-links {
      display: flex;
      gap: var(--space-6);
      justify-content: center;
    }

    .footer-links a {
      color: var(--gray-600);
      text-decoration: none;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      transition: color var(--transition-fast);
    }

    .footer-links a:hover {
      color: var(--brand-600);
    }

    .footer-social {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: var(--space-2);
    }

    .footer-social p {
      margin: 0;
      font-size: var(--text-sm);
      color: var(--gray-500);
      font-weight: var(--weight-medium);
    }

    .social-icons {
      display: flex;
      gap: var(--space-3);
    }

    .social-icon {
      color: var(--gray-600);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--gray-200);
    }

    .social-icon:hover {
      color: white;
      background-color: var(--brand-500);
      transform: translateY(-2px);
    }

    .footer-copyright {
      background-color: var(--gray-900);
      color: var(--gray-400);
      text-align: center;
      padding: var(--space-4);
      font-size: var(--text-xs);
    }

    /* --- RESPONSIVE --- */
    @media (max-width: 1024px) {
      .header-nav { display: none; }
      .search-box { display: none; }
      
      .news-grid {
        grid-template-columns: 1fr;
      }
      
      .footer-main {
        grid-template-columns: 1fr;
        text-align: center;
        gap: var(--space-6);
    }
    }\n  `]
})
export class HomePageComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);

  currentYear = new Date().getFullYear();
  scrollY = signal(0);
  activeIndex = signal(0);
  isTransitioning = signal(false);
  isPaused = false;

  private autoPlayInterval: any;

  newsItems: NewsItem[] = [
    {
      id: 1,
      category: 'FESTIVAL 2026',
      title: 'Se abren las inscripciones para el certamen Nuevos Valores',
      image: 'assets/home-background.jpg',
      thumbType: 'img',
      thumbSrc: 'assets/img/cruzBaila.png',
      thumbBg: 'bg-blue'
    },
    {
      id: 2,
      category: 'JURADO',
      title: 'Capacitación para el jurado de danza en el Hotel Rayentray',
      image: 'assets/rayentray.png',
      thumbType: 'img',
      thumbSrc: 'assets/img/cruzBaila.png',
      thumbBg: 'bg-blue'
    },
    {
      id: 3,
      category: 'REGLAMENTO',
      title: 'Modificación en el reglamento del rubro "Solista Vocal"',
      image: 'assets/hidro.jpeg',
      thumbType: 'icon',
      thumbSrc: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>',
      thumbBg: 'bg-gold'
    },
    {
      id: 4,
      category: 'CRONOGRAMA',
      title: 'Cronograma oficial de la primera ronda clasificatoria',
      image: 'assets/home-background.jpg',
      thumbType: 'icon',
      thumbSrc: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      thumbBg: 'bg-gray'
    }
  ];

  activeNews = computed(() => this.newsItems[this.activeIndex()]);

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  startCarousel(): void {
    this.stopCarousel();
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 5000);
  }

  stopCarousel(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide(): void {
    const nextIndex = (this.activeIndex() + 1) % this.newsItems.length;
    this.selectNews(nextIndex);
  }

  selectNews(index: number): void {
    if (index === this.activeIndex()) return;
    
    this.startCarousel();

    this.isTransitioning.set(true);
    this.cdr.detectChanges();

    setTimeout(() => {
      this.activeIndex.set(index);
      this.isTransitioning.set(false);
      this.cdr.detectChanges();
    }, 200);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY.set(window.scrollY);
  }
}
