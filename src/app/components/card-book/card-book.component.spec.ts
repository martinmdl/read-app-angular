import { ComponentFixture, TestBed } from '@angular/core/testing'
import { CardBookComponent } from './card-book.component'
import { provideHttpClient } from '@angular/common/http'
import { Lenguaje } from '../../domain/Language'


describe('CardBookComponent', () => {
  let component: CardBookComponent
  let fixture: ComponentFixture<CardBookComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBookComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents()

    fixture = TestBed.createComponent(CardBookComponent)
    component = fixture.componentInstance
    component.libro = { id:1, bookTitle: 'Balenciaga', authorName: 'Pipo', pagesCount: 100, wordsCount: 4000, languages: [Lenguaje.es_ES], weekSales: 30000 }
  
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
