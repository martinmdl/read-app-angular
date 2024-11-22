import { fakeAsync, TestBed } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { BookService } from './book.service'
import { Book } from '../../domain/Book'
import { Lenguaje } from '../../domain/Language'
import { provideHttpClient } from '@angular/common/http'

describe('BookService', () => {
  let service: BookService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [provideHttpClient(), BookService, provideHttpClientTesting()],
    })
    service = TestBed.inject(BookService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should fetch books', fakeAsync( () => {
    const dummyBooks: Book[] = [{ 
      id: 1 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA],
      weekSales: 153
     }, {       
      id: 2 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA, Lenguaje.ko_KR],
      weekSales: 153 }]

    service.getBooks().then(books => {
      expect(books.length).toBe(2)
      expect(books).toEqual(dummyBooks)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/books')
    expect(req.request.method).toBe('GET')
    req.flush(dummyBooks)
  }))

  it('should fetch books to add', fakeAsync( () => {
    const dummyBooks: Book[] = [{ 
      id: 1 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA],
      weekSales: 153
     }, {       
      id: 2 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA, Lenguaje.ko_KR],
      weekSales: 153 }]
    service.getBooksToAddToReadingList().then(books => {
      expect(books.length).toBe(2)
      expect(books).toEqual(dummyBooks)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/books-to-add/to-read')
    expect(req.request.method).toBe('GET')
    req.flush(dummyBooks)
  }))

  it('should fetch books to read', fakeAsync( () => {
    const dummyBooks: Book[] = [{ 
      id: 1 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA],
      weekSales: 153
     }, {       
      id: 2 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA, Lenguaje.ko_KR],
      weekSales: 153 }]

    service.getBooksToRead().then(books => {
      expect(books.length).toBe(2)
      expect(books).toEqual(dummyBooks)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/books/to-read')
    expect(req.request.method).toBe('GET')
    req.flush(dummyBooks)
  }))

  it('should add a book to read', fakeAsync( () => {
    const idBook = 1

    service.addBookToRead(idBook).then(() => {
      expect(true).toBe(true)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/book/to-read')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toBe(idBook)
    req.flush({})
  }))

  it('should delete a book to read', fakeAsync( () => {
    const idLibroAEliminar = 1

    service.deleteBookToRead(idLibroAEliminar).then(() => {
      expect(true).toBe(true)
    })

    const req = httpMock.expectOne(`http://localhost:8080/api/books/to-read/${idLibroAEliminar}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({})
  }))

  it('should fetch read books', fakeAsync( () => {
    const dummyBooks: Book[] = [{ 
      id: 1 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA],
      weekSales: 153
     }, {       
      id: 2 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA, Lenguaje.ko_KR],
      weekSales: 153 }]

    service.getReadBooks().then(books => {
      expect(books.length).toBe(2)
      expect(books).toEqual(dummyBooks)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/books/read')
    expect(req.request.method).toBe('GET')
    req.flush(dummyBooks)
  }))

  it('should add a read book', fakeAsync( () => {
    const idBook = 1

    service.addReadBook(idBook).then(() => {
      expect(true).toBe(true)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/books/read')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toBe(idBook)
    req.flush({})
  }))

  it('should delete a read book', fakeAsync( () => {
    const idLibroAEliminar = 1

    service.deleteReadBook(idLibroAEliminar).then(() => {
      expect(true).toBe(true)
    })

    const req = httpMock.expectOne(`http://localhost:8080/api/books/read/${idLibroAEliminar}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({})
  }))

  it('should fetch books in recommendation', fakeAsync( () => {
    const idReco = 1
    const dummyBooks: Book[] = [{ 
      id: 1 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA],
      weekSales: 153
     }, {       
      id: 2 /* | null */,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 45,
      wordsCount: 45,
      languages: [Lenguaje.ar_SA, Lenguaje.ko_KR],
      weekSales: 153 }]
    service.getBooksInRecommendation(idReco).then(books => {
      expect(books.length).toBe(2)
      expect(books).toEqual(dummyBooks)
    })

    const req = httpMock.expectOne(`http://localhost:8080/api/books-to-add-in-recommendation/${idReco}`)
    expect(req.request.method).toBe('GET')
    req.flush(dummyBooks)
  }))

  it('should add a book in recommendation', fakeAsync( () => {
    const idReco = 1
    const idBook = 1

    service.addBookInRecommendation(idReco, idBook).then(() => {
      expect(true).toBe(true)
    })

    const req = httpMock.expectOne('http://localhost:8080/api/add-book-in-recommendation')
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({ idReco, idBook })
    req.flush({})
  }))

  it('should delete a book in recommendation', fakeAsync( () => {
    const idReco = 1
    const idBook = 1

    service.deleteBookInRecommendation(idReco, idBook).then(() => {
      expect(true).toBe(true)
    })

    const req = httpMock.expectOne(`http://localhost:8080/api/delete-book-in-recommendation/${idReco}/${idBook}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({})
  }))
})