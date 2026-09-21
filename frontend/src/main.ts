import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/services/auth.interceptor';
import { AuthService } from './app/services/auth.service';
import { AuthGuardService } from './app/guards/auth.guard';
import { RoleGuardService } from './app/guards/role.guard';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthService,
    AuthGuardService,
    RoleGuardService
  ]
}).catch(err => console.error(err));
