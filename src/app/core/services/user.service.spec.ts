import { fakeAsync, TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { UserService } from './user.service'
import { UserDTO } from '../../domain/User'
import { provideHttpClient } from '@angular/common/http'

describe('UserService', () => {
  let service: UserService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), provideHttpClientTesting(), UserService]
    })
    service = TestBed.inject(UserService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should fetch user info', fakeAsync(() => {
    const mockUser: UserDTO = {
      name: 'string',
      lastName: 'string',
      username: 'string',
      dateOfBirth: new Date(),
      mail: 'string',
      wordsPerMinutes: 123,
      typeOfReader: 'string',
      searchCriteria: 'string',
      minRange: 213,
      maxRange: 312
    }

    service.getInfoUser().then(user => {
      expect(user).toEqual(mockUser)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/user')
    expect(req.request.method).toBe('GET')
    req.flush(mockUser)
  }))

  it('should update user info', fakeAsync(() => {
    const updatedUser: UserDTO = {
      name: 'string',
      lastName: 'string',
      username: 'string',
      dateOfBirth: new Date(),
      mail: 'string',
      wordsPerMinutes: 123,
      typeOfReader: 'string',
      searchCriteria: 'string',
      minRange: 213,
      maxRange: 312
    }

    service.updateUser(updatedUser).then(user => {
      expect(user).toEqual(updatedUser)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/user')
    expect(req.request.method).toBe('PUT')
    expect(req.request.body).toEqual(updatedUser)
    req.flush(updatedUser)
  }))
})
