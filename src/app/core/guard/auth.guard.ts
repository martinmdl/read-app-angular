import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

export const authGuard: CanActivateFn = () => {

  const router = inject(Router)
  const localData = sessionStorage.getItem('ReadApp')
  if(localData !== null) {
    return true
  } else {
    router.navigate(['/login'])
    return false
  }
}
