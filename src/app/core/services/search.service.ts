import { Injectable } from '@angular/core'
import { RecommendationDTO } from '../../domain/Recommendation'
import { Book } from '../../domain/Book'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(private readonly http: HttpClient) { }

  filterRecommendations(data: { searchValue: string, privateCheck: boolean | null}): Observable<RecommendationDTO[]> {
    return this.http.post<RecommendationDTO[]>('http://localhost:8080/api/filterRecommendation',data)
  }

  filterbook(data: { searchValue: string, privateCheck: boolean | null}): Observable<Book[]> {
    return this.http.post<Book[]>('http://localhost:8080/api/filterBook',data)
  }
}
