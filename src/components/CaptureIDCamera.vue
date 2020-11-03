<template>
    <v-card id="idCaptureRow" v-resize="onResize" flat>
        <v-card-title class="headline">Capture your face</v-card-title>
        <v-row>
            <v-col sm="7">
                <video id="idCapturePreview" ref="idCapturePreview" playsinline autoplay></video>
            </v-col>
            <v-col sm="5">
                <canvas id="idCaptureCanvas" ref="idCaptureCanvas" width="1024" height="768" style="display: none;"></canvas>
                <v-row dense>
                    <v-col sm="6">
                        <v-img :src="captured"></v-img>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-card-subtitle>Position your document with the picture-side up and click the "Capture" button</v-card-subtitle>
        <v-card-actions>
            <v-btn color="blue" depressed dark @click="capture" :loading="loading">Capture</v-btn>
            <v-btn color="success" depressed dark @click="next(3)">Continue</v-btn>
            <v-btn text @click="next(1)">Back</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
// import Vue from 'vue';

export default {
    props: {
        next: {
            type: Function,
            required: true
        }
    },
    data: () => ({
        windowSize: { x: 0, y: 0, },
        video: {},
        canvas: {},
        loading: false,
        captured: null
    }),
    methods: {
        onResize: function() {
            this.windowSize = { x: window.innerWidth - 232, y: window.innerHeight - 416 }
        },
        capture() {
            const canvas = document.getElementById("idCaptureCanvas");
            this.vueCanvas.drawImage(this.$refs.idCapturePreview, 0, 0, 1024, 768);
            this.captured = canvas.toDataURL("image/png");
        }
    },
    mounted () {
        var c = document.getElementById("idCaptureCanvas");
        var ctx = c.getContext("2d");    
        this.vueCanvas = ctx;

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