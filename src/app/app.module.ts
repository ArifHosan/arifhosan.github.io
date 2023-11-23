import { LanguageService } from './services/language.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditorComponent } from './home/editor/editor.component';
import { HeaderComponent } from './layout/header/header.component';
import { HttpClientModule } from '@angular/common/http';
import { NgIconsModule } from '@ng-icons/core';
import { jamEgg, jamMagic } from '@ng-icons/jam-icons';
import { ProgramService } from './services/program.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    NgIconsModule.withIcons({ jamEgg, jamMagic }),
    MonacoEditorModule.forRoot()
  ],
  providers: [
    LanguageService,
    ProgramService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
