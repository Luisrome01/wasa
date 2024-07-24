import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { CreateStatusModalComponent } from './create-status-modal.component'; // Importa el componente modal

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  statuses: any[] = [];
  apiUrl = 'http://localhost:8000/api/status/all';
  createStatusForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private modalController: ModalController // Asegúrate de que ModalController está inyectado
  ) {
    this.createStatusForm = this.formBuilder.group({
      title: ['', Validators.required],
      imageUrl: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getStatuses().subscribe(
      (data: any[]) => {
        console.log('Data received:', data);
        this.statuses = data;
      },
      (error) => {
        console.error('Error fetching statuses:', error);
      }
    );
  }

  getStatuses(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  async openCreateStatusModal() {
    const modal = await this.modalController.create({
      component: CreateStatusModalComponent // Asegúrate de que este sea el componente correcto para el modal
    });
    modal.onDidDismiss().then(() => {
      // Volver a obtener los estados después de cerrar el modal
      this.getStatuses().subscribe(
        (data: any[]) => {
          console.log('Data received:', data);
          this.statuses = data;
        },
        (error) => {
          console.error('Error fetching statuses:', error);
        }
      );
    });
    return await modal.present();
  }
}
