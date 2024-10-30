import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonBackButton, IonButtons } from '@ionic/angular/standalone';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-alta-ds',
  templateUrl: './alta-ds.page.html',
  styleUrls: ['./alta-ds.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonBackButton, IonButton, IonButtons]
})
export class AltaDSPage implements OnInit {

  constructor() { }

  ngOnInit() 
  {
  }


  async tomarFoto() : Promise<void>
  {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });

    //validamos que haya sacado la foto
    if(image && image.dataUrl)
    {

    }
  }

}
