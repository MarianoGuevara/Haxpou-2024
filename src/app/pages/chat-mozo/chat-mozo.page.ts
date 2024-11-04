import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
} from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { AuthService } from 'src/app/services/auth.service';
import {
    Cliente,
    MesaMessage,
    MesaMessageFromFirestore,
    MozoMessage,
} from 'src/app/interfaces/app.interface';
import { Timestamp } from '@angular/fire/firestore';
import { MessageService } from 'src/app/services/message.service';

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
    ],
})
export class ChatMozoPage implements OnInit {
    protected messageService = inject(MessageService);
    authService = inject(AuthService);

    protected numeroMesaActual!: number;
    messages: MesaMessage[] | MozoMessage[] = [];
    groupedMessages: {
        date: string;
        messages: MesaMessage[] | MozoMessage[];
    }[] = [];

    messageContentToSend: string = '';

    ngOnInit(): void {
        this.numeroMesaActual = (
            this.authService.currentUserSig() as Cliente
        ).mesaAsignada;

        this.getMessagesFromDB();
    }

    async sendMessageToDB() {
        const messageToSend: MesaMessageFromFirestore = {
            content: this.messageContentToSend,
            createdAt: Timestamp.now(),
            numeroMesa: this.numeroMesaActual,
        };

        await this.messageService.sendMessage(messageToSend);

        // update the chat with the new message
        // this.getMessagesFromDB();
    }

    getMessagesFromDB() {
        this.messageService
            .getMensajesMesa(this.numeroMesaActual)
            .subscribe((messages) => {
                this.groupMessagesByDate(messages);
            });
    }

    groupMessagesByDate(messages: (MesaMessage| MozoMessage)[]) {
        const grouped: {
            date: string;
            messages: (MesaMessage| MozoMessage)[];
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

    getFormattedDate(date: Date): string {
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

    isSameDay(date1: Date, date2: Date): boolean {
        return (
            date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear()
        );
    }

    formatDateWithoutYear(date: Date): string {
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

    formatDateWithYear(date: Date): string {
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
