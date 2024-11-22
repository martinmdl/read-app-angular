import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, Observable, throwError } from 'rxjs'
import Swal from 'sweetalert2'

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = sessionStorage.getItem('ReadApp') ?? ''
  const bearerToken = `Bearer ${authToken}`
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', bearerToken),
  })
  return next(newReq)
}

export function serverErrorInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const router = inject(Router)
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        console.error('No Internet Connection or Server is not reachable.', error.message)
        swalBox('No Internet Connection or Server is not reachable.')
      }
      else if (error.status === 401) {
        console.error('Invalid credentials:', error.status, error.message)
        swalBox('Invalid credentials. Please try again.')
      }
      else if (error.status === 403) {
        console.error('Access Denied:', error.status, error.message)
        swalBox('You do not have permission to access this resource. Session expired.')
        sessionStorage.removeItem('ReadApp')
        router.navigate(['/login'])
      }
      else if (error.status >= 500) {
        console.error('Server-side error:', error.status, error.message)
        swalBox('Server-side error. Please try again later.')
      }
      else {
        console.error('Unexpected error:', error.status, error.message)
        swalBox('An unexpected error occurred. Please try again.')
      }
      return throwError(() => error) // Propagar el error? pregungar si el componente lo gestionará
    })
  )
}

// Función de SweetAlert2
function swalBox(errorMessage: string) {
  Swal.fire({
    icon: 'error',
    text: errorMessage,
    customClass: {
      confirmButton: 'btn btn-primary px-4',
    },
    confirmButtonColor: '#f76767',
    buttonsStyling: true
  })
}

