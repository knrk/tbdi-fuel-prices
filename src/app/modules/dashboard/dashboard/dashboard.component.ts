import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { IPrice } from '@shared/models/IPrice';
import { PricesService } from '@core/services/prices.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private latestSubject = new Subject<void>();
  public latest: {[key: string]: IPrice};

  public $prices: Observable<IPrice[]>;


  constructor(
    private pricesService: PricesService
  ) { 
    
  }

  ngOnInit() {
    this.getPrices();
    this.getLatestPrices();
  }

  ngOnDestroy() {
    this.latestSubject.next();
    this.latestSubject.complete();
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
}
