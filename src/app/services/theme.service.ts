import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeKey = 'app-theme';
  private _theme$ = new BehaviorSubject<Theme>(this.getStoredTheme());

  get theme$() {
    return this._theme$.asObservable();
  }

  get currentTheme(): Theme {
    return this._theme$.getValue();
  }

  constructor() {
    this.applyTheme(this.getStoredTheme());
  }

  private getStoredTheme(): Theme {
    const stored = localStorage.getItem(this.themeKey);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return 'dark';
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this._theme$.next(theme);
    localStorage.setItem(this.themeKey, theme);
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }
}