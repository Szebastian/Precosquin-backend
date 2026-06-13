import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface InscripcionResult {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  stage_name: string | null;
  category: string;
  subcategory: string;
  status: string;
  created_at: string;
}

interface InscripcionData {
  fullName: string;
  email: string;
  phone: string;
  dni: string;
  category: string;
  subcategory: string;
  artisticName: string;
  bio: string;
}

@Component({
  selector: 'app-inscripcion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="public-page">
      @if (currentStep() < 5) {
        <nav class="form-nav">
          <a routerLink="/" class="nav-brand">
            <img src="assets/logo.svg" alt="Precosquin" class="nav-logo" />
            <span>Precosquin</span>
          </a>
          <a routerLink="/auth/login" class="nav-link">¿Ya tenés cuenta? Acceder</a>
        </nav>
      }

      @if (currentStep() < 5) {
        <div class="form-wrapper">
          <div class="form-card animate-scale-in">
            <div class="form-header">
              <h1>Inscripción de Artista</h1>
              <p>Completá los pasos para participar en Precosquin</p>
            </div>

            <div class="steps-indicator">
              @for (step of steps; track step.number; let i = $index) {
                <div class="step" [class.active]="currentStep() === step.number" [class.completed]="currentStep() > step.number">
                  <div class="step-circle">
                    @if (currentStep() > step.number) {
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    } @else {
                      {{ step.number }}
                    }
                  </div>
                  <span class="step-label">{{ step.label }}</span>
                </div>
                @if (i < steps.length - 1) {
                  <div class="step-line" [class.completed]="currentStep() > step.number"></div>
                }
              }
            </div>

            <form (submit)="onSubmit($event)" class="inscription-form">
            @if (currentStep() === 1) {
              <div class="step-content animate-fade-in">
                <h2 class="step-title">Datos Personales</h2>
                <p class="step-desc">Contanos sobre vos para poder contactarte</p>

                <div class="form-group">
                  <label class="form-label" for="fullName">Nombre Completo *</label>
                  <input type="text" id="fullName" name="fullName" required class="form-input"
                    [(ngModel)]="data.fullName" placeholder="Ej: Juan Carlos Gómez" />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="email">Email *</label>
                    <input type="email" id="email" name="email" required class="form-input"
                      [(ngModel)]="data.email" placeholder="tu&#64;ejemplo.com" />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="phone">Teléfono / WhatsApp *</label>
                    <input type="tel" id="phone" name="phone" required class="form-input"
                      [(ngModel)]="data.phone" placeholder="+54 11 1234-5678" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="dni">DNI</label>
                  <input type="text" id="dni" name="dni" class="form-input"
                    [(ngModel)]="data.dni" placeholder="12345678" />
                </div>
              </div>
            }

            @if (currentStep() === 2) {
              <div class="step-content animate-fade-in">
                <h2 class="step-title">Categoría Artística</h2>
                <p class="step-desc">Seleccioná la categoría y subcategoría de tu presentación</p>

                <div class="form-group">
                  <label class="form-label">Categoría *</label>
                  <div class="category-cards">
                    <label class="category-card" [class.selected]="data.category === 'musica'">
                      <input type="radio" name="category" value="musica" [(ngModel)]="data.category" (ngModelChange)="onCategoryChange()" />
                      <div class="category-icon category-icon-music">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
                        </svg>
                      </div>
                      <div>
                        <span class="category-name">Música</span>
                        <span class="category-desc">5 subcategorías</span>
                      </div>
                    </label>
                    <label class="category-card" [class.selected]="data.category === 'danza'">
                      <input type="radio" name="category" value="danza" [(ngModel)]="data.category" (ngModelChange)="onCategoryChange()" />
                      <div class="category-icon category-icon-dance">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                        </svg>
                      </div>
                      <div>
                        <span class="category-name">Danza</span>
                        <span class="category-desc">6 subcategorías</span>
                      </div>
                    </label>
                  </div>
                </div>

                @if (data.category) {
                  <div class="form-group animate-fade-in">
                    <label class="form-label">Subcategoría *</label>
                    <div class="subcategory-grid">
                      @for (sub of subcategories(); track sub.id) {
                        <label class="subcategory-chip" [class.selected]="data.subcategory === sub.id">
                          <input type="radio" name="subcategory" [value]="sub.id" [(ngModel)]="data.subcategory" />
                          {{ sub.name }}
                        </label>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            @if (currentStep() === 3) {
              <div class="step-content animate-fade-in">
                <h2 class="step-title">Información Artística</h2>
                <p class="step-desc">Contanos un poco más sobre tu arte</p>

                <div class="form-group">
                  <label class="form-label" for="artisticName">Nombre Artístico</label>
                  <input type="text" id="artisticName" name="artisticName" class="form-input"
                    [(ngModel)]="data.artisticName" placeholder="Si tenés nombre artístico, ingresalo" />
                </div>

                <div class="form-group">
                  <label class="form-label" for="bio">Biografía / Descripción artística</label>
                  <textarea id="bio" name="bio" class="form-textarea" rows="5"
                    [(ngModel)]="data.bio"
                    placeholder="Contanos sobre tu trayectoria, experiencia, logros..."></textarea>
                  <span class="form-hint">Opcional pero recomendado para el jurado</span>
                </div>
              </div>
            }

            @if (currentStep() === 4) {
              <div class="step-content animate-fade-in">
                <h2 class="step-title">Revisá tu inscripción</h2>
                <p class="step-desc">Verificá que toda la información sea correcta antes de enviar</p>

                <div class="review-section">
                  <div class="review-header">
                    <h3>Datos Personales</h3>
                    <button type="button" class="btn-edit" (click)="goToStep(1)">Editar</button>
                  </div>
                  <div class="review-grid">
                    <div class="review-item">
                      <span class="review-label">Nombre</span>
                      <span class="review-value">{{ data.fullName || '-' }}</span>
                    </div>
                    <div class="review-item">
                      <span class="review-label">Email</span>
                      <span class="review-value">{{ data.email || '-' }}</span>
                    </div>
                    <div class="review-item">
                      <span class="review-label">Teléfono</span>
                      <span class="review-value">{{ data.phone || '-' }}</span>
                    </div>
                    <div class="review-item">
                      <span class="review-label">DNI</span>
                      <span class="review-value">{{ data.dni || 'No ingresado' }}</span>
                    </div>
                  </div>
                </div>

                <div class="review-section">
                  <div class="review-header">
                    <h3>Categoría</h3>
                    <button type="button" class="btn-edit" (click)="goToStep(2)">Editar</button>
                  </div>
                  <div class="review-grid">
                    <div class="review-item">
                      <span class="review-label">Categoría</span>
                      <span class="review-value">{{ data.category === 'musica' ? 'Música' : data.category === 'danza' ? 'Danza' : '-' }}</span>
                    </div>
                    <div class="review-item">
                      <span class="review-label">Subcategoría</span>
                      <span class="review-value">{{ subcategoryName() || '-' }}</span>
                    </div>
                  </div>
                </div>

                <div class="review-section">
                  <div class="review-header">
                    <h3>Información Artística</h3>
                    <button type="button" class="btn-edit" (click)="goToStep(3)">Editar</button>
                  </div>
                  <div class="review-grid">
                    <div class="review-item">
                      <span class="review-label">Nombre Artístico</span>
                      <span class="review-value">{{ data.artisticName || 'No ingresado' }}</span>
                    </div>
                    <div class="review-item full-width">
                      <span class="review-label">Biografía</span>
                      <span class="review-value">{{ data.bio || 'No ingresada' }}</span>
                    </div>
                  </div>
                </div>

                <div class="terms-check">
                  <label class="checkbox-label">
                    <input type="checkbox" [(ngModel)]="acceptedTerms" name="terms" />
                    <span>Acepto los <a href="#" class="text-brand">términos y condiciones</a> del festival</span>
                  </label>
                </div>
              </div>
            }

            @if (submitted()) {
              <div class="step-content success-content animate-scale-in">
                <div class="success-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                  </svg>
                </div>
                <h2>Inscripción Enviada</h2>
                <p>Generando tu constancia...</p>
              </div>
            }

            @if (!submitted()) {
              <div class="form-actions">
                @if (currentStep() > 1) {
                  <button type="button" class="btn btn-secondary" (click)="prevStep()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m15 18-6-6 6-6"/>
                    </svg>
                    Anterior
                  </button>
                }
                <div class="spacer"></div>
                @if (error()) {
                  <span class="form-error">{{ error() }}</span>
                }
                @if (currentStep() < 4) {
                  <button type="button" class="btn btn-primary" (click)="nextStep()" [disabled]="!canProceed()">
                    Siguiente
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                } @else {
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="!acceptedTerms || submitting()">
                    @if (submitting()) {
                      <span class="spinner"></span> Enviando...
                    } @else {
                      Enviar Inscripción
                    }
                  </button>
                }
              </div>
            }
          </form>
          <div class="sponsors-section">
            <img src="assets/MUNI-LOGO2.svg" alt="Municipalidad" class="sponsor-logo" />
            <img src="assets/rayentray.png" alt="Rayentray" class="sponsor-logo" />
            <img src="assets/hidro.jpeg" alt="Hidro" class="sponsor-logo" />
          </div>
          
          <div class="social-container">
            <p class="social-label">Seguinos en las redes:</p>
            <div class="social-section">
              <a href="https://www.instagram.com/precosquinpuertopiramides?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a href="https://www.youtube.com/@PreCosquinPuertoPirámides" target="_blank" rel="noopener noreferrer" class="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      }

      @if (currentStep() === 5 && inscriptionResult()) {
        <div class="constancia-page animate-scale-in" id="constancia">
          <div class="constancia-card">
            <div class="constancia-header">
              <img src="assets/logo.svg" alt="Precosquin" class="constancia-logo-img" />
              <div class="constancia-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>
                </svg>
                Inscripción Registrada
              </div>
            </div>

            <h2 class="constancia-title">Constancia de Inscripción</h2>

            <div class="constancia-body">
              <div class="constancia-field">
                <span class="constancia-label">N° de Inscripción</span>
                <span class="constancia-value constancia-id">{{ inscriptionResult()!.id }}</span>
              </div>

              <div class="constancia-field">
                <span class="constancia-label">Fecha de Inscripción</span>
                <span class="constancia-value">{{ formatDate(inscriptionResult()!.created_at) }}</span>
              </div>

              <div class="constancia-divider"></div>

              <div class="constancia-field">
                <span class="constancia-label">Nombre Completo</span>
                <span class="constancia-value">{{ inscriptionResult()!.full_name }}</span>
              </div>

              @if (inscriptionResult()!.stage_name) {
                <div class="constancia-field">
                  <span class="constancia-label">Nombre Artístico</span>
                  <span class="constancia-value">{{ inscriptionResult()!.stage_name }}</span>
                </div>
              }

              <div class="constancia-row">
                <div class="constancia-field">
                  <span class="constancia-label">Email</span>
                  <span class="constancia-value">{{ inscriptionResult()!.email }}</span>
                </div>
                <div class="constancia-field">
                  <span class="constancia-label">Teléfono</span>
                  <span class="constancia-value">{{ inscriptionResult()!.phone }}</span>
                </div>
              </div>

              <div class="constancia-divider"></div>

              <div class="constancia-row">
                <div class="constancia-field">
                  <span class="constancia-label">Categoría</span>
                  <span class="constancia-value constancia-category">{{ inscriptionResult()!.category === 'musica' ? 'Música' : 'Danza' }}</span>
                </div>
                <div class="constancia-field">
                  <span class="constancia-label">Subcategoría</span>
                  <span class="constancia-value constancia-category">{{ getSubcategoryName(inscriptionResult()!.subcategory) }}</span>
                </div>
              </div>

              <div class="constancia-divider"></div>

              <div class="constancia-field">
                <span class="constancia-label">Estado</span>
                <span class="constancia-value constancia-status">Pendiente de revisión</span>
              </div>

              <div class="constancia-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
                <p>Conservá esta constancia como comprobante. Tu inscripción será revisada por el jurado. Recibirás un email con los próximos pasos.</p>
              </div>
            </div>

            <div class="constancia-footer">
              <button type="button" class="btn btn-primary" (click)="printConstancia()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <rect x="6" y="14" width="12" height="8"/>
                </svg>
                Descargar / Imprimir
              </button>
              <a routerLink="/" class="btn btn-secondary">Volver al Inicio</a>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .public-page {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%);
      padding-bottom: var(--space-12);
    }

    .sponsors-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-8);
      margin-top: var(--space-8);
      padding: var(--space-6) var(--space-8);
      border-top: 1px solid var(--gray-200);
      background: #1e293b;
      border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    }

    .sponsor-logo {
      height: 70px;
      width: auto;
      max-width: 160px;
      object-fit: contain;
      filter: none;
      opacity: 1;
    }

    .social-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-6) var(--space-8);
      background: #1e293b;
      border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    }

    .social-label {
      font-size: var(--text-sm);
      color: #94a3b8;
      font-weight: var(--weight-medium);
      margin: 0;
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
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-lg);
      color: #fff;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .form-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-5) var(--space-6);
      max-width: 720px;
      margin: 0 auto;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      text-decoration: none;
      color: #fff;
      font-weight: var(--weight-bold);
      font-size: var(--text-lg);
    }

    .brand-icon-sm {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: var(--brand-600);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }

    .nav-link {
      font-size: var(--text-sm);
      color: #94a3b8;
      text-decoration: none;
      transition: color var(--transition-fast);
    }
    .nav-link:hover { color: #fff; }

    .form-wrapper {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 var(--space-4) var(--space-8);
    }

    .form-card {
      background: #fff;
      border-radius: var(--radius-2xl);
      box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
      overflow: hidden;
    }

    .form-header {
      text-align: center;
      padding: var(--space-10) var(--space-8) var(--space-5);
    }

    .form-header h1 {
      font-size: 1.625rem;
      font-weight: var(--weight-bold);
      color: var(--gray-900);
      margin: 0 0 var(--space-2);
    }

    .form-header p {
      font-size: var(--text-sm);
      color: var(--gray-500);
      margin: 0;
    }

    .steps-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-3) var(--space-8) var(--space-6);
      gap: 0;
    }

    .step {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .step-circle {
      width: 30px;
      height: 30px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      background: var(--gray-100);
      color: var(--gray-400);
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .step.active .step-circle {
      background: var(--brand-600);
      color: #fff;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.2);
    }

    .step.completed .step-circle {
      background: var(--success-500);
      color: #fff;
    }

    .step-label {
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      color: var(--gray-400);
      white-space: nowrap;
    }

    .step.active .step-label { color: var(--brand-600); font-weight: var(--weight-semibold); }
    .step.completed .step-label { color: var(--success-600); }

    .step-line {
      width: 36px;
      height: 2px;
      background: var(--gray-200);
      margin: 0 var(--space-2);
      flex-shrink: 0;
      transition: background var(--transition-base);
    }

    .step-line.completed { background: var(--success-500); }

    @media (max-width: 640px) {
      .step-label { display: none; }
      .step-line { width: 20px; }
      .form-header { padding: var(--space-8) var(--space-6) var(--space-4); }
      .steps-indicator { padding: var(--space-3) var(--space-6) var(--space-5); }
    }

    .inscription-form {
      padding: var(--space-2) var(--space-8) var(--space-8);
    }

    .step-content {
      min-height: 200px;
    }

    .step-title {
      font-size: 1.125rem;
      font-weight: var(--weight-semibold);
      color: var(--gray-900);
      margin: 0 0 var(--space-1);
    }

    .step-desc {
      font-size: var(--text-sm);
      color: var(--gray-500);
      margin: 0 0 var(--space-6);
    }

    .form-group {
      margin-bottom: var(--space-5);
    }

    .form-label {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--gray-700);
      margin-bottom: var(--space-2);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.75rem 0.875rem;
      font-size: var(--text-base);
      color: var(--gray-900);
      background: #fff;
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-lg);
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
      font-family: inherit;
    }

    .form-input:focus,
    .form-textarea:focus {
      border-color: var(--brand-500);
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      background: #fff;
    }

    .form-input::placeholder,
    .form-textarea::placeholder {
      color: var(--gray-400);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-5);
    }

    @media (min-width: 640px) {
      .form-row { grid-template-columns: 1fr 1fr; }
    }

    .category-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
    }

    .category-card {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-4) var(--space-4);
      border: 2px solid var(--gray-200);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);
      background: #fff;
    }

    .category-card input { display: none; }

    .category-card:hover {
      border-color: var(--gray-300);
      background: var(--gray-50);
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }

    .category-card.selected {
      border-color: var(--brand-500);
      background: var(--brand-50);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .category-icon-music { background: rgba(99, 102, 241, 0.1); color: var(--brand-600); }
    .category-icon-dance { background: rgba(245, 158, 11, 0.1); color: var(--warning-600); }
    .category-card.selected .category-icon-music { background: var(--brand-600); color: #fff; }
    .category-card.selected .category-icon-dance { background: var(--warning-600); color: #fff; }

    .category-name {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--gray-900);
    }

    .category-desc {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-500);
    }

    .subcategory-grid {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2);
    }

    .subcategory-chip {
      display: inline-flex;
      align-items: center;
      padding: 10px var(--space-4);
      border: 1.5px solid var(--gray-200);
      border-radius: var(--radius-full);
      font-size: var(--text-sm);
      color: var(--gray-600);
      cursor: pointer;
      transition: all var(--transition-fast);
      background: #fff;
    }

    .subcategory-chip input { display: none; }

    .subcategory-chip:hover {
      border-color: var(--gray-400);
      background: var(--gray-50);
    }

    .subcategory-chip.selected {
      border-color: var(--brand-500);
      background: var(--brand-50);
      color: var(--brand-700);
      font-weight: var(--weight-medium);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }

    .form-hint {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-400);
      margin-top: var(--space-2);
    }

    .review-section {
      margin-bottom: var(--space-5);
    }

    .review-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-3);
    }

    .review-header h3 {
      font-size: var(--text-sm);
      font-weight: var(--weight-semibold);
      color: var(--gray-900);
    }

    .btn-edit {
      font-size: var(--text-xs);
      color: var(--brand-600);
      background: none;
      border: none;
      cursor: pointer;
      font-weight: var(--weight-medium);
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }
    .btn-edit:hover { background: var(--brand-50); }

    .review-grid {
      background: var(--gray-50);
      border-radius: var(--radius-lg);
      padding: var(--space-4) var(--space-5);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .review-item.full-width {
      grid-column: 1 / -1;
    }

    .review-label {
      display: block;
      font-size: var(--text-xs);
      color: var(--gray-500);
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .review-value {
      display: block;
      font-size: var(--text-sm);
      font-weight: var(--weight-medium);
      color: var(--gray-900);
    }

    .terms-check {
      margin-top: var(--space-6);
      padding-top: var(--space-5);
      border-top: 1px solid var(--gray-200);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      font-size: var(--text-sm);
      color: var(--gray-600);
      cursor: pointer;
      padding: var(--space-2) 0;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--brand-600);
      flex-shrink: 0;
    }

    .form-actions {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      margin-top: var(--space-8);
      padding-top: var(--space-6);
      border-top: 1px solid var(--gray-100);
    }

    .spacer { flex: 1; }

    .form-error {
      color: var(--danger-600);
      font-size: var(--text-sm);
    }

    .constancia-page {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: var(--space-10) var(--space-4);
      min-height: 100vh;
    }

    .constancia-card {
      width: 100%;
      max-width: 640px;
      background: #fff;
      border-radius: var(--radius-xl);
      box-shadow: 0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.06);
      border: 1px solid var(--gray-200);
      padding: var(--space-10);
    }

    .constancia-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-6);
    }

    .constancia-logo-img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 50%;
    }

    .constancia-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      background: var(--success-50);
      color: var(--success-600);
      border-radius: var(--radius-full);
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
    }

    .constancia-title {
      font-size: var(--text-xl);
      font-weight: var(--weight-bold);
      color: var(--gray-900);
      text-align: center;
      margin-bottom: var(--space-6);
      padding-bottom: var(--space-4);
      border-bottom: 2px solid var(--gray-100);
    }

    .constancia-body {
      padding: var(--space-4) 0;
    }

    .constancia-field {
      margin-bottom: var(--space-3);
    }

    .constancia-label {
      display: block;
      font-size: var(--text-xs);
      font-weight: var(--weight-medium);
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 2px;
    }

    .constancia-value {
      display: block;
      font-size: var(--text-sm);
      color: var(--gray-900);
      font-weight: var(--weight-medium);
    }

    .constancia-id {
      font-family: monospace;
      font-size: var(--text-xs);
      color: var(--brand-600);
      background: var(--brand-50);
      padding: 2px 8px;
      border-radius: var(--radius-sm);
      display: inline-block;
    }

    .constancia-category {
      font-weight: var(--weight-semibold);
      color: var(--brand-600);
    }

    .constancia-status {
      color: var(--warning-600);
    }

    .constancia-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-4);
    }

    .constancia-divider {
      height: 1px;
      background: var(--gray-100);
      margin: var(--space-4) 0;
    }

    .constancia-note {
      display: flex;
      gap: var(--space-2);
      align-items: flex-start;
      background: var(--info-50);
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-lg);
      margin-top: var(--space-4);
      color: var(--info-600);
    }

    .constancia-note svg {
      flex-shrink: 0;
      margin-top: 2px;
    }

    .constancia-note p {
      font-size: var(--text-xs);
      color: var(--gray-600);
      margin: 0;
      line-height: 1.5;
    }

    .constancia-footer {
      display: flex;
      justify-content: center;
      gap: var(--space-3);
      margin-top: var(--space-6);
      padding-top: var(--space-4);
      border-top: 2px solid var(--gray-100);
    }

    @media print {
      body * { visibility: hidden; }
      #constancia, #constancia * { visibility: visible; }
      #constancia {
        position: absolute;
        left: 0; top: 0;
        width: 100%;
        padding: 40px;
        background: #fff;
      }
      .constancia-footer { display: none; }
      .constancia-badge { border: 1px solid var(--success-600); }
    }

    .nav-logo {
      height: 28px;
      width: auto;
    }

    .success-content {
      text-align: center;
      padding: var(--space-8) 0;
    }

    .success-icon {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-full);
      background: var(--success-50);
      color: var(--success-600);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--space-4);
    }

    .success-content h2 {
      font-size: var(--text-xl);
      color: var(--gray-900);
      margin-bottom: var(--space-2);
    }

    .success-content p {
      color: var(--gray-500);
      margin-bottom: var(--space-6);
      max-width: 360px;
      margin-left: auto;
      margin-right: auto;
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-lg { padding: 0.75rem 2rem; font-size: var(--text-base); }

    .btn-primary {
      background: var(--brand-600);
      color: #fff;
    }
    .btn-primary:hover:not(:disabled) { background: var(--brand-700); }

    .btn-secondary {
      background: var(--gray-100);
      color: var(--gray-700);
    }
    .btn-secondary:hover { background: var(--gray-200); }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }

    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in { animation: scaleIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

    @media (max-width: 640px) {
      .social-section {
        flex-direction: column;
        width: 100%;
      }

      .social-link {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class InscripcionPageComponent {
  private http = inject(HttpClient);

  currentStep = signal(1);
  submitted = signal(false);
  submitting = signal(false);
  error = signal('');
  inscriptionResult = signal<InscripcionResult | null>(null);
  acceptedTerms = false;

  steps = [
    { number: 1, label: 'Datos' },
    { number: 2, label: 'Categoría' },
    { number: 3, label: 'Arte' },
    { number: 4, label: 'Confirmar' },
    { number: 5, label: 'Constancia' },
  ];

  data: InscripcionData = {
    fullName: '',
    email: '',
    phone: '',
    dni: '',
    category: '',
    subcategory: '',
    artisticName: '',
    bio: '',
  };

  private subcategoriesByCategory: Record<string, { id: string; name: string }[]> = {
    musica: [
      { id: 'solista_vocal', name: 'Solista Vocal' },
      { id: 'solista_instrumental', name: 'Solista Instrumental' },
      { id: 'conjunto_instrumental', name: 'Conjunto Instrumental' },
      { id: 'conjunto_vocal', name: 'Conjunto Vocal' },
      { id: 'tema_inedito', name: 'Tema Inédito' },
    ],
    danza: [
      { id: 'malambo_masculino', name: 'Solista de Malambo Masculino' },
      { id: 'malambo_femenino', name: 'Solista de Malambo Femenino' },
      { id: 'pareja_tradicional', name: 'Pareja Tradicional' },
      { id: 'pareja_estilizada', name: 'Pareja Estilizada' },
      { id: 'conjunto_malambo', name: 'Conjunto de Malambo' },
      { id: 'conjunto_baile', name: 'Conjunto de Baile Folclórico' },
    ],
  };

  subcategories = computed(() => this.subcategoriesByCategory[this.data.category] || []);

  subcategoryName = computed(() => {
    const subs = this.subcategoriesByCategory[this.data.category] || [];
    const found = subs.find(s => s.id === this.data.subcategory);
    return found?.name || '';
  });

  onCategoryChange(): void {
    this.data.subcategory = '';
  }

  canProceed(): boolean {
    switch (this.currentStep()) {
      case 1: return !!(this.data.fullName && this.data.email && this.data.phone);
      case 2: return !!(this.data.category && this.data.subcategory);
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  }

  nextStep(): void {
    if (this.canProceed() && this.currentStep() < 4) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  goToStep(step: number): void {
    this.currentStep.set(step);
  }

  getSubcategoryName(id: string): string {
    const all = [
      ...this.subcategoriesByCategory['musica'],
      ...this.subcategoriesByCategory['danza'],
    ];
    return all.find(s => s.id === id)?.name || id;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  printConstancia(): void {
    window.print();
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.acceptedTerms) return;

    this.submitting.set(true);
    this.error.set('');

    const payload = {
      full_name: this.data.fullName,
      stage_name: this.data.artisticName || null,
      email: this.data.email,
      phone: this.data.phone,
      category: this.data.category,
      subcategory: this.data.subcategory,
      dni: this.data.dni || null,
      bio: this.data.bio || null,
    };

    this.http.post<InscripcionResult>('/api/v1/inscriptions/', payload).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.inscriptionResult.set(result);
        this.submitted.set(true);
        this.currentStep.set(5);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.error?.detail || 'Error al enviar la inscripción. Intentá de nuevo.');
      },
    });
  }
}
