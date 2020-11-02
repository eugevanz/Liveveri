<template>
    <v-card id="permissionForm" flat ref="permissionForm">
        <v-card-title>This should take about 30 seconds</v-card-title>
        <v-card-subtitle>We store everything <i>very</i> securely, and only use it with your consent (which you can revoke at any time).</v-card-subtitle>

        <v-card-actions>
            <v-btn depressed dark color="success" @click="next(2)">Proceed</v-btn>
            <v-dialog v-model="dialog" persistent max-width="512">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn text color="orange" v-bind="attrs" v-on="on">No, Thanks</v-btn>
                </template>
                <v-card>
                    <v-card-title class="headline">We understand. We'll send a note back to your requestor indicating that you declined consent.</v-card-title>
                    <v-card-text>You can refresh this page and opt back in at any time.</v-card-text>
                </v-card>
            </v-dialog>
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
        dialog: false
    }),
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