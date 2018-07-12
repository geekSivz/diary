import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common/common.service'
import { Diary } from '../diaryadd/diary.model'
import { FilesService } from '../common/files.service';
import { FileUploader } from 'ng2-file-upload';

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

@Component({
	selector: 'app-upload-download',
	templateUrl: './diarylist.component.html',
	styleUrls: ['./diarylist.component.css']
  })
  export class UploadDownloadComponent implements OnInit {
  
	constructor(private FileService: FilesService) { }
	private files = [];
	private url = 'http://localhost:3000/upload';
	private uploader: FileUploader;
  
	ngOnInit() {
	  this.uploader = new FileUploader({url: this.url});
  
	  this.FileService.showFileNames().subscribe(response => {
		for (let i = 0; i < response.json().length; i++) {
		  this.files[i] = {
			filename: response.json()[i].filename,
			originalname: response.json()[i].originalname,
			contentType: response.json()[i].contentType
		  };
		}
	  });
	}
  
	downloadPdf(filename, contentType) {
	  this.FileService.downloadPDF(filename, contentType).subscribe(
		(res) => {
		  const file = new Blob([res.blob()], { type: contentType });
		const fileURL = URL.createObjectURL(file);
		window.open(fileURL);
		}
	  );
	}
  }