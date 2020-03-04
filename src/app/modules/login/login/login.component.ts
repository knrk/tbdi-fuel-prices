import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  public busy: boolean = false; 
  public error: String;

  @ViewChild('focusEl', { static: true }) focusEl: ElementRef;

  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: this.fb.control('lukas@konarik.info'),
      password: this.fb.control('kokotkokot')
    })
  }

  ngAfterViewInit() {
    this.focusEl.nativeElement.focus();
  }

  onLogin() {
    const formData = this.loginForm.value;

    this.busy = true;
    this.authService.login(formData.username, formData.password).subscribe(
      response => {
        this.busy = false;
        this.router.navigate(['/dashboard']);
      }, 
      errorMessage => {
        this.error = errorMessage;
        this.busy = false;
      });
  }

}
