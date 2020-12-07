import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-downclues',
  templateUrl: './downclues.component.html',
  styleUrls: ['./downclues.component.scss']
})
export class DowncluesComponent implements OnInit {
  @Input() clues: any;

  constructor() { }

  ngOnInit(): void {
  }

}
