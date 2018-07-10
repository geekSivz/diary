
import { Component, OnInit } from '@angular/core';
import { Diary } from './diary.model'
import { CommonService } from '../common/common.service'

@Component({
    selector: 'diary-add',
    templateUrl: './diaryadd.component.html',
    styleUrls: ['./diaryadd.component.css']

})
export class DiaryAddComponent implements OnInit {

    private diaryItem


    constructor(private commonService:CommonService) {

    }

    addDiary(){
        this.commonService.addDiary(this.diaryItem).subscribe(res => {
            this.commonService.add_subject.next()
        })

        this.diaryItem = ''
    }

    ngOnInit() {

    }
}

