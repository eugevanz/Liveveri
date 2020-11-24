<template>
    <v-card id="idCaptureRow" class="mx-auto my-12 d-flex flex-column align-center" max-width="288" flat>
        <p class="headline ma-1 mt-4">Scan document</p>
        <p class="font-weight-bold text-center" style="color: gray">Position your document with the picture-side-up and click the "Capture" button</p>

        <video id="idCapturePreview" ref="idCapturePreview" playsinline autoplay width="288"></video>
        <!-- <v-img :src="captured"></v-img> -->

        <v-row>
            <v-col><v-btn text @click="next(3)">Skip</v-btn></v-col>
            <v-col><v-btn color="#194B99" outlined @click="capture" :loading="loading">Capture</v-btn></v-col>
        </v-row>
        
        <p class="font-weight-bold"><span class="headline align-self-end" style="color: #DA7967">2</span> of 3</p>

        <v-btn color="#194B99" depressed dark @click="next(3)" block>Next</v-btn>
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
            var x = this.windowSize.x
            if (window.innerWidth > 640) {
                x = 640;
            } else {
                x = window.innerWidth;
            }
            this.windowSize = { x: x, y: window.innerHeight }
        },
        capture() {
            const canvas = document.getElementById("idCaptureCanvas");
            this.vueCanvas.drawImage(this.$refs.idCapturePreview, 0, 0, 1024, 768);
            this.captured = canvas.toDataURL("image/png");
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