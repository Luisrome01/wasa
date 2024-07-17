import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  chats = [
    { name: 'Chacon', message: 'Tu madre', profileImage: 'assets/avatar1.png' },
    { name: 'Ale', message: 'Q fuee', profileImage: 'assets/avatar2.png' },
    { name: 'Mami', message: 'donde estai', profileImage: 'assets/avatar3.png' }
  ];

  constructor() {}
}
