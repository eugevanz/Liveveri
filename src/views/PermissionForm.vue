<template>
    <v-card id="permissionForm" flat ref="permissionForm" class="mx-auto my-12 d-flex flex-column align-center" max-width="288">
        <v-img height="304" position="top" src="..\assets\II_Vertical_Blue_Transparent.png"></v-img>

        <p class="headline ma-1 mt-4">Peter Reid</p>
        <p class="font-weight-bold text-center" style="color: gray">Has requested to verify your idenity</p>

        <ul class="my-4" style="font-size: 14px">
            <li>We gather details, including selfies</li>
            <li>This should take about 30 seconds</li>
            <li>We store everything <i>very</i> securely, and only use it with your consent (which you can revoke at any time).</li>
        </ul>
        
        <p class="body-2 font-weight-bold">Would you like to continue?</p>

        <v-dialog v-model="dialog" persistent max-width="512">
            <template v-slot:activator="{ on, attrs }">
                <v-btn text color="#194B99" v-bind="attrs" v-on="on" class="mb-2">No, Thanks</v-btn>
            </template>
            <v-card>
                <v-card-title class="headline">We understand. We'll send a note back to your requestor indicating that you declined consent.</v-card-title>
                <v-card-text>You can refresh this page and opt back in at any time.</v-card-text>
            </v-card>
        </v-dialog>

        <v-btn depressed dark color="#194B99" @click="next(2)" block>YES</v-btn>

        <a href="" class="ma-4" style="text-decoration: none;">
            Terms and conditions
            <v-icon size="18" color="#DA7967">mdi-open-in-new</v-icon>
        </a>
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
    }
}
</script>

<style>

</style>