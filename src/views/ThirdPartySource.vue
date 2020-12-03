<template>
    <v-card id="thirdPartyConfirm" flat class="mx-auto my-5" max-width="288" height="100%">
        <v-row class="text-center">
            <v-col cols="12">
                <p class="ma-1 mt-4 font-weight-bold" style="font-size: 24px">3rd Party verify</p>
                <p class="font-weight-bold text-center" style="color: gray">Please complete the missing _ fields below</p>
            </v-col>
            <v-col cols="12">
                <v-text-field class="mt-4 mb-1" v-model="address" label="Complete the sentence" filled></v-text-field>
                <v-text-field class="" label="My cat's name is:" outlined></v-text-field>
                <p class="text-center caption mb-4">*This is just to confirm your identity. We won't store this information.</p>
            </v-col>
            <v-col cols="12" style="position: fixed; bottom: 0; width: 312px">
                <p class="font-weight-bold"><span class="align-self-end" style="color: #DA7967; font-size: 22px">3</span> of 3</p>
                <v-btn id="doneThirdCharButton" color="#194B99" @click="next('upload-progress')" depressed dark block>I'm done</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>

import thirdPartySource from "../assets/thirdpartywrapper";

export default {
    props: {
        next: {
            type: Function,
            required: true
        },
        regResults: {
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
        thirdPartyService: {
            type: Object,
            required: false
        },
        tempLsToken: {
            type: String,
            required: false
        },
        thirdPartyFieldValue: {
            type: String,
            required: false
        },
        thirdPartyFieldName: {
            type: String,
            required: false
        }
    },
    data: () => ({
        secretRules: [
            v => /^[0-9]*$/.test(v) || 'Only use numerics between 0 and 9',
        ],
        tab1: false, tab2: false, tab3: false, tab4: false,
        counter1: 1, counter2: 1, counter3: 1, counter4: 1,
        address: "34 Tuin"
    }),
    methods: {
        // Tries the address field
        tryFetchAddressDetails() {
            // Assumed that the idNumber is correct here
            if (this.thirdPartyService === null) this.thirdPartyService = new thirdPartySource(this.tempLsToken);

            // Run check
            this.thirdPartyService.GetAddressDetails(this.regResults.idNumber).then(function (result) {
                console.log(result.error);
                if ((result.error !== undefined) && (result.error !== null)) {
                    console.log("Error in retrieving address details");
                    alert("No third party");
                }
                else {
                    if ((result.results !== null) && (result.results.length !== 0) && (result.results[0].address !== null)) {
                        this.loadThirdPartyField(result.results[0].address, "address", "Address");
                    }
                    else {
                        console.log("No results from third party addresses!");
                        alert("No third party");
                    }
                }
            })
            .catch(function (reason) {
                alert("No third party", reason);
            });
        },
        // Load a third party field
        loadThirdPartyField(fieldValue, fieldSource, fieldName) {
            this.thirdPartyFieldValue = fieldValue;
            this.thirdPartyFieldName = fieldName;
        }
    }
}
</script>

<style scoped>
  .v-text-field input {
    font-size: 3em;
  }
</style>