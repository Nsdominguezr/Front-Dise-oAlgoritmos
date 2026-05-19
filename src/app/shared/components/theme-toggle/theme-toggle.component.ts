import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="theme-toggle"
      (click)="toggleTheme()"
      [title]="themeService.currentTheme === 'dark' ? 'Cambiar a modo día' : 'Cambiar a modo noche'"
      [class.dark]="themeService.currentTheme === 'dark'"
      [class.light]="themeService.currentTheme === 'light'"
    >
      <div class="toggle-track">
        <div class="toggle-thumb">
          <span class="icon sun">☀️</span>
          <span class="icon moon">🌙</span>
        </div>
      </div>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .toggle-track {
      width: 64px;
      height: 32px;
      border-radius: 16px;
      position: relative;
      transition: background 0.4s ease;
      border: 2px solid var(--toggle-border);
    }

    .toggle-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55),
                  background 0.4s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--toggle-thumb-bg);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .icon {
      position: absolute;
      font-size: 14px;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .sun {
      opacity: 0;
      transform: scale(0.5) rotate(-90deg);
    }

    .moon {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    /* Dark theme (default) */
    :host-context([data-theme="dark"]) .toggle-track,
    .dark .toggle-track {
      background: var(--surface);
      border-color: var(--border);
    }

    :host-context([data-theme="dark"]) .sun,
    .dark .sun {
      opacity: 0;
    }

    :host-context([data-theme="dark"]) .moon,
    .dark .moon {
      opacity: 1;
    }

    /* Light theme */
    :host-context([data-theme="light"]) .toggle-track,
    .light .toggle-track {
      background: var(--surface);
      border-color: var(--border);
    }

    :host-context([data-theme="light"]) .toggle-thumb,
    .light .toggle-thumb {
      transform: translateX(32px);
    }

    :host-context([data-theme="light"]) .sun,
    .light .sun {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    :host-context([data-theme="light"]) .moon,
    .light .moon {
      opacity: 0;
      transform: scale(0.5) rotate(90deg);
    }

    .theme-toggle:hover .toggle-thumb {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  constructor(public themeService: ThemeService) {}

  ngOnInit(): void {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}