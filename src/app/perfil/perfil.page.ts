import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalEmailComponent } from './modalemail.component.';
import { ModalDeleteComponent } from '../modaldelete/modaldelete.component';
import { ModalupdatepasswordComponent } from '../modalupdatepassword/modalupdatepassword.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  updateEmailForm: FormGroup;
  userEmail: string | null = ''; // Restaurado
  profileImageUrl: string = ''; // Atributo para la imagen de perfil

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private modalController: ModalController
  ) {
    this.updateEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.userEmail = localStorage.getItem('userEmail') || '';
    // Obtener la URL de la imagen de perfil del backend
    this.getProfileImage();
  }

  getProfileImage() {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('No auth token found');
      return;
    }

    const imageUrl = `http://localhost:8000/profile-image`; // Aquí puedes verificar si la URL es correcta
    console.log('Fetching profile image from URL:', imageUrl);

    fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching profile image');
      }
      return response.blob();
    })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      this.profileImageUrl = url; // Corregido aquí
    })
    .catch(error => {
      console.error('Error fetching profile image:', error);
    });
  }

  logout() {
    console.log('Logging out...');
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      location.reload();
      event.detail.complete();
    }, 2000);
  }

  goToTabs() {
    this.router.navigate(['/tabs']);
  }

  async openUpdateEmailModal() {
    const modal = await this.modalController.create({
      component: ModalEmailComponent,
      componentProps: { currentEmail: this.userEmail } // Asegúrate de pasar el email actual
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data) {
        const updatedEmail = data.data.newEmail;
        this.updateEmailForm.patchValue({ email: updatedEmail });
        localStorage.setItem('userEmail', updatedEmail);
        this.userEmail = updatedEmail;
      }

      // Refrescar la página después de cerrar el modal
      this.reloadProfilePage();
    });

    return await modal.present();
  }

  updateEmail() {
    if (this.updateEmailForm.valid) {
      const updatedEmail = this.updateEmailForm.get('email')?.value;
      console.log('Updating email:', updatedEmail);
      localStorage.setItem('userEmail', updatedEmail);
      this.userEmail = updatedEmail; 
    }
  }

  async openUpdatePasswordModal() {
    const modal = await this.modalController.create({
      component: ModalupdatepasswordComponent
    });
    return await modal.present();
  }

  async openDeleteAccountModal() {
    const modal = await this.modalController.create({
      component: ModalDeleteComponent,
    });

    modal.onDidDismiss().then((data) => {
      if (data && data.data && data.data.success) {
        console.log('User account deleted successfully');
        this.logout(); // Opcional: puedes cerrar la sesión automáticamente después de la eliminación
      } else {
        console.log('User account not deleted');
      }
    });

    return await modal.present();
  }

  // Método para recargar la página de perfil
  reloadProfilePage() {
    window.location.reload();
  }
}
 