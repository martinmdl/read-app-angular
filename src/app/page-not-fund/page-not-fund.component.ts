import { Component } from '@angular/core'
import { Location } from '@angular/common'

@Component({
  selector: 'app-page-not-fund',
  standalone: true,
  imports: [],
  templateUrl: './page-not-fund.component.html',
  styleUrl: './page-not-fund.component.scss'
})
export class PageNotFundComponent {

  constructor(private location: Location) { }

  return(): void{
    this.location.back()
  }
}
