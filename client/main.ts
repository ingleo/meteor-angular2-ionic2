import 'angular2-meteor-polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './imports/app/app.module';

import '../both/methods/parties.methods';

import { Meteor } from "meteor/meteor";

Meteor.startup(() => {
   platformBrowserDynamic().bootstrapModule(AppModule);
});