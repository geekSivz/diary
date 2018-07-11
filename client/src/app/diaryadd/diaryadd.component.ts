
import { Component, OnInit } from '@angular/core';
import { Diary } from './diary.model'
import { CommonService } from '../common/common.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'diary-add',
    templateUrl: './diaryadd.component.html',
    styleUrls: ['./diaryadd.component.scss']

})
export class DiaryAddComponent implements OnInit {

    private diaryItem;

    modalForm: FormGroup;

    constructor(private commonService:CommonService, public fb: FormBuilder) {
        this.modalForm = fb.group({
            modalFormNameEx: ['', Validators.required],
            modalFormEmailEx: ['', [Validators.email, Validators.required]],
            modalFormSubjectEx: ['', Validators.required],
            modalFormTextEx: ['', Validators.required]
          });
      
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

