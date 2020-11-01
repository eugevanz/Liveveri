export default function thirdPartySource(key) {
    this._key = key;
    this._baseURL = 'https://apis.lightstone.co.za';
    this.GetEzContact = function (idNumber) {
        // get the details
        return getData3PL(this._baseURL + '/lsp-ezcontact/v1/EzContact/Get?idNumber=' + idNumber, this._key);
    }   

    this.GetAddressDetails = function (idNumber) {
        // Post the image
        return postData3PL(this._baseURL + '/lspsearch/v1/property', { "ownerIdentifier": idNumber }, this._key);
    }
}

// Example Get method implementation:
async function getData3PL(url, key) {

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json, text/plain, */*',
            'Ocp-Apim-Subscription-Key': key
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

    });
    return response.json(); // parses JSON response into native JavaScript objects
}
// Example POST method implementation:
async function postData3PL(url, data, key) {
    
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json-patch+json',
            'Accept': 'application/json, text/plain, */*',
            'Ocp-Apim-Subscription-Key': key
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}