import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Meteor } from 'meteor/meteor';
import { MeteorObservable } from 'meteor-rxjs';
import { CanActivate } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { InjectUser } from "angular2-meteor-accounts-ui";

import { Parties } from '../../../../both/collections/parties.collection';
import { Party } from '../../../../both/models/party.model';
import { Users } from '../../../../both/collections/users.collection';
import { User } from '../../../../both/models/user.model';

import template from './party-details.component.html';

@Component({
    selector: 'party-details',
    template
})

@InjectUser('user')
export class PartyDetailsComponent implements OnInit, OnDestroy, CanActivate {
    partyId: string;
    paramsSub: Subscription;
    partySub: Subscription;
    party: Party;
    users: Observable<User>;
    uninvitedSub: Subscription;
    user: Meteor.User;

    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        this.paramsSub = this.route.params
            //map - which transform the stream of data into another object 
            .map(params => params['partyId'])
            .subscribe(partyId => {
                this.partyId = partyId;

                if (this.partySub) {
                    this.partySub.unsubscribe();
                }

                this.partySub = MeteorObservable.subscribe('party', this.partyId).subscribe(() => {
                    //autorun method is used for re run every time party change
                    MeteorObservable.autorun().subscribe(() => {
                        this.party = Parties.findOne(this.partyId);
                        this.getUsers(this.party);
                    });
                });

                //
                if (this.uninvitedSub) {
                    this.uninvitedSub.unsubscribe();
                }

                this.uninvitedSub = MeteorObservable.subscribe('uninvited', this.partyId).subscribe(() => {
                    this.getUsers(this.party);
                });
            });
    }

    getUsers(party: Party) {
        if (party) {
            this.users = Users.find({
                _id: {
                    $nin: party.invited || [],
                    $ne: Meteor.userId()
                }
            }).zone();
        }
    }

    saveParty() {
        if (!Meteor.userId()) {
            alert('Please log in to change this party');
            return;
        }

        Parties.update(this.party._id, {
            $set: {
                name: this.party.name,
                description: this.party.description,
                location: this.party.location,
                'public': this.party.public
            }
        });
    }

    //let activate a route according to de party owner id
    canActivate() {
        const party = Parties.findOne(this.partyId);
        return (party && party.owner == Meteor.userId());
    }

    invite(user: Meteor.User) {
        MeteorObservable.call('invite', this.party._id, user._id).subscribe(() => {
            alert('User successfully invited.');
        }, (error) => {
            alert(`Failed to invite due to ${error}`);
        });
    }

    reply(rsvp: string) {
        MeteorObservable.call('reply', this.party._id, rsvp).subscribe(() => {
            alert('You successfully replied.');
        }, (error) => {
            alert(`Failed to reply due to ${error}`);
        });
    }

    get isOwner(): boolean {
        return this.party && this.user && this.user._id === this.party.owner;
    }

    get isPublic(): boolean {
        return this.party && this.party.public;
    }

    get isInvited(): boolean {
        if (this.party && this.user) {
            const invited = this.party.invited || [];
            return invited.indexOf(this.user._id) !== -1;
        }
        return false;
    }

    ngOnDestroy() {
        this.paramsSub.unsubscribe();
        this.partySub.unsubscribe();
        this.uninvitedSub.unsubscribe();
    }
}