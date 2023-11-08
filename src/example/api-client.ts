import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  getGeneralInfo$(): Observable<any[]> {
    return of([
      {
        name: 'total',
        label: 'Total',
        conditions: null,
        bg: 'blanchedalmond',
      },
      {
        name: 'savings',
        label: 'Savings',
        conditions: null,
        bg: 'lavender',
      },
      {
        name: 'numberOfQuotedItems',
        label: 'No. of quoted items',
        conditions: 'net 30, net 60',
      },
      {
        name: 'paymentTerms',
        label: 'Payment terms',
        conditions: '21.10.24',
      },
      {
        name: 'contractPeriod',
        label: 'Contract period',
        conditions: '21.10.24',
      },
      {
        name: 'deliveryDate',
        label: 'Delivery date',
        conditions: '21.10.24',
      },
    ]);
  }

  getSuppliersInfo$(start: number) {
    return of(getSuppliers(start));
  }

  getPositions$(start: number): Observable<any> {
    return of(getPositions(start));
  }
}

function getSupplierPositions() {
  let positions: { [id: string]: number } = {};

  for (let i = 0; i < 100; i++) {
    positions['id-' + i] = i * 1000;
  }

  return positions;
}

function getSuppliers(start: number = 10) {
  return new Array(10).fill(1).map((item, i) => ({
    id: 'id-' + (i + start) + Math.random(),
    name: 'Supplier ' + (i + start),
    total: i * start,
    savings: '+10%',
    numberOfQuotedItems: '10/10: ' + i,
    paymentTerms: 'Net 30',
    contractPeriod: '-',
    deliveryDate: '01.05.2025',
    positions: getSupplierPositions(),
  }));
}

function getPositions(start: number = 10) {
  return new Array(10).fill(1).map((item, i) => ({
    id: 'id-' + (i + start),
    name: 'position ' + (i + start),
    quantity: i * 100,
    uom: 'm',
    priceRange: {
      min: i * 1000,
      max: i * 5000,
      diff: i * 4000,
    },
    value: i * 1000,
  }));
}
