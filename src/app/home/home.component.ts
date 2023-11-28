import { Component, OnInit, ViewChild } from '@angular/core';
import { LanguageService } from '../services/language.service';
import { EditorComponent } from './editor/editor.component';
import { ProgramService } from '../services/program.service';
import { CodeStatus } from '../core/interfaces/interfaces';

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
  codeStatus: CodeStatus = CodeStatus.NOT_STARTED;
  codeMetadata: any;
  // ngModel

  constructor(
    private languageService: LanguageService,
    private programService: ProgramService
  ) {}
  ngOnInit() {
    this.languageService.getLanguages().subscribe((data: any) => {
      this.languages = data;
      this.selectedLanguage = this.languages[0].id;
      this.editor.setLanguage(this.languages[0].name);
    });
  }
  updateCodeLanguage(e: any) {
    const selectedLanguage = this.languages.find(
      (x: any) => x.id == e.target.value
    );
    this.editor.setLanguage(selectedLanguage.name);
  }
  CodeStatus() {
    return CodeStatus;
  }

  getSubmissionStatus(uuid: string) {
    return this.programService.get(uuid).subscribe((data: any) => {
      console.log(data);
      if (data.status.id == 11) {
        this.codeStatus = CodeStatus.RUNTIME_ERROR;
        console.log('Runtime Error');
        const decodedOutput = atob(data.stderr);
        this.output = decodedOutput;
      }
      if (data.status.id == 6) {
        console.log('Compilation Error');
        this.codeStatus = CodeStatus.COMPILE_ERROR;
        const decodedOutput = atob(data.compile_output);
        this.output = decodedOutput;
      } else {
        this.codeStatus = CodeStatus.SUCCESS;
        const decodedOutput = atob(data.stdout);
        console.log(decodedOutput);
        this.output = decodedOutput;
        this.codeMetadata = {
          time: data.time,
          memory: data.memory,
        }
      }
    });
  }

  onRun() {
    const base64Input = btoa(this.input);
    const base64Code = btoa(this.editor.getCode());
    const language = this.selectedLanguage;
    // console.log(base64Input);
    // console.log(base64Code);
    // console.log(language);
    this.codeStatus = CodeStatus.RUNNING;
    console.log(this.codeStatus);
    this.programService
      .create({
        input: base64Input,
        code: base64Code,
        language_id: language,
      })
      .subscribe((data: any) => {
        console.log(data);
        setTimeout(() => {
          this.getSubmissionStatus(data.uuid);
        }, 3000);
      });
  }
}
