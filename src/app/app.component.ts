import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  httpError: any;

  isUserLogged: boolean;



  constructor(
    private authService: AuthService
  ) {
    
  }

  ngOnInit() {
    this.isUserLogged = this.authService.isAuthenticated();
  }
}
