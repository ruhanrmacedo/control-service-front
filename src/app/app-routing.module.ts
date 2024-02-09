import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { RegistrarServicosComponent } from './pages/registrar-servicos/registrar-servicos.component';
import { ServicoComponent } from './pages/servico/servico.component';
import { TecnicoComponent } from './pages/tecnico/tecnico.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'tecnico',
    component: TecnicoComponent
  },
  {
    path: 'servico',
    component: ServicoComponent
  },
  {
    path: 'registrar-servicos',
    component: RegistrarServicosComponent
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
