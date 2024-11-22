import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { FriendDTO } from '../../domain/Friend'
@Injectable({
  providedIn: 'root'
})

export class AmigosUsuarioService {

    private realList: FriendDTO[] = []

    constructor(private readonly httpClient: HttpClient) { }

    // Obtener la lista de amigos desde el backend
    async getFriends(): Promise<FriendDTO[]> {
        return await lastValueFrom(this.httpClient.get<FriendDTO[]>(`http://localhost:8080/api/friends`))
    }

    async deleteFriend(friend: FriendDTO): Promise<void> {
        await lastValueFrom(this.httpClient.delete(`http://localhost:8080/api/friends/${friend.id}`))
    }

    async getUsers(): Promise<FriendDTO[]> {
        return lastValueFrom(this.httpClient.get<FriendDTO[]>(`http://localhost:8080/api/users`)) 
    }

    async addFriend(friend: FriendDTO): Promise<FriendDTO>{
        return lastValueFrom(this.httpClient.post<FriendDTO>(`http://localhost:8080/api/friends`, friend.id))
    }

}

