import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { IPrice } from '@shared/models/IPrice';


@Injectable({
  providedIn: 'root'
})
export class PricesService {

  private collectionId: string = 'prices';

  constructor(
    public firestore: AngularFirestore
  ) { }

  getPrices() {
    return this.firestore.collection(this.collectionId, ref => ref.orderBy('from', 'desc')).snapshotChanges();
  }

  addPrice(price: IPrice) {
    return this.firestore.collection(this.collectionId).add(price);
  }
}
