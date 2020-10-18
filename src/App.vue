<template>
    <v-app>

        <v-main>
          <v-container><liveness-v></liveness-v></v-container>
        </v-main>

    </v-app>
</template>

<script>
import Vue from 'vue'
import LivenessV from './views/LivenessV.vue'
export default {
    components: { LivenessV },
    mounted() {
        Vue.Main();
    }
}
</script>
