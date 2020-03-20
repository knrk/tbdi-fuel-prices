import { Component, OnInit, ViewChild, Input, AfterViewInit, ElementRef } from '@angular/core';

import * as moment from 'moment';

import { FormGroup, FormBuilder } from '@angular/forms';

import { PricesService } from '@core/services/prices.service';
import { NbWindowRef } from '@nebular/theme';

@Component({
  selector: 'app-add-price',
  templateUrl: './add-price.component.html',
  styleUrls: ['./add-price.component.scss']
})
export class AddPriceComponent implements OnInit, AfterViewInit {

  public addPriceForm: FormGroup;

  @Input() latestCrudePrice: number;
  @Input() latestPetrolPrice: number;

  @Input() initialFromDate: Date = new Date(new Date().setDate(new Date().getDate() + 1));
  @Input() initialToDate: Date = new Date(new Date().setDate(new Date().getDate() + 7));

  @ViewChild('fromDate') fromDate: any;
  @ViewChild('toDate') toDate: any;

  @ViewChild('focusEl') focusEl: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private priceService: PricesService,
    protected windowRef: NbWindowRef
  ) { }

  ngOnInit(): void {

    this.addPriceForm = this.formBuilder.group({
      crude: this.formBuilder.control(this.latestCrudePrice),
      petrol: this.formBuilder.control(this.latestPetrolPrice),
      from: this.formBuilder.control(this.initialFromDate),
      to: this.formBuilder.control(this.initialToDate)
    }, {
      updateOn: 'change'      
    })
  }

  ngAfterViewInit() {
    this.focusEl.nativeElement.focus();
  }

  onAdd() {
    // console.log(this.addPriceForm)
    if (this.addPriceForm.valid) {
      let { from, to, crude, petrol } = this.addPriceForm.value;

      from = moment(from, moment.defaultFormat).toDate();
      to = moment(to, moment.defaultFormat).toDate();

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
    }

    this.windowRef.close();
  }

  onClose() {
    this.windowRef.close();
  }

  onFromDateChanged(changeEvent) {
    const updatedToDate = new Date(new Date().setDate(new Date(changeEvent.target.value).getDate() + 6));
    // this.toDate.hostRef.nativeElement.value = updatedToDate.toLocaleDateString('cs-CZ');
    this.addPriceForm.controls['to'].setValue(moment(updatedToDate).format('YYYY-MM-DD'));
  }

}
