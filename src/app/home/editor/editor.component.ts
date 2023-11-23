import { Component } from '@angular/core';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
  editorOptions = { theme: 'vs-dark', language: 'javascript', scrollBeyondLastLine: false };
  code: string = 'function x() {\nconsole.log("Hello world!");\n}';

  getCode() {
    return this.code;
  }
}
