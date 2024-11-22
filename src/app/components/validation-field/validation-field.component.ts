import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { AbstractControl } from '@angular/forms'

@Component({
  selector: 'app-validation-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './validation-field.component.html',
  styleUrl: './validation-field.component.scss'
})
export class ValidationFieldComponent {
  @Input() control!: AbstractControl
  @Input() errorMessages: { [key: string]: string } = {}

  getErrorKeys(): string[] {
    return Object.keys(this.control.errors!) // Devuelve una lista de las validaciones fallidas, por ejemplo required, specialChars, etc
  }
}
