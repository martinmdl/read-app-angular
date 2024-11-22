import { Injectable } from '@angular/core'
import { RecommendationDetailsDTO, RecommendationDTO } from '../../domain/Recommendation'
import { HttpClient } from '@angular/common/http'
import { Observable, lastValueFrom } from 'rxjs'
import { NewValorationDTO } from '../../domain/Rating'

@Injectable({
    providedIn: 'root'
})
export class RecommendationService {
    private readonly apiUrl = ''

    constructor(private readonly http: HttpClient) { }

    getRecommendationById(id: number): Observable<RecommendationDTO> {
        return this.http.get<RecommendationDTO>(
            `http://localhost:8080/api/RecommendationById/${id}`
        )
    }

    getRecommendationsDetails(id: number): Observable<RecommendationDetailsDTO> {
        return this.http.get<RecommendationDetailsDTO>(
            `http://localhost:8080/api/recommendationDetails/${id}`
        )
    }

    getOwnRecommendations(): Observable<RecommendationDTO[]> {
        return this.http.get<RecommendationDTO[]>(
            'http://localhost:8080/api/ownRecommendations'
        )
    }

    getAllRecommendations(): Observable<RecommendationDTO[]> {
        return this.http.get<RecommendationDTO[]>(
            'http://localhost:8080/api/allRecommendations'
        )
    }

    async deleteRecommendation(id: number): Promise<void> {
        try {
            await lastValueFrom(
                this.http.delete<void>(`http://localhost:8080/api/deleteRecommendations/${id}`)
            )
        } catch (error) {
            console.error('Error occurred: ', error)
        }
    }


    updateRecomendation(recomendation: RecommendationDTO) {
        this.http.put<RecommendationDTO[]>('http://localhost:8080/api/updateRecommendations', recomendation)
    }

    async addRecommendation(id: number): Promise<void> {
        try {
            await lastValueFrom(
                this.http.post<void>(`http://localhost:8080/api/addRecommendationToValorate/${id}`, null)
            )
        } catch (error) {
            console.error('Error occurred: ', error)
        }
    }

    async getRecommendationsToValorate(): Promise<RecommendationDTO[]> {
        try {
            return await lastValueFrom(
                this.http.get<RecommendationDTO[]>(
                    'http://localhost:8080/api/getRecommendationsToValorate'
                )
            )
        } catch (error) {
            console.error('Error occurred: ', error)
            return []
        }
    }

    async deleteRecommendationToValorate(id: number): Promise<void> {
        try {
            await lastValueFrom(
                this.http.put<void>(
                    `http://localhost:8080/api/deleteRecommendationToValorate`, id)
            )
        } catch (error) {
            console.error('Error occurred: ', error)
        }
    }

    async getRecommendationfavoriteStatus(id: number): Promise<boolean> {
        try {
            const response = await lastValueFrom(
                this.http.get<boolean>(
                    `http://localhost:8080/api/favoriteRecommendationStatus/${id}`
                )
            )
            return response
        } catch (error) {
            console.error('Error occurred: ', error)
        }
        return false
    }

    async putRecommendationEdition(id: number, recommendation: RecommendationDetailsDTO): Promise<void> {
        return await lastValueFrom(this.http.put<void>(`http://localhost:8080/api/recommendationEdition/${id}`, recommendation))
    }

    async createValoration(idRecomendation: number, rating: NewValorationDTO): Promise<void> {
        return await lastValueFrom(this.http.post<void>(`http://localhost:8080/api/valoration/${idRecomendation}`, rating))
    }

}
