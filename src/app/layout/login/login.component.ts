import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormGroup, ReactiveFormsModule, FormControl, Validators, AbstractControl, ValidationErrors} from '@angular/forms'
import { LoginService } from '../../core/services/login.service'
import { Router } from '@angular/router'
import { ApiResponse } from '../../domain/ApiResponse'
import { ValidationFieldComponent } from "../../components/validation-field/validation-field.component"

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ValidationFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  currentSvg: string = '/icons/book-bookmark-big.svg'
  loginForm!: FormGroup
  showPassword: boolean = false
  private loginError: boolean = false
  private credential: { username: string, password: string } = {
    "username": '',
    "password": ''
  }

  usernameErrorMessages = {
    required: 'Debe ingresarse un nombre de usuario.',
    specialChars: 'No se permiten caracteres especiales'
  }

  passwordErrorMessages = {
    required: 'Debe ingresarse una contraseña.'
  }

  constructor(private readonly loginService: LoginService, private readonly router: Router) { }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, this.noSpecialChar]),
      password: new FormControl('', Validators.required)
    })

    this.loginForm.valueChanges.subscribe((value) => {
      this.credential.username = value.username
      this.credential.password = value.password
    })
  }
  
  noSpecialChar(input: AbstractControl): ValidationErrors | null {
    const hasSpecialChars = /[^a-zA-Z0-9]/.test(input.value)
    return hasSpecialChars ? { specialChars: true } : null
  }
  
  switchPasswordVisibility(): void {
    this.showPassword = !this.showPassword
  }
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginService.login(this.credential.username, this.credential.password).subscribe(((response: ApiResponse) => {
        if (response.token!=='') {
          console.log('Login success')
          this.loginError = false
          this.loginService.setUserSession(response.token)
          // this.loginService.setUserInfoSession(response.user.recomendacionesPorValorar || [])
          this.router.navigate(['/busqueda-principal'])
        } else {
          this.loginError = true
          console.log('Login failed')
        }
      }))
    } else {
      console.log('Invalid form')
    }
  }

  getLoginStatus(): boolean {
    return this.loginError
  }

  getLoginValidation(): boolean {
    const usernameErrors = this.loginForm.get('username')?.errors
    const passwordErrors = this.loginForm.get('password')?.errors
    return !!usernameErrors || !!passwordErrors
  }

  getPasswordValidation(): boolean { 
    const passwordErrorsRequiered = this.loginForm.get('password')?.hasError('required')
    const passwordTouched = this.loginForm.get('password')?.touched
    return !!passwordErrorsRequiered && !!passwordTouched
  }


}