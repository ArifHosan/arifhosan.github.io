import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/mode/loadmode';
import { LanguageService } from '../core/api/language.service';
import { RunnerService } from '../core/api/runner.service';


import {faCopy, faShareSquare} from '@fortawesome/free-regular-svg-icons';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { ShareComponent } from '../subview/share.component';


declare var CodeMirror: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren('codeBox') ref: any;
  private readonly modeUrl = '/assets/codemirror/mode/%N/%N.js'
  public content: string = "";
  public options: any = { lineNumbers: true, readOnly: false, theme: 'material', mode: 'null', matchBrackets: true, autoCloseBrackets: true, };
  private mode: string = null;
  public currentLanguage: Language;
  public stdoutText: String = "";
  public stdinText: String = "";
  public statusProperties: {
    hidden: boolean,
    status: {
      class: String,
      text: String
    },
    time: {
      text: String,
      hidden: boolean
    }
  }
  public isRunning = false;

  public languageList: Language[];

  public shareableUrl: String = "";

  public fontAwesome = {
    faCopy: faCopy,
    faShareSquare: faShareSquare
  }

  constructor(public languageService: LanguageService, public runnerService: RunnerService, private _snackBar: MatSnackBar, private _bottomSheet: MatBottomSheet) {
    CodeMirror.modeURL = this.modeUrl;
    this.statusProperties = {
      hidden: true,
      status: {
        class: "",
        text: "",
      },
      time: {
        text: "",
        hidden: true
      }
    }
  }

  ngOnInit() {
    this.languageService.getAllLanguage().subscribe(res => {
      this.languageList = res;
    });
  }

  ngAfterViewInit() {
  }

  changeCodeLanguage(event) {
    this.currentLanguage = this.languageList.filter(x => x._id == event.value)[0];
    const name = this.currentLanguage.file_name;
    const detectedMode = CodeMirror.findModeByFileName(name + ".js");
    // const detectedMode = CodeMirror.findModeByMIME("text/x-csrc");
    if (detectedMode) {
      this.mode = detectedMode.mode;
      CodeMirror.autoLoadMode(this.ref.first.codeMirror, this.mode);
      this.ref.first.codeMirror.setOption('mode', this.mode);
    }
  }

  onRun() {
    if(this.content.length <= 0) {
      return;
    }
    const data = {
      language_id: this.currentLanguage.language_name,
      source_code: this.content,
      stdin: this.stdinText
    };
    this.isRunning = true;

    this.statusProperties.hidden = false;
    this.statusProperties.status.class = "text-warning";
    this.statusProperties.status.text = "Compiling.....";

    this.statusProperties.time.hidden = true;
    this.statusProperties.time.text = "";

    this.runnerService.submitCode(data).subscribe(token => {
      console.log(token);
      setTimeout(() => {
        this.getSubmissionInfo(token["token"]);
      }, 1000);
    });
  }

  getSubmissionInfo(token) {
    this.statusProperties.status.class = "text-info";
    this.statusProperties.status.text = "Running.....";

    this.runnerService.getSubmission(token).subscribe(res => {
      console.log(res);
      this.processResponse(res);
    });
  }

  processResponse(result: Result) {
    if (result.status.id <= 2) {
      setTimeout(() => {
        this.getSubmissionInfo(result.token);
      }, 1000);
      return;
    }
    this.isRunning = false;

    switch (result.status.id) {
      case 3:
        this.statusProperties.status.class = "text-success";
        this.statusProperties.status.text = "Success";

        this.statusProperties.time.hidden = false;
        this.statusProperties.time.text = result.time + "s";

        this.stdoutText = result.stdout;
        break;
      default:
          this.statusProperties.status.class = "text-danger";
          this.statusProperties.status.text = result.status.description;

          this.statusProperties.time.hidden = true;

          this.stdoutText = result.compile_output ? result.compile_output: result.stderr;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  doCopy() {
    this.openSnackBar("Text Copied", "Dismiss");
  }

  openShareBottomSheet() {
    this._bottomSheet.open(ShareComponent, {
      data: { url: this.shareableUrl },
    });
  }


}
