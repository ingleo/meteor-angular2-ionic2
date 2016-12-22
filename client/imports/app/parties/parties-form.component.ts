import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meteor } from 'meteor/meteor';
import { InjectUser } from 'angular2-meteor-accounts-ui';

import { Parties } from '../../../../both/collections/parties.collection';
import template from './parties-form.component.html';
import style from './parties-form.component.scss';

@Component({
    selector: 'parties-form',
    template,
    styles: [style]
})

//injects a user property
@InjectUser('user')
export class PartiesFormComponent implements OnInit {

    user: Meteor.User;
    addForm: FormGroup;
    newPartyPosition: { lat: number, lng: number } = { lat: 37.4292, lng: -122.1381 };

    constructor(private formBuilder: FormBuilder) { }

    mapClicked($event) {
        this.newPartyPosition = $event.coords;
    }

    ngOnInit() {
        console.log(this.user);
        this.addForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: [],
            location: ['', Validators.required],
            public: [false]
        });
    }

    /*
      this.addForm = new FormGroup({
    name: new FormControl()
    });
    */

    addParty(): void {
        if (!Meteor.userId()) {
            alert('Please log in to add a party');
            return;
        }
        if (this.addForm.valid) {
            //Parties.insert(this.addForm.value);
            Parties.insert({
                name: this.addForm.value.name,
                description: this.addForm.value.description,
                location: {
                    name: this.addForm.value.location,
                    lat: this.newPartyPosition.lat,
                    lng: this.newPartyPosition.lng
                },
                public: this.addForm.value.public,
                owner: Meteor.userId()
            });
            this.addForm.reset();
        }
    }
}