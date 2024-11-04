import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, ref, listAll, getDownloadURL, list } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }


  async obtenerQrMesa(numeroMesa : string) : Promise<string>
  {

    const path = `qr/mesa${numeroMesa}.png`;
    const ref = this.storage.ref(path);

    const url = await ref.getDownloadURL().toPromise();

    return url;
  }
}
