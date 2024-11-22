import { TestBed } from '@angular/core/testing'
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router'
import { authGuard } from './auth.guard'

describe('authGuard', () => {
  let router: Router
  let spyRouter: jasmine.Spy
  
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters))

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [authGuard, { provide: Router, useValue: jasmine.createSpyObj('Router', ['navigate']) }]
    })

    router = TestBed.inject(Router)
    spyRouter = router.navigate as jasmine.Spy
  })

  it('should be created', () => {
    expect(executeGuard).toBeTruthy()
  })

  it('should return true and not redirect to /login(no navigate) if localStorage contains "ReadApp" as item set', () => {
    // Create in localStorage the item 'ReadApp' with value 'true'
    sessionStorage.setItem('ReadApp', 'true')
    // Call the guard.
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    // Expect the result to be true.
    expect(result).toBeTrue()
    // Expect the router to not have been called.
    expect(spyRouter).not.toHaveBeenCalled()


  })

  it('should return false and redirect to login (navigate) if localStorage not contains "ReadApp" as item set', () => {
    // Create in localStorage the item 'ReadApp' with value 'true' and eliminate it.
    sessionStorage.setItem('ReadApp', 'true')
    sessionStorage.removeItem('ReadApp')
    // Call the guard.
    const route = {} as ActivatedRouteSnapshot
    const state = {} as RouterStateSnapshot
    const result = executeGuard(route, state)
    // Expect the result to be false.
    expect(result).toBeFalse()
    // Expect the router to have been called.
    expect(spyRouter).toHaveBeenCalled()
  })
})
