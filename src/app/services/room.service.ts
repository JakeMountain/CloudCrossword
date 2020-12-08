import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  localurl = 'http://localhost:3000';
  cloudurl = `ec2-3-93-45-124.compute-1.amazonaws.com:3000`;
  constructor(private http: HttpClient) { }

  putRoom(grid:String[]){
    const url = this.localurl+`/room`;

    const putMethod = {
    method: 'PUT', // Method itself
    headers: {
      'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
    },
    body: JSON.stringify(grid) // We send data in JSON format
    }
    
    // make the HTTP put request using fetch api
    const userAction = async () => {
      const response = await fetch(url, putMethod);
      const myJson = await response.json(); //extract JSON from the http response
      return(myJson);
    }
    userAction().then(result => {
      return(result);
    })

  }
  putRoomWithID(room:number, grid:String[]){
    const url = this.localurl+`/room/${room}`;
    const putMethod = {
      method: 'PUT', // Method itself
      headers: {
        'Content-type': 'application/json; charset=UTF-8' // Indicates the content 
      },
      body: JSON.stringify(grid) // We send data in JSON format
      }
      
      // make the HTTP put request using fetch api
      const userAction = async () => {
        const response = await fetch(url, putMethod);
        const myJson = await response.json(); //extract JSON from the http response
        return(myJson);
      }
      userAction().then(result => {
        return(result);
      })
  }
  // getRoom(room:number){
  //   const url = this.localurl+`/room?room=${room}`;
  //   return this.http.get(url);
  // }

  getRoom(room:number){
    const url = this.localurl+`/room?room=${room}`;
    const userAction = async () => {
      const response = await fetch(url);
      const myJson = await response.json(); //extract JSON from the http response
      return(myJson);
    }
    userAction().then(result => {
      console.log(result);
      return(result);
    })
  }


}