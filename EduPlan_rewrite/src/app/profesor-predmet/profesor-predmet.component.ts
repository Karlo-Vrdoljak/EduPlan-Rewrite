import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-profesor-predmet',
  templateUrl: './profesor-predmet.component.html',
  styleUrls: ['./profesor-predmet.component.css']
})
export class ProfesorPredmetComponent implements OnInit {
   pkPredmet: any;
   
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.pkPredmet = this.route.snapshot.paramMap.get("pkPredmet");
  }

}
