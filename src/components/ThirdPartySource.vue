<template>
    <v-card id="thirdPartyConfirm" flat style="display:none">
        <v-card-title class="headline">Please complete the missing digits below.</v-card-title>
        <v-card-subtitle>This is just to confirm your identity. We won't store this information.</v-card-subtitle>
        <v-card-subtitle id="thirdPartyTextElement"></v-card-subtitle>
        <v-card-actions>
            <v-btn id="doneThirdCharButton" color="blue accent-4" @click="doneThirdParty" text disabled>I'm done</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import Vue from 'vue';
export default {
    methods: {
        doneThirdParty: () => Vue.doneThirdParty(),
    }
}
</script>

<style>

</style>