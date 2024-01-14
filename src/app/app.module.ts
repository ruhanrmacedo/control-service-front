import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { BannerComponent } from './shared/banner/banner.component';
import { CardComponent } from './shared/card/card.component';
import { HomeComponent } from './pages/home/home.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ContainerComponent } from './shared/container/container.component';
import { CardServicosComponent } from './shared/card-servicos/card-servicos.component';
import { MatButtonModule } from '@angular/material/button'; 
import { MatCardModule } from '@angular/material/card';
import { CardTecnicoComponent } from './shared/card-tecnico/card-tecnico.component';
import { CardCadastroServicosComponent } from './shared/card-cadastro-servicos/card-cadastro-servicos.component';
import { ModalLoginComponent } from './shared/modal/header/modal-login/modal-login.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalUsuarioComponent } from './shared/modal/header/modal-usuario/modal-usuario.component';
import { CardPainelComponent } from './shared/card-painel/card-painel.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ModalEdicaoComponent } from './shared/modal/perfil/modal-edicao/modal-edicao.component'; 


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BannerComponent,
    CardComponent,
    HomeComponent,
    ContainerComponent,
    CardServicosComponent,
    CardTecnicoComponent,
    CardCadastroServicosComponent,
    ModalLoginComponent,
    ModalUsuarioComponent,
    CardPainelComponent,
    PerfilComponent,
    ModalEdicaoComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    HttpClientModule,
    MatMenuModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
