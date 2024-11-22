import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { InformacionUsuarioComponent } from './profile-information.component'
import { provideRouter } from '@angular/router'
import { provideHttpClient } from '@angular/common/http'
import { UserService } from '../../core/services/user.service'
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms'
import { UserDTO } from '../../domain/User'
import Swal from 'sweetalert2'

describe('InformacionUsuarioComponent', () => {
  let component: InformacionUsuarioComponent
  let fixture: ComponentFixture<InformacionUsuarioComponent>
  let mockUserService: jasmine.SpyObj<UserService>

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserService', ['getInfoUser', 'updateUser'])

    await TestBed.configureTestingModule({
      imports: [InformacionUsuarioComponent, ReactiveFormsModule],
      providers: [provideRouter([]), provideHttpClient(), { provide: UserService, useValue: mockUserService }]
    })
      .compileComponents()

    fixture = TestBed.createComponent(InformacionUsuarioComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should call getUserInfo on ngOnInit', () => {
    component.ngOnInit()
    expect(mockUserService.getInfoUser).toHaveBeenCalled()
  })

  it('should initialize form with user data', fakeAsync(() => {
    const mockUserData: UserDTO = {
      name: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      dateOfBirth: new Date('1990-01-01'),
      mail: 'sadaads@sadsda.com',
      wordsPerMinutes: 200,
      typeOfReader: 'Leedor',
      searchCriteria: 'Precavido',
      minRange: 100,
      maxRange: 200
    }

    mockUserService.getInfoUser.and.returnValue(Promise.resolve(mockUserData))

    component.setInputs()

    tick()

    expect(component.informationForm.value.nombre).toEqual(mockUserData.name)
    expect(component.informationForm.value.apellido).toEqual(mockUserData.lastName)
    expect(component.informationForm.value.username).toEqual(mockUserData.username)
    expect(component.informationForm.value.fechaDeNacimiento).toEqual(mockUserData.dateOfBirth)
    expect(component.informationForm.value.email).toEqual(mockUserData.mail)
    expect(component.informationForm.value.tiempoPromedioDeLectura).toEqual(mockUserData.wordsPerMinutes)
    expect(component.informationForm.value.lectura).toEqual(mockUserData.typeOfReader)
    expect(component.informationForm.value.searchCriteria).toEqual(mockUserData.searchCriteria)
    expect(component.informationForm.value.minRange).toEqual(mockUserData.minRange)
    expect(component.informationForm.value.maxRange).toEqual(mockUserData.maxRange)
  }))

  it('should vvaldiate email with correct pattern', () => {
    const control = new FormControl('invalidEmail.com')
    const result = component.emailValidator(control)
    expect(result).toEqual({ invalidEmail: true })
  })

  it('should validate that name contains no special characters', () => {
    const control = new FormControl('John12!!3[¨]*[**')
    const result = component.noSpecialChar(control)
    expect(result).toEqual({ specialChars: true })
  })

  it('should not allow minors to register', () => {
    const control = new FormControl(new Date('2010-01-01'))
    const result = component.noIsAdult(control)
    expect(result).toEqual({ isMinor: true })
  })

  it('should mark all fields as touched if form is invalid on save', fakeAsync(() => {
    const mockUserData: UserDTO = {
      name: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      dateOfBirth: new Date('1990-01-01'),
      mail: 'sadaads@sadsda.com',
      wordsPerMinutes: 200,
      typeOfReader: 'Leedor',
      searchCriteria: 'Precavido',
      minRange: 100,
      maxRange: 200
    }
    mockUserService.getInfoUser.and.returnValue(Promise.resolve(mockUserData))
    component.ngOnInit()

    tick()

    component.informationForm.setErrors({ invalid: true })

    // Espiar el método markAllAsTouched en los controles del formulario
    const controlKeys = Object.keys(component.informationForm.controls)
    controlKeys.forEach(key => {
      const control = component.informationForm.get(key)
      spyOn(control as AbstractControl, 'markAsTouched')
    })

    component.save()

    tick()

    // Verificar que todos los controles hayan llamado a markAsTouched
    controlKeys.forEach(key => {
      const control = component.informationForm.get(key)
      if (control) {
        expect(control.markAsTouched).toHaveBeenCalled()
      }
    })
  }))

  it('should show success message on successful save', fakeAsync(() => {
    const mockUserData: UserDTO = {
      name: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      dateOfBirth: new Date('1990-01-01'),
      mail: 'sadaads@sadsda.com',
      wordsPerMinutes: 200,
      typeOfReader: 'Leedor',
      searchCriteria: 'Precavido',
      minRange: 100,
      maxRange: 200
    }
    mockUserService.getInfoUser.and.returnValue(Promise.resolve(mockUserData))
    mockUserService.updateUser.and.returnValue(Promise.resolve(mockUserData))

    component.ngOnInit()

    tick()

    spyOn(Swal, 'fire')
    component.save()

    tick()

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      position: "center",
      icon: "success",
      title: 'Información guardada!',
      showConfirmButton: false,
      timer: 1200
    }))
  }))

//   it('should handle errors during user update', fakeAsync(() => {
//     const mockUserData: UserDTO = {
//         name: 'John',
//         lastName: 'Doe',
//         username: 'johndoe',
//         dateOfBirth: new Date('1990-01-01'),
//         mail: 'sadaads@sadsda.com',
//         wordsPerMinutes: 200,
//         typeOfReader: 'Leedor',
//         searchCriteria: 'Precavido',
//         minRange: 100,
//         maxRange: 200
//     }

//     mockUserService.getInfoUser.and.returnValue(Promise.resolve(mockUserData))
//     mockUserService.updateUser.and.returnValue(Promise.reject(new Error('Error al actualizar'))) // Rechazar con objeto Error

//     component.ngOnInit()
//     tick()

//     spyOn(console, 'error')
//     component.save()

//     tick()

//     expect(console.error).toHaveBeenCalledWith('Error al actualizar el usuario:', jasmine.any(Error))
// }))

})


