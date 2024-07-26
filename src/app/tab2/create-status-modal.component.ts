import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-status-modal',
  templateUrl: './create-status-modal.component.html',
  styleUrls: ['./create-status-modal.component.scss'],
})
export class CreateStatusModalComponent {
  createStatusForm: FormGroup;
  selectedFile: File | null = null; // Inicializar selectedFile
  imagePreview: SafeUrl | null = null; // Para la vista previa de la imagen

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private alertController: AlertController
  ) {
    this.createStatusForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      // Generar la vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
      };
      reader.readAsDataURL(file);

      // Actualizar el valor del control de imagen
      this.createStatusForm.get('image')?.setValue(file);
    }
  }

  async createStatus() {
    if (!this.createStatusForm.valid) {
      // Marcar todos los campos como tocados para mostrar errores de validación
      this.createStatusForm.markAllAsTouched();
      return;
    }

    if (!this.selectedFile) {
      await this.showAlert('Error', 'Please select an image file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.createStatusForm.get('title')?.value);
    formData.append('description', this.createStatusForm.get('description')?.value);
    formData.append('image', this.selectedFile);
    formData.append('userEmail', localStorage.getItem('userEmail')!); // Obtener el email del usuario del localStorage

    const authToken = localStorage.getItem('authToken') || '';

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    this.http.post('https://backend-wassapp-4.onrender.com/api/status/create', formData, { headers }).subscribe(
      async (response: any) => {
        console.log('Status created:', response);
        await this.showAlert('Success', 'Status created successfully!');
        this.closeModal(); // Cerrar el modal después de la alerta
      },
      async (error) => {
        console.error('Error creating status:', error);
        await this.showAlert('Error', 'Failed to create status. Please try again.');
      }
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
