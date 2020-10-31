<template>
    <v-card id="enclosingCol" flat>
        <canvas id="jeeFaceFilterCanvas" width="1024" height="768" ref="jeeFaceFilterCanvas"/>

        <v-list-item id="instructionsRow" two-line>
            <v-list-item-content>
                <v-list-item-title id="FaceWidthOutput" class="headline">Please move your head around a bit</v-list-item-title>
                <v-list-item-subtitle id="smallText">Left-to-right, and up-and-down</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80">
                <v-img v-if="success" id="successTick" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/CompleteTick.gif"></v-img>
                <v-img v-else id="warningTick" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/WarningAnimated.gif"></v-img>
            </v-list-item-avatar>
        </v-list-item>
    </v-card>
</template>

<script>
import Vue from 'vue';
export default {
    props: {
        next: {
            type: Function,
            required: true
        }
    },
    data: () => ({
        success: false
    }),
    mounted() {
        Vue.faceFilter();
    }
}
</script>

<style>

</style>