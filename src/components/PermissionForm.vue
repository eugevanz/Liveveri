<template>
    <v-card id="permissionForm" flat ref="permissionForm">
        <v-card-title>This should take about 30 seconds</v-card-title>
        <v-card-subtitle>We store everything <i>very</i> securely, and only use it with your consent (which you can revoke at any time).</v-card-subtitle>

        <v-card-actions>
            <v-btn text color="green accent-4" @click="next(2)">Proceed</v-btn>
            <v-btn text color="orange" @click="next(1)">No, Thanks</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
// import Vue from 'vue';

// import CaptureIDCamera from './CaptureIDCamera';
// import ConsentNo from './ConsentNo';

export default {
    props: {
        next: {
            type: Function,
            required: true
        }
    },
    methods: {
        // ConsentYes: function() {
        //     this.$emit('consent', 2);
        //     Vue.ConsentYes();
        // },
        // ConsentNo: function() {
        //     this.$emit('consent', 1);
        //     Vue.ConsentNo();
        // },
    }
}
</script>

<style>

</style>