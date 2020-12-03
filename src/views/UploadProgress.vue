<template>
    <v-card id="progressBarRow" flat class="mx-auto my-12 d-flex flex-column align-center" max-width="288">
        <p class="ma-1 mt-4 font-weight-bold" style="font-size: 30px">Thank you!</p>
        <p class="font-weight-bold text-center" style="color: gray">You have been successfully verified</p>

        <span class="text-center caption mt-4">{{ response }}</span>
        <v-progress-linear id="progressBar" v-model="progress" height="42" rounded color="#194B99" background-color="#A6A6A6"></v-progress-linear>
        <strong style="color: #DA7967" v-if="progress < 100">{{ Math.ceil(progress) }}%</strong>
        <strong style="color: #DA7967; font-size: 22px" v-else>Done!</strong>
    </v-card>
</template>

<script>

import mintVisionWrapper from '../assets/mintvisionwrapper';

export default {
    props: {
        visionWrapper: {
            type: Object,
            required: false
        },
        facesToBeSubmitted: {
            type: Array,
            required: false
        },
        handleFetchError: {
            type: Function,
            required: false
        },
    },
    data: () => ({
        progress: 10,
        interval: 0,
        response: 'Sending response...'
    }),
    beforeDestroy () {
      clearInterval(this.interval)
    },
    watch: {
        progress (val) {
            if (val < 100) return
            // if (val > 99) this.progress = 0;
            this.response = "Response sent";
        },
    },
    methods: {
        // Process a face from the queue
        processFace() {

            if (this.visionWrapper === null) this.visionWrapper = new mintVisionWrapper(this.tempToken);

            // Pick the first one
            for (var i = 0; i < this.facesToBeSubmitted.length; i++) {
                if (this.facesToBeSubmitted[i].submitted === false) {

                    this.progress = Math.round((i / this.facesToBeSubmitted.length) * 100);
                    
                    this.facesToBeSubmitted[i].submitted = true;
                    this.visionWrapper.AddPersonFace(this.facesToBeSubmitted[i].personID, this.facesToBeSubmitted[i].base64Image).then(function () {
                        this.processFace();
                    }).catch(reason => this.handleFetchError(reason));
                    return;
                }
            }
        }
    },
    mounted () {
      this.processFace()
    },
}
</script>

<style>

</style>