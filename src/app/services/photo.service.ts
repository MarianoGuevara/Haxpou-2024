import { inject, Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { AngularFireStorage } from '@angular/fire/compat/storage';

import { AuthService } from './auth.service';
import { CollectionsNames } from '../utils/firebase-names.enum';

@Injectable({
    providedIn: 'root',
})
export class PhotoService {
    private storage = inject(AngularFireStorage);
    private authService = inject(AuthService);

    constructor() {}

    async takePhoto(): Promise<string> {
        const image = await Camera.getPhoto({
            quality: 90,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
        });
        return `data:image/jpeg;base64,${image.base64String}`;
    }

    async uploadPhoto(photoData: string): Promise<string | null> {
        // const user = this.authService.currentUserSig();
        // if (!user) {
        //     throw new Error('User not logged in');
        // }
        try {
            if (photoData !== '/assets/DefaultUser.png') {
                const fileName = `${new Date().getTime()}_img.jpg`;
                const filePath = `${CollectionsNames.IMAGENES_PERFIL}/${fileName}`;
                const fileRef = this.storage.ref(filePath);

                // Convert base64 to blob
                const response = await fetch(photoData);
                const blob = await response.blob();

                // Upload the photo to Firebase Storage
                await this.storage.upload(filePath, blob);

                // Get the download URL
                const url: string = await fileRef.getDownloadURL().toPromise();

                return url;
            } else {
                // si no puso ninguna img, devuelvo default
                return 'https://firebasestorage.googleapis.com/v0/b/apps-ionic-pps.appspot.com/o/users-photos%2F1729279893772_undefined.jpg?alt=media&token=21740d6d-c2d6-4bd6-a3cf-e3d724548bf8';
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
