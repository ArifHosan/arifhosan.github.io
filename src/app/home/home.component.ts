import { environment } from './../../environments/environment';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ViewChildren, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/mode/loadmode';
import { ClipboardService } from 'ngx-clipboard'
import { LanguageService } from '../core/api/language.service';
import { RunnerService } from '../core/api/runner.service';


import { faCopy, faShareSquare } from '@fortawesome/free-regular-svg-icons';
import { MatSnackBar, MatBottomSheet } from '@angular/material';
import { ShareComponent } from '../subview/share.component';
import { SnippetService } from '../core/api/snippet.service';
import { ActivatedRoute, Router } from '@angular/router';

import { UUID } from 'angular2-uuid';
import { CookieService } from 'ngx-cookie-service';

declare var CodeMirror: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChildren('codeBox') ref: any;
  private readonly modeUrl = '/assets/codemirror/mode/%N/%N.js'
  public content = '';
  public options: any = { lineNumbers: true, readOnly: false, theme: 'material', mode: 'null', matchBrackets: true, autoCloseBrackets: true, };
  private mode: string = null;
  public currentLanguage: Language;
  public stdoutText: string = '';
  public stdinText: string = '';
  public matLanguageSelect = '';
  public statusProperties: {
    hidden: boolean,
    status: {
      class: string,
      text: string
    },
    time: {
      text: string,
      hidden: boolean
    }
  };
  public linkShared = {
    shared: false,
    snippet: null
  };
  public isRunning = false;

  public languageList: Language[];

  public shareableUrl: string = '';

  public fontAwesome = {
    faCopy: faCopy,
    faShareSquare: faShareSquare
  }

  public isDetailed = false;
  public existingSnippet = null;
  public isOwner = false;
  public uuid: string;

  constructor(public languageService: LanguageService,
              public runnerService: RunnerService,
// tslint:disable-next-line: variable-name
              private _snackBar: MatSnackBar,
// tslint:disable-next-line: variable-name
              private _bottomSheet: MatBottomSheet,
              public snippetService: SnippetService,
              private _clipboardService: ClipboardService,
              public route: ActivatedRoute,
              public router: Router,
              private cookieService: CookieService,
              ) {
    CodeMirror.modeURL = this.modeUrl;
    this.statusProperties = {
      hidden: true,
      status: {
        class: '',
        text: '',
      },
      time: {
        text: '',
        hidden: true
      }
    }

    this.uuid = this.cookieService.get('randid');
    if(!this.uuid) {
      this.uuid = UUID.UUID();
      this.cookieService.set('randid', this.uuid);
    }

    const keyId = route.snapshot.params.keyId;
    if(keyId) {
      console.log(keyId);
      this.isDetailed = true;
      this.snippetService.getSnippet(keyId).subscribe(res => {
        if(res.length <= 0) { return; }
        const data = res[0];
        this.existingSnippet = data;
        this.content = data.code;
        this.stdinText = data.stdin;
        this.isOwner = this.uuid == data.uuid;
        this.matLanguageSelect = data.language._id;

        this.currentLanguage = data.language;
        this.changeLanguageStyle();

        if(this.isOwner) {
          this.linkShared.shared = true;
          this.linkShared.snippet = data;
          this.linkShared.snippet.url = environment.baseUrl + data.url;
        }
      });
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
    this.changeLanguageStyle();
  }

  changeLanguageStyle() {
    const name = this.currentLanguage.file_name;
    const detectedMode = CodeMirror.findModeByFileName(name + '.js');
    // const detectedMode = CodeMirror.findModeByMIME("text/x-csrc");
    if (detectedMode) {
      this.mode = detectedMode.mode;
      CodeMirror.autoLoadMode(this.ref.first.codeMirror, this.mode);
      this.ref.first.codeMirror.setOption('mode', this.mode);
    }
  }

  onRun() {
    if (this.content.length <= 0) {
      return;
    }
    const data = {
      language_id: this.currentLanguage.language_name,
      source_code: this.content,
      stdin: this.stdinText
    };
    this.isRunning = true;

    this.statusProperties.hidden = false;
    this.statusProperties.status.class = 'text-warning';
    this.statusProperties.status.text = 'Compiling.....';

    this.statusProperties.time.hidden = true;
    this.statusProperties.time.text = '';

    this.runnerService.submitCode(data).subscribe(token => {
      console.log(token);
      setTimeout(() => {
        this.getSubmissionInfo(token['token']);
      }, 1000);
    });
  }

  getSubmissionInfo(token) {
    this.statusProperties.status.class = 'text-info';
    this.statusProperties.status.text = 'Running.....';

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
        this.statusProperties.status.class = 'text-success';
        this.statusProperties.status.text = 'Success';

        this.statusProperties.time.hidden = false;
        this.statusProperties.time.text = result.time + 's';

        this.stdoutText = result.stdout;

        break;
      default:
        this.statusProperties.status.class = 'text-danger';
        this.statusProperties.status.text = result.status.description;

        this.statusProperties.time.hidden = true;

        this.stdoutText = result.compile_output ? result.compile_output : result.stderr;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  doCopy() {
    this._clipboardService.copyFromContent(this.linkShared.snippet.url);
    this.openSnackBar('Text Copied', 'Dismiss');
  }

  openShareBottomSheet() {
    this._bottomSheet.open(ShareComponent, {
      data: { url: this.shareableUrl },
    });
  }

  createShareLink() {
    const snippet: Snippet = {
      code: this.content,
      stdin: this.stdinText,
      language: this.currentLanguage,
      uuid: this.uuid
    };
    this.snippetService.generateSnippet(snippet).subscribe(res => {
      this.router.navigateByUrl('/' + res.url);
      this.linkShared.shared = true;
      this.linkShared.snippet = res;
      this.linkShared.snippet.url = environment.baseUrl + res.url;
    });
  }

  updateShareLink() {
    this.existingSnippet.code = this.content;
    this.existingSnippet.stdin = this.stdinText;
    this.existingSnippet.language = this.currentLanguage;
    this.existingSnippet.url = this.existingSnippet.url.split('/').slice(-1).toString();
    this.snippetService.updateSnippet(this.existingSnippet._id, this.existingSnippet).subscribe(res=>{console.log(res)});
  }


}
