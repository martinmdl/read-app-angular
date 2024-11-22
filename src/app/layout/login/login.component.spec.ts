import { ComponentFixture, TestBed } from '@angular/core/testing'
import { LoginComponent } from './login.component'
import { ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LoginService } from '../../core/services/login.service'
import { of } from 'rxjs'
import { ApiResponse } from '../../domain/ApiResponse'

describe('LoginComponent', () => {
  let component: LoginComponent
  let fixture: ComponentFixture<LoginComponent>
  let mockLoginService: jasmine.SpyObj<LoginService>
  let mockRouter: jasmine.SpyObj<Router>

  beforeEach(async () => {
    mockLoginService = jasmine.createSpyObj('LoginService', ['login', 'setUserSession'])
    mockRouter = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: LoginService, useValue: mockLoginService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(LoginComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

    it('should initialize the form with empty fields and validators', () => {
      component.ngOnInit()
      const usernameControl = component.loginForm.get('username')
      const passwordControl = component.loginForm.get('password')

      expect(usernameControl?.value).toBe('')
      expect(passwordControl?.value).toBe('')

      expect(usernameControl?.hasValidator(Validators.required)).toBeTrue()
      expect(passwordControl?.hasValidator(Validators.required)).toBeTrue()
    })

    it('should return an error for special characters in username', () => {
      const usernameControl = component.loginForm.get('username')
      usernameControl?.setValue('user@name')
      fixture.detectChanges()

      expect(usernameControl?.hasError('specialChars')).toBeTrue()
    })

    it('should return required error if password is empty', () => {
      const passwordControl = component.loginForm.get('password')
      passwordControl?.setValue('')
      fixture.detectChanges()

      expect(passwordControl?.hasError('required')).toBeTrue()
    })

    it('should toggle showPassword boolean', () => {
      component.showPassword = false
      component.switchPasswordVisibility()

      expect(component.showPassword).toBeTrue()

      component.switchPasswordVisibility()
      expect(component.showPassword).toBeFalse()
    })

    it('should call loginService with the correct credentials on form submit', () => {
      const mockResponse: ApiResponse = { token: 'fakeToken' }
      mockLoginService.login.and.returnValue(of(mockResponse))

      component.loginForm.get('username')?.setValue('validUser')
      component.loginForm.get('password')?.setValue('validPassword')

      component.onSubmit()

      expect(mockLoginService.login).toHaveBeenCalledWith('validUser', 'validPassword')
      expect(mockLoginService.setUserSession).toHaveBeenCalledWith('fakeToken')
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/busqueda-principal'])
    })

    it('should set loginError to true on failed login', () => {
      const mockResponse: ApiResponse = { token: '' }
      mockLoginService.login.and.returnValue(of(mockResponse))

      component.loginForm.get('username')?.setValue('invalidUser')
      component.loginForm.get('password')?.setValue('invalidPassword')

      component.onSubmit()

      expect(component.getLoginStatus()).toBeTrue()
    })

    it('should not submit the form if it is invalid', () => {
      component.loginForm.get('username')?.setValue('')
      component.loginForm.get('password')?.setValue('')

      component.onSubmit()

      expect(mockLoginService.login).not.toHaveBeenCalled()
      expect(component.getLoginStatus()).toBeFalse()
    })

    it('should return true if username or password has errors', () => {
      component.loginForm.get('username')?.setValue('')
      component.loginForm.get('password')?.setValue('')

      expect(component.getLoginValidation()).toBeTrue()
    })

    it('should return false if no validation errors exist', () => {
      component.loginForm.get('username')?.setValue('validUser')
      component.loginForm.get('password')?.setValue('validPassword')

      expect(component.getLoginValidation()).toBeFalse()
    })

    it('should return true if password is required and touched', () => {
      const passwordControl = component.loginForm.get('password')
      passwordControl?.markAsTouched()
      passwordControl?.setValue('')

      expect(component.getPasswordValidation()).toBeTrue()
    })

    it('should return false if password is not required or not touched', () => {
      const passwordControl = component.loginForm.get('password')
      passwordControl?.setValue('validPassword')

      expect(component.getPasswordValidation()).toBeFalse()
    })
  })