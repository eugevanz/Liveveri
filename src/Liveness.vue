<template>
  <v-app>
    <div>
      <v-toolbar color="blue lighten-5" flat prominent id="topRow">
        <v-toolbar-title>
          <h2>VisionVerify.ai</h2>
          <p class="subtitle-1">We need to verify your identity</p>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-img max-height="144" max-width="144" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/II_Square_Logo_640.png"></v-img>
      </v-toolbar>

      <v-main class="mt-5" id="midRow">
        <div v-html="rawHtml"></div>
        <v-container>
          <!-- Consent -->
          <v-card id="permissionForm" color="#385F73" dark flat ref="permissionForm">
            <v-card-title class="headline">To verify you, we need to gather some details, including some selfies</v-card-title>

            <v-card-subtitle>This should take about 30 seconds.</v-card-subtitle>
            <v-card-subtitle>We store everything <i>very</i> securely, and only use it with your consent (which you can revoke at any time).</v-card-subtitle>

            <v-card-actions>
              <v-btn text color="green accent-4" @click="ConsentYes">Proceed</v-btn>
              <v-btn text color="orange" @click="ConsentNo">No, Thanks</v-btn>
            </v-card-actions>
          </v-card>

          <!-- Consent No -->
          <v-card id="consentNo" flat style="display:none">
            <v-card-title class="headline"> We understand. We'll send a note back to your requestor indicating that you declined consent.</v-card-title>
            <v-card-subtitle>You can refresh this page and opt back in at any time.</v-card-subtitle>
          </v-card>

          <!-- Capture ID Camera -->
          <v-card id="idCaptureRow" flat ref="idCaptureRow" style="display:none">
            <video id="idCapturePreview" autoplay playsinline ref="idCapturePreview"></video>
            <canvas id="idCaptureCanvas" width="1024" height="768" style="display:none"></canvas>

            <v-card-title class="headline">Position your document with the picture-side up and click the "Capture" button</v-card-title>

            <v-card-actions>
              <v-btn color="blue lighten-2" text @click="CaptureIDPicture">Capture</v-btn>
            </v-card-actions>
          </v-card>

          <!-- Capture ID Manually -->
          <v-card id="formRow" flat ref="formRow" style="display: none;">
            <v-card-text>
              <v-form>
                <v-text-field id="idNumber" :rules="idRules" :counter="13" label="South African ID Number" hint="We will use this for verification and onboarding only. For more information see our Privacy Policy." required></v-text-field>
                <v-btn @click="CaptureID" text>Submit</v-btn>
              </v-form>
            </v-card-text>
          </v-card>

          <!-- Screen Preview -->
          <v-card id="enclosingCol" flat>
              <v-card-text id="centerColumn" ref="centerColumn">
                  <canvas id="jeeFaceFilterCanvas" style="display:none;" width="1024" height="480" ref="jeeFaceFilterCanvas"/>
              </v-card-text>
          </v-card>

          <!-- Instruction Row For Capture -->
          <v-card id="instructionsRow" flat style="display:none;">
            <v-img id="successTick" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/CompleteTick.gif" style="display:none"></v-img>
            <v-img id="warningTick" src="https://mintiiaccesscontrol.z6.web.core.windows.net/MobileApplication/WarningAnimated.gif" style="display:none"></v-img>
            <v-card-title class="headline" id="FaceWidthOutput">Please move your head around a bit</v-card-title>
            <v-card-subtitle id="smallText">Left-to-right, and up-and-down</v-card-subtitle>
          </v-card>

          <!-- Row for progress for uploading -->
          <v-card id="progressBarRow" flat style="display:none">
            <v-card-actions>
              <v-progress-linear id="progressBar" v-model="progress" height="25" color="blue-grey" rounded>
                <template v-slot="{ value }">
                  <strong>Uploading {{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>
            </v-card-actions>
          </v-card>

          <!-- To confirm third party source -->
          <v-card id="thirdPartyConfirm" flat style="display:none">
            <v-card-title class="headline">Please complete the missing digits below.</v-card-title>
            <v-card-subtitle>This is just to confirm your identity. We won't store this information.</v-card-subtitle>
            <v-card-subtitle id="thirdPartyTextElement"></v-card-subtitle>
            <v-card-actions>
              <v-btn id="doneThirdCharButton" color="blue accent-4" @click="doneThirdParty" text disabled>I'm done</v-btn>
            </v-card-actions>
          </v-card>

          <v-card flat style="display:none">
            <v-card-text>
              <v-row justify="space-around">
                <v-col md="4">
                    <v-img id="leftFace" src="https://picsum.photos/510/300?random">
                      <v-card-title>Left</v-card-title>
                    </v-img>
                </v-col>
                <v-col md="4">
                    <v-img id="rightFace" src="https://picsum.photos/510/300?random">
                      <v-card-title>Right</v-card-title>
                    </v-img>
                </v-col>
                <v-col md="4">
                    <v-img id="straightFace" src="https://picsum.photos/510/300?random">
                      <v-card-title>Straight</v-card-title>
                    </v-img>
                </v-col>
                <v-col md="4">
                    <v-img id="downFace" src="https://picsum.photos/510/300?random">
                      <v-card-title>Down</v-card-title>
                    </v-img>
                </v-col>
                <v-col md="4">
                    <v-img id="upFace" src="https://picsum.photos/510/300?random">
                      <v-card-title>Up</v-card-title>
                    </v-img>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>

        <v-dialog id="errorModal" v-model="errorModal" max-width="290">
          <v-card>
            <v-card-title id="exampleModalLongTitle" class="headline">Uh Oh, something went wrong</v-card-title>
            <v-card-text id="errorMessageText">Unfortunately an error has occurred</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="errorModal = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>

      <!-- <v-footer padless>
        <v-card flat width="100%" tile class="grey lighten-4 text-center">
          <v-card-text>
            {{ new Date().getFullYear() }} — <strong>Mint Vision Verify</strong>
          </v-card-text>
        </v-card>
      </v-footer> -->
    </div>
  </v-app>
</template>

<script>
import Vue from 'vue';

export default {
  props: {
    guid: {
      type: String,
      required: true
    }
  },
  data: () => ({
    idRules: [
      v => !!v || 'ID Number is required',
      v => /^[0-9]*$/.test(v) || 'ID Number can only be numerics between 0 and 9',
      v => v.length == 13 || 'ID number must be 13 characters',
    ],
    progress: 25,
    valid: 'jhgvghhjsknflfvbhj',
    errorModal: false
  }),
  methods: {
    ConsentYes: () => Vue.ConsentYes(),
    ConsentNo: () => Vue.ConsentNo(),
    CaptureIDPicture: () => Vue.CaptureIDPicture(),
    CaptureID: () => Vue.CaptureID(),
    doneThirdParty: () => Vue.doneThirdParty(),

    checkGuid: () => {
      this.guid == this.valid ? true : false;
    }
  }, 
  mounted: {
    checkGuid();
  }
};
</script>
