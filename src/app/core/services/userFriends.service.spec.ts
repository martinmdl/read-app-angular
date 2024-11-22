import { TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { AmigosUsuarioService } from './userFriends.service'
import { FriendDTO } from '../../domain/Friend'
import { provideHttpClient } from '@angular/common/http'

describe('AmigosUsuarioService', () => {
  let service: AmigosUsuarioService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), AmigosUsuarioService]
    })
    service = TestBed.inject(AmigosUsuarioService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should retrieve friends from the API via GET', async () => {
    const dummyFriends: FriendDTO[] = [
      {
        name: 'string',
        username: 'string',
        id: 1
      },
      {
        name: 'string',
        username: 'string',
        id: 2
      }
    ]

    service.getFriends().then(friends => {
      expect(friends.length).toBe(2)
      expect(friends).toEqual(dummyFriends)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/friends')
    expect(req.request.method).toBe('GET')
    req.flush(dummyFriends)
  })

  it('should delete a friend from the API via DELETE', async () => {
    const dummyFriend: FriendDTO = {
      name: 'string',
      username: 'string',
      id: 2
    }

    service.deleteFriend(dummyFriend).then(() => {
    })

    const req = httpMock.expectOne(`http://localhost:8080/api/friends/${dummyFriend.id}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({})
  })

  it('should retrieve users from the API via GET', async () => {
    const dummyUsers: FriendDTO[] = [
      {
        name: 'string',
        username: 'string',
        id: 1
      },
      {
        name: 'string',
        username: 'string',
        id: 2
      }
    ]

    service.getUsers().then(users => {
      expect(users.length).toBe(2)
      expect(users).toEqual(dummyUsers)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/users')
    expect(req.request.method).toBe('GET')
    req.flush(dummyUsers)
  })

  it('should add a friend via POST', async () => {
    const newFriend: FriendDTO = {
      name: 'string',
      username: 'string',
      id: 3
    }

    service.addFriend(newFriend).then(friend => {
      expect(friend).toEqual(newFriend)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/friends')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(newFriend.id)
    req.flush(newFriend)
  })
})