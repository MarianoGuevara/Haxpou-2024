import { Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
} from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import {
    Cliente,
    Empleado,
    MesaMessage,
    MesaMessageFromFirestore,
    MozoMessage,
    MozoMessageFromFirestore,
} from 'src/app/interfaces/app.interface';
import { Timestamp } from '@angular/fire/firestore';
import { MessageService } from 'src/app/services/message.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { SendPushService } from 'src/app/services/api-push.service';

@Component({
    selector: 'app-chat-mozo',
    templateUrl: './chat-mozo.page.html',
    styleUrls: ['./chat-mozo.page.scss'],
    standalone: true,
    imports: [
        IonContent,
        IonHeader,
        IonTitle,
        IonToolbar,
        CommonModule,
        FormsModule,
        IonButtons,
        IonBackButton,
    ],
})
export class ChatMozoPage {
    protected messageService = inject(MessageService);
    authService = inject(AuthService);
    private spinner = inject(NgxSpinnerService);
    private activatedRoute = inject(ActivatedRoute);
    private sendPushService = inject(SendPushService);

    protected numeroMesaActual!: number;
    protected isUserMozo!: boolean;

    groupedMessages: {
        date: string;
        messages: MesaMessage[] | MozoMessage[];
    }[] = [];

    messageContentToSend: string = '';

    constructor() {
        this.spinner.show();
        this.activatedRoute.paramMap.subscribe((params) => {
            this.numeroMesaActual = parseInt(params.get('numeroMesa')!);
        });

        effect(() => {
            if (this.authService.currentUserSig()) {
                this.isUserMozo =
                    this.authService.currentUserSig()?.role === 'mozo';

                this.getMessagesFromDB();
            }
        });
    }

    async sendMessageFromClientToDB() {
        const messageToSend: MesaMessageFromFirestore = {
            userId: this.authService.currentUserSig()?.uid!,
            content: this.messageContentToSend,
            createdAt: Timestamp.now(),
            numeroMesa: this.numeroMesaActual,
        };
        console.log(messageToSend);
        this.messageContentToSend = '';

        await this.messageService.sendMessage(messageToSend);

        this.sendPushService.sendToRole(
            'Consulta de cliente',
            `En la mesa ${this.numeroMesaActual} el cliente tiene una constulta`,
            'mozo'
        );

        // update the chat with the new message
        this.getMessagesFromDB();
    }

    async sendMessageFromMozoToDB() {
        if (this.isUserMozo) {
            const messageToSend: MozoMessageFromFirestore = {
                userId: this.authService.currentUserSig()?.uid!,
                content: this.messageContentToSend,
                createdAt: Timestamp.now(),
                numeroMesa: this.numeroMesaActual,
                nombreMozo: (this.authService.currentUserSig() as Empleado)
                    .nombre,
            };
            this.messageContentToSend = '';

            await this.messageService.sendMessage(messageToSend);
        }

        // update the chat with the new message
        this.getMessagesFromDB();
    }

    castMessageToMozoMessage(message: MesaMessage | MozoMessage) {
        return message as MozoMessage;
    }

    private getMessagesFromDB() {
        this.messageService
            .getMensajesMesa(this.numeroMesaActual)
            .subscribe((messages) => {
                this.groupMessagesByDate(messages);

                this.spinner.hide();
            });
    }

    private groupMessagesByDate(messages: (MesaMessage | MozoMessage)[]) {
        const grouped: {
            date: string;
            messages: (MesaMessage | MozoMessage)[];
        }[] = [];

        messages.forEach((message: MesaMessage | MozoMessage) => {
            const messageDate = message.createdAt;
            const formattedDate = this.getFormattedDate(messageDate);

            // Busca si ya existe un grupo con la misma fecha
            const group = grouped.find((g) => g.date === formattedDate);
            if (group) {
                group.messages.push(message);
            } else {
                grouped.push({ date: formattedDate, messages: [message] });
            }
        });

        this.groupedMessages = grouped;
    }

    private getFormattedDate(date: Date): string {
        const today = new Date();
        const yesterday = new Date();
        const twoDaysAgo = new Date();

        yesterday.setDate(today.getDate() - 1);
        twoDaysAgo.setDate(today.getDate() - 2);

        // Comparar solo día, mes, y año (ignorando la hora)
        if (this.isSameDay(date, today)) {
            return 'Hoy';
        } else if (this.isSameDay(date, yesterday)) {
            return 'Ayer';
        } else if (this.isSameDay(date, twoDaysAgo)) {
            return 'Anteayer';
        } else if (date.getFullYear() === today.getFullYear()) {
            return this.formatDateWithoutYear(date);
        } else {
            return this.formatDateWithYear(date);
        }
    }

    private isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }

    private formatDateWithoutYear(date: Date): string {
        const months = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        return `${date.getDate()} de ${months[date.getMonth()]}`;
    }

    private formatDateWithYear(date: Date): string {
        const months = [
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];
        return `${date.getDate()} de ${
            months[date.getMonth()]
        } del ${date.getFullYear()}`;
    }
}
