/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { LibrosLeidosUsuarioComponent } from './user-book-read.component'
import { BookService } from '../../core/services/book.service'
import Swal from 'sweetalert2'
import { Book } from '../../domain/Book'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { Lenguaje } from '../../domain/Language'

describe('LibrosLeidosUsuarioComponent', () => {
  let component: LibrosLeidosUsuarioComponent
  let fixture: ComponentFixture<LibrosLeidosUsuarioComponent>
  let bookService: jasmine.SpyObj<BookService>

  const mockBooks: Book[] = [
    { 
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 213,
      wordsCount: 231,
      languages: [Lenguaje.ar_SA],
      weekSales: 321
    },
    {       
      id: 2,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 213,
      wordsCount: 231,
      languages: [Lenguaje.ar_SA],
      weekSales: 321 }
  ]

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getReadBooks', 'deleteReadBook', 'getBooksToAddToReadList', 'addReadBook'])

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [LibrosLeidosUsuarioComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: BookService, useValue: bookServiceSpy }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(LibrosLeidosUsuarioComponent)
    component = fixture.componentInstance
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>

    bookService.getReadBooks.and.returnValue(Promise.resolve(mockBooks))
    bookService.getBooksToAddToReadList.and.returnValue(Promise.resolve(mockBooks))
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should load read books on init', fakeAsync( () => {
    component.ngOnInit()
    
    tick()

    expect(component.booksRead).toEqual(mockBooks)
  }))

  it('should delete a book and update the list', fakeAsync( () => {

    const mockBooksAfterDelete: Book[] = [
      {       
        id: 2,
        bookTitle: 'string',
        authorName: 'string',
        pagesCount: 213,
        wordsCount: 231,
        languages: [Lenguaje.ar_SA],
        weekSales: 321 }
    ]

    component.ngOnInit()

    bookService.deleteReadBook.and.returnValue(Promise.resolve())

    bookService.getReadBooks.and.returnValue(Promise.resolve(mockBooksAfterDelete))

    component.deleteBook(1)

    tick()

    expect(component.booksRead.length).toBe(1)
    expect(component.booksRead[0].id).toBe(2)
  }))

  it('should show a confirmation dialog before deleting a book', fakeAsync( () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any))
    spyOn(component, 'deleteBook').and.returnValue(Promise.resolve())

    component.eliminarLibroSwal(1)
    tick()

    expect(Swal.fire).toHaveBeenCalled()
    expect(component.deleteBook).toHaveBeenCalledWith(1)
  }))

  it('should show a list of books to add', fakeAsync( () => {
    spyOn(Swal, 'fire').and.callFake((options: any) => {
      options.didOpen()
      return Promise.resolve({} as any)
    })

    component.viewAddBooks()

    tick()

    expect(Swal.fire).toHaveBeenCalled()
  }))

  it('should add a book and update the list', async () => {

    const mockBooks2: Book[] = [
      { 
        id: 1,
        bookTitle: 'string',
        authorName: 'string',
        pagesCount: 213,
        wordsCount: 231,
        languages: [Lenguaje.ar_SA],
        weekSales: 321
      },
      {       
        id: 2,
        bookTitle: 'string',
        authorName: 'string',
        pagesCount: 213,
        wordsCount: 231,
        languages: [Lenguaje.ar_SA],
        weekSales: 321 
      },
      {       
        id: 3,
        bookTitle: 'string',
        authorName: 'string',
        pagesCount: 213,
        wordsCount: 231,
        languages: [Lenguaje.ar_SA],
        weekSales: 321 }
    ]

    await component.ngOnInit()

    bookService.addReadBook.and.returnValue(Promise.resolve())

    bookService.getReadBooks.and.returnValue(Promise.resolve(mockBooks2))

    await component.addBook(mockBooks2[2])
    
    expect(component.booksRead.length).toBe(3)
  })

  it('should show an alert if no more books are available to add', async () => {
    bookService.getBooksToAddToReadList.and.returnValue(Promise.resolve([]))
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any))

    await component.viewAddBooks()
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'No hay más libros',
      text: 'Todos los libros ya están en tu lista de libros leidos y por leer.',
      icon: 'info',
      confirmButtonColor: '#5EADE1',
    } as any)
  })
})