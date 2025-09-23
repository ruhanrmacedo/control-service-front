import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1) Deixe o preflight passar direto
    if (req.method === 'OPTIONS') {
      return next.handle(req);
    }

    // 2) Se a URL é relativa (começa com /), prefixe com a base da API
    let url = req.url;
    if (url.startsWith('/')) {
      url = `${environment.apiUrl}${url}`;
    }

    // 3) Não adiciona Authorization no endpoint de login
    const isLoginEndpoint =
      url.includes('/api/login/efetuarLogin'); // funciona p/ relativa ou absoluta

    // 4) Se não for login, injete o token (se ainda válido)
    let request = req.clone({ url });

    if (!isLoginEndpoint) {
      const token = localStorage.getItem('token');

      if (this.authService.tokenExpirou()) {
        alert('Sessão encerrada. Sua sessão expirou!');
        localStorage.removeItem('token');
        this.router.navigate(['/']);
        return next.handle(request);
      }

      if (token) {
        request = request.clone({
          headers: (request.headers || new HttpHeaders()).set('Authorization', `Bearer ${token}`)
        });
      }
    }

    return next.handle(request);
  }
}
