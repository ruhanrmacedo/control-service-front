import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verifica se a requisição atual não é para o endpoint de login
    if (!req.url.endsWith('/api/login/efetuarLogin')) {
      const token = localStorage.getItem('token');
    
      if (this.authService.tokenExpirou()) {
        // Utiliza o alert do navegador para avisar o usuário
        alert("Sessão encerrada. Sua sessão expirou!");
        localStorage.removeItem('token'); // Remover o token expirado
        this.router.navigate(['/']); // Redirecionar para homepage
        return next.handle(req); // Você pode optar por cancelar as requisições subsequentes aqui
      }
      
      if (token) {
        const cloned = req.clone({
          headers: req.headers.set("Authorization", "Bearer " + token)
        });
        return next.handle(cloned);
      }
    }
  
    return next.handle(req);
  }
}
