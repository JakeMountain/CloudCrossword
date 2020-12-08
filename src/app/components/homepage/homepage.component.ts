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
    console.log(JSON.stringify(this.userGrid));
  }
  createRoom(){
    this.createGrid();
    let requestResult = this.roomService.putRoom(this.userGrid);
    console.log(requestResult);
  }
  joinRoom(){
    this.roomID = this.selectedRoom;
    let requestResult = this.roomService.getRoom(this.roomID);
    console.log(requestResult);
  }

}
