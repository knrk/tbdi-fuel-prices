import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ } from '@angular/core';
import { map, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { NbWindowService } from '@nebular/theme';

import { curveLinear, curveNatural } from 'd3-shape';

import { IPrice } from '@shared/models/IPrice';
import { PricesService } from '@core/services/prices.service';
import { AddPriceComponent } from '@shared/dialogs/add-price/add-price.component'
import { AuthService } from '@core/services/auth.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'fuel-price-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public isLogged: boolean = false;

  private latestSubject = new Subject<void>();
  private historySubject = new Subject<void>();

  public latest: {[key: string]: IPrice};

  public $prices: Observable<IPrice[]>;
  public $chartPrices: Observable<any[]>;
  public chartConfig = {};

  constructor(
    private pricesService: PricesService,
    private windowService: NbWindowService,
    private authService: AuthService
  ) { 
    
  }

  ngOnInit() {
    this.getPrices();
    this.getLatestPrices();

    this.setChart();

    this.$chartPrices = this.getChartData();

    this.isLogged = this.authService.isAuthenticated();
  }

  ngOnDestroy() {
    this.latestSubject.next();
    this.latestSubject.complete();
    this.historySubject.next();
    this.historySubject.complete();
  }


  filterPriceOlderWeek(price: any) {
    const beforeWeek = new Date(new Date().setDate(new Date().getDate() - 7));
    return price.from < beforeWeek ? true : false;
  }

  trackByFn(index, item) {
    return item.id;
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

  setChart() {    
    this.chartConfig = {
      colorScheme: {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
      },
      view: [500, 120],
      legend: false,
      showLabels: false,
      animations: true,
      autoScale: true,
      yScaleMin: 20,
      yScaleMax: 40,
      curve: curveNatural,
      xAxis: false,
      yAxis: false,
      showYAxisLabel: true,
      showXAxisLabel: true
    }
  }

  getChartData() {

    return this.$prices.pipe(
      takeUntil(this.historySubject),
      map(data => {
        return data.filter((item: any) => {
          const publishDate = new Date(item.from);
          if (publishDate < new Date()) {
            return item;
          }
        });
      }),
      map(data => {
        
        let crudePrices = [];
        let petrolPrices = [];

        data.forEach((oitem) => {
          const { fuel, ...rest } = oitem;
         
          if (fuel == 'crude') {
            crudePrices.push(rest)
          }
  
          if (fuel == 'petrol') {
            petrolPrices.push(rest)
          }
        });
          
        return [{
          "name": "Nafta",
          "series": crudePrices.map(item => {
              return {
                "name": item.from,
                "value": item.price
              }
          }),
        },
        {
          "name": "Benzin",
          "series": petrolPrices.map(item => {
              return {
                "name": item.from,
                "value": item.price
              }
          })
        }];  
      })
    )

    // return [
    //   {
    //     "name": "Nafta",
    //     "series": [{
    //         "name": "11.2.",
    //         "value": 29.69
    //       }, {
    //         "name": "18.2.",
    //         "value": 35.21
    //       }, {
    //         "name": "25.2.",
    //         "value": 30.45
    //       }
    //     ]
    //   }, 
    //   {
    //     "name": "Benzin",
    //     "series": [{
    //         "name": "11.2.",
    //         "value": 31.20
    //       }, {
    //         "name": "18.2.",
    //         "value": 32.50
    //       }, {
    //         "name": "25.2.",
    //         "value": 33.10
    //       }
    //     ]
    //   }
    // ]
  }

  onAdd($event) {
    this.windowService.open(AddPriceComponent, { hasBackdrop: true, windowClass: 'stretch'});
  }
}
