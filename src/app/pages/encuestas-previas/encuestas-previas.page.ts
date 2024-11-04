import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { QrInicioAppComponent } from '../../components/homes/qr-inicio-app/qr-inicio-app.component';
import { DatabaseService } from 'src/app/services/database.service';
import { CommonModule } from '@angular/common';
import {
    IonBackButton,
    IonButtons,
    IonNote,
    IonFab,
    IonFabButton,
    IonInputPasswordToggle,
    IonInput,
} from '@ionic/angular/standalone';
import { NgxSpinnerService } from 'ngx-spinner';
import { Encuesta } from 'src/app/interfaces/app.interface';
import { GraficoComponent } from '../../components/grafico/grafico.component';

@Component({
    selector: 'app-encuestas-previas',
    templateUrl: './encuestas-previas.page.html',
    styleUrls: ['./encuestas-previas.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        IonBackButton,
        IonButton,
        IonButtons,
        IonNote,
        IonFab,
        IonFabButton,
        IonInputPasswordToggle,
        IonInput,
        RouterLink,
        QrInicioAppComponent,
        GraficoComponent,
    ],
})
export class EncuestasPreviasPage implements OnInit {
    auth = inject(AuthService);
    db = inject(DatabaseService);
    spinner = inject(NgxSpinnerService);
    encuestas: Encuesta[] = [];
    seriesComida: any = null;
    labelsComida: any = null;
    seriesComoConocio: any = null;
    labelsComoConocio: any = null;
    seriesLimpieza: any = null;
    labelsLimpieza: any = null;
    seriesAtencion: any = null;
    labelsAtencion: any = null;

    constructor() {
        // const s: Encuesta = {
        //     uid: '',
        //     foto1: '',
        //     foto2: '',
        //     foto3: '',
        //     fecha: new Date(),
        //     atencion_cliente: 7,
        //     comida: 0,
        //     como_conocio: 2,
        //     opinion_general: 'TODO OK',
        //     limpieza: 1,
        //     encuestado: 'ramiro',
        // };
        // this.db.agregarFalopaaaaaa(s, 'Encuestas');
    }

    async ngOnInit() {
        this.spinner.show();

        this.db.traerEncuestas().subscribe((data) => {
            this.encuestas = data;
            this.encuestas.forEach((encuesta) => {
                // normalizar la fecha...
                encuesta.fecha = this.deTimestampADate(encuesta.fecha);
            });
            console.log(this.encuestas);

            this.asignarParaComida();
            this.asignarParaComoConociste();
            this.asignarParaLimpieza();
            this.atencionAlClienteContenido();

            this.spinner.hide();
        });
    }

    deTimestampADate(timestamp: any): Date {
        return new Date(
            timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
        );
    }

    asignarParaComida() {
        let labels_comida: string[] = ['mala', 'buena', 'excelente'];
        let comida: number[] = [0, 0, 0];

        this.encuestas.forEach((encuesta) => {
            if (encuesta.comida == 0) {
                comida[0]++;
            } else if (encuesta.comida == 1) {
                comida[1]++;
            } else if (encuesta.comida == 2) {
                comida[2]++;
            }
        });

        this.labelsComida = labels_comida;
        this.seriesComida = comida;
    }

    asignarParaComoConociste() {
        let labels_conocio: string[] = [
            'recomendación',
            'redes sociales',
            'publicidad',
            'otro',
        ];
        let conocio: number[] = [0, 0, 0, 0];

        this.encuestas.forEach((encuesta) => {
            switch (encuesta.como_conocio) {
                case 0:
                    conocio[0]++;
                    break;
                case 1:
                    conocio[1]++;
                    break;
                case 2:
                    conocio[2]++;
                    break;
                case 3:
                    conocio[3]++;
                    break;
            }
        });
        this.seriesComoConocio = [{ name: '', data: conocio }];
        this.labelsComoConocio = labels_conocio;
    }

    asignarParaLimpieza() {
        let labels_conforme: string[] = ['si', 'no'];
        let conforme: number[] = [0, 0];

        this.encuestas.forEach((encuesta) => {
            switch (encuesta.limpieza) {
                case 0:
                    conforme[0]++;
                    break;
                case 1:
                    conforme[1]++;
                    break;
            }
        });
        this.seriesLimpieza = [{ name: '', data: conforme }];
        this.labelsLimpieza = labels_conforme;
    }

    atencionAlClienteContenido() {
        let labels_atencion: string[] = [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
        ];
        let atencion: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        this.encuestas.forEach((encuesta) => {
            switch (encuesta.atencion_cliente) {
                case 1:
                    atencion[0]++;
                    break;
                case 2:
                    atencion[1]++;
                    break;
                case 3:
                    atencion[2]++;
                    break;
                case 4:
                    atencion[3]++;
                    break;
                case 5:
                    atencion[4]++;
                    break;
                case 6:
                    atencion[5]++;
                    break;
                case 7:
                    atencion[6]++;
                    break;
                case 8:
                    atencion[7]++;
                    break;
                case 9:
                    atencion[8]++;
                    break;
                case 10:
                    atencion[9]++;
                    break;
            }
        });
        series: [
            {
                name: 'Desktops',
                data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
            },
        ];
        this.seriesAtencion = [{ name: '', data: atencion }];
        this.labelsAtencion = labels_atencion;
    }
}
