import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-encuesta-alta',
  templateUrl: './encuesta-alta.page.html',
  styleUrls: ['./encuesta-alta.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EncuestaAltaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
