<template>
    <v-card id="idCaptureRow" v-resize="onResize" flat>
        <video id="idCapturePreview" ref="idCapturePreview" :width="windowSize.x" :height="windowSize.y" autoplay></video>
        <!-- <canvas id="idCaptureCanvas" ref="idCaptureCanvas" width="640" height="480"></canvas> -->

        <v-card-title>Position your document with the picture-side up and click the "Capture" button</v-card-title>
        <v-card-actions>
            <v-btn color="blue" depressed dark @click="capture" :loading="loading">Capture</v-btn>
            <v-btn color="green accent-4" depressed dark @click="next(3)">Continue</v-btn>
            <v-btn text @click="next(1)">Cancel</v-btn>
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
        captures: [],
        loading: false
    }),
    methods: {
        // CaptureIDPicture: function() {
        //     this.$emit('nextComponent', ScreenPreview);
        //     Vue.CaptureIDPicture();
        // },
        onResize: function() {
            this.windowSize = { x: window.innerWidth - 232, y: window.innerHeight - 416 }
        },
        capture() {
            this.canvas = this.$refs.idCaptureCanvas;
            this.canvas.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
            this.captures.push(this.canvas.toDataURL("image/png"));
        }
    },
    mounted () {
        this.onResize();
        var video = this.$refs.idCapturePreview;
        // Get access to the camera
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(
                function(stream) {
                    video.srcObject = stream;
                    video.play();
                }
            ).catch(function(err) { alert(err); });
        }
    },
}
</script>