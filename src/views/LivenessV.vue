<template>
    <v-stepper v-model="currentStep" vertical outlined>
        <v-list-item two-line id="topRow">
            <v-list-item-content>
                <v-list-item-title class="display-2">VisionVerify.ai</v-list-item-title>
                <v-list-item-subtitle class="title ml-4">We need to verify your identity</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="96">
                <v-img src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/II_Square_Logo_640.png"></v-img>
            </v-list-item-avatar>
        </v-list-item>

        <v-stepper-step step="1">To verify you, we need to gather some details, including some selfies</v-stepper-step>
        <v-stepper-content step="1">
            <permission-form :next="next"></permission-form>
        </v-stepper-content>

        <v-stepper-step step="2">Capture your face</v-stepper-step>
        <v-stepper-content step="2">
            <capture-id-camera :next="next"></capture-id-camera>
        </v-stepper-content>

        <v-stepper-step step="3">Verifying your ID</v-stepper-step>
        <v-stepper-content step="3">
            <capture-id-manually :next="next"></capture-id-manually>
        </v-stepper-content>

        <v-stepper-step step="4">Position your document with the picture-side up and click the "Capture" button</v-stepper-step>
        <v-stepper-content step="4">
            <screen-preview :next="next"></screen-preview>
        </v-stepper-content>

        <v-stepper-step step="5">Third party confirmation</v-stepper-step>
        <v-stepper-content step="5">
            <third-party-source :next="next"></third-party-source>
        </v-stepper-content>

        <v-stepper-step step="6">Finish</v-stepper-step>
        <v-stepper-content step="6">
            <upload-progress></upload-progress>
        </v-stepper-content>

        <v-dialog v-model="dialog" persistent max-width="512">
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" class="float-button" rounded dark large color="error">
                    <v-icon left>mdi-close</v-icon> Cancel
                </v-btn>
            </template>
            <v-card>
                <v-card-subtitle class="headline">We understand. We'll send a note back to your requestor indicating that you declined consent.</v-card-subtitle>
                <v-card-text>You can refresh this page and opt back in at any time.</v-card-text>
            </v-card>
        </v-dialog>
        
    </v-stepper>
</template>

<script>
// import Vue from 'vue';

import CaptureIdCamera from '../components/CaptureIDCamera';
import CaptureIdManually from '../components/CaptureIDManually';
import PermissionForm from '../components/PermissionForm';
import ScreenPreview from '../components/ScreenPreview';
import ThirdPartySource from '../components/ThirdPartySource';
import UploadProgress from '../components/UploadProgress';

export default {
    components: { 
        CaptureIdCamera,
        CaptureIdManually,
        PermissionForm,
        ScreenPreview,
        ThirdPartySource,
        UploadProgress
    },
    props: {
        guid: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            // currentComponent: PermissionForm,
            idRules: [
            v => !!v || 'ID Number is required',
            v => /^[0-9]*$/.test(v) || 'ID Number can only be numerics between 0 and 9',
            v => v.length == 13 || 'ID number must be 13 characters',
            ],
            valid: 'jhgvghhjsknflfvbhj',
            errorModal: false,
            currentStep: 1,
            dialog: false
        }
    },
    methods: {
        next: function(params) { this.currentStep = params; },
        // ConsentNo: () => Vue.ConsentNo(),
        // CaptureIDPicture: () => Vue.CaptureIDPicture(),
        // CaptureID: () => Vue.CaptureID(),
        // doneThirdParty: () => Vue.doneThirdParty(),
    }, 
    // mounted: {
    //     if (this.$route.params.verifyId) {
    //       this.errorModal = this.$route.params.verifyId != this.valid ? true : false;
    //     }
    // }
};
</script>

<style scoped>
.float-button {
    position: fixed;
    right: 20px;
    bottom: 20px;
    transition: all 0.2s ease-in 0s;
    z-index: 9999;
    cursor: pointer;
}
</style>