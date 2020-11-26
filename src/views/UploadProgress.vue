<template>
    <v-card id="progressBarRow" flat class="mx-auto my-12 d-flex flex-column align-center" max-width="288">
        <p class="headline ma-1 mt-4">Thank you!</p>
        <p class="font-weight-bold text-center" style="color: gray">You have been successfully verified</p>

        <span class="text-center caption mt-4">{{ response }}</span>
        <v-progress-linear id="progressBar" v-model="progress" height="42" rounded color="#194B99" background-color="#A6A6A6"></v-progress-linear>
        <strong style="color: #DA7967" v-if="progress < 100">{{ Math.ceil(progress) }}%</strong>
        <strong style="color: #DA7967" v-else>Done!</strong>
    </v-card>
</template>

<script>
export default {
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
            this.startBuffer()
        },
    },
    methods: {
        startBuffer () {
            clearInterval(this.interval)

            this.interval = setInterval(() => {
            this.progress += Math.random() * (15 - 5) + 5
            }, 5000)
        },
    },
    mounted () {
      this.startBuffer()
    },
}
</script>

<style>

</style>