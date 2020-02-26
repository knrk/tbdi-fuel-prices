import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';

import { IPrice } from '@shared/models/IPrice';
import { PricesService } from '@core/services/prices.service';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  private latestSubject = new Subject<void>();
  public latest: {[key: string]: IPrice};

  public $prices: Observable<IPrice[]>;

  // public lineChartData: ChartDataSets[] = [
  //   { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //   { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  //   { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  // ];
  // public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
  //   responsive: true,
  //   scales: {
  //     xAxes: [{}],
  //     yAxes: [
  //       {
  //         id: 'y-axis-0',
  //         position: 'left',
  //       },
  //       {
  //         id: 'y-axis-1',
  //         position: 'right',
  //         gridLines: {
  //           color: 'rgba(255,0,0,0.3)',
  //         },
  //         ticks: {
  //           fontColor: 'red',
  //         }
  //       }
  //     ]
  //   },
  //   annotation: {
  //     annotations: [
  //       {
  //         type: 'line',
  //         mode: 'vertical',
  //         scaleID: 'x-axis-0',
  //         value: 'March',
  //         borderColor: 'orange',
  //         borderWidth: 2,
  //         label: {
  //           enabled: true,
  //           fontColor: 'orange',
  //           content: 'LineAnno'
  //         }
  //       },
  //     ],
  //   },
  // };
  // public lineChartColors: Color[] = [
  //   { // grey
  //     backgroundColor: 'rgba(148,159,177,0.2)',
  //     borderColor: 'rgba(148,159,177,1)',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   },
  //   { // dark grey
  //     backgroundColor: 'rgba(77,83,96,0.2)',
  //     borderColor: 'rgba(77,83,96,1)',
  //     pointBackgroundColor: 'rgba(77,83,96,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(77,83,96,1)'
  //   },
  //   { // red
  //     backgroundColor: 'rgba(255,0,0,0.3)',
  //     borderColor: 'red',
  //     pointBackgroundColor: 'rgba(148,159,177,1)',
  //     pointBorderColor: '#fff',
  //     pointHoverBackgroundColor: '#fff',
  //     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  //   }
  // ];
  // public lineChartLegend = true;
  // public lineChartType = 'line';

  // @ViewChild(BaseChartDirective) chart: BaseChartDirective;

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
