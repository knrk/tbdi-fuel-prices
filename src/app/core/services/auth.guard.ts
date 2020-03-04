import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.authService.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return true;
                }
                // return this.router.createUrlTree(['/login']);

                return false;
            })
        );
    }

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return this.checkAuth();
  // }

  // canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   return this.checkAuth();
  // }

  // checkAuth(): any {
  //   // console.log(this.authService.isAuthenticated().subscribe())
  //   // this.authService.isAuthenticated().subscribe(loggedIn => {
  //   //   console.log(loggedIn)
  //   // })



  //   console.log(this.authService.isAuthenticated());


  //   this.router.navigate(['/login']);
  //   // this.router.createUrlTree(['/login']);
  //   return false;
  // }
}
