import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonBackButton,
    IonButtons,
    AlertController,
    IonNote,
    IonFab,
    IonFabButton,
    IonInputPasswordToggle,
    IonInput,
} from '@ionic/angular/standalone';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Cliente, Mesa, SituacionCliente, UserDetails } from 'src/app/interfaces/app.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailService } from 'src/app/services/email.service';
import { Router, RouterModule } from '@angular/router';
import { QrscannerService } from 'src/app/services/qrscanner.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.page.html',
  styleUrls: ['./mesas.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonNote,
    IonFab,
    IonFabButton,
    IonInputPasswordToggle,
    ReactiveFormsModule,
    IonInput,
    RouterModule,
],
})
export class MesasPage implements OnInit {

  spinner = inject(NgxSpinnerService);
  db = inject(DatabaseService);
  qr = inject(QrscannerService);
  alertController = inject(AlertController);
  auth = inject(AuthService);
  cliente : UserDetails | null | undefined;

  qrMesaSeleccionada : string | null = null;

  mesas : Mesa[] = [];

  constructor() { 
    this.cliente = this.auth.currentUserSig()
  }

  ngOnInit() {
    this.spinner.show();
    this.db.traerMesas().subscribe((data) => {
      this.mesas = data;
      this.spinner.hide();
    })
  }


  async mostrarQr(mesa : Mesa) : Promise<void>
  {
    this.qrMesaSeleccionada = mesa.qr;

    await this.qr.startScan();

    this.verificarQrCorresponde(mesa);
  }

  async verificarQrCorresponde(mesa: Mesa)
  {
    try
    {
      var mesaConCliente  = await this.verificarClienteTieneMesa();
      if(!mesa.disponible)
      {
        if(mesa.idCliente !== this.cliente?.uid)
        {
          this.showAlert('Mesa ocupada',`Esta mesa esta ocupada por ${this.cliente?.nombre}, tu mesa asignada es la numero ${mesaConCliente.numero}`);
        }
      }
      else
      {
        this.showAlert('Mesa no correspondiente',`Tu mesa asignada es la numero ${mesaConCliente.numero}`);
      }
    }
    catch(error : any)
    {
      this.showAlert('Error', (error as Error).message)
    }

  }

  async verificarClienteTieneMesa() 
  {
    const resp = await this.db.traerClienteDeUnaMesa(this.cliente?.uid!);

    if(resp.empty)
    {
      throw new Error('No tienes una mesa asignada');
    }
    else
    {
      return resp.docs[0].data() as Mesa;
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
        header,
        message,
        buttons: ['Aceptar'],
        cssClass: 'custom-alert-class',
    });
    await alert.present();
}

}
