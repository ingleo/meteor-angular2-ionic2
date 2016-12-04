import { Meteor } from 'meteor/meteor';
import { Parties } from '../../../both/collections/parties.collection';

/*
Notice that we used buildQuery.call(this) 
calling syntax in order to make context of 
this method the same as in Meteor.publish 
and be able to use this.userId inside that method.
*/

Meteor.publish('parties', function () {
    return Parties.find(buildQuery.call(this));
});

Meteor.publish('party', function (partyId: string) {
    return Parties.find(buildQuery.call(this, partyId));
});


function buildQuery(partyId?: string): Object {

    const isAvailable = {
        $or: [{
            // party is public
            public: true
        },
        // or
        {
            // current user is the owner
            $and: [{
                owner: this.userId
            }, {
                owner: {
                    $exists: true
                }
            }]
        }]
    };

    if (partyId) {
        return {
            // only single party
            $and: [{
                _id: partyId
            },
                isAvailable
            ]
        };
    }
    return isAvailable;
}

/*
Meteor.publish('parties', function () {

    const selector = {
        $or: [{
            // party is public
            public: true
        },
        // or
        {
            // current user is the owner
            $and: [{
                owner: this.userId
            }, {
                owner: {
                    $exists: true
                }
            }]
        }]
    };
    return Parties.find(selector);
});

*/