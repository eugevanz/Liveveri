<template>
    <v-card id="thirdPartyConfirm" flat>
        <v-card-title class="headline">Please complete the missing digits below.</v-card-title>
        <v-card-subtitle>This is just to confirm your identity. We won't store this information.</v-card-subtitle>
        <v-card-subtitle id="thirdPartyTextElement"></v-card-subtitle>
        <v-card-text>
            <v-row class="mx-15">
                <v-col><v-text-field solo outlined :counter="counter1" :disabled="tab1"></v-text-field></v-col>
                <v-col><v-text-field solo outlined :counter="counter2" :disabled="tab2"></v-text-field></v-col>
                <v-col><v-text-field solo outlined :counter="counter3" :disabled="tab3"></v-text-field></v-col>
                <v-col><v-text-field solo outlined :counter="counter4" :disabled="tab4"></v-text-field></v-col>
            </v-row>
        </v-card-text>
        <v-card-actions>
            <v-btn id="doneThirdCharButton" color="success" @click="next(6)" depressed>I'm done</v-btn>
            <v-btn text @click="next(4)">Back</v-btn>
        </v-card-actions>
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
        counter1: 1, counter2: 1, counter3: 1, counter4: 1
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