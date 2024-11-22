import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule } from '@angular/forms'
import { SearchBarComponent } from './search-bar.component'

let component: SearchBarComponent
let fixture: ComponentFixture<SearchBarComponent>

describe('SearchBarComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SearchBarComponent]
    })
    .compileComponents()

    fixture = TestBed.createComponent(SearchBarComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should initialize form with default values', () => {
    const searchControl = component.searchForm.get('search')
    const checkPrivateControl = component.searchForm.get('checkPrivate')
    expect(searchControl?.value).toBe('')
    expect(checkPrivateControl?.value).toBe(false)
  })

  it('should update searchValue when form value changes', () => {
    const searchControl = component.searchForm.get('search')
    searchControl?.setValue('test search')
    expect(component.searchValue).toBe('test search')
  })

  it('should emit searchedAndPrivate event with correct values on search', () => {
    spyOn(component.searchedAndPrivate, 'emit')
    component.searchForm.setValue({ search: 'test search', checkPrivate: true })
    component.onSearch()
    expect(component.searchedAndPrivate.emit).toHaveBeenCalledWith({ search: 'test search', privateCheck: true })
  })

  it('should log search value and private check value if form is valid on search', () => {
    spyOn(console, 'log')
    component.searchForm.setValue({ search: 'test search', checkPrivate: true })
    component.onSearch()
    expect(console.log).toHaveBeenCalledWith('Search: test search true')
  })
})
