import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-nav',
  templateUrl: './group-nav.component.html',
  styleUrls: ['./group-nav.component.sass']
})
export class GroupNavComponent implements OnInit {

  /*
  Röviden: A csoportok, személyek közötti navigációs ablak
  */

  constructor(
   private route: ActivatedRoute,
   private router:Router
  ) { }

  groupId:string;
  personId:string;

  //mivel az adatszerkezet egy fa, meg lehet határozni milyen mélyen vagyunk a rendelkezésre álló paraméterek alapján
  //alapértelmezetten 0, tehát a csoportokat listázzuk
  level = 0;

  //paraméterek alapján a fának mélységének meghatározása. Ha van groupId akkor a személyeket listázzuk
  // Ha van personId is akkor az adott személy adatait listázzuk már
  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      this.groupId = params["groupId"];
      if (this.groupId != undefined){
        this.level = 1;
      }
      this.personId = params["personId"];
      if (this.personId != undefined){
        this.level = 2;
      }
    })
  }

  //a rendelkezésre álló paraméter alapján lehet előre ugrálni a fában.
  toLevel(index:number){
    if (index < this.level){
      switch(index){
        case 0: 
          this.router.navigate(["groups"])
          break;
        case 1: 
          this.router.navigate(["groups",this.groupId])
          break;
        default:
          break;
      }
    }
  }

}
