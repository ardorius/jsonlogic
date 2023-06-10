import { Component } from '@angular/core';
import * as jsonLogic from 'json-logic-js';

@Component({
  selector: 'app-sample2',
  templateUrl: './sample2.component.html',
  styleUrls: ['./sample2.component.css']
})
export class Sample2Component {
  public rule: any;
  public data: any;
  public outputTask: any;
  public expanded = { rule: false, data: false, output: false };

  ngOnInit(): void {

    let originalData = [{ "itemid": 1001, "order": 3 }, { "itemid": 1002, "order": 1 }, { "itemid": 1003, "order": 2 }];//problem s jsonlogic.apply, ktory to zmodifikoval

    this.data = JSON.parse(JSON.stringify(originalData));

    this.rule = { "sort": [ { "var": "" }, "order", false ] }

    let sort = function(arr: any[], prop: any, asc: boolean) {
      return arr.sort((a,b) => {
        if(a[prop] < b[prop]){
          return asc ? -1 : 1;
        }
        if(a[prop] > b[prop]){
          return asc ? 1 : -1;
        }
        return 0
      });
    }

    jsonLogic.add_operation("sort", sort);

    // pre pisanie podmienok pouzivame JsonLogic: https://jsonlogic.com

    // uloha je napisat kod pre custom jsonlogic operator

    // operator ma na vstupe:
    // - array - vstupny objekt
    // - string - nazov property
    // - bool - priznak ci ma byt usporiadanie vzostupne

    // operator ma na vystupe:
    // - array, ktory je vstup usporiadany podla zvolenej property a zvoleneho smeru.

    // pomocka:
    // - dokumentacia k pridavaniu custom operatorov je tu: https://jsonlogic.com/add_operation.html

    // Priklad:
    // Rule: { "sort": [ { "var": "" }, "order", false ] }
    // Data: [ { "itemid": 1001, "order": 3 }, { "itemid": 1002, "order": 1 }, { "itemid": 1003, "order": 2 } ]
    // Vystup: [ { "itemid": 1002, "order": 1 }, { "itemid": 1003, "order": 2 }, { "itemid": 1001, "order": 3 } ]

    this.outputTask = jsonLogic.apply(this.rule, originalData);

    console.log('Sample 2 output: ' + JSON.stringify(this.outputTask)); // vypíše ample 2 output: [{"itemid":1001,"order":3},{"itemid":1003,"order":2},{"itemid":1002,"order":1}]
  }
}
