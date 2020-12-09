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
  localurl = 'http://localhost:3000';
  cloudurl = `http://ec2-3-93-45-124.compute-1.amazonaws.com:4000`;

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
    const url = this.cloudurl+`/room`;

    const putMethod = {
    method: 'PUT', // Method itself
    headers: {
      'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
    },
    body: JSON.stringify(this.userGrid) // We send data in JSON format
    }
    
    // make the HTTP put request using fetch api
    const userAction = async () => {
      const response = await fetch(url, putMethod);
      const myJson = await response.json(); //extract JSON from the http response
      return(myJson);
    }
    userAction().then(result => {
      this.roomID = result[0].max;
    })
  }
  joinRoom(){
    this.roomID = this.selectedRoom;
    let requestResult = this.roomService.getRoom(this.roomID);
    console.log(requestResult);

    const url = this.cloudurl+`/room?room=${this.roomID}`;
    const userAction = async () => {
      const response = await fetch(url);
      const myJson = await response.json(); //extract JSON from the http response
      return(myJson);
    }
    userAction().then(result => {
      this.userGrid = result[0].usergrid;
    })
  }

}
