import { Component, OnInit } from '@angular/core';
import { XwordFetchService } from 'src/app/services/xworod-fetch.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  result: any;
  date = "";
  constructor(private xwordService: XwordFetchService) { }



  ngOnInit(): void {
  }


  datePicked(date: Date){
    const req = this.xwordService.getXword(date.toLocaleDateString());
    req.subscribe((data : any) => {
      console.log(data);
      this.result = data;
    });

  }

}
