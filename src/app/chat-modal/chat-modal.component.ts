import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss'],
})
export class ChatModalComponent implements OnInit {
  @Input() chatId!: string;
  @Input() chatPartnerEmail: string = "example@example.com"; // Añadido para mostrar el email en el header
  messages: any[] = [];
  newMessage: string = ''; // Propiedad para el nuevo mensaje

  constructor(private modalController: ModalController, private alertController: AlertController) {}

  ngOnInit() {
    if (this.chatId) {
      this.fetchMessages();
    } else {
      console.error('No chatId provided');
    }
  }

  async fetchMessages() {
    const authToken = localStorage.getItem('authToken');
    console.log('Auth Token:', authToken);
    console.log('Fetching messages for chat ID:', this.chatId);
  
    try {
      const response = await fetch(`https://backend-wassapp-4.onrender.com/api/chats/${this.chatId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Fetched data:', data);
  
      if (data && Array.isArray(data.messages)) {
        this.messages = data.messages;
      } else {
        console.error('Fetched data.messages is not an array:', data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      // Aquí deberías enviar el nuevo mensaje al backend
      console.log('Sending message:', this.newMessage);

      // Luego, puedes agregar el mensaje a la lista localmente
      this.messages.push({
        sender: 'Me',
        content: this.newMessage
      });

      // Limpiar el input
      this.newMessage = '';
    }
  }

  async sendAudio() {
    const alert = await this.alertController.create({
      header: 'Lo Sentimos!',
      message: 'Por los momentos no pudimos implementar esta opción!  :(',
      buttons: ['OK'],
    });

    await alert.present();
  }

  onFocus() {
    console.log('Input focused');
  }
}
