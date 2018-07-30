import { Injectable } from '@angular/core';
import { Diary } from '../diaryadd/diary.model';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';
import {Observable} from 'rxjs';

@Injectable()
export class CommonService {
	public diaryList: Diary[]
	public add_subject=new Subject<String>()

	constructor(private http : Http){
		this.diaryList = []
	}

	addDiary(item){
		console.log(item);
		/*return this.http.post('/api/addDiary',{
			diaryItem : item
		})*/
	}

	getDiary(){
		return this.http.post('/api/getDiary',{})
	}
}