import { Component, EventEmitter, Input, Output } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {

  searchForm!: FormGroup
  searchValue: string = ''
  @Input() showCheck: boolean = true
  @Output() searchedAndPrivate = new EventEmitter<{search: string, privateCheck: boolean}>()

  ngOnInit(): void {

    this.searchForm = new FormGroup({
      search: new FormControl(''),
      checkPrivate: new FormControl(false)
    })

    this.searchForm.valueChanges.subscribe((value) => {
      this.searchValue = value.search
    })
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      console.log('Search: ' + this.searchValue + ' ' + this.searchForm.get('checkPrivate')?.value)
      this.searchedAndPrivate.emit({search: this.searchValue, privateCheck: this.searchForm.get('checkPrivate')?.value})
    }
    else {
      console.log('Invalid search')
    }
  }
}
