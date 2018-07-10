import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service'
import { Diary } from '../diaryadd/diary.model'

@Component({
  selector: 'diary-list',
  templateUrl: './diarylist.component.html',
  styleUrls: ['./diarylist.component.css']
})
export class DiaryListComponent implements OnInit {

	private diaryList:Diary[]

	constructor(private commonService:CommonService){

	}

	ngOnInit(){

		this.getAllDiary()

		this.commonService.add_subject.subscribe(response => {
			this.getAllDiary()
		})

	}

	getAllDiary(){
		this.commonService.getDiary().subscribe(res =>{
			this.diaryList  = []
			res.json().data.map(e => {
				this.diaryList.push(new Diary(e.item,false));
			})
		})
	}

}