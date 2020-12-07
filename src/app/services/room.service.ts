import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  putRoom(grid:String[]){
    const url = `localhost:3000/room`;
    console.log(grid);
    return this.http.put(url, grid);
  }
  putRoomWithID(room:number, grid:String[]){
    const url = `localhost:3000/room/${room}`;
    console.log(grid);
    return this.http.put(url, grid);
  }
  getRoom(room:number){
    const url = `localhost:3000/room?room=${room}`;
    return this.http.get(url);
  }
}