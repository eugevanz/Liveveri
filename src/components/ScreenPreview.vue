<template>
    <v-card id="enclosingCol" flat>
        <canvas id="jeeFaceFilterCanvas" width="1024" height="480" ref="jeeFaceFilterCanvas"/>

        <v-list-item id="instructionsRow" two-line>
            <v-list-item-content>
                <v-list-item-title id="FaceWidthOutput" ref="FaceWidthOutput" class="headline">Please move your head around a bit</v-list-item-title>
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
// import JEEFACEFILTERAPI from '@/assets/scripts/jeelizFaceFilter.js';
// import $ from "jquery";
import RunningAverageDoubleClass from '@/assets/scripts/runningAverage.js'
import { JEEFACEFILTERAPI, NN_4EXPR } from 'facefilter';

export default {
    props: {
        next: {
            type: Function,
            required: true
        }
    },
    data: () => ({
        success: false,
        RUNNING_AVERAGES: 10,
        THRESHOLD_OF_FACE_MOVEMENT_FOR_ZOOMING: 300,
        THRESHOLD_OF_FACE_TO_CONSIDER: 20,
        MAX_ANGLE_FACE_LEFTRIGHT: 200,
        MAX_ANGLE_FACE_TOPBOTTOM: 200,
        DETECT_THRESHOLD: 0.8,
        NUM_DETECTS_FOR_REAL_FACE: 10,
        MAX_TWIST_ANGLE_FOR_FACE: 0.1,
        // Minimum angle before a face is considered left-right
        MIN_LEFT_RIGHT_FOR_CAPTURE: 0.10,
        MAX_LEFT_RIGHT_FOR_CAPTURE: 0.35,
        // Minimum angle before a face is considered up-down
        MIN_UP_FOR_CAPTURE: 0.20,
        MAX_UP_FOR_CAPTURE: 0.55,
        MIN_DOWN_FOR_CAPTURE: 0.03,
        MAX_DOWN_FOR_CAPTURE: 0.25,

        // Third party field confirmation
        MAX_THIRD_PARTY_LENGTH: 30,
        MIN_THIRD_PARTY_LENGTH_FOR_4_CHARS: 11,

        // Above this, the spoof is too high and processing stops
        MAX_SPOOF_FOR_ALERT: 0.6,

        // For the timeout
        TIME_FOR_FACE_TO_STAY_REAL: 5000,

        // Minimum face captures for a person to enroll
        NUM_FACES_FOR_REGISTRATION: 4, // Five is max, three would result in faster reg

        // Bounding Box is too small
        BOUNDING_BOX_CORRECT_FACTOR: 2.4,

        _isFaceReal: false,
        _numRealDetects: 0,

        // For video res
        _videoWidth: 0,
        _videoHeight: 0,

        // For timeout
        _faceTimeOut: null,

        // For most-left and most-right
        _mostLeftAngle: 0,
        _mostLeftFace: null,
        _mostRightAngle: 0,
        _mostRightFace: null,
        // For most-up and most-down
        _mostUpAngle: 0,
        _mostUpFace: null,
        _mostDownAngle: 0,
        _mostDownFace: null,
        // Most straight
        _mostStraightAngle: 100000,
        _mostStraightFace: null,
        _previousMostStraightFace: null,


        // For when we are onboarding someone
        _areSubmitting: false,
        _livenessCheckCount: 0,
        _isSpoofOverThreshold: false,
        _realnessAverage: 0,
        _spoofAverage: 0,

        // Found Person Data, should really live in an object
        _mintPersonID: null,
        _mintPersonName: null,

        // Number of faces added to person
        _facesToBeSubmitted: [],

        //_confirmThirdParty: false,
        _thirdPartyFieldValue: null,
        _thirdPartyFieldName: null,
        _numThirdChars: 0,
    }),
    methods: {
        CropPlusExport() {
            // Dummy fo now
            return this.vueCanvas.toDataURL();

            //// create a temporary canvas sized to the cropped size
            //var faceCanvas = document.getElementById('jeeFaceFilterCanvas');
            //var canvas1 = document.getElementById('cropCanvas');
            //var ctx1 = canvas1.getContext('2d');
            //canvas1.width = cropWidth;
            //canvas1.height = cropHeight;
            //// use the extended from of drawImage to draw the
            //// cropped area to the temp canvas
            //ctx1.drawImage(faceCanvas, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

            //var im = canvas1.toDataURL();
            //$("#debugIm").attr("src", im);
            //// return the .toDataURL of the temp canvas
            //return (im);
        },
        CheckForRealness() {
            var angleChangeLeftRight = Math.abs(Math.round(this._ryAngle.GetIndexOfDispersion() * 10000));
            console.log(angleChangeLeftRight);
            if (angleChangeLeftRight > this.MAX_ANGLE_FACE_LEFTRIGHT)
                this._numRealDetects++;
            var angleChangeTopBottom = Math.abs(Math.round(this._rxAngle.GetIndexOfDispersion() * 10000));

            if (angleChangeTopBottom > this.MAX_ANGLE_FACE_TOPBOTTOM)
                this._numRealDetects++;

            if (this._numRealDetects > this.NUM_DETECTS_FOR_REAL_FACE) {
                //$("#FaceWidthOutput").text("Face Is Real");
                this._isFaceReal = true;
            }

            // Set the timeout
            if (this._faceTimeOut !== null)
                clearTimeout(this._faceTimeOut);

            this._faceTimeOut = setTimeout(function () {
                if (this._areSubmitting)
                    return;
                this.ResetFacesDetected();
                this.refs.FaceWidthOutput.text = "I don't see a face; please center yourself in the viewfinder";
            }, this.TIME_FOR_FACE_TO_STAY_REAL);
        },
        CaptureLeftRightImages(leftRightAngle, upDownAngle, left, top, width, height) {

            var madeAChange = false;
            // Left-Right - Check if over threshold
            if ((Math.abs(leftRightAngle) > this.MIN_LEFT_RIGHT_FOR_CAPTURE) && (Math.abs(leftRightAngle) < this.MAX_LEFT_RIGHT_FOR_CAPTURE)) {
                // Left or right image?
                if (leftRightAngle < 0) {
                    if (leftRightAngle < this._mostLeftAngle) {
                        this._mostLeftAngle = leftRightAngle;
                        this._mostLeftFace = this.CropPlusExport(left, top, width, height);
                        // $("#leftFace").attr("src", this._mostLeftFace);
                        this.vueCanvas.addClass("border-left");
                        madeAChange = true;
                    }
                }
                else {
                    if (leftRightAngle > this._mostRightAngle) {
                        this._mostRightAngle = leftRightAngle;
                        this._mostRightFace = this.CropPlusExport(left, top, width, height);
                        // $("#rightFace").attr("src", this._mostRightFace);
                        this.vueCanvas.addClass("border-right");
                        madeAChange = true;
                    }
                }
            }

            // Left or right image?
            if (upDownAngle < 0) {
                if ((Math.abs(upDownAngle) > this.MIN_UP_FOR_CAPTURE) && (Math.abs(upDownAngle) < this.MAX_UP_FOR_CAPTURE)) {
                    if (upDownAngle < this._mostUpAngle) {
                        this._mostUpAngle = upDownAngle;
                        this._mostUpFace = this.CropPlusExport(left, top, width, height);
                        // $("#upFace").attr("src", this._mostUpFace);
                        this.vueCanvas.addClass("border-top");
                        madeAChange = true;
                    }
                }
            }
            else {
                if ((Math.abs(upDownAngle) > this.MIN_DOWN_FOR_CAPTURE) && (Math.abs(upDownAngle) < this.MAX_DOWN_FOR_CAPTURE)) {
                    if (upDownAngle > this._mostDownAngle) {
                        this._mostDownAngle = upDownAngle;
                        this._mostDownFace = this.CropPlusExport(left, top, width, height);
                        // $("#downFace").attr("src", this._mostDownFace);
                        this.vueCanvas.addClass("border-bottom");
                        madeAChange = true;
                    }
                }
            }

            // Most forward-facing image
            var straitAngleRef = Math.abs(leftRightAngle) * Math.abs(upDownAngle);
            if (straitAngleRef <= this._mostStraightAngle) 
            {
                this._mostStraightAngle = straitAngleRef;
                if (this._mostStraightFace !== null)
                    this._previousMostStraightFace = this._mostStraightFace;
                this._mostStraightFace = this.CropPlusExport(left, top, width, height);
                // $("#straightFace").attr("src", this._mostStraightFace);
                madeAChange = true;
            }

            // Check for Submit?
            if (madeAChange)
                this.CheckForEnoughFacesAndRealnessAndSubmit();
        },
        ResetFacesDetected() {
            this._isFaceReal = false;
            this._numRealDetects = 0;
        },
        faceFilter() {
            const canvas = this.vueCanvas;
            JEEFACEFILTERAPI.init({
                canvas,
                NNC: NN_4EXPR, // root of NNC.json file
                maxFacesDetected: 1,
                followZRot: true,
                callbackReady: function (errCode, spec) {
                    if (errCode) {
                        console.log('AN ERROR HAPPENS. ERR =', errCode);
                        return;
                    }
                    this._videoWidth = spec.videoElement.videoWidth;
                    this._videoHeight = spec.videoElement.videoHeight;

                    console.log('INFO: JEEFACEFILTERAPI IS READY');
                },

                // called at each render iteration (drawing loop):
                callbackTrack: function (detectState) {
                    // Are we done?
                    if (this._areSubmitting)
                        return;

                    // Show the video
                    JEEFACEFILTERAPI.render_video();

                    // Is there no face?
                    if (detectState.detected <= this.DETECT_THRESHOLD) {
                        this.refs.FaceWidthOutput.text = "I don't see a face; please center yourself in the viewfinder";
                        this.ResetFacesDetected();
                        return;
                    }


                    // Capture the images first
                    var boxWidth = (this._videoWidth * detectState.s * this.BOUNDING_BOX_CORRECT_FACTOR);
                    var leftBoundingBox = (this._videoWidth * detectState.x) + (this._videoWidth / 2) - (boxWidth / this.BOUNDING_BOX_CORRECT_FACTOR / 2);
                    var topBoundBox = (this._videoHeight * (-detectState.y)) - (boxWidth / 2 / this.BOUNDING_BOX_CORRECT_FACTOR);
                    if (topBoundBox < 0)
                        topBoundBox = 0;
                    if (leftBoundingBox < 0)
                        leftBoundingBox = 0;
                    this.CaptureLeftRightImages(detectState.ry, detectState.rx, leftBoundingBox, topBoundBox, boxWidth, boxWidth);


                    // There is a face; add points to the running average meter
                    this._faceWidthToHeightRatio.AddPoint(detectState.s);
                    this._ryAngle.AddPoint(detectState.ry);
                    this._rxAngle.AddPoint(detectState.rx);

                    // Capture movement index
                    var movement = Math.abs(Math.round(this._faceWidthToHeightRatio.GetIndexOfDispersion() * 1000000));
                    if (movement <= this.THRESHOLD_OF_FACE_TO_CONSIDER) {
                        if (!this._isFaceReal)
                            this.refs.FaceWidthOutput.text = "Please move your head around a bit";
                        return;
                    }
                    if (movement >= this.THRESHOLD_OF_FACE_MOVEMENT_FOR_ZOOMING) {
                        if (!this._isFaceReal)
                            this.refs.FaceWidthOutput.text = "Please move a little slower";
                        return;
                    }

                    // Check if the face is twisting? This leads to many false positives
                    if (Math.abs(detectState.rz) > this.MAX_TWIST_ANGLE_FOR_FACE)
                        return;

                    // Check for Realness
                    this.CheckForRealness();

                }
            });
        }
    },
    mounted() {
        var c = document.getElementById("jeeFaceFilterCanvas");
        var ctx = c.getContext("2d");  
        this.vueCanvas = ctx;

        this._faceWidthToHeightRatio = new RunningAverageDoubleClass(this.RUNNING_AVERAGES),
        this._ryAngle = new RunningAverageDoubleClass(this.RUNNING_AVERAGES),
        this._rxAngle = new RunningAverageDoubleClass(this.RUNNING_AVERAGES),
        this.faceFilter();
    }
}
</script>

<style>

</style>