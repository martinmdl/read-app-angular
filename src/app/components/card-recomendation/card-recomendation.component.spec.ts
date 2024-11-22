import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CardRecomendationComponent } from './card-recomendation.component'
import { RecommendationService } from '../../core/services/recommendation.service'
import { RecommendationDTO } from '../../domain/Recommendation'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { TruncatePipe } from '../../core/pipes/truncate.pipe'
import { of } from 'rxjs'

describe('CardRecomendationComponent', () => {
    let component: CardRecomendationComponent
    let fixture: ComponentFixture<CardRecomendationComponent>

    const mockRecommendation: RecommendationDTO = {
        id: 1,
        name: 'string',
        description: 'string',
        recommendedBooks: [],
        averageRating: 0,
        numberOfBooks: 0,
        readingTime: 0,
        canRate: true,
        owner: true,
        private: true,
        favorite: true
    }

    beforeEach(async () => {
        const recommendationServiceSpy = jasmine.createSpyObj('RecommendationService', ['deleteRecommendation', 'getRecommendationfavoriteStatus', 'deleteRecommendationToValorate', 'addRecommendation'])

        await TestBed.configureTestingModule({
            imports: [CardRecomendationComponent, CommonModule, RouterLink, TruncatePipe],
            providers: [
                { provide: RecommendationService, useValue: recommendationServiceSpy },
                { provide: ActivatedRoute, useValue: { params: of({ id: '123' }) } }
            ]
        }).compileComponents()
        fixture = TestBed.createComponent(CardRecomendationComponent)
        component = fixture.componentInstance
        component.recomendation = mockRecommendation
        fixture.detectChanges()
    })

    it('should create', () => {
        expect(component).toBeTruthy()
    })

    it('should set favorite status on init', () => {
        component.ngOnInit()
        expect(component.heartstatus).toBe(mockRecommendation.favorite)
    })

    it('should set favorite status on initialization', () => {
        component.ngOnInit()
        expect(component.heartstatus).toBeTrue()
      })

      it('should set heartstatus to the favorite status of the recommendation', () => {
        component.setFavoriteStatus()
        expect(component.heartstatus).toBeTrue()
      })
      
})