import { inject, Injectable } from '@angular/core';
import { PerfilesType } from '../interfaces/app.interface';

export const FCM_TOKEN = 'push_notification_token';

@Injectable({
    providedIn: 'root',
})
export class SendPushService {
    private readonly API_BASE_URL =
        'https://haxpou-api-push-notifications.onrender.com';

    constructor() {}

    public async sendToRole(title: string, body: string, role: PerfilesType) {
        console.log('sending push to users with role: ' + role);

        await fetch(this.API_BASE_URL + '/notify-role', {
            method: 'POST', // Especifica que esta es una solicitud POST
            headers: {
                'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON
            },
            body: JSON.stringify({
                title,
                body,
                role,
            }),
        });
    }

    public async sendToToken(title: string, body: string, token: string) {
        const res = await fetch(this.API_BASE_URL + '/notify', {
            method: 'POST', // Especifica que esta es una solicitud POST
            headers: {
                'Content-Type': 'application/json', // Indica que el cuerpo de la solicitud es JSON
            },
            body: JSON.stringify({
                title,
                body,
                token,
            }),
        });
        const resData = await res.json();

    }
}
