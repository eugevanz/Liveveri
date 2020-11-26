<template>
    <v-card id="thirdPartyConfirm" flat class="mx-auto my-12 d-flex flex-column align-center" max-width="288">
        <p class="headline ma-1 mt-4">3rd Party verify</p>
        <p class="font-weight-bold text-center" style="color: gray">Please complete the missing _ fields below</p>

        <v-text-field class="mt-4 mb-1" v-model="address" label="Complete the sentence" filled></v-text-field>
        
        <v-text-field class="mb -4" label="My cat's name is:" outlined></v-text-field>

        <p class="text-center caption my-4">*This is just to confirm your identity. We won't store this information.</p>

        <p class="font-weight-bold"><span class="headline align-self-end" style="color: #DA7967">3</span> of 3</p>

        <v-btn id="doneThirdCharButton" color="#194B99" @click="next(6)" depressed dark block>I'm done</v-btn>
    </v-card>
</template>

<script>
export default {
    props: {
        next: {
            type: Function,
            required: true
        }
    },
    data: () => ({
        secretRules: [
            v => /^[0-9]*$/.test(v) || 'Only use numerics between 0 and 9',
        ],
        tab1: false, tab2: false, tab3: false, tab4: false,
        counter1: 1, counter2: 1, counter3: 1, counter4: 1,
        address: "34 Tuin"
    }),
    methods: {
        // disableField(counter) {
        //     if (counter = )
        // }
    }
}
</script>

<style scoped>
  .v-text-field input {
    font-size: 3em;
  }
</style>