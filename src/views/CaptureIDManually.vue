<template>
    <v-card id="formRow" flat ref="formRow" class="mx-auto my-5" max-width="288" height="100%">
        <v-row class="text-center">
            <v-col cols="12">
                <p class="headline ma-1 mt-4 font-weight-bold">ID verification</p>
                <p class="font-weight-bold text-center" style="color: gray">We need to check your ID number against 3rd parties</p>
            </v-col>
            <v-col cols="12">
                <v-text-field class="my-5" v-model="idNumber" :rules="idRules" :counter="counter" label="South African ID Number" hint="*This is for verification and onboarding only. See Privacy Policy." persistent-hint required outlined></v-text-field>
            </v-col>
            <v-col cols="12" style="position: fixed; bottom: 0; width: 312px">
                <p class="font-weight-bold"><span class="align-self-end" style="color: #DA7967; font-size: 22px">1</span> of 3</p>
                <v-btn @click="next('screen-preview')" depressed dark color="#194B99" block>Submit</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

import mintVisionWrapper from '../assets/mintvisionwrapper';

export default {
    props: {
        next: {
            type: Function,
            required: true
        },
        reqResults: {
            type: Object,
            required: false
        },
        visionWrapper: {
            type: Object,
            required: false
        },
        tempToken: {
            type: String,
            required: false
        },
        handleFetchError: {
            type: Function,
            required: false
        },
        mintPersonID: {
            type: String,
            required: false
        },
        mintPersonName: {
            type: String,
            required: false
        }
    },
    data: () => ({
        idRules: [
            v => !!v || 'ID Number is required',
            v => /^[0-9]*$/.test(v) || 'ID Number can only be numerics between 0 and 9',
        ],
        counter: 13,
        idNumber: ''
    }),
    methods: {
        captureID: function() {
            this.next('screen-preview');
            
            event.preventDefault();
            event.stopPropagation();

            // Submit the ID Check
            if (this.visionWrapper === null) this.visionWrapper = new mintVisionWrapper(this.tempToken);

            this.regResults.idNumber = this.idNumber;
            this.visionWrapper.FindPersonFromID(this.regResults.idNumber).then(function (result) {
                this.checkForFoundPerson(result); 
            }).catch(reason => this.handleFetchError(reason));

            // PreLoad3rdPartyDetails();
        },
        // Have we found persons or people
        checkForFoundPerson(peopleResult) {
            // Check for a result
            if ((peopleResult !== null) && (peopleResult.people !== null) && (peopleResult.people.length !== 0)) {
                this.mintPersonID = peopleResult.people[0].id;
                this.mintPersonName = peopleResult.people[0].name;
            }
        }
    }
}
</script>