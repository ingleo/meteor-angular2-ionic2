import { MongoObservable } from 'meteor-rxjs';
import { Party } from '../models/party.model'
import { Meteor } from 'meteor/meteor';

export const Parties = new MongoObservable.Collection<Party>('parties');


function loggedIn() {
  return !!Meteor.user();
}

//method allow, let the follows actions over the collection
Parties.allow({
  insert: loggedIn,
  update: loggedIn,
  remove: loggedIn
});
