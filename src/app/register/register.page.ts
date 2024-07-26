import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  registerForm: FormGroup;
  passwordFieldType: string = 'password';
  confirmPasswordFieldType: string = 'password';
  selectedFile: File | null = null; // Variable para almacenar la imagen de perfil seleccionada

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
      confirmPassword: ['', Validators.required],
      profileImage: [null, Validators.required] // Asegúrate de que este campo es requerido
    }, {
      validators: this.passwordMatchValidator
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Archivo seleccionado:', this.selectedFile);
      this.registerForm.patchValue({ profileImage: this.selectedFile });
      this.registerForm.get('profileImage')?.updateValueAndValidity(); // Actualiza la validez del campo
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { email, password, confirmPassword } = this.registerForm.value;
      if (password !== confirmPassword) {
        this.presentAlert('Error', 'Las contraseñas no coinciden.');
        return;
      }

      if (!this.selectedFile) {
        this.presentAlert('Error', 'Por favor, selecciona una imagen de perfil.');
        return;
      }

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profileImage', this.selectedFile);

      // Verificar el contenido de FormData
      console.log('Contenido de FormData:', formData.get('email'), formData.get('password'), formData.get('profileImage'));

      fetch('https://backend-wassapp-4.onrender.com/api/users/createUser', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjlmNDIyNGE4MDU3MTM5YWUxNTZiNmYiLCJpYXQiOjE3MjE4NDQ3Mjl9.hKyHTfYzSiZMHSDFftCaZfy3QrjoCHDgYtGycs53wpY'
        },
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          if (response.status === 400) {
            return response.json().then(errorData => {
              throw new Error('Email ya existe');
            });
          } else {
            throw new Error('Ocurrió un error al registrar.');
          }
        }
        return response.json();
      })
      .then(data => {
        this.router.navigate(['/login']);
      })
      .catch(error => {
        console.error('Error al registrar:', error);
        if (error.message === 'Email ya existe') {
          this.presentAlert('Error', 'El email ya está registrado. Por favor, utiliza otro email.');
        } else {
          this.presentAlert('Error', 'Ocurrió un error al registrar. Por favor, intenta de nuevo más tarde.');
        }
      });
    } else {
      console.log('Form is invalid');
      this.presentAlert('Error', 'Por favor, verifica que el email sea valido y que la contraseña coincida con su confirmacion.');
      if (!this.selectedFile) {
        this.presentAlert('Error', 'Asegúrate de haber seleccionado una imagen de perfil.');
      }
      this.markFormGroupTouched(this.registerForm);
    }
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'confirmPassword') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();
      event.detail.complete();
    }, 2000);
  }

  passwordMatchValidator = (form: FormGroup) => {
    const password = form.get('password')!;
    const confirmPassword = form.get('confirmPassword')!;
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
  };
}
