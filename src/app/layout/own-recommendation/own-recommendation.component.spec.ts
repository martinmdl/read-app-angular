import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { asapScheduler, of, scheduled } from 'rxjs'
import { provideHttpClient } from '@angular/common/http'
import { RecommendationService } from '../../core/services/recommendation.service'
import { SearchService } from '../../core/services/search.service'
import { RecommendationDTO } from '../../domain/Recommendation'
import { MisRecomendacionesComponent } from './own-recommendation.component'

describe('MisRecomendacionesComponent', () => {
  let component: MisRecomendacionesComponent
  let fixture: ComponentFixture<MisRecomendacionesComponent>
  let mockRecommendationService: jasmine.SpyObj<RecommendationService>
  let mockSearchService: jasmine.SpyObj<SearchService>

  const mockRecommendations: RecommendationDTO[] = [
    {
      id: 1, name: 'Recommendation 1',
      description: '',
      recommendedBooks: [],
      averageRating: 0,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: false,
      private: false,
      favorite: false
    },
    {
      id: 2, name: 'Recommendation 2',
      description: '',
      recommendedBooks: [],
      averageRating: 0,
      numberOfBooks: 0,
      readingTime: 0,
      canRate: false,
      owner: false,
      private: false,
      favorite: false
    }
  ]



  beforeEach(async () => {
    mockRecommendationService = jasmine.createSpyObj('RecommendationService', ['getOwnRecommendations'])
    mockSearchService = jasmine.createSpyObj('SearchService', ['filterRecommendations'])

    mockRecommendationService.getOwnRecommendations.and.returnValue(scheduled([mockRecommendations], asapScheduler))


    await TestBed.configureTestingModule({
      imports: [MisRecomendacionesComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' }) // Mock any params you expect
          }
        },
        { provide: RecommendationService, useValue: mockRecommendationService },
        { provide: SearchService, useValue: mockSearchService }
      ]
    })
      .compileComponents()

    fixture = TestBed.createComponent(MisRecomendacionesComponent)
    component = fixture.componentInstance
    component.currentRecommendations = mockRecommendations
    component.filterCurrentRecommendations = mockRecommendations
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call loadRecommendations on initialization', () => {
    spyOn(component, 'loadRecommendations')
    component.ngOnInit()
    expect(component.loadRecommendations).toHaveBeenCalled()
  })

  it('should load current recommendations from recommendationService', () => {
    component.ngOnInit()
    expect(mockRecommendationService.getOwnRecommendations).toHaveBeenCalled()
    expect(component.currentRecommendations).toEqual(mockRecommendations)
    expect(component.filterCurrentRecommendations).toEqual(mockRecommendations)
  })

  it('should update filterCurrentRecommendations based on searchService result', () => {
    const searchValue = 'test'
    const privateCheck = false
    const filteredRecommendations: RecommendationDTO[] = [
      {
        id: 1,
        name: 'Filtered Recommendation',
        description: '',
        recommendedBooks: [],
        averageRating: 0,
        numberOfBooks: 0,
        readingTime: 0,
        canRate: false,
        owner: false,
        private: false,
        favorite: false
      }
    ]
    mockSearchService.filterRecommendations.and.returnValue(of(filteredRecommendations))
    component.handleSearch({ searchValue, privateCheck })
    expect(mockSearchService.filterRecommendations).toHaveBeenCalledWith({ searchValue, privateCheck })
    expect(component.filterCurrentRecommendations).toEqual(filteredRecommendations)
  })

  it('should reload recommendations when handleRefresh is called', () => {
    spyOn(component, 'loadRecommendations')
    component.handleRefresh()
    expect(component.loadRecommendations).toHaveBeenCalled()
  })

  it('should copy currentRecommendations to filterCurrentRecommendations', () => {
    component.currentRecommendations = mockRecommendations
    component.loadCurrentRecommendations()
    expect(component.filterCurrentRecommendations).toEqual(mockRecommendations)
  })
})