import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface JuryMember {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface InviteResult {
  id: string;
  email: string;
  full_name: string;
  temp_password: string;
  message: string;
}

@Component({
  selector: 'app-jurado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
            </svg>
          </div>
          <div>
            <h1 class="page-title">Jurado</h1>
            <p class="page-subtitle">Gestionar miembros del jurado y enviar invitaciones</p>
          </div>
        </div>
        <button class="btn btn-primary" (click)="showInviteModal.set(true)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
          </svg>
          Invitar Jurado
        </button>
      </div>

      <div class="stats-row">
        <div class="stat-card stat-total">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ members().length }}</span>
            <span class="stat-label">Total Jurados</span>
          </div>
        </div>
        <div class="stat-card stat-active">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ activeCount() }}</span>
            <span class="stat-label">Activos</span>
          </div>
        </div>
        <div class="stat-card stat-inactive">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ pendingCount() }}</span>
            <span class="stat-label">Inactivos</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-header-left">
            <h2>Miembros del Jurado</h2>
            <span class="card-count">{{ members().length }} personas</span>
          </div>
        </div>
        <div class="card-body">
          @if (loading()) {
            <div class="loading-state">
              <div class="spinner-lg"></div>
              <p>Cargando jurados...</p>
            </div>
          } @else if (members().length === 0) {
            <div class="empty-state">
              <div class="empty-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                </svg>
              </div>
              <h3 class="empty-title">No hay jurados asignados</h3>
              <p class="empty-desc">Invitá profesionales del ámbito folklórico para que evalúen a los artistas del festival.</p>
              <button class="btn btn-primary btn-lg" (click)="showInviteModal.set(true)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>
                </svg>
                Enviar Primera Invitación
              </button>
            </div>
          } @else {
            <div class="member-grid">
              @for (member of members(); track member.id) {
                <div class="member-card" [class.inactive]="!member.is_active">
                  <div class="member-top">
                    <div class="member-avatar" [class.inactive]="!member.is_active">
                      {{ getInitials(member.full_name) }}
                    </div>
                    <div class="member-info">
                      <h3 class="member-name">{{ member.full_name }}</h3>
                      <p class="member-email">{{ member.email }}</p>
                    </div>
                    <span class="status-pill" [class.active]="member.is_active">
                      {{ member.is_active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div class="member-meta">
                    <div class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
                      </svg>
                      <span>Agregado {{ formatDate(member.created_at) }}</span>
                    </div>
                  </div>
                  <div class="member-actions">
                    <button class="btn-action" (click)="resendInvite(member)" title="Reenviar invitación">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Reenviar
                    </button>
                    <button class="btn-action btn-danger-action" (click)="removeMember(member)" [disabled]="!member.is_active" title="Remover del jurado">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <line x1="17" x2="22" y1="11" y2="16"/>
                      </svg>
                      Remover
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      @if (showInviteModal()) {
        <div class="modal-overlay" (click)="showInviteModal.set(false)">
          <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="modal-title-row">
                <div class="modal-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </div>
                <h2>Invitar Jurado</h2>
              </div>
              <button class="btn-close" (click)="showInviteModal.set(false)">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              @if (!inviteResult()) {
                <p class="modal-desc">Enviá una invitación por email para que se una al jurado del festival.</p>
                <div class="form-group">
                  <label class="form-label">Nombre completo *</label>
                  <input type="text" class="form-input" [(ngModel)]="inviteForm.full_name" placeholder="Ej: Dr. Carlos Méndez" />
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-input" [(ngModel)]="inviteForm.email" placeholder="carlos&#64;ejemplo.com" />
                </div>
                <div class="invite-info">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                  <p>Se creará la cuenta y se generará una contraseña temporal. Compartila con el jurado por email o WhatsApp.</p>
                </div>
                @if (inviteError()) {
                  <div class="alert alert-error">{{ inviteError() }}</div>
                }
              } @else {
                <div class="invite-success">
                  <div class="success-icon-lg">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                    </svg>
                  </div>
                  <h3>Invitación Enviada</h3>
                  <p>Se creó la cuenta para <strong>{{ inviteResult()!.email }}</strong></p>
                  <div class="temp-credentials">
                    <span class="cred-label">Contraseña temporal:</span>
                    <code class="cred-value">{{ inviteResult()!.temp_password }}</code>
                  </div>
                  <p class="cred-note">Copiá esta contraseña y compartila con el jurado. Se le pedirá cambiarla al iniciar sesión.</p>
                </div>
              }
            </div>
            <div class="modal-footer">
              @if (!inviteResult()) {
                <button class="btn btn-secondary" (click)="showInviteModal.set(false)">Cancelar</button>
                <button class="btn btn-primary" (click)="sendInvite()" [disabled]="!inviteForm.email || !inviteForm.full_name || inviting()">
                  @if (inviting()) {
                    <span class="spinner"></span> Enviando...
                  } @else {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 2 11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Enviar Invitación
                  }
                </button>
              } @else {
                <button class="btn btn-primary" (click)="closeModal()">Cerrar</button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container { 
      max-width: 1024px; 
      margin: 0 auto;
      padding: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.75rem;
      gap: 1rem;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      border-radius: 1rem;
      background: var(--warning-50);
      color: var(--warning-600);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .header-icon {
      background: rgba(245, 158, 11, 0.15);
      color: var(--warning-400);
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--gray-900);
      margin: 0 0 2px;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .page-title {
      color: var(--gray-100);
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .page-subtitle {
      color: var(--gray-400);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .stats-row {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #fff;
      border: 1px solid var(--gray-200);
      border-radius: 1rem;
      padding: 1.25rem;
      transition: all 0.2s ease;
    }

    :host-context(.dark) .stat-card {
      background: #1e293b;
      border-color: #334155;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-total .stat-icon { background: var(--brand-50); color: var(--brand-600); }
    .stat-active .stat-icon { background: var(--success-50); color: var(--success-600); }
    .stat-inactive .stat-icon { background: var(--gray-100); color: var(--gray-500); }

    :host-context(.dark) .stat-total .stat-icon { background: rgba(99,102,241,0.15); color: var(--brand-400); }
    :host-context(.dark) .stat-active .stat-icon { background: rgba(34,197,94,0.15); color: var(--success-400); }
    :host-context(.dark) .stat-inactive .stat-icon { background: #334155; color: var(--gray-400); }

    .stat-content { display: flex; flex-direction: column; }

    .stat-value {
      font-size: 1.375rem;
      font-weight: bold;
      color: var(--gray-900);
      line-height: 1.2;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .stat-value {
      color: var(--gray-100);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--gray-500);
      font-weight: 500;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .stat-label {
      color: var(--gray-400);
    }

    .card {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      border: 1px solid var(--gray-200);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .card {
      background: #1e293b;
      border-color: #334155;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--gray-100);
      transition: border-color 0.3s ease;
    }

    :host-context(.dark) .card-header {
      border-color: #334155;
    }

    .card-header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .card-header h2 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .card-header h2 {
      color: var(--gray-100);
    }

    .card-count {
      font-size: 0.75rem;
      color: var(--gray-400);
      background: var(--gray-100);
      padding: 2px 8px;
      border-radius: 9999px;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .card-count {
      background: #334155;
      color: var(--gray-400);
    }

    .card-body { padding: 0; }

    .member-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
      padding: 1.25rem;
    }

    .member-card {
      background: #fff;
      border: 1px solid var(--gray-200);
      border-radius: 1rem;
      padding: 1.25rem;
      transition: all 0.2s ease;
    }

    :host-context(.dark) .member-card {
      background: #1e293b;
      border-color: #334155;
    }

    .member-card:hover {
      border-color: var(--gray-300);
      box-shadow: 0 4px 16px rgba(0,0,0,0.08);
      transform: translateY(-2px);
    }

    :host-context(.dark) .member-card:hover {
      border-color: #475569;
    }

    .member-card.inactive {
      opacity: 0.6;
    }

    .member-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .member-avatar {
      width: 44px;
      height: 44px;
      border-radius: 9999px;
      background: var(--warning-100);
      color: var(--warning-600);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: bold;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .member-avatar {
      background: rgba(245,158,11,0.2);
      color: var(--warning-400);
    }

    .member-avatar.inactive {
      background: var(--gray-100);
      color: var(--gray-400);
    }

    :host-context(.dark) .member-avatar.inactive {
      background: #334155;
      color: var(--gray-500);
    }

    .member-info {
      flex: 1;
      min-width: 0;
    }

    .member-name {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .member-name {
      color: var(--gray-100);
    }

    .member-email {
      font-size: 0.75rem;
      color: var(--gray-500);
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .member-email {
      color: var(--gray-400);
    }

    .status-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      background: var(--gray-100);
      color: var(--gray-500);
      flex-shrink: 0;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .status-pill {
      background: #334155;
      color: var(--gray-400);
    }

    .status-pill.active {
      background: var(--success-50);
      color: var(--success-600);
    }

    :host-context(.dark) .status-pill.active {
      background: rgba(34,197,94,0.15);
      color: var(--success-400);
    }

    .member-meta {
      padding-top: 0.75rem;
      border-top: 1px solid var(--gray-100);
      margin-bottom: 0.75rem;
      transition: border-color 0.3s ease;
    }

    :host-context(.dark) .member-meta {
      border-color: #334155;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--gray-400);
      transition: color 0.3s ease;
    }

    :host-context(.dark) .meta-item {
      color: var(--gray-500);
    }

    .member-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 8px 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 0.75rem;
      border: 1px solid var(--gray-200);
      background: #fff;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    :host-context(.dark) .btn-action {
      background: #1e293b;
      border-color: #334155;
      color: var(--gray-300);
    }

    .btn-action:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
      color: var(--gray-900);
    }

    :host-context(.dark) .btn-action:hover {
      background: #334155;
      border-color: #475569;
      color: var(--gray-100);
    }

    .btn-danger-action:hover {
      background: var(--danger-50);
      border-color: var(--danger-200);
      color: var(--danger-600);
    }

    :host-context(.dark) .btn-danger-action:hover {
      background: rgba(239,68,68,0.15);
      border-color: rgba(239,68,68,0.3);
      color: var(--danger-400);
    }

    .btn-action:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 1.5rem;
    }

    .empty-icon-wrap {
      width: 80px;
      height: 80px;
      border-radius: 9999px;
      background: var(--gray-50);
      color: var(--gray-300);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .empty-icon-wrap {
      background: #334155;
      color: #475569;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 0.5rem;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .empty-title {
      color: var(--gray-100);
    }

    .empty-desc {
      font-size: 0.875rem;
      color: var(--gray-500);
      max-width: 380px;
      margin: 0 auto 1.5rem;
      line-height: 1.6;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .empty-desc {
      color: var(--gray-400);
    }

    .loading-state {
      text-align: center;
      padding: 4rem 1.5rem;
      color: var(--gray-500);
      transition: color 0.3s ease;
    }

    :host-context(.dark) .loading-state {
      color: var(--gray-400);
    }

    .spinner-lg {
      width: 32px;
      height: 32px;
      border: 3px solid var(--gray-200);
      border-top-color: var(--brand-600);
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
      margin: 0 auto 1rem;
    }

    :host-context(.dark) .spinner-lg {
      border-color: #334155;
      border-top-color: var(--brand-500);
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
      animation: fadeIn 0.15s ease-out;
      backdrop-filter: blur(4px);
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    .modal {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 24px 80px rgba(0,0,0,0.3);
      width: 100%;
      max-width: 480px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.2s ease-out;
      transition: background 0.3s ease;
    }

    :host-context(.dark) .modal {
      background: #1e293b;
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--gray-100);
      transition: border-color 0.3s ease;
    }

    :host-context(.dark) .modal-header {
      border-color: #334155;
    }

    .modal-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .modal-icon {
      width: 36px;
      height: 36px;
      border-radius: 0.75rem;
      background: var(--brand-50);
      color: var(--brand-600);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .modal-icon {
      background: rgba(99,102,241,0.15);
      color: var(--brand-400);
    }

    .modal-header h2 {
      font-size: 1.0625rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .modal-header h2 {
      color: var(--gray-100);
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: 0.5rem;
      border: none;
      background: none;
      color: var(--gray-400);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    :host-context(.dark) .btn-close {
      color: var(--gray-500);
    }

    .btn-close:hover {
      background: var(--gray-100);
      color: var(--gray-600);
    }

    :host-context(.dark) .btn-close:hover {
      background: #334155;
      color: var(--gray-300);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .modal-desc {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0 0 1.25rem;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .modal-desc {
      color: var(--gray-400);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--gray-100);
      transition: border-color 0.3s ease;
    }

    :host-context(.dark) .modal-footer {
      border-color: #334155;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 0.5rem;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .form-label {
      color: var(--gray-300);
    }

    .form-input {
      width: 100%;
      padding: 10px 0.75rem;
      font-size: 0.875rem;
      color: var(--gray-900);
      background: #fff;
      border: 1.5px solid var(--gray-300);
      border-radius: 0.75rem;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    :host-context(.dark) .form-input {
      background: #1e293b;
      border-color: #475569;
      color: var(--gray-100);
    }

    .form-input::placeholder {
      color: var(--gray-400);
    }

    :host-context(.dark) .form-input::placeholder {
      color: var(--gray-500);
    }

    .form-input:focus {
      border-color: var(--brand-500);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }

    :host-context(.dark) .form-input:focus {
      border-color: var(--brand-400);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
    }

    .invite-info {
      display: flex;
      gap: 0.75rem;
      align-items: flex-start;
      background: var(--info-50);
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .invite-info {
      background: rgba(59,130,246,0.1);
    }

    .invite-info svg { flex-shrink: 0; margin-top: 2px; color: var(--info-500); }

    :host-context(.dark) .invite-info svg {
      color: var(--info-400);
    }

    .invite-info p {
      font-size: 0.75rem;
      color: var(--gray-600);
      margin: 0;
      line-height: 1.5;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .invite-info p {
      color: var(--gray-300);
    }

    .alert-error {
      padding: 0.75rem 1rem;
      background: var(--danger-50);
      color: var(--danger-600);
      border-radius: 0.75rem;
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .alert-error {
      background: rgba(239,68,68,0.15);
      color: var(--danger-400);
    }

    .invite-success {
      text-align: center;
      padding: 1rem 0;
    }

    .success-icon-lg {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--success-50);
      color: var(--success-600);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1rem;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .success-icon-lg {
      background: rgba(34,197,94,0.15);
      color: var(--success-400);
    }

    .invite-success h3 {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 0.5rem;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .invite-success h3 {
      color: var(--gray-100);
    }

    .invite-success p {
      font-size: 0.875rem;
      color: var(--gray-600);
      margin: 0 0 1rem;
      transition: color 0.3s ease;
    }

    :host-context(.dark) .invite-success p {
      color: var(--gray-400);
    }

    .temp-credentials {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 0.75rem;
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .temp-credentials {
      background: #334155;
      border-color: #475569;
    }

    .cred-label {
      font-size: 0.875rem;
      color: var(--gray-600);
      transition: color 0.3s ease;
    }

    :host-context(.dark) .cred-label {
      color: var(--gray-400);
    }

    .cred-value {
      font-family: monospace;
      font-size: 0.875rem;
      background: #fff;
      padding: 4px 10px;
      border-radius: 0.5rem;
      border: 1px solid var(--gray-200);
      color: var(--brand-600);
      font-weight: 600;
      transition: all 0.3s ease;
    }

    :host-context(.dark) .cred-value {
      background: #1e293b;
      border-color: #475569;
      color: var(--brand-400);
    }

    .cred-note {
      font-size: 0.75rem;
      color: var(--gray-400);
      transition: color 0.3s ease;
    }

    :host-context(.dark) .cred-note {
      color: var(--gray-500);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 10px 1rem;
      font-size: 0.875rem;
      font-weight: 500;
      border-radius: 0.75rem;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-lg {
      padding: 12px 1.5rem;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: var(--brand-600);
      color: #fff;
    }

    .btn-primary:hover:not(:disabled) { 
      background: var(--brand-700); 
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(99,102,241,0.3);
    }

    .btn-secondary {
      background: var(--gray-100);
      color: var(--gray-700);
    }

    :host-context(.dark) .btn-secondary {
      background: #334155;
      color: var(--gray-300);
    }

    .btn-secondary:hover { 
      background: var(--gray-200); 
    }

    :host-context(.dark) .btn-secondary:hover { 
      background: #475569; 
    }

    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
  `]
})
export class JuradoPageComponent implements OnInit {
  private http = inject(HttpClient);

  members = signal<JuryMember[]>([]);
  loading = signal(true);
  showInviteModal = signal(false);
  inviting = signal(false);
  inviteError = signal('');
  inviteResult = signal<InviteResult | null>(null);

  inviteForm = { email: '', full_name: '' };

  activeCount = signal(0);
  pendingCount = signal(0);

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.loading.set(true);
    this.http.get<JuryMember[]>('/api/v1/jury/members').subscribe({
      next: (members) => {
        this.members.set(members);
        this.activeCount.set(members.filter(m => m.is_active).length);
        this.pendingCount.set(members.filter(m => !m.is_active).length);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  sendInvite(): void {
    if (!this.inviteForm.email || !this.inviteForm.full_name) return;
    this.inviting.set(true);
    this.inviteError.set('');

    this.http.post<InviteResult>('/api/v1/jury/members/invite', this.inviteForm).subscribe({
      next: (result) => {
        this.inviting.set(false);
        this.inviteResult.set(result);
        this.loadMembers();
      },
      error: (err) => {
        this.inviting.set(false);
        let errorMessage = 'Error al enviar la invitación';
        
        if (err.error?.detail) {
          errorMessage = err.error.detail;
        } else if (err.message) {
          errorMessage = err.message;
        } else if (err.status === 0) {
          errorMessage = 'No se puede conectar al servidor. Verifica que el backend esté corriendo.';
        } else if (err.status === 500) {
          errorMessage = 'Error interno del servidor. Inténtalo más tarde.';
        }
        
        this.inviteError.set(errorMessage);
      }
    });
  }

  resendInvite(member: JuryMember): void {
    this.inviteForm = { email: member.email, full_name: member.full_name };
    this.showInviteModal.set(true);
  }

  removeMember(member: JuryMember): void {
    if (!confirm(`¿Remover a ${member.full_name} del jurado?`)) return;
    this.http.delete(`/api/v1/jury/members/${member.id}`).subscribe({
      next: () => this.loadMembers(),
      error: (err) => {
        console.error('Error al remover miembro:', err);
        alert('Error al remover el miembro del jurado. Inténtalo más tarde.');
      }
    });
  }

  closeModal(): void {
    this.showInviteModal.set(false);
    this.inviteResult.set(null);
    this.inviteError.set('');
    this.inviteForm = { email: '', full_name: '' };
  }
}
