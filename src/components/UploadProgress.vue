<template>
    <v-card id="progressBarRow" flat>
        <v-card-title>Thank You!</v-card-title>
        <v-card-subtitle>You have been successfully verified</v-card-subtitle>
        <v-card-actions>
            <v-progress-linear id="progressBar" v-model="progress" height="25" rounded buffer-value="0" background-color="blue-grey">
                <strong v-if="progress < 100">Uploading {{ Math.ceil(progress) }}%</strong>
                <strong v-else>Done!</strong>
            </v-progress-linear>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        progress: 10,
        interval: 0,
    }),
    beforeDestroy () {
      clearInterval(this.interval)
    },
    watch: {
        progress (val) {
            if (val < 100) return
            // if (val > 99) this.progress = 0;
            
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