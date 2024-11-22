import { TestBed, ComponentFixture, waitForAsync, fakeAsync, tick } from '@angular/core/testing'
import { AmigosUsuarioComponent } from './user-friends.component'
import { AmigosUsuarioService } from '../../core/services/userFriends.service'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { CommonModule } from '@angular/common'
import { FriendDTO } from '../../domain/Friend'
import Swal from 'sweetalert2'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'

describe('AmigosUsuarioComponent', () => {
  let component: AmigosUsuarioComponent
  let fixture: ComponentFixture<AmigosUsuarioComponent>
  let amigosService: jasmine.SpyObj<AmigosUsuarioService>

  beforeEach(waitForAsync(() => {
    const amigosServiceSpy = jasmine.createSpyObj('AmigosUsuarioService', ['getFriends', 'deleteFriend', 'getUsers', 'addFriend'])

    TestBed.configureTestingModule({
      imports: [AmigosUsuarioComponent, SidebarComponent, CommonModule],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: AmigosUsuarioService, useValue: amigosServiceSpy }
      ]
    }).compileComponents()

    amigosService = TestBed.inject(AmigosUsuarioService) as jasmine.SpyObj<AmigosUsuarioService>
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AmigosUsuarioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize friends list on ngOnInit', async () => {
    const mockFriends: FriendDTO[] = [{
      name: 'string',
      username: 'string',
      id: 1
    }]
    amigosService.getFriends.and.returnValue(Promise.resolve(mockFriends))

    await component.ngOnInit()

    expect(component.friendsList).toEqual(mockFriends)
  })

  it('should delete a friend and update the list', fakeAsync(() => {
    const mockFriend: FriendDTO = {
      name: 'string',
      username: 'string',
      id: 1
    }

    const mockFriends: FriendDTO[] = []

    component.friendsList = [mockFriend]

    amigosService.deleteFriend.and.returnValue(Promise.resolve())

    amigosService.getFriends.and.returnValue(Promise.resolve(mockFriends))

    component.deleteFriend(mockFriend)
    
    tick()

    expect(component.friendsList).toEqual([])
    expect(amigosService.deleteFriend).toHaveBeenCalledWith(mockFriend)
  }))

  it('should show Swal confirmation dialog when deleting a friend', () => {
    const mockFriend: FriendDTO = {
      name: 'string',
      username: 'string',
      id: 1
    }

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }))

    component.deleteFriendSwal(mockFriend)

    expect(Swal.fire).toHaveBeenCalled()
  })

  it('should show Swal with list of users when there are non-friends users', async () => {
    const mockUsers: FriendDTO[] = [{
      name: 'string',
      username: 'string',
      id: 1
    }]
    amigosService.getUsers.and.returnValue(Promise.resolve(mockUsers))
    spyOn(component, 'sweetAlertAddFriends')

    await component.viewUsers()

    expect(component.sweetAlertAddFriends).toHaveBeenCalledWith(mockUsers)
  })

  it('should show Swal info dialog when there are no non-friends users', async () => {
    const mockUsers: FriendDTO[] = []
    amigosService.getUsers.and.returnValue(Promise.resolve(mockUsers))
    spyOn(component, 'alertNoAvailableUsers')

    await component.viewUsers()

    expect(component.alertNoAvailableUsers).toHaveBeenCalled()
  })
})