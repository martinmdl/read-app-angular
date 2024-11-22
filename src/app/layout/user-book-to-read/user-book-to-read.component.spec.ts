import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LibrosALeerUsuarioComponent } from './user-book-to-read.component'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'

describe('LibrosALeerUsuarioComponent', () => {
  let component: LibrosALeerUsuarioComponent
  let fixture: ComponentFixture<LibrosALeerUsuarioComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosALeerUsuarioComponent],
      providers: [provideRouter([]),provideHttpClient()]
    })
    .compileComponents()

    fixture = TestBed.createComponent(LibrosALeerUsuarioComponent)
    component = fixture.componentInstance
  
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
