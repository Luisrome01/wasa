import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  chats: any[] = [];
  private apiUrl = 'http://localhost:8000/api/chats'; // Ajusta la URL según tu backend

  constructor() { }

  ngOnInit() {
    this.fetchChats();
  }

  async fetchChats() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched chats:', data); // Agregado para depuración

      // Ordenar los chats alfabéticamente por el email del miembro
      this.chats = data
        .sort((a: any, b: any) => {
          const emailA = a.member?.email?.toLowerCase() || '';
          const emailB = b.member?.email?.toLowerCase() || '';
          // Ordenar alfabéticamente
          return emailA.localeCompare(emailB);
        })
        .sort((a: any, b: any) => {
          const nameA = a.member?.email || 'No member info';
          const nameB = b.member?.email || 'No member info';
          // Mover los chats sin información al final
          return nameA === 'No member info' ? 1 : nameB === 'No member info' ? -1 : 0;
        });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }
}
