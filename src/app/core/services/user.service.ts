import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { UserDTO } from '../../domain/User'
import { lastValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class UserService {

    constructor(private readonly httpClient: HttpClient) { }

    async getInfoUser(): Promise<UserDTO>{
        const user$ = this.httpClient.get<UserDTO>('http://localhost:8080/api/user')
        return await lastValueFrom(user$)
    }

    async updateUser(updatedUser: UserDTO): Promise<UserDTO> {
        const updatedUser$ = this.httpClient.put<UserDTO>('http://localhost:8080/api/user', updatedUser)
        return await lastValueFrom(updatedUser$)
    }
}
