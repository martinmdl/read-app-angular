import { Component } from '@angular/core'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { AmigosUsuarioService} from '../../core/services/userFriends.service'
import { CommonModule } from '@angular/common'
import { FriendDTO } from '../../domain/Friend'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-amigos-usuario',
  standalone: true,
  imports: [SidebarComponent, CommonModule],
  templateUrl: './user-friends.component.html',
  styleUrl: './user-friends.component.scss'
})
export class AmigosUsuarioComponent {

  friendsList: FriendDTO[] = []  

  constructor(public amigosService: AmigosUsuarioService) {}

  async ngOnInit() {
    await this.updateFriendList()
  }

  deleteFriendSwal(friend: FriendDTO) {
    Swal.fire({
      title: `¿Deseas eliminar a ${friend.name} de tu lista de amigos?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      confirmButtonColor: '#f00',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then( async (result) => {
      if (result.isConfirmed) {
        await this.deleteFriend(friend)
        Swal.fire({
          position: "center",
          icon: "success",
          title: 'Amigo eliminado existosamente!',
          showConfirmButton: false,
          timer: 1200
      })
      } 
    })
  }

  async deleteFriend(friendToEliminate: FriendDTO) {
    await this.amigosService.deleteFriend(friendToEliminate)
    await this.updateFriendList()
  }

  async viewUsers(){
    const usersNonFriends = await this.amigosService.getUsers()
    
    if(this.hasNonFriendsUsers(usersNonFriends)){
      this.sweetAlertAddFriends(usersNonFriends)
    }else{
      this.alertNoAvailableUsers()
    }
  }

  hasNonFriendsUsers(usersNonFriends: FriendDTO[]){
    return usersNonFriends.length > 0
  }

  sweetAlertAddFriends(addableUsers: FriendDTO[]){
    Swal.fire({
      title: 'Lista de Usuarios',
      html: 
      `<ul style="display: flex; flex-direction: column; gap: 1rem">
         ${addableUsers.map(
          user => 
          `<li>
            <button style="font-size: 1rem; cursor: pointer; width: 50%; height: 2rem" id="${user.id}">
              ${user.name}
            </button>
          </li>`).join('')
        }
      </ul>`,  
      showCloseButton: true,
      confirmButtonColor: '#5EADE1',
      confirmButtonText: 'Cerrar',
      didOpen: () => {
        addableUsers.forEach(user => {
          const button = document.getElementById(`${user.id}`)
          if (button) {
            button.addEventListener('click', () => {
              this.addFriend(user)
              button.parentElement?.remove() //Elimina en el swal el boton del usuario en el momento que se toca 
            })
          }
        })
      }
    })
  }

  alertNoAvailableUsers(){
    Swal.fire({
      title: 'No hay más usuarios',
      text: 'Todos los usuarios ya están en tu lista de amigos.',
      icon: 'info',
      confirmButtonColor: '#5EADE1',
    })
  }

  async addFriend(friend: FriendDTO){
    await this.amigosService.addFriend(friend)
    await this.updateFriendList()
    Swal.fire({
      position: "center",
      icon: "success",
      title: 'Amigo agregado exitosamente!',
      showConfirmButton: false,
      timer: 1200
    })
  }

  async updateFriendList() {
    this.friendsList = await this.amigosService.getFriends()
  }

}
