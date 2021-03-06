import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccountsModule } from 'angular2-meteor-accounts-ui';

import { AppComponent } from './app.component';
import { routes, ROUTES_PROVIDERS } from './app.routes';
import { PARTIES_DECLARATIONS } from './parties';
import { SHARED_DECLARATIONS } from './shared';

import { APP_BASE_HREF } from '@angular/common';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { MaterialModule } from "@angular/material";
import { AUTH_DECLARATIONS } from "./auth/index";

@NgModule({

    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(routes),
        AccountsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAWoBdZHCNh5R-hB5S5ZZ2oeoYyfdDgniA'
        }),
        MaterialModule.forRoot()
    ],
    declarations: [
        AppComponent,
        ...PARTIES_DECLARATIONS,
        ...SHARED_DECLARATIONS,
        ...AUTH_DECLARATIONS
    ],
    providers: [
        ...ROUTES_PROVIDERS,
        { provide: APP_BASE_HREF, useValue: '/' }
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule { }