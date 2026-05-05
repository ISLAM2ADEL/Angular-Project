import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { minLength } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: '../../SharedAuthStyle/SharedAuth.css',
})
export class Signup {
  signupForm: FormGroup;
  isPasswordVisible: boolean = false;
private authService = inject(Auth);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required,Validators.pattern(/^01[0125][0-9]{8}$/)]],
    });
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.register(this.signupForm.value).subscribe({
        next: (response) => {
          console.log('Registration successful:', response);
          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created successfully! Please sign in to continue.',
            confirmButtonColor: '#3b1e2a',
          })
          this.router.navigate(['/sign-in']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.error.message || 'An error occurred during registration. Please try again.',
            confirmButtonColor: '#3b1e2a',
          })
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
