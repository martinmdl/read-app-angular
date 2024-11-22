import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { lastValueFrom } from 'rxjs'
import { Book } from '../../domain/Book'

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(private readonly httpClient: HttpClient) {}

  async getBooks(): Promise<Book[]> {
    const libros$ = this.httpClient.get<Book[]>(`http://localhost:8080/api/books`)
    return await lastValueFrom(libros$)
  }

  // libros a leer

  async getBooksToRead() : Promise<Book[]> {
    const libros$ = this.httpClient.get<Book[]>(`http://localhost:8080/api/books/to-read`)
    return await lastValueFrom(libros$)
  }

  async addBookToRead(idBook: number) : Promise<void> {
    return await lastValueFrom (this.httpClient.post<void>(`http://localhost:8080/api/book/to-read`, idBook))
  }

  async deleteBookToRead(idLibroAEliminar: number) : Promise<void> {
    await lastValueFrom(this.httpClient.delete(`http://localhost:8080/api/books/to-read/${idLibroAEliminar}`))
  }

  async getBooksToAddToReadingList() : Promise<Book[]> { 
    return await lastValueFrom (this.httpClient.get<Book[]>(`http://localhost:8080/api/books-to-add/to-read`))
  }

  // libros leidos

  async getReadBooks() : Promise<Book[]> {
    const libros$ = this.httpClient.get<Book[]>(`http://localhost:8080/api/books/read`)
    return await lastValueFrom(libros$)
  }

  async addReadBook(idBook: number) : Promise<void> {
    return await lastValueFrom (this.httpClient.post<void>(`http://localhost:8080/api/books/read`, idBook))
  }

  async deleteReadBook(idLibroAEliminar: number) : Promise<void> {
    await lastValueFrom(this.httpClient.delete(`http://localhost:8080/api/books/read/${idLibroAEliminar}`))
  }

  async getBooksToAddToReadList() : Promise<Book[]> {
    return await lastValueFrom(this.httpClient.get<Book[]>(`http://localhost:8080/api/books-to-add/read`))
  }

  // libros recomendacion

  async getBooksInRecommendation(idReco: number) : Promise<Book[]> {
    return await lastValueFrom(this.httpClient.get<Book[]>(`http://localhost:8080/api/books-to-add-in-recommendation/${idReco}`))
  }

  async addBookInRecommendation(idReco: number, idBook: number) : Promise<void> {
    return await lastValueFrom (this.httpClient.post<void>(`http://localhost:8080/api/add-book-in-recommendation`, {idReco, idBook}))
  }

  async deleteBookInRecommendation(idReco: number, idBook: number) : Promise<void> {
    await lastValueFrom(this.httpClient.delete(`http://localhost:8080/api/delete-book-in-recommendation/${idReco}/${idBook}`))
  }

}