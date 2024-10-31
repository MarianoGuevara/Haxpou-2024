import { Component, OnInit } from '@angular/core';
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
import { Cliente } from 'src/app/interfaces/user-details.interface';

@Component({
  selector: 'app-clientes-pendientes',
  templateUrl: './clientes-pendientes.page.html',
  styleUrls: ['./clientes-pendientes.page.scss'],
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
],
})
export class ClientesPendientesPage implements OnInit {

  clientes : Cliente[] = [];
  cargando : boolean = false;


  constructor(private db : DatabaseService) {}

  ngOnInit() {
    this.cargando = true;
    this.db.traerClientesPendientes().subscribe((data) => {
      this.clientes = data;
      this.cargando = false;
    })
  }

  aprobar(cliente : Cliente) : void
  {

  }

}
