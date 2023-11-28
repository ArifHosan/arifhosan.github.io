import { Component } from '@angular/core';
import { codeSnippets } from '../../core/codes';
@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent {
  editorOptions = {
    theme: 'vs-dark',
    language: 'javascript',
    scrollBeyondLastLine: false,
  };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  getCode() {
    return this.code;
  }

  chooseCode(language: string) {
    switch (language) {
      case 'c':
        this.code = codeSnippets.c;
        break;
      case 'cpp':
        this.code = codeSnippets.cpp;
        break;
      case 'java':
        this.code = codeSnippets.java;
        break;
      case 'javascript':
        this.code = codeSnippets.javascript;
        break;
      case 'python':
        this.code = codeSnippets.python;
        break;
      case 'typescript':
        this.code = codeSnippets.typescript;
        break;
      default:
        this.code = '';
        break;
    }
  }

  setLanguage(language: string) {
    language = language.toLowerCase().split(' ')[0];
    language = language == 'c++' ? 'cpp' : language;
    this.editorOptions = {
      theme: 'vs-dark',
      language: language,
      scrollBeyondLastLine: false,
    };
    this.chooseCode(language);
  }
}
