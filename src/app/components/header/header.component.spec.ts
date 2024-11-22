import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HeaderComponent } from './header.component'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { LoginService } from '../../core/services/login.service'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>
  let loginService: jasmine.SpyObj<LoginService>

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['logout'])

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should toggle nav class', () => {
    const navElement = document.createElement('nav')
    navElement.classList.add('nav-closed')
    component.toggleNav(navElement)
    expect(navElement.classList.contains('nav-open')).toBeTrue()
    component.toggleNav(navElement)
    expect(navElement.classList.contains('nav-open')).toBeFalse()
  })

  it('should call logout on loginService', () => {
    component.callLogout()
    expect(loginService.logout).toHaveBeenCalled()
  })
})
