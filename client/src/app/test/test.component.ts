import { Component, OnInit } from '@angular/core';


const sectors : string[] = ['G12R', 'G12P']; 

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})


export class TestComponent implements OnInit {



  data = [
    { name: 'bill', co: '1', addr: '123', other: "12333" },
    { name: 'bob', co: '2', addr: '123', other: "12333" },
    { name: 'bo3', co: '32', addr: 'x123', other: "12333" },
    { name: 'bo4', co: '32', addr: 'x123', other: "12333" },
    { name: 'bo5', co: '32', addr: 'x123', other: "12333" }
  ];
  displayedColumns: any[] = [];

  dataSource: any[] = [];

  ngOnInit() {

    const head = this.data.map(x => x.name)
    const data: any[] = [];
    this.data.forEach((x, index) => { //  { name: 'bill', co: '1', addr: '123', other: "12333" }
      Object.keys(x).forEach((k, index2) => { //  name: 'bill'
        data[index2] = data[index2] || {}
        data[index2][head[index]] = x[k as keyof typeof x]

      })
    })
    this.displayedColumns = head;
    this.dataSource = data.slice(1);
  }
}
