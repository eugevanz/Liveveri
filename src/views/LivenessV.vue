<template>
    <v-card flat>
        <v-list-item two-line id="topRow">
            <v-list-item-content>
                <v-list-item-title class="display-2">VisionVerify.ai</v-list-item-title>
                <v-list-item-subtitle class="title ml-4">We need to verify your identity</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="96">
                <v-img src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/II_Square_Logo_640.png"></v-img>
            </v-list-item-avatar>
        </v-list-item>

        <v-container>
            <component :is="currentComponent" class="mt-16" @nextComponent="nextComponent($event)"></component>
        </v-container>

        <v-container>      
            <v-card flat style="display:none">
                <v-card-text>
                    <v-row justify="space-around">
                        <v-col md="4">
                            <v-img id="leftFace" src="https://picsum.photos/510/300?random">
                                <v-card-title>Left</v-card-title>
                            </v-img>
                        </v-col>
                        <v-col md="4">
                            <v-img id="rightFace" src="https://picsum.photos/510/300?random">
                                <v-card-title>Right</v-card-title>
                            </v-img>
                        </v-col>
                        <v-col md="4">
                            <v-img id="straightFace" src="https://picsum.photos/510/300?random">
                                <v-card-title>Straight</v-card-title>
                            </v-img>
                        </v-col>
                        <v-col md="4">
                            <v-img id="downFace" src="https://picsum.photos/510/300?random">
                                <v-card-title>Down</v-card-title>
                            </v-img>
                        </v-col>
                        <v-col md="4">
                            <v-img id="upFace" src="https://picsum.photos/510/300?random">
                                <v-card-title>Up</v-card-title>
                            </v-img>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-container>

        <v-dialog id="errorModal" v-model="errorModal" max-width="290">
            <v-card>
                <v-card-title id="exampleModalLongTitle" class="headline">Uh Oh, something went wrong</v-card-title>
                <v-card-text id="errorMessageText">Unfortunately an error has occurred</v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" text @click="errorModal = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
import Vue from 'vue';

import CaptureIDCamera from '../components/CaptureIDCamera';
import CaptureIDManually from '../components/CaptureIDManually';
import ConsentNo from '../components/ConsentNo';
import PermissionForm from '../components/PermissionForm';
import ScreenPreview from '../components/ScreenPreview';
import ThirdPartySource from '../components/ThirdPartySource';
import UploadProgress from '../components/UploadProgress';

export default {
    components: { 
        CaptureIDCamera,
        CaptureIDManually,
        ConsentNo,
        PermissionForm,
        ScreenPreview,
        ThirdPartySource,
        UploadProgress
    },
    // props: {
    //     guid: {
    //         type: String,
    //         required: true
    //     }
    // },
    data() {
        return {
            currentComponent: PermissionForm,
            idRules: [
            v => !!v || 'ID Number is required',
            v => /^[0-9]*$/.test(v) || 'ID Number can only be numerics between 0 and 9',
            v => v.length == 13 || 'ID number must be 13 characters',
            ],
            progress: 25,
            valid: 'jhgvghhjsknflfvbhj',
            errorModal: false,
        }
    },
    methods: {
        ConsentYes: () => Vue.ConsentYes(),
        ConsentNo: () => Vue.ConsentNo(),
        CaptureIDPicture: () => Vue.CaptureIDPicture(),
        CaptureID: () => Vue.CaptureID(),
        doneThirdParty: () => Vue.doneThirdParty(),

        nextComponent: function(value) { this.currentComponent = value }
    }, 
    // mounted: {
    //     if (this.$route.params.verifyId) {
    //       this.errorModal = this.$route.params.verifyId != this.valid ? true : false;
    //     }
    // }
};
</script>
