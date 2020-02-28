import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { NbWindowService } from '@nebular/theme';

import { IPrice } from '@shared/models/IPrice';
import { PricesService } from '@core/services/prices.service';
import { AddPriceComponent } from '@shared/dialogs/add-price/add-price.component'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'fuel-price-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private latestSubject = new Subject<void>();
  public latest: {[key: string]: IPrice};

  public $prices: Observable<IPrice[]>;

  // public chartConfig = {
  //   // labels: ['Led', 'Un', 'Bre', 'Dub', 'Kve', 'Cer', 'Cvn', 'Srp', 'Za', 'Ri', 'Li', 'Pro'],
  //   datasets: [{
  //       label: null,
  //       // data: [65, 59, 80, 81, 56, 55, 40],
  //       fill: false,
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(255, 159, 64, 0.2)',
  //         'rgba(255, 205, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(201, 203, 207, 0.2)',
  //       ],
  //       borderColor: [
  //         'rgb(255, 99, 132)',
  //         'rgb(255, 159, 64)',
  //         'rgb(255, 205, 86)',
  //         'rgb(75, 192, 192)',
  //         'rgb(54, 162, 235)',
  //         'rgb(153, 102, 255)',
  //         'rgb(201, 203, 207)',
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };


  constructor(
    private pricesService: PricesService,
    private windowService: NbWindowService
  ) { 
    
  }

  ngOnInit() {
    this.getPrices();
    this.getLatestPrices();
    this.setChart();
  }

  ngOnDestroy() {
    this.latestSubject.next();
    this.latestSubject.complete();
  }

  trackByFn(index, item) {
    return item.id;
  }

  setChart() {
    // let chartConfig = {
    //   ...this.chartConfig,
    //   datasets: [{
    //     data: []
    //   }]
    // }

    // this.chartConfig = chartConfig;
  }

  getPrices() {
    this.$prices = this.pricesService.getPrices().pipe(
      map(data => {
        return data.map((c: any) => {
          return {
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
            from: new Date(+c.payload.doc.get('from').toDate()),
            to: new Date(c.payload.doc.get('to').toDate())
          } as IPrice;
        });
      })
    )
  }

  getLatestPrices(period: number = 7) {
    this.$prices.pipe(
      takeUntil(this.latestSubject),
      map(data => {
        return data.filter((item: any) => {
          const beforeWeekDate = new Date(new Date().setDate(new Date().getDate() - period));
          const publishDate = new Date(item.from);
          // return latest price only
          if (publishDate > beforeWeekDate) {
            return item;
          }
        });
      })
    ).subscribe(data => {
      
      this.latest = data.reduce((obj, oitem) => {
        const { fuel, ...rest } = oitem;
        return {
          ...obj,
          [fuel]: rest
        }
      }, {});

    });
  }

  onAdd($event) {
    this.windowService.open(AddPriceComponent, { hasBackdrop: true, windowClass: 'stretch'});
  }
}
