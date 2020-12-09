import { Component, OnInit, Input } from '@angular/core';
import { HostListener } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-puzzle',
  templateUrl: './puzzle.component.html',
  styleUrls: ['./puzzle.component.scss']
})


export class PuzzleComponent implements OnInit {
  @Input() puzzle: any; //this needs to come from server
  @Input() roomID!: number;
  rows: number;
  cols: number;
  rowArr: Array<number>;
  colArr: Array<number>;
  cellClasses: Array<string>;
  curSquare: number;
  horizontal: boolean;
  acrossWordArr: Array<Array<number>>;
  downWordArr: Array<Array<number>>;
  gridWordAssoc: Array<[number, number]>;
  downGrid: Array<Array<string>>;
  grid: Array<Array<number>>;
  highlightedWord:Array<number>;
  lastClicked:[number,number];
  userGrid: Array<string>;

  subscription: Subscription;

  localurl = 'http://localhost:3000';
  cloudurl = `http://ec2-3-93-45-124.compute-1.amazonaws.com:4000`;

  constructor(private roomService:RoomService) {
    this.rows = 0;
    this.cols = 0;
    this.rowArr = [];
    this.colArr = [];
    this.cellClasses = []; //this
    this.curSquare = 0; //i forget but probably this
    this.horizontal = true; //this
    this.acrossWordArr = [];//this
    this.downWordArr = []; //this
    this.gridWordAssoc = []; //this
    this.grid = []; //construction
    this.downGrid = []; //used for construction
    this.highlightedWord = []; //this
    this.lastClicked = [0,0]; //this


    this.userGrid = []; //SERVER


    const source = interval(2000);
    this.subscription = source.subscribe(val => this.getServerGrid());
  }

  ngOnInit(): void {
    this.rows = this.puzzle["size"]["rows"];
    this.cols = this.puzzle["size"]["cols"];
    this.createGrid();
    //create row and col arrs for html iteration
    for (var i = 0; i < this.rows; ++i){
      this.rowArr.push(i)
    }
    for (var i = 0; i < this.cols; ++i){
      this.colArr.push(i)
    }
    this.assignClasses();
    this.createWordArrays();
    //initialize gridWordAssoc. each index has the across and down word for that square
    for (let i = 0; i < this.puzzle["grid"].length; ++i){
      this.gridWordAssoc.push([-1, -1]);
    }
    for(let i = 0; i < this.acrossWordArr.length; ++i){
      this.acrossWordArr[i].forEach((element) => {
        this.gridWordAssoc[element][0] = i;
      });
    }
    for(let i = 0; i < this.downWordArr.length; ++i){
      this.downWordArr[i].forEach((element) => {
        this.gridWordAssoc[element][1] = i;
      });
    }
    this.highlightFirstWord();
  }

  createGrid(){
    this.userGrid = new Array(this.puzzle["grid"].length).fill(" ");
    //put dots where they belong in user grid
    for(let i = 0; i < this.userGrid.length; ++i){
      if (this.puzzle["grid"][i] == "."){
        this.userGrid[i] = ".";
      }
    }
    for(let i = 0; i < this.cols; ++i){
      this.downGrid.push([]);
    }
    for (let i = 0; i < this.cols*this.rows; ++i){
      this.downGrid[i%this.cols].push(this.puzzle["grid"][i]);
    }

    for (let i = 0; i < this.rows; ++i){
      this.grid.push([]);
      for(let j = 0; j < this.cols; ++j){
        this.grid[i].push(this.puzzle["grid"][i*this.cols + j]);
      }
    }
  }
  createWordArrays(){
    let wordIndex = -1;
    let lastBlack = false;
    let grid = this.puzzle["grid"];

    //across words
    for (let i = 0; i < this.rows; ++i){
      //each row has a new word at the start
      wordIndex++;
      this.acrossWordArr.push([]);
      this.acrossWordArr[wordIndex] = [];
      //set lastBlack to true because if we encounter a black square at the start we don't want
      // to increment the wordcounter
      lastBlack = true;
      for (let j = 0; j < this.cols; ++j){
        let cur = i*this.cols + j;
        if (grid[cur] != "."){
          lastBlack = false;
          this.acrossWordArr[wordIndex].push(cur)
        }
        else if (!lastBlack){
          wordIndex++;
          this.acrossWordArr.push([]);
          this.acrossWordArr[wordIndex] = [];
          lastBlack = true;
        }
      }
    }
    let tempArr: Array<Array<number>> = [];
    this.acrossWordArr.forEach(element => {
      if(element.length > 0){
        tempArr.push(element);
      }
    });
    this.acrossWordArr = tempArr;

    //down words
    // ** FIX **
    for(let i = 0; i < this.puzzle["clues"]["down"].length +10; ++i){
      this.downWordArr.push([]);
    }

    //make a grid that is index if word and -1 otherwise
    let downIndicesGrid: Array<Array<number>> = [];
    for(let i = 0; i < this.cols; ++i){
      downIndicesGrid[i] = [];
      for(let j = 0; j < this.rows; ++j){
        if (this.downGrid[i][j] != "."){
          downIndicesGrid[i][j] = i + this.cols * j;
        }
        else{
          downIndicesGrid[i][j] = -1;
        }
      }
    }
    let complete: boolean = false;
    let curIndex: number[] = new Array(this.cols).fill(0);
    let minNextWordInd = 0;
    wordIndex = 0

    while (!complete){
      // keep iterating through the columns
      for (let i = 0; i < this.cols; ++i){
        
        if (curIndex[i] == minNextWordInd){
          //only cols that have words starting on the min index go in this round
          while(curIndex[i] < this.cols && downIndicesGrid[i][curIndex[i]] != -1){
            //add indices to this word
            this.downWordArr[wordIndex].push(downIndicesGrid[i][curIndex[i]]);
            curIndex[i]++;
          }
          wordIndex++;
          while(curIndex[i] < this.cols && downIndicesGrid[i][curIndex[i]] == -1){
            //move curIndex to next word
            curIndex[i]++;
          }
        }
      }
      //reset minNextWordInd to the smallest cur index column -- next pass will create words for
      //all columns with words starting at that index
      minNextWordInd = curIndex[0];
      for (let i = 0; i < curIndex.length; ++i){
        if (curIndex[i] < minNextWordInd){
          minNextWordInd = curIndex[i];
        }
      }
      complete = (minNextWordInd == this.rows); //done if minNextWordInd is out of bounds
    }

    tempArr = [];
    this.downWordArr.forEach(element => {
      if(element.length > 0){
        tempArr.push(element);
      }
    });
    this.downWordArr = tempArr;
  }
  assignClasses(){
        //set class labels
        let unready = "unready ";
        let current = "current ";
        let black = "black ";
        for(var i = 0; i < this.rows; ++i){
          for (var j = 0; j < this.cols; ++j){
            //assign classes
            let cur: number = i * this.rows + j;
            this.cellClasses[cur] = "";
            this.cellClasses[cur] += unready;
            if (this.puzzle["grid"][i*this.rows + j] == "."){
              this.cellClasses[cur] += black
            }
          }
        }
  }

  highlightFirstWord(){
    let firstSquare:number = 0;
    while(this.userGrid[firstSquare]=="."){
      firstSquare++;
    }
    this.lastClicked= [Math.floor(firstSquare/this.cols), firstSquare%this.cols];
    let currents = this.acrossWordArr[this.gridWordAssoc[firstSquare][0]];
    this.highlightedWord = currents;
    currents.forEach(element => {
      this.cellClasses[element] += "curword ";
    });
    this.cellClasses[firstSquare] = this.cellClasses[firstSquare].slice(0, -"curword ".length);
    this.cellClasses[firstSquare] += "current ";
  }

  onSquareClick(i: number, j:number){
    this.setSelectedSquare(i,j);

  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    const key = event.key
    let row = this.lastClicked[0]
    let col = this.lastClicked[1];
    if(key == " "){
      this.setSelectedSquare(row, col);
    }
    else if(key === "Backspace"){
      if (this.userGrid[row*this.cols + col] == " "){
        
        let ind = this.getPrevSquare(row, col);
        this.setSelectedSquare(ind[0], ind[1]);
      }
      else{
        this.userGrid[row*this.cols+col] = " ";
      }
    }
    else if(key === "Enter"){
      let ind = this.getNextWordSquare(row,col);
      this.setSelectedSquare(ind[0], ind[1]);
    }
    else if (key.length == 1){
      this.userGrid[row*this.cols + col] = event.key.toUpperCase();
      let ind = this.getNextSquare(row,col);
      this.setSelectedSquare(ind[0], ind[1]);
    }
    //update server grid with every keypress
    this.updateServerGrid();
  }

  getPrevSquare(row:number, col:number){
    // **TODO** backspace assumes horizontal is true. fix to be like getnextsquare
    let index = row*this.cols +col;
    if (index > 0){
      --index;
      while (index > 0 && this.puzzle["grid"][index] == "."){
        --index;
      }
    }
    if (index == 0){
      return [0,0]
    }
    else{
      return [(Math.floor(index/this.cols)), index%this.cols]
    }

  }
  getNextSquare(row: number, col: number){
    let index = row*this.cols +col;
    if(this.horizontal){
      if (index < this.userGrid.length - 1){
        ++index;
          while (index < this.userGrid.length && this.puzzle["grid"][index] == "."){
            ++index;
          }
        }
        if (index >= this.userGrid.length){
          return [0,0]
        }
        else{
          return [(Math.floor(index/this.cols)), index%this.cols]
        }
    }
    else{
      if (index < this.userGrid.length){
        if(this.puzzle["grid"][index+this.cols] == "." || 
                          index+this.cols >= this.userGrid.length){
          let next = this.getNextWordSquare((Math.floor(index/this.cols)), index%this.cols);
          return next;
        }
        else{
          index+=this.cols;
          return [(Math.floor(index/this.cols)), index%this.cols]
        }
      }
    }
    return [0,0];

  }
  getNextWordSquare(row:number, col:number){
    let index = 0;
    if(this.horizontal){
      let curWord = this.gridWordAssoc[row*this.cols + col][0];
      if(curWord < this.acrossWordArr.length -1){
        index = this.acrossWordArr[curWord+1][0];
      }
      else{
        index = 0;
      }
    }
    else{
      let curWord = this.gridWordAssoc[row*this.cols + col][1];
      if(curWord < this.downWordArr.length -1){
        index = this.downWordArr[curWord+1][0];
      }
      else{
        index = 0;
      }
    }
    return [(Math.floor(index/this.cols)), index%this.cols];
  }

  setSelectedSquare(i:number, j:number){
    if(this.puzzle["grid"][i *this.cols + j] != "."){
      if(this.lastClicked[0] == i && this.lastClicked[1] == j){
        this.horizontal = !this.horizontal;
      }
      this.cellClasses[this.lastClicked[0]*this.cols + this.lastClicked[1]] = 
          this.cellClasses[this.lastClicked[0]*this.cols + this.lastClicked[1]].slice(0, -"current ".length);
      
      //remove "curword " tag from all squares in last selected word
      this.highlightedWord.forEach(element => {
        if(element != this.lastClicked[0]*this.cols + this.lastClicked[1]){
          this.cellClasses[element] = this.cellClasses[element].slice(0, -"curword ".length);
        }
      });

      let currents: number[] = [];
      if (this.horizontal){
        currents = this.acrossWordArr[this.gridWordAssoc[i*this.cols + j][0]]
        this.highlightedWord = currents;
      }
      else{
        currents = this.downWordArr[this.gridWordAssoc[i*this.cols + j][1]]
        this.highlightedWord = currents;
      }
      currents.forEach(element => {
        this.cellClasses[element] += "curword ";
      });
      this.cellClasses[i*this.cols + j] = this.cellClasses[i*this.cols + j].slice(0, -"curword ".length);
      this.cellClasses[i*this.cols + j] += "current ";
      this.lastClicked= [i,j];
    }
  }

  getServerGrid(){
    //call server for updated usergrid
    const url = this.cloudurl + `/room?room=${this.roomID}`;
    const userAction = async () => {
      const response = await fetch(url);
      const myJson = await response.json(); //extract JSON from the http response
      return(myJson);
    }
    userAction().then(result => {
      this.userGrid = result[0].usergrid;
    });
  }
  updateServerGrid(){
    let reqResult = this.roomService.putRoomWithID(this.roomID, this.userGrid);
    console.log(reqResult);
  }
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }
}
