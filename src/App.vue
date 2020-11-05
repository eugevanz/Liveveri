<template>
    <v-app>

        <v-main>
            <liveness-v></liveness-v>
        </v-main>

    </v-app>
</template>

<script>
// import Vue from 'vue'
import LivenessV from './views/LivenessV.vue'
export default {
    components: { LivenessV },
    // mounted() {
    //     Vue.Main();
    // }
}
</script>
