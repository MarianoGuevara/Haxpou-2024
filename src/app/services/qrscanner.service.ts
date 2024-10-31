import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';

@Injectable({
    providedIn: 'root',
})
export class QrscannerService {
    constructor() {}

    async startScan() {
        try {
            const result = await CapacitorBarcodeScanner.scanBarcode({
                hint: 17,
                cameraDirection: 1,
            });

            return result.ScanResult;
        } catch (error) {
            return null;
        }
    } // end of startScan
}
