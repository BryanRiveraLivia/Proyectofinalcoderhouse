import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { fakeBackendProvider } from './_helpers';

import { AppRoutingModule } from './app-routing.module';
import { ErrorInterceptor } from './_helpers';
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fakeBackendProvider2 } from './_helpers/fake-backend-lessons';
import { fakeBackendProvider3 } from './_helpers/fake-backend-courses';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        
        fakeBackendProvider,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        
        fakeBackendProvider2,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        
        fakeBackendProvider3
    ],
    bootstrap: [AppComponent]
})
export class AppModule { };