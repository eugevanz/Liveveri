<template>
    <v-card id="idCaptureRow" v-resize="onResize" flat>
        <video id="idCapturePreview" autoplay playsinline></video>
        <canvas id="idCaptureCanvas" :width="windowSize.x" :height="windowSize.y"></canvas>

        <v-card-title>Position your document with the picture-side up and click the "Capture" button</v-card-title>

        <v-card-actions>
            <v-btn color="blue" text @click="CaptureIDPicture">Capture</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Vue from 'vue';
export default {
    data: () => ({
        windowSize: { x: 0, y: 0, },
    }),
    methods: {
        CaptureIDPicture: () => Vue.CaptureIDPicture(),
        onResize: function() {
            this.windowSize = { x: window.innerWidth - 232, y: window.innerHeight - 544 }
        },
    },
    mounted () {
        this.onResize()
    },
}
</script>

<style>

</style>