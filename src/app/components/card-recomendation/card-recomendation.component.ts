import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { RecommendationDTO } from '../../domain/Recommendation'
import { RouterLink } from '@angular/router'
import { RecommendationService } from '../../core/services/recommendation.service'
import { TruncatePipe } from '../../core/pipes/truncate.pipe'

@Component({
  selector: 'app-card-recomendation',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './card-recomendation.component.html',
  styleUrls: ['./card-recomendation.component.scss']
})

export class CardRecomendationComponent {
  @Input() showIcons: 'actions' | 'heart' | 'none' = 'none'
  @Input() recomendation!: RecommendationDTO
  @Output() refresh = new EventEmitter<void>()

  heartstatus = false
  isdeleting = false

  constructor(private readonly recommendationService: RecommendationService) { }

  ngOnInit(): void {
    this.setFavoriteStatus()
  }

  setFavoriteStatus(): void {
    this.heartstatus = this.recomendation.favorite
  }

  deleteRecommendation(): void {
    this.isdeleting = true
    this.recommendationService.deleteRecommendation(this.recomendation.id).then(() => {
      setTimeout(() => {
        this.refresh.emit()
        this.isdeleting = false
      }, 400)
    }).catch(error => {
      console.error('Error deleting recommendation', error)
      this.isdeleting = false
    })
  }

  refreshFavoriteStatus(): void {
    this.recommendationService.getRecommendationfavoriteStatus(this.recomendation.id)
      .then((status: boolean) => {
        this.heartstatus = status
      })
      .catch(error => {
        console.error('Failed to refresh favorite status', error)
      })
  }

  addOrRemoveRecommendationToValorate(): void {
    if (this.heartstatus) {
      const id = this.recomendation.id
      this.recommendationService.deleteRecommendationToValorate(id)
        .then(() => {
          this.refresh.emit()
          this.refreshFavoriteStatus()
        })
        .catch(error => {
          console.error('Error deleting recommendation to valorate', error)
        })
    } else {
      this.recommendationService.addRecommendation(this.recomendation.id)
        .then(() => {
          this.refresh.emit()
          this.refreshFavoriteStatus()
        })
        .catch(error => {
          console.error('Error adding recommendation to valorate', error)
        })
    }
  }
  

  getAveregaRating(): number {
    return this.recomendation.averageRating
  }

  getBookCount(): number {
    return this.recomendation.numberOfBooks
  }

  getReadingTime(): number {
    return this.recomendation.readingTime
  }
}
