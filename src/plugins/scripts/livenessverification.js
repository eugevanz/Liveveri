"use strict";

// To be gotten fro Querystring
var _tempToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL21pbnRpaXZpc2lvbnNlcnZpY2UuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2lkZW50aWZ5L2NsYWltcy90ZW5hbnQiOiJWaXNpb25WZXJpZnkuYWkiLCJodHRwczovL21pbnRpaXZpc2lvbnNlcnZpY2UuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL2lkZW50aWZ5L2NsYWltcy90ZW5hbnRfdG9rZW4iOiJ7XHJcbiAgXCJkZXZpY2VOYW1lXCI6IFwicG93ZXJhcHBzXCIsXHJcbiAgXCJ0ZW5hbnROYW1lXCI6IFwiVmlzaW9uVmVyaWZ5LmFpXCIsXHJcbiAgXCJ1c2VyXCI6IG51bGwsXHJcbiAgXCJzdWJUZW5hbnRcIjogbnVsbCxcclxuICBcImFwaVZlcnNpb25cIjogbnVsbFxyXG59IiwibmJmIjoxNjAxOTEwNzM4LCJleHAiOjE2MDE5OTcxMzgsImlhdCI6MTYwMTkxMDczOCwiaXNzIjoiaHR0cHM6Ly9taW50aWl2aXNpb25zZXJ2aWNlLmF6dXJld2Vic2l0ZXMubmV0LyJ9.H8HEp-3otGupjaxHP1YuatEDtQPcJgyl4TQE8CQfFsA";
var _tempLsToken = "3af44b1ab46f4c69a281bb75b454da32";

// For words and chars to ignore for third party
var _ignoreWords = [
    "street",
    "str",
    "avenue",
    "ave",
    ".",
    ","
];

// const PAGE_MARGIN_IN_PIXELS = 140;
const RUNNING_AVERAGES = 10;
const THRESHOLD_OF_FACE_MOVEMENT_FOR_ZOOMING = 300;
const THRESHOLD_OF_FACE_TO_CONSIDER = 20;
const MAX_ANGLE_FACE_LEFTRIGHT = 200;
const MAX_ANGLE_FACE_TOPBOTTOM = 200;
const DETECT_THRESHOLD = 0.8;
const NUM_DETECTS_FOR_REAL_FACE = 10;
const MAX_TWIST_ANGLE_FOR_FACE = 0.1;
// Minimum angle before a face is considered left-right
const MIN_LEFT_RIGHT_FOR_CAPTURE = 0.10;
const MAX_LEFT_RIGHT_FOR_CAPTURE = 0.35;
// Minimum angle before a face is considered up-down
const MIN_UP_FOR_CAPTURE = 0.20;
const MAX_UP_FOR_CAPTURE = 0.55;
const MIN_DOWN_FOR_CAPTURE = 0.03;
const MAX_DOWN_FOR_CAPTURE = 0.25;

// Third party field confirmation
const MAX_THIRD_PARTY_LENGTH = 30;
const MIN_THIRD_PARTY_LENGTH_FOR_4_CHARS = 11;

// Above this, the spoof is too high and processing stops
const MAX_SPOOF_FOR_ALERT = 0.6;

// For the timeout
const TIME_FOR_FACE_TO_STAY_REAL = 5000;

// Minimum face captures for a person to enroll
const NUM_FACES_FOR_REGISTRATION = 4; // Five is max, three would result in faster reg

// Bounding Box is too small
const BOUNDING_BOX_CORRECT_FACTOR = 2.4;

// For completeness message
var _regResults = {
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
}

// Vision Wrapper
var _visionWrapper = null;
var _thirdPartyService = null;

import RunningAverageDoubleClass from "./runningAverage";
// Tracking Points
var _faceWidthToHeightRatio = new RunningAverageDoubleClass(RUNNING_AVERAGES);
var _ryAngle = new RunningAverageDoubleClass(RUNNING_AVERAGES);
var _rxAngle = new RunningAverageDoubleClass(RUNNING_AVERAGES);

// For tracking faces
var _isFaceReal = false;
var _numRealDetects = 0;

// For video res
var _videoWidth = 0;
var _videoHeight = 0;

// For timeout
var _faceTimeOut = null;

// For most-left and most-right
var _mostLeftAngle = 0;
var _mostLeftFace = null;
var _mostRightAngle = 0;
var _mostRightFace = null;
// For most-up and most-down
var _mostUpAngle = 0;
var _mostUpFace = null;
var _mostDownAngle = 0;
var _mostDownFace = null;
// Most straight
var _mostStraightAngle = 100000;
var _mostStraightFace = null;
var _previousMostStraightFace = null;


// For when we are onboarding someone
var _areSubmitting = false;
var _livenessCheckCount = 0;
var _isSpoofOverThreshold = false;
var _realnessAverage = 0;
var _spoofAverage = 0;

// Found Person Data; should really live in an object
var _mintPersonID = null;
// var _mintPersonName = null;

// Number of faces added to person
var _facesToBeSubmitted = new Array();

//var _confirmThirdParty = false;
var _thirdPartyFieldValue = null;
// var _thirdPartyFieldName = null;
// var _numThirdChars = 0;

import { JEEFACEFILTERAPI } from "./jeelizFaceFilter";
// entry point:
(function () {

    // Bind Resize Event
    window.onresize = function () {
        ResizeCanvas();
    }

    // Force resize
    ResizeCanvas();

    _regResults.nameFromQS = getUrlParameter("name");

    if ((_regResults.nameFromQS === undefined) || (_regResults.nameFromQS === null) || (_regResults.nameFromQS === "") )
        HandleError("Unfortunately this page was loaded with no name to be checked.");
    else {
        document.getElementById('nameFromQSParam').innerText = ", " + FirstNameFromName(_regResults.nameFromQS);
    }
    // Should we use the ID Capture?
    var capIdPic = getUrlParameter("useIDDoc");
    if ((capIdPic !== undefined) && (capIdPic !== null) && (capIdPic === "true"))
        _regResults.idPictureCaptureRequested = true;
    // Should we confirm third party
    var conf3rdParty = getUrlParameter("conf3rdParty");
    if ((conf3rdParty !== undefined) && (conf3rdParty !== null) && (conf3rdParty === "true"))
        _regResults.thirdPartyCheck.requestedInQS = true;
});

// Resize the window
function ResizeCanvas() {
    document.getElementById('jeeFaceFilterCanvas').style.width = document.getElementById('centerColumn').offsetWidth;
    console.log(document.getElementById('midRow').style.height);
    document.getElementById('idCapturePreview').style.height = document.getElementById('midRow').style.height/2.5;
}

// Start it all up
function init_faceFilter(){
  JEEFACEFILTERAPI.init({
    antialias: false,
    canvasId: 'jeeFaceFilterCanvas',
    NNCpath: 'models/NNC4Expr0.json', // root of NNC.json file
    maxFacesDetected: 1,
      callbackReady: function (errCode, spec) {
          if (errCode) {
              console.log('AN ERROR HAPPENS. ERR =', errCode);
              return;
          }
          _videoWidth = spec.videoElement.videoWidth;
          _videoHeight = spec.videoElement.videoHeight;

          console.log('INFO: JEEFACEFILTERAPI IS READY');
      },

    // called at each render iteration (drawing loop):
      callbackTrack: function (detectState) {
          // Are we done?
          if (_areSubmitting)
              return;

          // Show the video
          JEEFACEFILTERAPI.render_video();

          // Is there no face?
          if (detectState.detected <= DETECT_THRESHOLD) {
            document.getElementById('FaceWidthOutput').innerText = "I don't see a face. Please center yourself in the viewfinder.";
              ResetFacesDetected();
              return;
          }


          // Capture the images first
          var boxWidth = (_videoWidth * detectState.s * BOUNDING_BOX_CORRECT_FACTOR);
          var leftBoundingBox = (_videoWidth * detectState.x) + (_videoWidth / 2) - (boxWidth / BOUNDING_BOX_CORRECT_FACTOR / 2);
          var topBoundBox = (_videoHeight * (-detectState.y)) - (boxWidth / 2 / BOUNDING_BOX_CORRECT_FACTOR);
          if (topBoundBox < 0)
              topBoundBox = 0;
          if (leftBoundingBox < 0)
              leftBoundingBox = 0;
          CaptureLeftRightImages(detectState.ry, detectState.rx, leftBoundingBox, topBoundBox, boxWidth, boxWidth);


          // There is a face; add points to the running average meter
          _faceWidthToHeightRatio.AddPoint(detectState.s);
          _ryAngle.AddPoint(detectState.ry);
          _rxAngle.AddPoint(detectState.rx);

          // Capture movement index
          var movement = Math.abs(Math.round(_faceWidthToHeightRatio.GetIndexOfDispersion() * 1000000));
          if (movement <= THRESHOLD_OF_FACE_TO_CONSIDER) {
              if (!_isFaceReal)
                document.getElementById('FaceWidthOutput').innerText = "Please move your head around a bit";
              return;
          }
          if (movement >= THRESHOLD_OF_FACE_MOVEMENT_FOR_ZOOMING) {

              if (!_isFaceReal)
                document.getElementById("FaceWidthOutput").innerText = "Please move a little slower";
              return;
          }

          // Check if the face is twisting? This leads to many false positives
          if (Math.abs(detectState.rz) > MAX_TWIST_ANGLE_FOR_FACE)
              return;

          // Check for Realness
          CheckForRealness();

      }
  });
}

// Resets the faces
function ResetFacesDetected() {
    _isFaceReal = false;
    _numRealDetects = 0;
}

// Capture most-left and most-right faces
function CaptureLeftRightImages(leftRightAngle, upDownAngle, left, top, width, height) {
    var canvasElement = document.getElementById('jeeFaceFilterCanvas');

    var madeAChange = false;
    // Left-Right - Check if over threshold
    if ((Math.abs(leftRightAngle) > MIN_LEFT_RIGHT_FOR_CAPTURE) && (Math.abs(leftRightAngle) < MAX_LEFT_RIGHT_FOR_CAPTURE)) {
        // Left or right image?
        if (leftRightAngle < 0) {
            if (leftRightAngle < _mostLeftAngle) {
                _mostLeftAngle = leftRightAngle;
                _mostLeftFace = CropPlusExport(left, top, width, height);
                document.getElementById('leftFace').setAttribute("src", _mostLeftFace);
                canvasElement.classList.add("border-left");
                madeAChange = true;
            }
        }
        else {
            if (leftRightAngle > _mostRightAngle) {
                _mostRightAngle = leftRightAngle;
                _mostRightFace = CropPlusExport(left, top, width, height);
                document.getElementById('rightFace').setAttribute("src", _mostRightFace);
                canvasElement.classList.add("border-right");
                madeAChange = true;
            }
        }
    }

    // Left or right image?
    if (upDownAngle < 0) {
        if ((Math.abs(upDownAngle) > MIN_UP_FOR_CAPTURE) && (Math.abs(upDownAngle) < MAX_UP_FOR_CAPTURE)) {
            if (upDownAngle < _mostUpAngle) {
                _mostUpAngle = upDownAngle;
                _mostUpFace = CropPlusExport(left, top, width, height);
                document.getElementById('upFace').setAttribute("src", _mostUpFace);
                canvasElement.classList.add("border-top");
                madeAChange = true;
            }
        }
    }
    else {
        if ((Math.abs(upDownAngle) > MIN_DOWN_FOR_CAPTURE) && (Math.abs(upDownAngle) < MAX_DOWN_FOR_CAPTURE)) {
            if (upDownAngle > _mostDownAngle) {
                _mostDownAngle = upDownAngle;
                _mostDownFace = CropPlusExport(left, top, width, height);
                document.getElementById('downFace').setAttribute("src", _mostDownFace);
                canvasElement.classList.add("border-bottom");
                madeAChange = true;
            }
        }
    }

    // Most forward-facing image
    var straitAngleRef = Math.abs(leftRightAngle) * Math.abs(upDownAngle);
    if (straitAngleRef <= _mostStraightAngle) 
    {
        _mostStraightAngle = straitAngleRef;
        if (_mostStraightFace !== null)
            _previousMostStraightFace = _mostStraightFace;
        _mostStraightFace = CropPlusExport(left, top, width, height);
        document.getElementById("straightFace").setAttribute("src", _mostStraightFace);
        madeAChange = true;
    }

    // Check for Submit?
    if (madeAChange)
        CheckForEnoughFacesAndRealnessAndSubmit();
}

//// Crop and update the image
function CropPlusExport() {
    // Dummy fo now
    var faceCanvas = document.getElementById('jeeFaceFilterCanvas');
    return faceCanvas.toDataURL();

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
    //document.getElementById("debugIm").setAttribute("src", im);
    //// return the .toDataURL of the temp canvas
    //return (im);
}

// Update the Realness Indicator
function CheckForRealness() {
    var angleChangeLeftRight = Math.abs(Math.round(_ryAngle.GetIndexOfDispersion() * 10000));
    console.log(angleChangeLeftRight);
    if (angleChangeLeftRight > MAX_ANGLE_FACE_LEFTRIGHT)
        _numRealDetects++;
    var angleChangeTopBottom = Math.abs(Math.round(_rxAngle.GetIndexOfDispersion() * 10000));

    if (angleChangeTopBottom > MAX_ANGLE_FACE_TOPBOTTOM)
        _numRealDetects++;

    if (_numRealDetects > NUM_DETECTS_FOR_REAL_FACE) {
        //document.getElementById("FaceWidthOutput").innerText = ("Face Is Real");
        _isFaceReal = true;
    }

    // Set the timeout
    if (_faceTimeOut !== null)
        clearTimeout(_faceTimeOut);

    _faceTimeOut = setTimeout(function () {
        if (_areSubmitting)
            return;
        ResetFacesDetected();
        document.getElementById('FaceWidthOutput').innerText = "I don't see a face; please center yourself in the viewfinder";
    }, TIME_FOR_FACE_TO_STAY_REAL);
}

// Do we have enough faces and realness to proceed?
function CheckForEnoughFacesAndRealnessAndSubmit() {
    if (_areSubmitting)
        return;
    var numFaces = 0;
    if (_mostLeftFace !== null)
        numFaces++;
    if (_mostRightFace !== null)
        numFaces++;
    if (_mostUpFace !== null)
        numFaces++;
    if (_mostDownFace !== null)
        numFaces++;
    if (_mostStraightFace !== null)
        numFaces++;

    if ((numFaces >= NUM_FACES_FOR_REGISTRATION) && (_isFaceReal)) {
        SubmitPerson();
    }
}

import { JeelizResizer } from "./JeelizResizer";
// Consent Given
function ConsentYes() {
    document.getElementById("permissionForm").style.display = 'none';

    if (_regResults.idPictureCaptureRequested) {
        document.getElementById('idCaptureRow').style.display = 'block';
        StartIDCaptureVideo();
    }
    else {
        // Show the fill-in-id part and start the face tracking
        document.getElementById('formRow').style.display = 'block';

        // Here, check if the picture of ID is required, or enter ID is required
        JeelizResizer.size_canvas({
            canvasId: 'jeeFaceFilterCanvas',
            callback: function (isError, bestVideoSettings) {
                init_faceFilter(bestVideoSettings);
            }
        })
    }
}

// No Consent Given
function ConsentNo() {
    document.getElementById("consentNo").style.display = 'block';
    document.getElementById("permissionForm").style.display = 'none';
}

// Start the video capture for the ID Document
function StartIDCaptureVideo() {
    var player = document.getElementById('idCapturePreview');

    var constraints = {
        audio: false,
        video: {
            width: { ideal: 3840 },
            height: { ideal: 2160 },
            facingMode: "environment"
        }
    };

    // Attach the video stream to the video element and autoplay.
    navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
            player.srcObject = stream;
        });
    ResizeCanvas();
}

/// Stop the ID Capture Video Preview
function StopIdCaptureVideo() {
    // Stop all video streams.
    var player = document.getElementById('idCapturePreview');
    player.srcObject.getVideoTracks().forEach(track => track.stop());
}

import mintVisionWrapper from './mintvisionwrapper'
// Capture the ID Pic
function CaptureIDPicture(){
    var player = document.getElementById('idCapturePreview');
    var canvas = document.getElementById('idCaptureCanvas');
    var context = canvas.getContext('2d');

    context.drawImage(player, 0, 0, canvas.width, canvas.height);

    var im = canvas.toDataURL();

    // Show "Processing..."
    showSpinner();

    // Submit the ID Check
    if (_visionWrapper === null)
        _visionWrapper = new mintVisionWrapper(_tempToken);

    _visionWrapper.SubmitIDDoc(im).then(function (result) {
        // Show the fill-in-id part and start the face tracking
        document.getElementById('idCaptureRow').style.display = "none";
        StopIdCaptureVideo();

        hideSpinner();

        // Here, check if the picture of ID is required, or enter ID is required
        JeelizResizer.size_canvas({
            canvasId: 'jeeFaceFilterCanvas',
            callback: function (isError, bestVideoSettings) {
                init_faceFilter(bestVideoSettings);
            }
        })

        if (result.DocumentType !== "Negative") {
            // Todo: Capture NAme and ID And compare to passed-in name and id
            _regResults.idNumber = result.IDNumber;
            _regResults.homeAffairsName = result.FullName;
            PreLoad3rdPartyDetails();
        }
        if ((_regResults.idNumber === undefined) || (_regResults.idNumber === null)) {
            document.getElementById('formRow').style.display = 'block';
        }
        else {

            // CompareNameAndName(result.FullName, _personNameFromQS);
            document.getElementById('jeeFaceFilterCanvas').style.display = 'block';
            document.getElementById('instructionsRow').style.display = 'block';
        }
        console.log(JSON.stringify(result));
    }).catch(reason => HandleFetchError(reason));
}


// Capture the ID
function CaptureID() {

    event.preventDefault();
    event.stopPropagation();

    // Submit the ID Check
    if (_visionWrapper === null)
        _visionWrapper = new mintVisionWrapper(_tempToken);

    _regResults.idNumber = document.getElementById('idNumber').value;
    _visionWrapper.FindPersonFromID(_regResults.idNumber).then(function (result) { CheckForFoundPerson(result); }).catch(reason => HandleFetchError(reason));

    document.getElementById('formRow').style.display = 'none';
    document.getElementById('jeeFaceFilterCanvas').style.display = 'block';
    document.getElementById('instructionsRow').style.display = 'block';
    PreLoad3rdPartyDetails();

    // Todo: Capture an ID here?


    ResizeCanvas();
}

// Have we found persons or people
function CheckForFoundPerson(peopleResult) {
    // Check for a result
    if ((peopleResult !== null) && (peopleResult.people !== null) && (peopleResult.people.length !== 0)) {
        _mintPersonID = peopleResult.people[0].id;
        // _mintPersonName = peopleResult.people[0].name;
    }
}

// Submit Person
function SubmitPerson() {
    _areSubmitting = true;

    // Firstly, stop the camera and processing
    // Not sure how
    // Hide the camera and show the thanks

    // Do the Liveness Check
    if (_mostStraightFace !== null)
        SendForLiveness(_mostStraightFace);
    if (_mostLeftFace !== null)
        SendForLiveness(_mostLeftFace);
    if (_mostRightFace !== null)
        SendForLiveness(_mostRightFace);
}

// Send Image for Liveness
function SendForLiveness(base64Image) {
    if (_visionWrapper === null)
        _visionWrapper = new mintVisionWrapper(_tempToken);

    // We've sent liveness
    _livenessCheckCount++;

    // Send
    _visionWrapper.SendForLiveness(base64Image).then(function (result) {

        // Add together
        if (_realnessAverage === 0)
            _realnessAverage = result.real;
        else
            _realnessAverage = (_realnessAverage + result.real) / 2;
        if (_spoofAverage === 0)
            _spoofAverage = result.spoof;
        else
            _spoofAverage = (_spoofAverage + result.spoof) / 2;
        if (result.spoof >= MAX_SPOOF_FOR_ALERT)
            _isSpoofOverThreshold = true;

        _livenessCheckCount--;
        if (_livenessCheckCount === 0) {
            LivenessCheckComplete();
        }
    }).catch(reason => HandleFetchError(reason));
}

// Liveness Check is complete
function LivenessCheckComplete() {
    console.log("Average Spoof: " + _spoofAverage + "; Average Liveness: " + _realnessAverage + "; is Spoof OVer: " + _isSpoofOverThreshold);

    document.getElementById('jeeFaceFilterCanvas').style.display = 'none';
    document.getElementById('instructionsRow').style.display = 'none';

    // Are we doing third party?
    if (_regResults.thirdPartyCheck.requestedInQS)
        ConfirmThirdPartyValue();
    else
        Complete();
}

// SHow that things are complete
function Complete() {
    if (IsSpoof()) {
        document.getElementById('warningTick').style.display = 'block';
        document.getElementById('FaceWidthOutput').innerText = "Verified with warnings";
        document.getElementById('smallText').innerText = "You have been verified but some information doesn't match; you will be verified once someone has checked your profile";
    }
    else {
        document.getElementById('successTick').style.display = 'block';
        document.getElementById('FaceWidthOutput').innerText = "Thank-you";
        document.getElementById('smallText').innerText = "You have been verified";
    }

    // Do the submission
    AddPersonAndAddFaces();
}

// Function that checks for Spoof once spoofcheck is complete
function IsSpoof() {
    if (_isSpoofOverThreshold)
        return true;
    if (_spoofAverage > _realnessAverage)
        return true;
    return false;
}
// Submit Front for Verification
function AddPersonAndAddFaces() {

    if (_visionWrapper === null)
        _visionWrapper = new mintVisionWrapper(_tempToken);

    // Same person or new person?
    if (_mintPersonID === null) {
        _visionWrapper.AddPerson(_regResults.nameFromQS, _regResults.idNumber).then(function (result) {
            AddAllFacesToProfile(result.personId);
        }).catch(reason => HandleFetchError(reason));
    }
    else {
        AddAllFacesToProfile(_mintPersonID);
    }
}

// Adds all faces to a profile
function AddAllFacesToProfile(personID) {
    // Safety
    if (_mostStraightFace !== null)
        AddSingleFaceToPerson(personID, _mostStraightFace);
    if (_previousMostStraightFace !== null)
        AddSingleFaceToPerson(personID, _previousMostStraightFace);
    if (_mostLeftFace !== null)
        AddSingleFaceToPerson(personID,_mostLeftFace);
    if (_mostRightFace !== null)
        AddSingleFaceToPerson(personID, _mostRightFace);
    if (_mostUpFace !== null)
        AddSingleFaceToPerson(personID, _mostUpFace);
    if (_mostDownFace !== null)
        AddSingleFaceToPerson(personID, _mostDownFace);

    // Start Processing
    ProcessFace();
}

// Add a single face to a person
function AddSingleFaceToPerson(personID, base64Image) {
    // Add to the array
    _facesToBeSubmitted.push({ "personID": personID, "base64Image": base64Image, "submitted": false });

}

// Process a face from the queue
function ProcessFace() {

    if (_visionWrapper === null)
        _visionWrapper = new mintVisionWrapper(_tempToken);

    // Update process bar
    document.getElementById('progressBarRow').style.display = 'block';

    // Pick the first one
    for (var i = 0; i < _facesToBeSubmitted.length; i++) {
        if (_facesToBeSubmitted[i].submitted === false) {

            var percentageComplete = Math.round((i / _facesToBeSubmitted.length) * 100);

            document.getElementById('progressBar').setAttribute("aria-valuenow", percentageComplete)
            document.getElementById('progressBar').style.width = percentageComplete + "%"
            document.getElementById('progressBar').innerText = "Uploading " + percentageComplete + "%";
            _facesToBeSubmitted[i].submitted = true;
            _visionWrapper.AddPersonFace(_facesToBeSubmitted[i].personID, _facesToBeSubmitted[i].base64Image).then(function () {
                ProcessFace();
            }).catch(reason => HandleFetchError(reason));
            return;
        }
    }

    document.getElementById('progressBarRow').style.display = 'none';
}

// Get first name from name
function FirstNameFromName(fullname) {
    return fullname.split(' ')[0];
}

// Helper function
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

// Error function
function HandleFetchError(reason) {
    HandleError(reason.message);
}
function HandleError(message) {
    console.log("Error! " + message);
    document.getElementById('errorMessageText').innerText = message;
    document.getElementById('errorModal').modal();
}

// SPinner show and hide
function showSpinner() {
    document.getElementById('loadingOverlay').style.display = 'block';
}
function hideSpinner() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

import thirdPartySource from './thirdpartywrapper'
// ----------------------- Third Party Confirmation ----------------------------------------
function PreLoad3rdPartyDetails() {
    // Assumed that the idNumber is correct here
    if (_thirdPartyService === null)
        _thirdPartyService = new thirdPartySource(_tempLsToken);

    // Run check
    _thirdPartyService.GetEzContact(_regResults.idNumber)
        .then(function (result) {
            if ((result.error !== undefined) && (result.error !== null))
                TryFetchAddressDetails();
            else if (result.phone2 !== null)
                LoadThirdPartyField(result.phone2, "phone2", "Phone Number");
            else if (result.phone1 !== null)
                LoadThirdPartyField(result.phone1, "phone1", "Phone Number");
            else if (result.addressLine1 !== null)
                LoadThirdPartyField(result.addressLine1, "addressLine1", "Address");
            else
                TryFetchAddressDetails();
        })
        .catch(function (reason) {
            console.log(JSON.stringify(reason));
            HandleFetchError(reason);
        });
}

// Tries the address field
function TryFetchAddressDetails() {
    // Assumed that the idNumber is correct here
    if (_thirdPartyService === null)
        _thirdPartyService = new thirdPartySource(_tempLsToken);

    // Run check
    _thirdPartyService.GetAddressDetails(_regResults.idNumber)
        .then(function (result) {
            console.log(result.error);
            if ((result.error !== undefined) && (result.error !== null)) {
                console.log("Error in retrieving address details");
                NoThirdPartyToConfirm();

            }
            else {
                if ((result.results !== null) && (result.results.length !== 0) && (result.results[0].address !== null)) {
                    LoadThirdPartyField(result.results[0].address, "address", "Address");
                }
                else {
                    console.log("No results from third party addresses!");
                    NoThirdPartyToConfirm();
                }
            }
        })
        .catch(function () {
            NoThirdPartyToConfirm();
        });
}

// Load a third party field
function LoadThirdPartyField(fieldValue) {
    _thirdPartyFieldValue = fieldValue;
    // _thirdPartyFieldName = fieldName;
}

// To confirm third party
function ConfirmThirdPartyValue() {
    if (typeof _thirdPartyFieldValue === 'string') {
        // Is it too long?
        if (_thirdPartyFieldValue.length >= MAX_THIRD_PARTY_LENGTH) {
            _thirdPartyFieldValue = _thirdPartyFieldValue.substring(0, MAX_THIRD_PARTY_LENGTH) + "...";
        }
        // Get a copy
        var copyField = getEscapedStringCopy(_thirdPartyFieldValue);
        var char1Pos = getRandomPlaceInString(copyField);
        copyField = copyField.substring(0, char1Pos) + "*" + copyField.substring(char1Pos + 1, copyField.length);

        var char2Pos = getRandomPlaceInString(copyField);
        copyField = copyField.substring(0, char2Pos) + "*" + copyField.substring(char2Pos + 1, copyField.length);

        var char3Pos = getRandomPlaceInString(copyField);
        copyField = copyField.substring(0, char3Pos) + "*" + copyField.substring(char3Pos + 1, copyField.length);

        var char4Pos = -1;
        // Only make four chars if it is longer than a certain length
        if (_thirdPartyFieldValue.length > MIN_THIRD_PARTY_LENGTH_FOR_4_CHARS) {
            char4Pos = getRandomPlaceInString(copyField);
            copyField = copyField.substring(0, char4Pos) + "*" + copyField.substring(char4Pos + 1, copyField.length);
            // _numThirdChars = 4;
        }
        else
            // _numThirdChars = 3;

        var numInputsAdded = 1;
        // Add to the fields
        for (var i = 0; i < _thirdPartyFieldValue.length; i++) {
            if ((i === char1Pos) || (i === char2Pos) || (i === char3Pos) || (i === char4Pos)) {
                document.getElementById('thirdPartyTextElement').insertAdjacentHTML('afterend', '<input type="text" style="width:20px;" size="1" maxlength="1" id="thirdChar' + numInputsAdded + '" onkeyup="thirdCharEntered(this, ' + numInputsAdded++ + ')" />');
            }
            else
                document.getElementById('thirdPartyTextElement').insertAdjacentHTML('afterend', "<span>" + _thirdPartyFieldValue[i] + "</span>");
        }

        // Show the element
        document.getElementById('thirdPartyConfirm').style.display = 'block';
        // Focus on the first block
        document.getElementById('thirdChar1').focus();
    }
    else {
        console.log("Error on finding third party string");
        NoThirdPartyToConfirm();
    }
}

// Could not load third party confirmation
function NoThirdPartyToConfirm() {
    // Todo: what here?
    alert("No third party");
}

// Helper functions for third party strings
function getEscapedStringCopy(strVal) {
    strVal = strVal.toLowerCase();
    // Replace spaces
    strVal = strVal.split(' ').join('*');
    // Replace other values
    for (var i = 0; i < _ignoreWords.length; i++) {
        strVal = strVal.split(_ignoreWords[i]).join("*".repeat(_ignoreWords[i].length));
    }
   
    return strVal;
}

// Get a valid char pos in string
function getRandomPlaceInString(strVal) {
    var charPos = Math.round(Math.random() * (strVal.length-1));
    while (strVal[charPos] === '*')
        charPos = Math.round(Math.random() * (strVal.length-1));
    return charPos;
}

// When a char is entered
// function thirdCharEntered(inputEl,charNum) {
//     console.log(document.getElementById(inputEl).getAttribute("id"));
//     if (charNum === 1)
//         document.getElementById('thirdChar2').focus();
//     else if (charNum === 2)
//         document.getElementById("thirdChar3").focus();
//     else if (charNum === 3) {
        // if (_numThirdChars === 4)
//             document.getElementById("thirdChar4").focus();
//         else {
//             document.getElementById("doneThirdCharButton").classList.remove("disabled");
//             document.getElementById("thirdChar3").blur();
//         }
//     }
//     else if (charNum === 4) {
//         document.getElementById("doneThirdCharButton").classList.remove("disabled");
//         document.getElementById("thirdChar4").blur();
//     }
// }

/// Done with third party check
function doneThirdParty() {
    if (document.getElementById("doneThirdCharButton").classList.contains("disabled"))
        return;

    document.getElementById("thirdPartyConfirm").style.display = 'none';
    document.getElementById("instructionsRow").style.display = 'block';

    Complete();
}

export default {
    install: function (Vue) {
        Vue.ConsentYes = ConsentYes;
        Vue.ConsentNo = ConsentNo;
        Vue.CaptureIDPicture = CaptureIDPicture;
        Vue.CaptureID = CaptureID;
        Vue.doneThirdParty = doneThirdParty;
    }
}