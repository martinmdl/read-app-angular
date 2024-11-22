import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ApiResponse } from '../../domain/ApiResponse'
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly requestLogin = "http://localhost:8080/auth/login"

  constructor(private readonly http: HttpClient) {
  }

  login(username: string, password: string): Observable<ApiResponse> {

    const payload = {
      username: username,
      password: password
    }

    return this.http.post<ApiResponse>(this.requestLogin, payload)
  }

  logout() {
    sessionStorage.removeItem('ReadApp')
    window.location.href = '/login'
  }

  setUserSession(token: string) {
    sessionStorage.setItem('ReadApp', token)
  }

}
