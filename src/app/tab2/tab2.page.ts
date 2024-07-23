import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  statuses: any[] = [];
  apiUrl = 'http://localhost:8000/api/status/all';
  showCreateStatusModal = false;
  createStatusForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
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
}
