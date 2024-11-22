import { Component } from '@angular/core'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class PerfilComponent {

}
