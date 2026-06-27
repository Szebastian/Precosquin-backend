import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="app-footer">
      <div class="sponsors-section">
        <img src="assets/MUNI-LOGO2.svg" alt="Municipalidad" class="sponsor-logo">
        <img src="assets/rayentray.png" alt="Rayentray" class="sponsor-logo">
        <img src="assets/hidro.jpeg" alt="Hidro" class="sponsor-logo">
      </div>
      <div class="footer-content">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span>&copy; {{ currentYear }} Precosquin. Todos los derechos reservados.</span>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background-color: var(--gray-900);
      color: var(--gray-400);
      padding: var(--space-4) var(--space-6);
      text-align: center;
      font-size: var(--text-sm);
    }

    :host-context(.dark) .app-footer {
      background-color: #0a0d14;
    }

    .sponsors-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-8);
      margin-bottom: var(--space-4);
      padding-bottom: var(--space-4);
      border-bottom: 1px solid var(--gray-800);
    }

    .sponsor-logo {
      height: 80px;
      width: 160px;
      object-fit: contain;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
