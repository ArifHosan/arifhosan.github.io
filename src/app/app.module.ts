import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule, MatButtonModule, MatInputModule, MatSnackBarModule, MatBottomSheetModule, MatListModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { ShareComponent } from './subview/share.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShareComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CodemirrorModule,
    FormsModule,
    HttpClientModule,

    BrowserAnimationsModule, MatFormFieldModule,
    MatSelectModule, MatButtonModule, MatInputModule, MatSnackBarModule, MatBottomSheetModule, MatListModule,
    FontAwesomeModule
  ],
  providers: [],
  entryComponents: [ShareComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
