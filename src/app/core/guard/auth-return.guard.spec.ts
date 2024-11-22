import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'

import { authReturnGuard } from './auth-return.guard'

describe('authReturnGuard', () => {
  let router: Router
  let spyRouter: jasmine.Spy
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authReturnGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [authReturnGuard, { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }]
    })

    router = TestBed.inject(Router)
    spyRouter = router.navigate as jasmine.Spy
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })

  it('should return false and redirect to /busqueda-principal if sessionStorage contains "ReadApp" as item set', () => {
    sessionStorage.setItem('ReadApp', 'true')
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    expect(result).toBeFalse()
    expect(spyRouter).toHaveBeenCalledWith(['/busqueda-principal'])
  })

  it('should return true and not navigate if sessionStorage does not contain "ReadApp" as an item set', () => {
    sessionStorage.removeItem('ReadApp')
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    expect(result).toBeTrue()
    expect(spyRouter).not.toHaveBeenCalled()
  })

  it('should return true and not navigate if sessionStorage is empty', () => {
    sessionStorage.clear()
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    expect(result).toBeTrue()
    expect(spyRouter).not.toHaveBeenCalled()
  })

  it('should return false and redirect to /busqueda-principal if sessionStorage contains "ReadApp" with any value', () => {
    sessionStorage.setItem('ReadApp', 'someValue')
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    expect(result).toBeFalse()
    expect(spyRouter).toHaveBeenCalledWith(['/busqueda-principal'])
  })

  it('should handle sessionStorage containing "ReadApp" with an empty string', () => {
    sessionStorage.setItem('ReadApp', '')
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    expect(result).toBeFalse()
    expect(spyRouter).toHaveBeenCalledWith(['/busqueda-principal'])
  })
})
