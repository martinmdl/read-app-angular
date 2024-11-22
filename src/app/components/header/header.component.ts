import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { LoginService } from '../../core/services/login.service'


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

constructor(private loginService: LoginService) { }

    toggleNav(nav: HTMLElement): void {
        nav.classList.toggle('nav-open')
    }

    callLogout(): void {
        this.loginService.logout()
    }
  
}
