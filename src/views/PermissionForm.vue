<template>
    <v-card id="permissionForm" flat ref="permissionForm" class="mx-auto my-5" max-width="288">
        <v-row>
            <v-col cols="12">
                <v-img class="mb-n16" contain src="..\assets\mintiilogo_large.png"></v-img>
            </v-col>
            <v-col cols="12" class="text-center">
                <p class="ma-1 font-weight-bold" style="font-size: 26px">Peter Reid</p>
                <p class="font-weight-bold text-center" style="color: gray">Has requested to verify your idenity</p>
            </v-col>
            <v-col cols="12">
                <ul class="my-4" style="font-size: 14px">
                    <li>We gather details, including selfies</li>
                    <li>This should take about 30 seconds</li>
                    <li>We store everything <i>very</i> securely, and only use it with your consent (which you can revoke at any time).</li>
                </ul>
            </v-col>
            <v-col cols="12" class="text-center">
                <p class="font-weight-bold" style="font-size: 14px">Would you like to continue?</p>
            </v-col>

            <v-col cols="12" class="text-center" style="bottom: 0; width: 312px">
                <v-dialog v-model="dialog" persistent max-width="512">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn text color="#194B99" v-bind="attrs" v-on="on" class="font-weight-bold">No, Thanks</v-btn>
                    </template>
                    <v-card class="orange">
                        <v-card-subtitle class="title font-weight-bold py-3 white--text">We understand. We'll send a note back to your requestor indicating that you declined consent.</v-card-subtitle>
                        <v-card-text class="white--text text-center py-5">
                            <v-icon left>mdi-alert-circle-outline</v-icon>
                            You can refresh this page and opt back in at any time.
                        </v-card-text>
                    </v-card>
                </v-dialog>

                <v-btn class="mb-2" depressed dark color="#194B99" @click="consentYes" block>YES</v-btn>

                <a href="" style="text-decoration: none;">
                    Terms and conditions
                    <v-icon size="18" color="#DA7967">mdi-open-in-new</v-icon>
                </a>
            </v-col>
        </v-row>        
    </v-card>
</template>

<script>

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
    },
    data: () => ({
        dialog: false,
    }),
    methods: {
        consentYes: function () {
            if (this.regResults.idPictureCaptureRequested) {
                this.next('capture-id-camera');
            }
            else {
                // Show the fill-in-id part and start the face tracking
                this.next('capture-id-manually');
            }
        }
    }
}
</script>

<style>

</style>