<template>
<v-app>
  <v-app-bar app color="#194B99" dark flat>
    <v-app-bar-nav-icon>
      <v-img contain width="48" src=".\assets\mintiilogo.png"></v-img>
    </v-app-bar-nav-icon>
    <v-toolbar-title>visionverify.AI</v-toolbar-title>
  </v-app-bar>
    <v-main>
        <component :is="currentTab" :next="next" :regResults="regResults" :visionWrapper="visionWrapper" :tempToken="tempToken" :handleFetchError="handleFetchError" :thirdPartyService="thirdPartyService" :thirdPartyFieldValue="thirdPartyFieldValue" :thirdPartyFieldName="thirdPartyFieldName" :facesToBeSubmitted="facesToBeSubmitted"></component>
        <!-- <router-view/> -->
    </v-main>

</v-app>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
</template>

<script>
import PermissionForm from './views/PermissionForm.vue';
import CaptureIDCamera from './views/CaptureIDCamera.vue';
import CaptureIDManually from './views/CaptureIDManually.vue';
import ScreenPreview from './views/ScreenPreview.vue';
import ThirdPartySource from './views/ThirdPartySource.vue';
import UploadProgress from './views/UploadProgress.vue';

export default {
  components: {
    'permission-form': PermissionForm, 
    'capture-id-camera': CaptureIDCamera, 
    'capture-id-manually': CaptureIDManually, 
    'screen-preview': ScreenPreview, 
    'third-party-source': ThirdPartySource, 
    'upload-progress': UploadProgress
  },
  data: () => ({
    currentTab: 'permission-form',
    regResults: {
      idNumber: "",
      idPictureCaptureRequested : false,
      nameFromQS : "",
      homeAffairsName : "",
      averageSpoofResult: 0,
      averageLivenessResult: 0,
      dhaResult: "",
      realTimeLivenessResult: "",
      nameMatch: 0,
      thirdPartyCheck : {
        requestedInQS: false,
        source: "",
        field: null,
        testString: "",
        expectedCharacters:"",
        inputtedCharacters:""
      }
    },
    thirdPartyService: null,
    thirdPartyFieldValue: null,
    thirdPartyFieldName: null,
    visionWrapper: null,
    tempToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL21pbnRpaXZpc2lvbnNlcnZpY2UuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2lkZW50aWZ5L2NsYWltcy90ZW5hbnQiOiJWaXNpb25WZXJpZnkuYWkiLCJodHRwczovL21pbnRpaXZpc2lvbnNlcnZpY2UuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2lkZW50aWZ5L2NsYWltcy90ZW5hbnRfdG9rZW4iOiJ7XHJcbiAgXCJkZXZpY2VOYW1lXCI6IFwicG93ZXJhcHBzXCIsXHJcbiAgXCJ0ZW5hbnROYW1lXCI6IFwiVmlzaW9uVmVyaWZ5LmFpXCIsXHJcbiAgXCJ1c2VyXCI6IG51bGwsXHJcbiAgXCJzdWJUZW5hbnRcIjogbnVsbCxcclxuICBcImFwaVZlcnNpb25cIjogbnVsbFxyXG59IiwibmJmIjoxNjAxOTEwNzM4LCJleHAiOjE2MDE5OTcxMzgsImlhdCI6MTYwMTkxMDczOCwiaXNzIjoiaHR0cHM6Ly9taW50aWl2aXNpb25zZXJ2aWNlLmF6dXJld2Vic2l0ZXMubmV0LyJ9.H8HEp-3otGupjaxHP1YuatEDtQPcJgyl4TQE8CQfFsA",
    tempLsToken: "3af44b1ab46f4c69a281bb75b454da32",
    mintPersonID: null,
    mintPersonName: null,
    facesToBeSubmitted: []
  }),
  methods: {
    next: function(component) {
      this.currentTab = component;
    },
    // Error function
    handleFetchError: function(reason) {
        this.handleError(reason.message);
    },
    handleError: function(message) {
        console.log("Error! " + message);
        this.message = message;
    },
  }
}
</script>

<style>
@font-face {
    font-family: Rubik;
    src: url('./assets/Rubik-VariableFont_wght.ttf');
}
* {
    font-family: Rubik, Roboto, Arial, sans-serif;
}
</style>