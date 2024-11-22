import { Component} from '@angular/core'
import { SidebarComponent } from '../../components/sidebar/sidebar.component'
import { CommonModule } from '@angular/common'
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms'
import { ValidationFieldComponent } from "../../components/validation-field/validation-field.component"
import { UserService } from '../../core/services/user.service'
import { UserDTO } from '../../domain/User'
import Swal from 'sweetalert2'

@Component({
  selector: 'app-informacion-usuario',
  standalone: true,
  imports: [SidebarComponent, CommonModule, ReactiveFormsModule, ValidationFieldComponent],
  templateUrl: './profile-information.component.html',
  styleUrl: './profile-information.component.scss'
})
export class InformacionUsuarioComponent {

    informationForm !: FormGroup
    fechaDeNacimientoMaxima = new Date()
    listaSearchCriteria : string[] = [
        'Precavido',
        'Leedor',
        'Poliglota',
        'Nativista',
        'Calculador',
        'Demandante',
        'Experimentado',
        'Cambiante'
    ]

    nameErrorMessages = {
        required: 'Debe ingresar un nombre.',
        specialCharsOrNumbers: 'No se permiten caracteres especiales ni numeros'
    }

    lastNameErrorMessage = {
        required: 'Debe ingresar un apellido.',
        specialCharsOrNumbers: 'No se permiten caracteres especiales ni numeros'
    }

    usernameErrorMessage = {
        required: 'Debe ingresar un username.',
        specialChars: 'No se permiten caracteres especiales'
    }

    dateOfBirthErrorMessage = {
        required: 'Debe ingresar una fecha de nacimiento.',
        isMinor: 'Debe tener 18 años o mas'
    }

    emailErrorMessage = {
        required: 'Debe ingresar un email.',
        invalidEmail: 'introduce un correo electrónico válido en el formato '+'usuario@dominio.extension'
    }

    averageReadingTimeErrorMessage = {
        required: 'Debe ingresar un tiempo promedio de lectura.',
        notPositiveNumber: 'Debe ser un numero positivo'
    }

    constructor(private userService: UserService) {}

    async ngOnInit(): Promise<void> {
        await this.setInputs()
        this.fechaDeNacimientoMaxima.setFullYear(this.fechaDeNacimientoMaxima.getFullYear() - 18)
    }

    onCheckboxChange(event: Event, criteria: string): void {
        const searchCriteriaControl = this.informationForm.get('searchCriteria')//FormCOntrol
        if (searchCriteriaControl) {
            const searchCriteria = searchCriteriaControl.value as string[]
            
            const isChecked = (event.target as HTMLInputElement).checked
    
            if (isChecked) {
                searchCriteriaControl.setValue([...searchCriteria, criteria])
            } else {
                searchCriteriaControl.setValue(searchCriteria.filter(c => c !== criteria))
            }
        }
    }

    noSpecialChar(control: AbstractControl): ValidationErrors | null {
        const hasSpecialChars = /[^a-zA-Z0-9]/.test(control.value)
        return hasSpecialChars ? { specialChars: true } : null
    }

    noSpecialCharsOrNumbers(control: AbstractControl): ValidationErrors | null {
        const hasSpecialChars = /[^a-zA-Z0-9]/.test(control.value)
        const hasNumbers = /\d/.test(control.value)

        if (hasSpecialChars || hasNumbers) {
            return { specialCharsOrNumbers: true }
        }
        return null
    }

    noIsAdult(control: AbstractControl): ValidationErrors | null {
        const fechaMaxima = new Date()
        fechaMaxima.setFullYear(fechaMaxima.getFullYear() - 18)
        const inputDate = new Date(control.value) // Convierte el valor del control en una fecha

        if (inputDate >= fechaMaxima) { // Verifica si la fecha ingresada corresponde a una persona que tenga 18 años o mas
            return { isMinor: true } // Retorna un objeto que indica que la fecha ingresada no es valida
        }
        return null
    }

    emailValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value
        if (!value) { // Si el valor está vacío, no hacemos la validación, permitimos que 'required' lo maneje.
            return null
        }

        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // Expresión regular para validar el formato de correo electrónico (usuario@dominio.extension)

        if (!emailPattern.test(value)) { // Si el valor no coincide con el patrón del correo electrónico, devolvemos un error
            return { invalidEmail: true }
        }
        return null
    }

    positiveNumberValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value
        const invalidPattern = /[^0-9.]+|(\.[0-9]*\.)/ // Permitir solo numeros positivos

        if (invalidPattern.test(value)) { // Si el valor contiene caracteres no validos
            return { notPositiveNumber: true } // Marca como error si contiene caracteres invalidos
        }
        return null
    }

    async setInputs(){
        const infoUser = await this.userService.getInfoUser()
        this.informationForm = new FormGroup({
            nombre: new FormControl(infoUser.name, [Validators.required, this.noSpecialCharsOrNumbers]),
            apellido: new FormControl(infoUser.lastName, [Validators.required, this.noSpecialCharsOrNumbers]),
            username: new FormControl(infoUser.username, [Validators.required, this.noSpecialChar]),
            fechaDeNacimiento: new FormControl(infoUser.dateOfBirth, [Validators.required, this.noIsAdult]),
            email: new FormControl(infoUser.mail, [Validators.required, this.emailValidator]),
            tiempoPromedioDeLectura: new FormControl(infoUser.wordsPerMinutes, [Validators.required, this.positiveNumberValidator]),
            lectura: new FormControl(infoUser.typeOfReader),
            searchCriteria: new FormControl(infoUser.searchCriteria || [ ], Validators.required),
            minRange: new FormControl(infoUser.minRange),
            maxRange: new FormControl(infoUser.maxRange),
        })
    }

    async cancelSave(){
        await this.setInputs()
    }

    async save(){
        if (this.informationForm.valid) {
            
            const updatedUser: UserDTO = {
                name: this.informationForm.value.nombre,
                lastName: this.informationForm.value.apellido,
                username: this.informationForm.value.username,
                dateOfBirth: new Date(this.informationForm.value.fechaDeNacimiento),
                mail: this.informationForm.value.email,
                wordsPerMinutes: this.informationForm.value.tiempoPromedioDeLectura,
                typeOfReader: this.informationForm.value.lectura,
                searchCriteria: this.informationForm.value.searchCriteria,
                minRange: this.informationForm.value.minRange,
                maxRange: this.informationForm.value.maxRange
            }
    
            try {
                await this.userService.updateUser(updatedUser)
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Información guardada!',
                    showConfirmButton: false,
                    timer: 1200
                })
            } catch (error) {
                console.error('Error al actualizar el usuario:', error)
                }finally {await this.setInputs()}
        } else {
            this.markAllFieldsAsTouched()
            console.log('El formulario no es válido')
        }
    }

    markAllFieldsAsTouched() {
        Object.keys(this.informationForm.controls).forEach(field => {
            const control = this.informationForm.get(field)
            control?.markAsTouched({ onlySelf: true })
        })
    }

  }





