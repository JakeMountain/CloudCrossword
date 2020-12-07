import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-acrossclues',
  templateUrl: './acrossclues.component.html',
  styleUrls: ['./acrossclues.component.scss']
})
export class AcrosscluesComponent implements OnInit {
  @Input() curSquare: any;
  @Input() acrossWordArr: any;
  @Input() clues: any;

  constructor() { }

  ngOnInit(): void {
    console.log(this.clues);
  }

}
