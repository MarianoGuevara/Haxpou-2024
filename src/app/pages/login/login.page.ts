import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonInput, IonLabel, IonItem, IonCard, IonContent, IonInputPasswordToggle  } from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonButton, IonInput, IonLabel, IonItem, IonCard, IonContent, IonInputPasswordToggle ]
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
