import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-nav',
  templateUrl: './group-nav.component.html',
  styleUrls: ['./group-nav.component.sass']
})
export class GroupNavComponent implements OnInit {

  constructor(
   private route: ActivatedRoute,
   private router:Router
  ) { }

  groupId:string;
  personId:string;

  level = 0;

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
