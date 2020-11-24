<template>
    <v-card id="formRow" flat ref="formRow" class="mx-auto my-12 d-flex flex-column align-center" max-width="288">
        <p class="headline ma-1 mt-4">ID verification</p>
        <p class="font-weight-bold text-center" style="color: gray">We need to check your ID number against 3rd parties</p>
        
        <v-text-field class="my-5" id="idNumber" :rules="idRules" :counter="counter" label="South African ID Number" hint="*This is for verification and onboarding only. See Privacy Policy." persistent-hint required outlined></v-text-field>

        <p class="font-weight-bold"><span class="headline align-self-end" style="color: #DA7967">1</span> of 3</p>

        <v-btn @click="captureID" depressed dark color="#194B99" block class="">Submit</v-btn>
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