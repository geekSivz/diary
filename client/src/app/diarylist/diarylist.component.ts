import { Component, OnInit, Compiler } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { CommonService } from '../common/common.service'
import { Diary } from '../diaryadd/diary.model'
import { FilesService } from '../common/files.service';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

@Component({
	selector: 'diary-list',
	templateUrl: './diarylist.component.html',
	styleUrls: ['./diarylist.component.css']
})
export class DiaryListComponent implements OnInit {

	private diaryList: Diary[]
	aType: string[] = [
    'Hotel',
    'Dining',
    'Shopping',
  ];
  myform: FormGroup;
  Title: FormControl;
  ActivityType: FormControl;
  Description: FormControl;
	FileNames: FormControl;
	myFiles:string [] = [];

	constructor(private commonService: CommonService, private _compiler: Compiler) {

	}

	ngOnInit() {

		this.getAllDiary();
		this.createFormControls();
    this.createForm();
		this._compiler.clearCache();

		this.commonService.add_subject.subscribe(response => {
			this.getAllDiary()
		})

	}
	
  createFormControls() {
    this.Title = new FormControl('', Validators.required);
    /*this.email = new FormControl('', [
      Validators.required,
      Validators.pattern("[^ @]*@[^ @]*")
    ]);*/
    this.ActivityType = new FormControl('', [
      Validators.required,
    ]);		
		this.FileNames = new FormControl('', [
      Validators.required
    ]);
    this.Description = new FormControl('');
  }

	getFileDetails (e) {
    //console.log (e.target.files);
    for (var i = 0; i < e.target.files.length; i++) { 
      this.myFiles.push(e.target.files[i]);
    }
		console.log(this.myFiles);
  }

  createForm() {
    this.myform = new FormGroup({
      Title: this.Title,
			ActivityType: this.ActivityType,
      FileNames: this.FileNames,
      Description: this.Description
    });
  }

  onSubmit() {
    if (this.myform.valid) {
      console.log("Form Submitted!");
			this.commonService.addDiary(this.myform.value);
      this.myform.reset();
    }
  }


	getAllDiary() {
		this.commonService.getDiary().subscribe(res => {
			this.diaryList = []
			res.json().data.map(e => {
				this.diaryList.push(new Diary(e.Title,e.ActivityType,e.FileNames,e.Description));
			})
		})
	}
}