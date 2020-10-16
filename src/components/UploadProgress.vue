<template>
    <v-card id="progressBarRow" flat style="display:none">
        <v-card-actions>
            <v-progress-linear id="progressBar" v-model="progress" height="25" color="blue-grey" rounded>
                <template v-slot="{ value }">
                    <strong>Uploading {{ Math.ceil(value) }}%</strong>
                </template>
            </v-progress-linear>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {

}
</script>

<style>

</style>