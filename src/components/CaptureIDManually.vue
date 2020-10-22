<template>
    <v-card id="formRow" flat ref="formRow">
        <v-card-text>
            <v-text-field id="idNumber" :rules="idRules" :counter="counter" label="South African ID Number" hint="We will use this for verification and onboarding only. For more information see our Privacy Policy." required></v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="captureID" text>Submit</v-btn>
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
        idRules: [
            v => !!v || 'ID Number is required',
            v => /^[0-9]*$/.test(v) || 'ID Number can only be numerics between 0 and 9',
        ],
        counter: 13,
    }),
    methods: {
        captureID: function() {
            this.next(4);
            // Vue.CaptureID();
        },
    }
}
</script>

<style>

</style>