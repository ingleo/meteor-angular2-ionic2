import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { MeteorObservable } from 'meteor-rxjs';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';

import template from './parties-list.component.html';
import style from './parties-list.component.scss';

@Component({
    selector: 'parties-list',
    template,
    styles: [style]
})

@InjectUser('user')
export class PartiesListComponent implements OnInit, OnDestroy {

    parties: Observable<Party[]>;
    partiesSub: Subscription;
    user: Meteor.User;

    constructor() {
    }

    ngOnInit() {
        this.parties = Parties.find({}).zone();
        //subscribe to parties published by server
        this.partiesSub = MeteorObservable.subscribe('parties').subscribe();
    }

    removeParty(party: Party): void {
        Parties.remove(party._id);
    }

    search(value: string): void {
        this.parties = Parties.find(value ? { location:{name: value} } : {}).zone();
    }

    isOwner(party: Party): boolean {
        return this.user && this.user._id === party.owner;
    }

    //unsubscribe when the component is destroyed
    ngOnDestroy() {
        this.partiesSub.unsubscribe();
    }
}