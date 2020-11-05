export default function mintVisionWrapper(token) {
    this._token = token;
    this._baseURL = 'https://mintiivisionservice.azurewebsites.net';
    this.SubmitImage = function (base64ImageString) {
        // Post the image
        return postData(this._baseURL + '/v1.52/api/persons/recognise', { "base64String": base64ImageString }, this._token);
    }
    this.FindPersonFromID = function (idNumber) {
        // Post the search
        return postData(this._baseURL + '/v1.52/api/persons/filter', { "saIdNumberOrUniqueNumber": idNumber }, this._token);
    }
    this.SendForLiveness = function (base64ImageString) {
        // Post the image
        return postData(this._baseURL + '/v1.52/api/faces/liveness', { "base64String": base64ImageString }, this._token);
    }
    this.AddPerson = function (name, idNumber) {
        // Post the image
        return postData(this._baseURL + '/v1.52/api/persons', {
            "saIdNumberOrUniqueNumber": idNumber,
            "acceptedTermsAndConditionsText": "Accept",
            "name": name
        }, this._token);
    }
    this.AddPersonFace = function (personID, base64ImageString) {
        // Post the image
        return postData(this._baseURL + '/v1.52/api/persons/' + personID + '/faces', { "base64String": base64ImageString }, this._token);
    }
    this.SubmitIDDoc = function (base64ImageString) {
        // Post the image
        return postData(this._baseURL + '/v1.52/api/documents/info?dhaCheck=true', { "base64String": base64ImageString, dhaCheck:true }, this._token);
    }
}

// Example POST method implementation:
async function postData(url, data, token) {
    
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer ' + token
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}