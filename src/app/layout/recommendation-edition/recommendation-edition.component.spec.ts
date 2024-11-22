import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'

import { EdicionRecomendacionComponent } from './recommendation-edition.component'
import { provideHttpClient } from '@angular/common/http'
import { ActivatedRoute, Router } from '@angular/router'
import { of, throwError } from 'rxjs'
import { RecommendationService } from '../../core/services/recommendation.service'
import { BookService } from '../../core/services/book.service'
import { RecommendationDetailsDTO } from '../../domain/Recommendation'
import { Lenguaje } from '../../domain/Language'
import { Book } from '../../domain/Book'
import Swal from 'sweetalert2'

describe('EdicionRecomendacionComponent', () => {
  let component: EdicionRecomendacionComponent
  let fixture: ComponentFixture<EdicionRecomendacionComponent>
  let mockRecommendationService: jasmine.SpyObj<RecommendationService>
  let mockBookService: jasmine.SpyObj<BookService>
  let mockLocation: jasmine.SpyObj<Location>
  let mockRouter: jasmine.SpyObj<Router>


  beforeEach(async () => {
    mockRecommendationService = jasmine.createSpyObj('RecommendationService', ['getRecommendationsDetails','putRecommendationEdition'])
    mockBookService = jasmine.createSpyObj('BookService', ['getBooksInRecommendation','deleteBookInRecommendation'])
    mockLocation = jasmine.createSpyObj('Location', ['back'])
    mockRouter = jasmine.createSpyObj('Router', ['navigate'])

    await TestBed.configureTestingModule({
      imports: [EdicionRecomendacionComponent],
      providers: [provideHttpClient(),
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '1' }) // Mock any params you expect
        }
      },
      { provide: Router, useValue: mockRouter }, 
      { provide: Location, useValue: mockLocation }, 
      { provide: RecommendationService, useValue: mockRecommendationService }, 
      { provide: BookService, useValue: mockBookService }]
    })
      .compileComponents()

    fixture = TestBed.createComponent(EdicionRecomendacionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should get recommendation details', fakeAsync(() => {
    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }
    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    component.ngOnInit()
    
    tick()

    expect(mockRecommendationService.getRecommendationsDetails).toHaveBeenCalledWith(1)
    expect(component.recommendation).toEqual(mockRecommendation)
  }))

  it('should handle error when fetching recommendation details', fakeAsync(() => {
    spyOn(component, 'navegarAHome')

    mockRecommendationService.getRecommendationsDetails.and.returnValue(throwError(() => new Error('error')))
    component.ngOnInit()

    tick()

    expect(component.navegarAHome).toHaveBeenCalled()
    }))

  it('should navigate to home when call navegarAHome()', () => {
    component.navegarAHome()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/busqueda-principal'])
  })

  it ('should in itializae the form with recommendation details', fakeAsync(() => {
    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }
    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    component.ngOnInit()

    tick()

    expect(component.recommendationForm.value.name).toEqual(mockRecommendation.name)
    expect(component.recommendationForm.value.private).toEqual(mockRecommendation.private)
    expect(component.recommendationForm.value.description).toEqual(mockRecommendation.description)
  }))

  it('should show a success message when saving a recommendation', fakeAsync(() => {
    const swalSpy = spyOn(Swal,'fire')

    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }

    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    component.ngOnInit()

    tick()

    component.save()

    tick()

    expect(mockRecommendationService.putRecommendationEdition).toHaveBeenCalled()
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({icon: 'success', title: 'Recomendacion Actualizada!'}))
  }))

  it('should display an error if the form is invalid', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'log')
    
    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }

    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    component.ngOnInit()

    tick()

    component.recommendationForm.setErrors({ invalid: true })
    component.save()

    tick()
    expect(consoleSpy).toHaveBeenCalledWith('El formulario no es válido')
  }))

  it('should delete a book from the recommendation', fakeAsync(() => {
    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }

    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    component.ngOnInit()

    tick()

    component.deleteBook(1)

    tick()

    expect(mockBookService.deleteBookInRecommendation).toHaveBeenCalledWith(1, 1)
    expect(component.recommendation?.recommendedBooks).not.toContain(mockBook)
  }))

  it ('should display a SweetAlert with book list when tehre are book available to add', fakeAsync(() => {

    const swalSpy = spyOn(Swal, 'fire')

    const mockNewBook: Book = {
      id: 3,
      bookTitle: 'otro Book',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }

    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }

    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    mockBookService.getBooksInRecommendation.and.returnValue(Promise.resolve([mockNewBook]))
    component.ngOnInit()

    tick()

    component.viewAddBooks(1)

    tick()

    expect(mockBookService.getBooksInRecommendation).toHaveBeenCalledWith(1)
    expect(swalSpy).toHaveBeenCalled()
  }))


  it('should display a "No avaibale books" when there are no books available to add', fakeAsync(() => {

    const swalSpy = spyOn(Swal, 'fire')

    const mockBook: Book = {
      id: 1,
      bookTitle: 'string',
      authorName: 'string',
      pagesCount: 312,
      wordsCount: 123,
      languages: [Lenguaje.ar_SA],
      weekSales: 1563
    }

    const mockRecommendation: RecommendationDetailsDTO = {
      id: 1,
      name: 'string',
      description: 'string',
      recommendedBooks: [mockBook],
      averageRating: 0,
      canRate: true,
      valoration: [],
      private: false
    }

    const mockListBooks: Book[] = []

    mockRecommendationService.getRecommendationsDetails.and.returnValue(of(mockRecommendation))
    mockBookService.getBooksInRecommendation.and.returnValue(Promise.resolve(mockListBooks))
    component.ngOnInit()

    tick()

    component.viewAddBooks(1)

    tick()

    expect(mockBookService.getBooksInRecommendation).toHaveBeenCalledWith(1)
    expect(swalSpy).toHaveBeenCalledWith(jasmine.objectContaining({icon: 'info', title: 'No hay más libros', text: 'Todos los libros ya están en tu lista de libros leidos.' }))
  }))

})
