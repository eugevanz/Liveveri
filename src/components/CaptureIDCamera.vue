<template>
    <v-card id="idCaptureRow" v-resize="onResize" flat>
        <video id="idCapturePreview" ref="idCapturePreview" :width="windowSize.x" height="480" autoplay playsinline></video>
        <canvas id="idCaptureCanvas" ref="idCaptureCanvas" :width="windowSize.x" :height="windowSize.y"></canvas>

        <v-card-title>Position your document with the picture-side up and click the "Capture" button</v-card-title>
        <v-card-actions>
            <v-btn color="blue" dark @click="capture" :loading="loading">Capture</v-btn>
            <v-btn color="green" dark @click="next(3)">Continue</v-btn>
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
            this.windowSize = { x: window.innerWidth - 232, y: window.innerHeight - 552 }
        },
        capture() {
            this.canvas = this.$refs.idCaptureCanvas;
            this.canvas.getContext("2d").drawImage(this.video, 0, 0, 640, 480);
            this.captures.push(this.canvas.toDataURL("image/png"));
        }
    },
    mounted () {
        this.onResize();
        this.video = this.$refs.idCapturePreview;
        // if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        //     navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        //         this.video.src = window.URL.createObjectURL(stream);
        //         this.video.play();
        //     });
        // }

        if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia({video: true});
        }
    },
}
</script>