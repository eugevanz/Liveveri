<template>
    <v-card id="permissionForm" color="#385F73" dark outlined ref="permissionForm">
        <v-card-title class="headline">To verify you, we need to gather some details, including some selfies</v-card-title>

        <v-card-subtitle>This should take about 30 seconds.</v-card-subtitle>
        <v-card-subtitle>We store everything <i>very</i> securely, and only use it with your consent (which you can revoke at any time).</v-card-subtitle>

        <v-card-actions>
            <v-btn text color="green accent-4" @click="ConsentYes">Proceed</v-btn>
            <v-btn text color="orange" @click="ConsentNo">No, Thanks</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Vue from 'vue';

import CaptureIDCamera from './CaptureIDCamera';

export default {
    props: {},
    methods: {
        ConsentYes: function() {
            this.$emit('nextComponent', CaptureIDCamera);
            Vue.ConsentYes();
        },
        ConsentNo: function() {
            this.$emit('nextComponent', ConsentNo);
            Vue.ConsentNo();
        },
    }
}
</script>

<style>

</style>