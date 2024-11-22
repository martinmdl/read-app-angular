import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms'
import { ValidationFieldComponent } from './validation-field.component'
import { CommonModule } from '@angular/common'

describe('ValidationFieldComponent', () => {
  let component: ValidationFieldComponent
  let fixture: ComponentFixture<ValidationFieldComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationFieldComponent,CommonModule, ReactiveFormsModule],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationFieldComponent)
    component = fixture.componentInstance
    component.control = new FormControl('', Validators.required)
    component.errorMessages = { required: 'This field is required' }
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should return error keys when control is invalid', () => {
    component.control.markAsTouched()
    expect(component.getErrorKeys()).toEqual(['required'])
  })

  it('should display error message when control is invalid', () => {
    component.control.markAsTouched()
    fixture.detectChanges()
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('.error-message').textContent).toContain('This field is required')
  })

  it('should not display error message when control is valid', () => {
    component.control.setValue('Valid value')
    const compiled = fixture.nativeElement
    expect(compiled.querySelector('.error-message')).toBeNull()
  })

  it('should handle multiple error messages', () => {
    component.control.setValidators([Validators.required, Validators.minLength(5)])
    component.errorMessages = {
      required: 'This field is required',
      minlength: 'Minimum length is 5 characters'
    }
    component.control.setValue('')
    component.control.markAsTouched()
    expect(component.getErrorKeys()).toEqual(['required'])
    
    component.control.setValue('1234')
    expect(component.getErrorKeys()).toEqual(['minlength'])
  })
})