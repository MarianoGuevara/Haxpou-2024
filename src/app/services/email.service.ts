import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  	constructor() { }

	// usar asincronico; en .then salió todo bien
	async enviarCorreo(
		destinatarioNombre: string,
		remitenteNombre: string,
		direccionCorreo: string,
		asunto: string,
		cuerpo: string,
		urlLogo: string
	): Promise<void> {
		const templateParams = {
			to_name: destinatarioNombre,
			from_name: remitenteNombre,
			message: cuerpo,
			subject: asunto,
			logo_url: urlLogo,
			to_email: direccionCorreo
		};
	
		try {
			const response: EmailJSResponseStatus = await emailjs.send(
				'haxpou2024', 
				'Haxpou2024-template', 
				templateParams, 
				'paTjMkufhSx00e3uw'
			);
			console.log('Correo enviado exitosamente!', response.status, response.text);
		} catch (error) {
			console.error('Error al enviar el correo:', error);
		}
	}
}
