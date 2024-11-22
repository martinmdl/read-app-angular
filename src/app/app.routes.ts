import { Routes } from '@angular/router'
import { InformacionUsuarioComponent } from './layout/profile-information/profile-information.component'
import { AmigosUsuarioComponent } from './layout/user-friends/user-friends.component'
import { LibrosALeerUsuarioComponent } from './layout/user-book-to-read/user-book-to-read.component'
import { LibrosLeidosUsuarioComponent } from './layout/user-book-read/user-book-read.component'
import { RecomendacionesAValorarUsuarioComponent } from './layout/user-recommendation-rating/user-recommendation-rating.component'
import { BusquedaPrincipalComponent } from './layout/recommendation-search/recommendation-search.component'
import { MisRecomendacionesComponent } from './layout/own-recommendation/own-recommendation.component'
import { DetalleRecomendacionComponent } from './layout/recommendation-details/recommendation-details.component'
import { EdicionRecomendacionComponent } from './layout/recommendation-edition/recommendation-edition.component'
import { BusquedaLibrosComponent } from './layout/book-search/book-search.component'
import { LoginComponent } from './layout/login/login.component'
import { PageNotFundComponent } from './page-not-fund/page-not-fund.component'
import { authGuard } from './core/guard/auth.guard'
import { authReturnGuard } from './core/guard/auth-return.guard'
import { PerfilComponent } from './layout/profile/profile.component'

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent, canActivate: [authReturnGuard] },
    {
        path: 'busqueda-principal', component: BusquedaPrincipalComponent,
        canActivate: [authGuard],
        children: [
            { path: 'detalle-recomendacion/:id', component: DetalleRecomendacionComponent },
            { path: 'edicion-recomendacion/:id', component: EdicionRecomendacionComponent },
            { path: 'busqueda-libros', component: BusquedaLibrosComponent },
            { path: 'mis-recomendaciones', component: MisRecomendacionesComponent },
            { path: 'perfil', component: PerfilComponent,
                children: [
                    { path: '', redirectTo: 'informacion', pathMatch: 'full' },
                    {path: 'informacion', component: InformacionUsuarioComponent},
                    {path: 'amigos', component: AmigosUsuarioComponent},
                    {path: 'libros-aleer', component: LibrosALeerUsuarioComponent},
                    {path: 'libros-leidos', component: LibrosLeidosUsuarioComponent},
                    {path: 'recomendaciones-valorar', component: RecomendacionesAValorarUsuarioComponent},
                ]
             }
        ]
    },
    { path: '**', pathMatch: 'full', component: PageNotFundComponent }
]
