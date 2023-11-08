import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ApiClient } from './api-client';

/**
 * @title Flex-layout tables with toggle-able sticky headers, footers, and columns
 */
@Component({
  selector: 'table-sticky-complex-flex-example',
  styleUrls: ['table-sticky-complex-flex-example.css'],
  templateUrl: 'table-sticky-complex-flex-example.html',
  animations: [
    trigger('detailExpandTop', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('0ms')),
    ]),
    trigger('detailExpandBottom', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('0ms')),
    ]),
  ],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    MatTableModule,
    MatSlideToggleModule,
    InfiniteScrollModule,
    AsyncPipe,
  ],
})
export class TableStickyComplexFlexExample implements OnInit {
  positions$$ = new BehaviorSubject<any[]>([]);

  suppliers$$ = new BehaviorSubject<any[]>([]);

  startPositionBatchIndex = 0;

  startSupplierBatchIndex = 0;

  isCollapsedTop: boolean = false;

  isCollapsedBottom: boolean = false;

  displayedColumnsTableTop$: Observable<string[]> = this.suppliers$$
    .asObservable()
    .pipe(
      map((suppliers) => {
        return [
          ...['expand', 'commercial-conditions'],
          ...suppliers.map((supplier) => supplier.id),
        ];
      })
    );

  displayedColumnsTableBottom$: Observable<string[]> = this.suppliers$$
    .asObservable()
    .pipe(
      map((suppliers) => {
        return [
          ...[
            'expandBottom',
            'quantity',
            'uom',
            'price-range',
            'price-range-toggle',
          ],
          ...suppliers.map((supplier) => supplier.id),
        ];
      })
    );

  dataSourcePositions$ = combineLatest([
    this.positions$$.asObservable(),
    this.suppliers$$.asObservable(),
  ]).pipe(
    map(([positions, suppliers]) => {
      const positionsWithSuppliers = positions.map((position) => {
        const positionId = position.id;

        const supplierValuesById: { [id: string]: any } = {};

        suppliers.forEach((supplier) => {
          supplierValuesById[supplier.id] = supplier.positions[positionId];
        });

        return {
          ...position,
          ...supplierValuesById,
        };
      });

      return [...positionsWithSuppliers];
    })
  );

  dataSourceTop$ = combineLatest([
    this.apiClient.getGeneralInfo$(),
    this.suppliers$$.asObservable(),
  ]).pipe(
    map(([generalInfoArray, suppliers]) => {
      const generalInfoWithSuppliers = generalInfoArray.map((item) => {
        const itemName = item.name; // 'total', 'savings', 'numberOfQuotedItems' etc

        const supplierValuesById: { [id: string]: any } = {};

        suppliers.forEach((supplier) => {
          supplierValuesById[supplier.id] = supplier[itemName];
        });

        return {
          ...item,
          ...supplierValuesById,
        };
      });

      return [...generalInfoWithSuppliers];
    })
  );

  constructor(private apiClient: ApiClient) {}

  ngOnInit(): void {
    this.apiClient
      .getPositions$(this.startPositionBatchIndex)
      .subscribe((positions) => {
        this.positions$$.next(positions);
      });

    this.apiClient
      .getSuppliersInfo$(this.startSupplierBatchIndex)
      .subscribe((suppliers) => {
        this.suppliers$$.next(suppliers);
      });
  }

  whenMain(index: number): boolean {
    // when we should use row template for main fields: total, savings
    return index < 2;
  }

  whenCollapsible(index: number): boolean {
    // when we should use row template for collapsible fields
    return index < 6;
  }

  toggleCollapsedTop(): void {
    this.isCollapsedTop = !this.isCollapsedTop;
  }

  toggleCollapseBottom(): void {
    this.isCollapsedBottom = !this.isCollapsedBottom;
  }

  onScroll(): void {
    console.log('scrolled vertically');

    // imitating loading 2 more batches of positions

    this.startPositionBatchIndex += 10;

    if (this.startPositionBatchIndex >= 30) {
      return;
    }

    this.apiClient
      .getPositions$(this.startPositionBatchIndex)
      .subscribe((positions: any[]) => {
        this.positions$$.next([...this.positions$$.getValue(), ...positions]);
      });
  }

  onHorizontalScroll() {
    console.log('scrolled horizontally');

    // imitating loading 2 more batches of suppliers

    this.startSupplierBatchIndex += 5;

    if (this.startSupplierBatchIndex >= 15) {
      return;
    }

    this.apiClient
      .getSuppliersInfo$(this.startSupplierBatchIndex)
      .subscribe((suppliers: any[]) => {
        this.suppliers$$.next([...this.suppliers$$.getValue(), ...suppliers]);
      });
  }
}
