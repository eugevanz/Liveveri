<template>
    <v-stepper v-model="currentStep">
        <v-list-item two-line id="topRow">
            <v-list-item-content>
                <v-list-item-title class="display-2">VisionVerify.ai</v-list-item-title>
                <v-list-item-subtitle class="title ml-4">We need to verify your identity</v-list-item-subtitle>
                <v-icon>mdi-arrow-left-circle</v-icon>
                <v-icon>mdi-arrow-left-thin-circle-outline</v-icon>
            </v-list-item-content>

            <v-list-item-avatar size="96">
                <v-img src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/II_Square_Logo_640.png"></v-img>
            </v-list-item-avatar>
        </v-list-item>

        <v-stepper-header>
            <v-stepper-step step="1"></v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="2"></v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="3"></v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="4"></v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="5"></v-stepper-step>
            <v-divider></v-divider>

            <v-stepper-step step="6"></v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <permission-form :next="next"></permission-form>
            </v-stepper-content>

            <v-stepper-content step="2">
                <capture-id-camera :next="next"></capture-id-camera>
            </v-stepper-content>

            <v-stepper-content step="3">
                <capture-id-manually :next="next"></capture-id-manually>
            </v-stepper-content>

            <v-stepper-content step="4">
                <screen-preview :next="next"></screen-preview>
            </v-stepper-content>

            <v-stepper-content step="5">
                <third-party-source :next="next"></third-party-source>
            </v-stepper-content>

            <v-stepper-content step="6">
                <upload-progress></upload-progress>
            </v-stepper-content>
        </v-stepper-items>

        <v-dialog v-model="dialog" persistent max-width="512">
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" v-on="on" class="float-button" rounded dark large color="error">
                    <v-icon left>mdi-close</v-icon> Cancel
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="headline">Thank you!</v-card-title>
                <v-card-subtitle>We understand. We'll send a note back to your requestor indicating that you declined consent.</v-card-subtitle>
                <v-card-text>You can refresh this page and opt back in at any time.</v-card-text>
            </v-card>
        </v-dialog>
        
    </v-stepper>
</template>

<script>

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
            dialog: false,
            _visionWrapper: null,
            _tempToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL21pbnRpaXZpc2lvbnNlcnZpY2UuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2lkZW50aWZ5L2NsYWltcy90ZW5hbnQiOiJWaXNpb25WZXJpZnkuYWkiLCJodHRwczovL21pbnRpaXZpc2lvbnNlcnZpY2UuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2lkZW50aWZ5L2NsYWltcy90ZW5hbnRfdG9rZW4iOiJ7XHJcbiAgXCJkZXZpY2VOYW1lXCI6IFwicG93ZXJhcHBzXCIsXHJcbiAgXCJ0ZW5hbnROYW1lXCI6IFwiVmlzaW9uVmVyaWZ5LmFpXCIsXHJcbiAgXCJ1c2VyXCI6IG51bGwsXHJcbiAgXCJzdWJUZW5hbnRcIjogbnVsbCxcclxuICBcImFwaVZlcnNpb25cIjogbnVsbFxyXG59IiwibmJmIjoxNjAxOTEwNzM4LCJleHAiOjE2MDE5OTcxMzgsImlhdCI6MTYwMTkxMDczOCwiaXNzIjoiaHR0cHM6Ly9taW50aWl2aXNpb25zZXJ2aWNlLmF6dXJld2Vic2l0ZXMubmV0LyJ9.H8HEp-3otGupjaxHP1YuatEDtQPcJgyl4TQE8CQfFsA",
        }
    },
    methods: {
        next: function(params) { this.currentStep = params; },
    }, 
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