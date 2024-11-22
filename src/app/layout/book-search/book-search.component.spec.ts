import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BusquedaLibrosComponent } from './book-search.component'
import { BookService } from '../../core/services/book.service'
import { SearchService } from '../../core/services/search.service'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'
import { of } from 'rxjs'
import { Book } from '../../domain/Book'
import { Lenguaje } from '../../domain/Language'

describe('BusquedaLibrosComponent', () => {
  let component: BusquedaLibrosComponent
  let fixture: ComponentFixture<BusquedaLibrosComponent>
  let mockBookService: jasmine.SpyObj<BookService>
  let mockSearchService: jasmine.SpyObj<SearchService>

  const mockBooks: Book[] = [
    { id: 1, bookTitle: 'Book 1', authorName: 'Author 1', pagesCount: 100, wordsCount: 1000, languages: [Lenguaje.ar_SA], weekSales: 412 },
    { id: 2, bookTitle: 'Book 2', authorName: 'Author 1', pagesCount: 100, wordsCount: 1000, languages: [Lenguaje.ar_SA], weekSales: 412  }
  ]

  beforeEach(async () => {
    mockBookService = jasmine.createSpyObj('BookService', ['getBooks'])
    mockSearchService = jasmine.createSpyObj('SearchService', ['filterbook'])

    await TestBed.configureTestingModule({
      imports: [BusquedaLibrosComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: BookService, useValue: mockBookService },
        { provide: SearchService, useValue: mockSearchService }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(BusquedaLibrosComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

    it('should call loadBooks on initialization', async () => {
      mockBookService.getBooks.and.returnValue(Promise.resolve(mockBooks))

      await component.ngOnInit()

      expect(mockBookService.getBooks).toHaveBeenCalled()
      expect(component.filterCurrentBook).toEqual(mockBooks)
    })

    it('should load books from the service', async () => {
      mockBookService.getBooks.and.returnValue(Promise.resolve(mockBooks))

      await component.loadBooks()

      expect(mockBookService.getBooks).toHaveBeenCalled()
      expect(component.filterCurrentBook).toEqual(mockBooks)
    })

    it('should filter books based on search value', () => {
      const searchValue = { searchValue: 'Book 1' }
      const filteredBooks = [mockBooks[0]]

      mockSearchService.filterbook.and.returnValue(of(filteredBooks))

      component.handleSearch(searchValue)

      expect(mockSearchService.filterbook).toHaveBeenCalledWith({ ...searchValue, privateCheck: null })
      expect(component.filterCurrentBook).toEqual(filteredBooks)
    })
  })
