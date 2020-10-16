<template>
    <v-card id="enclosingCol" flat>
        <canvas id="jeeFaceFilterCanvas" style="display:none;" width="1024" height="480" ref="jeeFaceFilterCanvas"/>

        <v-list-item id="instructionsRow" two-line>
            <v-list-item-content>
                <v-list-item-title id="FaceWidthOutput" class="headline">Please move your head around a bit</v-list-item-title>
                <v-list-item-subtitle id="smallText">Left-to-right, and up-and-down</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-avatar size="80">
                <v-img v-if="success" id="successTick" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/CompleteTick.gif" style="display:none"></v-img>
                <v-img v-else id="warningTick" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/WarningAnimated.gif" style="display:none"></v-img>
            </v-list-item-avatar>
        </v-list-item>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        success: true
    })
}
</script>

<style>

</style>