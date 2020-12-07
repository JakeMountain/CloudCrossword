import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/services/room.service';
import { XwordFetchService } from 'src/app/services/xworod-fetch.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  result: any;
  date = "";
  userGrid: Array<string>;
  roomID: number;
  selectedRoom = 0;

  constructor(private xwordService: XwordFetchService, private roomService:RoomService) { 
    this.userGrid = []; //SERVER
    this.roomID = 0;
  }



  ngOnInit(): void {
  }


  datePicked(date: Date){
    this.date = date.toLocaleDateString();
    const req = this.xwordService.getXword(date.toLocaleDateString());
    req.subscribe((data : any) => {
      console.log(data);
      this.result = data;
    });

  }
  createGrid(){
    this.userGrid = new Array(this.result["grid"].length).fill(" ");
    //put dots where they belong in user grid
    for(let i = 0; i < this.userGrid.length; ++i){
      if (this.result["grid"][i] == "."){
        this.userGrid[i] = ".";
      }
    }
  }
  createRoom(){
    this.createGrid();
    const req = this.roomService.putRoom(this.userGrid);
    req.subscribe((data : any) => {
      console.log(data);
      this.roomID = data;
    });
  }
  joinRoom(){
    this.roomID = this.selectedRoom;
    const req = this.roomService.getRoom(this.roomID);
    let requestData = null;
    req.subscribe((data : any) => {
      console.log(data);
      requestData = data;
    });
    console.log(requestData);
  }

}
