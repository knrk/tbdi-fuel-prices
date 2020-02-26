import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class PricesService {

  constructor(
    public firestore: AngularFirestore
  ) { }

  getPrices() {
    return this.firestore.collection('prices', ref => ref.orderBy('from', 'desc')).snapshotChanges();
  }
}
