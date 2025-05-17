// biome-ignore lint/style/useImportType: <explanation>
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      // Aquí puedes agregar interceptors si los necesitas
      // withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      SweetAlert2Module.forRoot() // Solo SweetAlert2
    ),
    provideAnimations(),
    provideClientHydration(withEventReplay())
  ]
};
