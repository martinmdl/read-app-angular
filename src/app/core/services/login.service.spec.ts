import { TestBed } from '@angular/core/testing'
import { LoginService } from './login.service'
import { LoginComponent } from '../../layout/login/login.component'
import { provideHttpClient } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { ApiResponse } from '../../domain/ApiResponse'

describe('LoginService', () => {
    let service: LoginService
    let httpMock: HttpTestingController

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [provideHttpClient(),provideHttpClientTesting(), LoginService]
        })
        service = TestBed.inject(LoginService)
        httpMock = TestBed.inject(HttpTestingController)
    })

    afterEach(() => {
        httpMock.verify()
        TestBed.resetTestingModule()
    })

    it('should be created', () => {
        expect(service).toBeTruthy()
    })

    it('should loggin using the correct payload: "admin", "admin"', () => {
        const dummyPayload = { username: 'admin', password: 'admin' }
        const dummyResponse: ApiResponse = { token: '123456' }

        service.login(dummyPayload.username, dummyPayload.password).subscribe(
            response => {
                expect(response).toEqual(dummyResponse)
            }
        )
        const req = httpMock.expectOne('http://localhost:8080/auth/login')
        expect(req.request.method).toBe('POST')
        expect(req.request.body).toEqual(dummyPayload)
        req.flush(dummyResponse)
    })

    it('should store token in sessionStorage on setUserSession', () => {
        const MockToken = '12345'
        spyOn(sessionStorage,'setItem')
        service.setUserSession(MockToken)
        expect(sessionStorage.setItem).toHaveBeenCalledWith('ReadApp', MockToken)
    })

})
