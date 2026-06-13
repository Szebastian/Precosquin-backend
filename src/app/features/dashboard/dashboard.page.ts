import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  total_inscripciones: number;
  inscripciones_pendientes: number;
  inscripciones_aprobadas: number;
  artistas_confirmados: number;
  jurados_activos: number;
  eventos_proximos: number;
  incidencias_abiertas: number;
  contratos_pendientes: number;
}

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div>
          <h1 class="welcome-title">¡Bienvenido! 👋</h1>
          <p class="welcome-subtitle">{{ auth.profile()?.full_name || 'Usuario' }} - Aquí tienes un resumen de Precosquin</p>
        </div>
        <div class="welcome-actions">
          <span class="badge badge-soft-brand">Vista General</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card stat-card-brand">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ stats()?.total_inscripciones || 0 }}</p>
              <p class="stat-label">Inscripciones Totales</p>
            </div>
          </div>
          <div class="stat-footer">
            <span class="stat-trend-up">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              +12% esta semana
            </span>
          </div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ stats()?.inscripciones_pendientes || 0 }}</p>
              <p class="stat-label">Pendientes Revisión</p>
            </div>
          </div>
          <div class="stat-footer">
            <a routerLink="/panel/inscripciones" class="stat-link">Ver todos →</a>
          </div>
        </div>

        <div class="stat-card stat-card-success">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ stats()?.artistas_confirmados || 0 }}</p>
              <p class="stat-label">Artistas Confirmados</p>
            </div>
          </div>
          <div class="stat-footer">
            <a routerLink="/panel/artistas" class="stat-link">Ver artistas →</a>
          </div>
        </div>

        <div class="stat-card stat-card-danger">
          <div class="stat-card-inner">
            <div class="stat-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" x2="12" y1="8" y2="12"/>
                <line x1="12" x2="12.01" y1="16" y2="16"/>
              </svg>
            </div>
            <div class="stat-content">
              <p class="stat-value">{{ stats()?.incidencias_abiertas || 0 }}</p>
              <p class="stat-label">Incidencias Abiertas</p>
            </div>
          </div>
          <div class="stat-footer">
            <a routerLink="/panel/staff" class="stat-link">Ver incidencias →</a>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="main-grid">
        <!-- Quick Actions -->
        <div class="card card-elevated">
          <div class="card-header">
            <h3 class="card-title">Acciones Rápidas</h3>
            <p class="card-description">Las tareas más frecuentes</p>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <a routerLink="/panel/inscripciones" class="quick-action">
                <div class="quick-action-icon action-brand">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Revisar Inscripciones</p>
                  <p class="quick-action-desc">{{ stats()?.inscripciones_pendientes || 0 }} pendientes</p>
                </div>
              </a>

              <a routerLink="/panel/cronograma" class="quick-action">
                <div class="quick-action-icon action-info">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Ver Cronograma</p>
                  <p class="quick-action-desc">{{ stats()?.eventos_proximos || 0 }} eventos próximos</p>
                </div>
              </a>

              <a routerLink="/panel/jurado" class="quick-action">
                <div class="quick-action-icon action-success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Evaluar Artistas</p>
                  <p class="quick-action-desc">{{ stats()?.jurados_activos || 0 }} jurados activos</p>
                </div>
              </a>

              <a routerLink="/panel/contratos" class="quick-action">
                <div class="quick-action-icon action-warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
                    <path d="M14 2v6h6"/>
                    <path d="M16 13H8"/>
                    <path d="M16 17H8"/>
                    <path d="M10 9H8"/>
                  </svg>
                </div>
                <div class="quick-action-content">
                  <p class="quick-action-title">Gestionar Contratos</p>
                  <p class="quick-action-desc">{{ stats()?.contratos_pendientes || 5 }} pendientes</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card card-elevated">
          <div class="card-header">
            <h3 class="card-title">Actividad Reciente</h3>
            <a routerLink="/panel/reportes" class="text-link">Ver todas</a>
          </div>
          <div class="card-body">
            <div class="activity-list">
              @for (activity of recentActivity; track activity.id) {
                <div class="activity-item">
                  <div class="activity-avatar {{ activity.type }}">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @if (activity.type === 'submitted') {
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                      } @else if (activity.type === 'approved') {
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      } @else if (activity.type === 'signed') {
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/>
                        <path d="M14 2v6h6"/>
                      } @else if (activity.type === 'pending') {
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      } @else {
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" x2="9" y1="9" y2="15"/>
                        <line x1="9" x2="15" y1="9" y2="15"/>
                      }
                    </svg>
                  </div>
                  <div class="activity-content">
                    <p class="activity-text">{{ activity.description }}</p>
                    <p class="activity-time">{{ activity.time }}</p>
                  </div>
                  <a [routerLink]="activity.link" class="activity-link">Ver</a>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      background: transparent;
      transition: all 0.3s ease;
    }

    /* Welcome Section */
    .welcome-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .welcome-title {
      font-size: 1.875rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 0.25rem 0;
      line-height: 1.2;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .welcome-title {
      color: var(--gray-100);
    }

    .welcome-subtitle {
      font-size: 0.9375rem;
      color: var(--gray-500);
      margin: 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .welcome-subtitle {
      color: var(--gray-400);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .stat-card {
      border-radius: 1rem;
      padding: 1.5rem;
      background: #fff;
      border: 1px solid var(--gray-200);
      transition: all 0.2s ease;
    }

    :host-context(.dark) .stat-card {
      background: #1e293b;
      border-color: #334155;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .stat-card-brand {
      border-top: 3px solid var(--brand-500);
    }

    .stat-card-warning {
      border-top: 3px solid var(--warning-500);
    }

    .stat-card-success {
      border-top: 3px solid var(--success-500);
    }

    .stat-card-danger {
      border-top: 3px solid var(--danger-500);
    }

    .stat-card-inner {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .stat-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card-brand .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
      color: #fff;
    }

    .stat-card-warning .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--warning-500), var(--warning-600));
      color: #fff;
    }

    .stat-card-success .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--success-500), var(--success-600));
      color: #fff;
    }

    .stat-card-danger .stat-icon-wrapper {
      background: linear-gradient(135deg, var(--danger-500), var(--danger-600));
      color: #fff;
    }

    .stat-content {
      flex: 1;
      min-width: 0;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--gray-900);
      margin: 0;
      line-height: 1;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .stat-value {
      color: var(--gray-100);
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0.375rem 0 0 0;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .stat-label {
      color: var(--gray-400);
    }

    .stat-footer {
      padding-top: 0.875rem;
      border-top: 1px solid var(--gray-100);
      transition: border-color 0.3s ease;
    }

    :host-context(.dark) .stat-footer {
      border-color: #334155;
    }

    .stat-trend-up {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--success-600);
    }

    .stat-link {
      font-size: 0.875rem;
      color: var(--brand-600);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .stat-link:hover {
      color: var(--brand-700);
    }

    /* Main Grid */
    .main-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 1024px) {
      .main-grid {
        grid-template-columns: 1.2fr 1fr;
      }
    }

    /* Cards */
    .card {
      background: #fff;
      border-radius: 1rem;
      border: 1px solid var(--gray-200);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .card {
      background: #1e293b;
      border-color: #334155;
    }

    .card-elevated {
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--gray-100);
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color 0.3s ease;
    }

    :host-context(.dark) .card-header {
      border-color: #334155;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .card-title {
      color: var(--gray-100);
    }

    .card-description {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0.25rem 0 0 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .card-description {
      color: var(--gray-400);
    }

    .card-body {
      padding: 1.25rem 1.5rem;
    }

    /* Quick Actions */
    .quick-actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .quick-actions {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .quick-action {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem;
      border-radius: 0.875rem;
      text-decoration: none;
      border: 1px solid var(--gray-200);
      transition: all 0.2s ease;
      background: #fff;
    }

    :host-context(.dark) .quick-action {
      background: #1e293b;
      border-color: #334155;
    }

    .quick-action:hover {
      border-color: var(--brand-300);
      background: var(--brand-50);
      transform: translateX(4px);
    }

    :host-context(.dark) .quick-action:hover {
      background: rgba(37, 99, 235, 0.2);
    }

    .quick-action-icon {
      width: 44px;
      height: 44px;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .action-brand {
      background: var(--brand-100);
      color: var(--brand-600);
    }

    .action-info {
      background: var(--info-100);
      color: var(--info-600);
    }

    .action-success {
      background: var(--success-100);
      color: var(--success-600);
    }

    .action-warning {
      background: var(--warning-100);
      color: var(--warning-600);
    }

    .quick-action-content {
      flex: 1;
      min-width: 0;
    }

    .quick-action-title {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .quick-action-title {
      color: var(--gray-100);
    }

    .quick-action-desc {
      font-size: 0.8125rem;
      color: var(--gray-500);
      margin: 0.125rem 0 0 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .quick-action-desc {
      color: var(--gray-400);
    }

    /* Activity List */
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 0.75rem;
      border-radius: 0.75rem;
      transition: background-color 0.2s ease;
    }

    .activity-item:hover {
      background: var(--gray-50);
    }

    :host-context(.dark) .activity-item:hover {
      background: #334155;
    }

    .activity-avatar {
      width: 36px;
      height: 36px;
      border-radius: 0.625rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .activity-avatar.submitted {
      background: var(--brand-100);
      color: var(--brand-600);
    }

    .activity-avatar.approved {
      background: var(--success-100);
      color: var(--success-600);
    }

    .activity-avatar.signed {
      background: var(--info-100);
      color: var(--info-600);
    }

    .activity-avatar.pending {
      background: var(--warning-100);
      color: var(--warning-600);
    }

    .activity-avatar.rejected {
      background: var(--danger-100);
      color: var(--danger-600);
    }

    .activity-content {
      flex: 1;
      min-width: 0;
    }

    .activity-text {
      font-size: 0.875rem;
      color: var(--gray-900);
      margin: 0;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .activity-text {
      color: var(--gray-100);
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--gray-500);
      margin: 0.125rem 0 0 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .activity-time {
      color: var(--gray-400);
    }

    .activity-link {
      font-size: 0.8125rem;
      color: var(--brand-600);
      font-weight: 500;
      text-decoration: none;
      padding: 0.375rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--brand-50);
      transition: all 0.2s ease;
    }

    :host-context(.dark) .activity-link {
      background: rgba(37, 99, 235, 0.2);
    }

    .activity-link:hover {
      background: var(--brand-100);
      color: var(--brand-700);
    }

    /* Links */
    .text-link {
      font-size: 0.875rem;
      color: var(--brand-600);
      font-weight: 500;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .text-link:hover {
      color: var(--brand-700);
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  auth = inject(AuthService);
  private http = inject(HttpClient);

  stats = signal<DashboardStats | null>(null);

  recentActivity = [
    { id: 1, type: 'submitted' as const, description: 'Juan Pérez envió inscripción - Música > Solista Vocal', time: 'hace 5 min', link: '/panel/inscripciones/123' },
    { id: 2, type: 'approved' as const, description: 'María García aprobada - Danza > Pareja Tradicional', time: 'hace 30 min', link: '/panel/inscripciones/124' },
    { id: 3, type: 'signed' as const, description: 'Los Pibes firmaron contrato', time: 'hace 1 hora', link: '/panel/contratos/125' },
    { id: 4, type: 'pending' as const, description: 'Banda X pendiente revisión documentación', time: 'hace 2 horas', link: '/panel/inscripciones/126' },
    { id: 5, type: 'rejected' as const, description: 'Pedro López rechazado - Documentación incompleta', time: 'hace 3 horas', link: '/panel/inscripciones/127' }
  ];

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    this.http.get<DashboardStats>('/api/v1/dashboard/stats').subscribe({
      next: (data) => this.stats.set(data),
      error: () => {
        this.stats.set({
          total_inscripciones: 47,
          inscripciones_pendientes: 12,
          inscripciones_aprobadas: 28,
          artistas_confirmados: 23,
          jurados_activos: 8,
          eventos_proximos: 3,
          incidencias_abiertas: 2,
          contratos_pendientes: 5
        });
      }
    });
  }
}
