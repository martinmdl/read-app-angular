import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { asapScheduler, of, scheduled, throwError } from 'rxjs'
import { provideHttpClient } from '@angular/common/http'
import { DetalleRecomendacionComponent } from './recommendation-details.component'
import { RecommendationService } from '../../core/services/recommendation.service'
import { RecommendationDetailsDTO } from '../../domain/Recommendation'
import { Book } from '../../domain/Book'
import { Lenguaje } from '../../domain/Language'
import Swal from 'sweetalert2'

describe('DetalleRecomendacionComponent', () => {
  let component: DetalleRecomendacionComponent
  let fixture: ComponentFixture<DetalleRecomendacionComponent>
  let mockRecommendationService: jasmine.SpyObj<RecommendationService>

  beforeEach(async () => {
    mockRecommendationService = jasmine.createSpyObj('RecommendationService', ['getRecommendationsDetails', 'createValoration'])

    await TestBed.configureTestingModule({
      imports: [DetalleRecomendacionComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        },
        { provide: RecommendationService, useValue: mockRecommendationService }
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(DetalleRecomendacionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('shuld load recommendation details', fakeAsync(() => {
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

    mockRecommendationService.getRecommendationsDetails.and.returnValue(scheduled([mockRecommendation], asapScheduler))
    component.ngOnInit()

    tick()

    expect(component.recommendation).toBeDefined()
    expect(mockRecommendationService.getRecommendationsDetails).toHaveBeenCalled()
  }))

  it('should handle error when loading recommendation details', fakeAsync(() => {
    mockRecommendationService.getRecommendationsDetails.and.returnValue(throwError(() => new Error('error')))
    spyOn(component, 'navegarAHome')
    component.ngOnInit()

    tick()

    expect(component.navegarAHome).toHaveBeenCalled()
  }))

  it('should create valoration', fakeAsync(() => {
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

    mockRecommendationService.getRecommendationsDetails.and.returnValue(scheduled([mockRecommendation], asapScheduler))
    component.ngOnInit()

    tick()

    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false, value: { value: 5, comment: 'string' } }))
    mockRecommendationService.createValoration.and.returnValue(Promise.resolve())
    component.createValoration(1)

    tick()

    expect(mockRecommendationService.createValoration).toHaveBeenCalled()
  }))

  it('should navigate to home when calling navegarAHome', () => {
    const routerSpy = spyOn(TestBed.inject(Router), 'navigate')
    component.navegarAHome()
    expect(routerSpy).toHaveBeenCalledWith(['/busqueda-principal'])
  })
})
