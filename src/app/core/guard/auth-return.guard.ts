import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

export const authReturnGuard: CanActivateFn = () => {
  const router = inject(Router)
  const localData = sessionStorage.getItem('ReadApp')
  if (localData === null) {
    return true
  } else {
    router.navigate(['/busqueda-principal'])
    return false
  }
}
