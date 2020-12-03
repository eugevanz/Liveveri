<template>
    <v-card id="idCaptureRow" class="mx-auto my-5" max-width="288" flat height="100%">
        <v-row class="text-center">
            <v-col cols="12">
                <p class="ma-1 mt-4 font-weight-bold" style="font-size: 24px">Scan document</p>
                <p class="font-weight-bold text-center" style="color: gray">Position your document with the picture-side-up and click the "Capture" button</p>
            </v-col>
            <v-col cols="12">
                <video id="idCapturePreview" ref="idCapturePreview" autoplay width="288"></video>
            </v-col>
            <v-col cols="12">
                <v-row>
                    <v-col class="mr-n16"><v-btn text @click="next('capture-id-manually')">Skip</v-btn></v-col>
                    <v-col class="ml-n16">
                        <v-progress-circular v-if="processing" indeterminate color="primary"></v-progress-circular>
                        <v-btn v-else color="#194B99" outlined @click="capture" :loading="loading">Capture</v-btn>
                    </v-col>
                </v-row>
                <p class="text-center caption mb-4">{{ message }}</p>
            </v-col>
            <v-col cols="12" style="position: fixed; bottom: 0; width: 312px">
                <p class="font-weight-bold"><span class="align-self-end" style="color: #DA7967; font-size: 22px">1</span> of 3</p>
                <v-btn color="#194B99" depressed dark @click="next('screen-preview')" class="mb-3" block>Next</v-btn>
            </v-col>
        </v-row>
        <!-- <v-img :src="captured"></v-img> -->
        
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
        windowSize: { x: 0, y: 0, },
        video: {},
        canvas: {},
        loading: false,
        captured: null,
        processing: false,
        message: '*Skip if you do not have your document.'
    }),
    methods: {
        onResize: function() {
            var x = this.windowSize.x
            if (window.innerWidth > 640) {
                x = 640;
            } else {
                x = window.innerWidth;
            }
            this.windowSize = { x: x, y: window.innerHeight }
        },
        stopIdCaptureVideo: function() {
            // Stop all video streams.
            const player = document.getElementById('idCapturePreview');
            player.srcObject.getVideoTracks().forEach(track => track.stop());
        },
        // Capture the ID Pic
        captureIDPicture: function() {
            const player = document.getElementById('idCapturePreview');
            // const canvas = document.getElementById("idCaptureCanvas");
            // var context = canvas.getContext('2d');

            this.vueCanvas.drawImage(player, 0, 0, this.vueCanvas.width, this.vueCanvas.height);
            this.captured = this.vueCanvas.toDataURL();

            // Show "Processing..."
            this.processing = true;

            // Submit the ID Check
            if (this._visionWrapper === null)
                this._visionWrapper = new mintVisionWrapper(this._tempToken);

            this._visionWrapper.SubmitIDDoc(this.captured).then(function (result) {
                // Show the fill-in-id part and start the face tracking
                this.next('capture-id-manually');
                this.stopIdCaptureVideo();

                this.processing = false;

                if (result.DocumentType !== "Negative") {
                    // Todo: Capture NAme and ID And compare to passed-in name and id
                    this.regResults.idNumber = result.IDNumber;
                    this.regResults.homeAffairsName = result.FullName;
                }
                if ((this.regResults.idNumber === undefined) || (this.regResults.idNumber === null)) {
                    this.next('capture-id-manually');
                }
                else {
                    this.next('screen-preview');
                }
                console.log(JSON.stringify(result));
            }).catch(reason => this.handleFetchError(reason));
        }
    },
    mounted () {
        var c = document.getElementById("idCaptureCanvas");
        // var ctx = c.getContext("2d");    
        this.vueCanvas = c;

        this.onResize();
        var video = this.$refs.idCapturePreview;
        // Get access to the camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(
                function(stream) {
                    video.facingMode = "environment";
                    video.srcObject = stream;
                    // video.play();
                }
            ).catch(function(err) { alert(err); });
        }
    },
}
</script>