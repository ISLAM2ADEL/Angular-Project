import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router'; 
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signin.html', 
  styleUrls: ['../../SharedAuthStyle/SharedAuth.css']   
})
export class Signin {
  signinForm: FormGroup;
  isPasswordVisible: boolean = false;
  private authService = inject(Auth);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.authService.login(this.signinForm.value).subscribe({
        next: (response) => {
          console.log('Login Success!', response);
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'You have been logged in successfully!',
            confirmButtonColor: '#3b1e2a',
          });
          localStorage.setItem('token', response.token); 
          if (response?.data?.role) {
            localStorage.setItem('role', response.data.role);
          }

          const role = String(response?.data?.role || '').toLowerCase();
          this.router.navigate([role === 'admin' ? '/admin-panel' : '/home']);
        },
        error: (err) => {
          console.error('Login Error', err);
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: err.error.message || 'An error occurred during login. Please try again.',
            confirmButtonColor: '#3b1e2a',
          })
        }
      });
    } else {
      this.signinForm.markAllAsTouched();
    }
  }
}