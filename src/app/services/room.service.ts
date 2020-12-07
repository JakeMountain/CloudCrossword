import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private http: HttpClient) { }

  putRoom(grid:String[]){
    const url = `ec2-3-93-45-124.compute-1.amazonaws.com:3000/room`;
    console.log(grid);
    return this.http.put(url, grid);
  }
  putRoomWithID(room:number, grid:String[]){
    const url = `ec2-3-93-45-124.compute-1.amazonaws.com:3000/room/${room}`;
    console.log(grid);
    return this.http.put(url, grid);
  }
  getRoom(room:number){
    const url = `ec2-3-93-45-124.compute-1.amazonaws.com:3000/room?room=${room}`;
    return this.http.get(url);
  }
}