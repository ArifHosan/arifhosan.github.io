import { Component, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { EditorComponent } from './editor/editor.component';
import { ProgramService } from '../services/program.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('editor') editor!: EditorComponent;
  languages: any;

  // ngModel
  input: string = '';
  output: string = '';
  selectedLanguage: string = '';
  // ngModel

  constructor(
    private languageService: LanguageService,
    private programService: ProgramService
  ) {
  }
  ngOnInit() {
    this.languageService.getLanguages().subscribe((data: any) => {
      this.languages = data;
    });
  }

  getSubmissionStatus(uuid: string) {
    return this.programService.get(uuid).subscribe((data: any) => {
      console.log(data);
      const decodedOutput = atob(data.stdout);
      console.log(decodedOutput);
      this.output = decodedOutput;
    });
  }

  onRun() {
    const base64Input = btoa(this.input);
    const base64Code = btoa(this.editor.getCode());
    const language = this.selectedLanguage;
    console.log(base64Input);
    console.log(base64Code);
    console.log(language);
    this.programService.create({
      input: base64Input,
      code: base64Code,
      language_id: language
    }).subscribe((data: any) => {
      console.log(data);
      setTimeout(() => {
        this.getSubmissionStatus(data.uuid);
      }, 3000);
    });
  }

}
