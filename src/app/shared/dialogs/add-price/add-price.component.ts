import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, FormBuilder } from '@angular/forms';

import { PricesService } from '@core/services/prices.service';
import { NbWindowRef, NbDatepicker, NbDatepickerComponent } from '@nebular/theme';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.scss']
})
export class AddPriceComponent implements OnInit {

  public addPrice: FormGroup;

  @ViewChild('fromDate') fromDate: any;
  @ViewChild('toDate') toDate: any;

  constructor(
    private fb: FormBuilder,
    private priceService: PricesService,
    protected windowRef: NbWindowRef
  ) { }

  ngOnInit(): void {

    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
    const plusWeek = new Date(new Date().setDate(new Date().getDate() + 8));

    this.addPrice = this.fb.group({
      crude: this.fb.control('30.00'),
      petrol: this.fb.control('30.00'),
      from: this.fb.control(tomorrow),
      to: this.fb.control(plusWeek)
    })
  }

  onAdd() {
    // console.log(this.addPrice.value)
    const { from, to, crude, petrol } = this.addPrice.value;
    this.priceService.addPrice({
      from, to, 
      price: petrol,
      fuel: 'petrol',
      published: true
    });
    this.priceService.addPrice({
      from, to, 
      price: crude,
      fuel: 'crude',
      published: true
    });

    this.windowRef.close();
  }

  onFromDateChanged(fromDate) {
    const from = new Date(new Date().setDate(new Date(fromDate).getDate() + 6));
    this.toDate.hostRef.nativeElement.value = from.toLocaleDateString('cs-CZ');
  }

}
