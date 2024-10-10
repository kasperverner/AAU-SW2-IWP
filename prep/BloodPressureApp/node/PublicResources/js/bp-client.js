'use strict'
//SEE: https://javascript.info/strict-mode
//or, better use javascript "type=module"

//Just a demo function
function showDate(data){
    let p=document.getElementById("id1");
    let d=document.createElement("pre");
    d.textContent=String("Fetched date object: "+data);
    p.parentElement.append(d);
}


/* *******************************************************
* Helper functions to communicate with server
* ********************************************************* */

//Tries to parse a http body as json document.
//But first ensure taht the response code is OK (200) and
//the content type is actually a json document; else rejects the promise
function jsonParse(response){
  if(response.ok)
     if(response.headers.get("Content-Type") === "application/json")
       return response.json();
     else throw new Error("Wrong Content Type");
 else
    throw new Error("Non HTTP OK response");
}

//GET a json document at URL
function jsonFetch(url){
  return  fetch(url).then(jsonParse);
}

//POST a json document in data to URL
//Sets content type appropriately first.
function jsonPost(url = '', data={}){
  const options={
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
  return fetch(url,options).then(jsonParse);
}

//POST a json document in data to URL
//Sets content type appropriately first.
function jsonPut(url = '', data={}){
  const options={
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify(data) // body data type must match "Content-Type" header
    };
  return fetch(url,options).then(jsonParse);
}
/* *******************************************************
* BLOOD PRESSURE APPLICATION CODE
* ********************************************************* */

//some helper functions to show/hide/enable/diable elements of the HTML page
function hideElem(elem){
  elem.style.visibility="hidden";
}

function showElem(elem){
 elem.style.visibility="visible";
}
function disableElem(elem){
  elem.style.display="none";
}
//assumes the element should be a block type
function enableElem(elem){
 elem.style.display="block";
}

/* In this app we don't use the browsers form submission, but the API defined by the server,
   Hence we extract the values of the input fields of the form and store them in an object, that is
   sent to the server as part of a POST/PUT to insert a new record (alse sends updated record back)
*/
function extractPatientRegistrationData(){
  let patientData={};
  patientData.patientEmail=document.getElementById("email_id").value;
  patientData.CPRNumber= document.getElementById("CPRRegistration_id").value;
  console.log("Extracted"); console.log(patientData);
  return patientData;
}

function sendPatientRegistration(event) {
  event.preventDefault(); //we handle the interaction with the server rather than browsers form submission
  document.getElementById("registerBtn_id").disabled=true; //prevent double submission
  const patientData=extractPatientRegistrationData();

  jsonPost(document.getElementById("patientRegistrationForm_id").action,patientData)
  .then(registrationStatus=>{
    console.log(patientData.CPRNumber+" Registered or updated");
    alert("Thank you!");
    document.getElementById("registerBtn_id").disabled=false; //prevent double submission
  }).catch(e=>{
    console.log("Ooops "+e.message);
    alert("Encountered Error: " +e.message + "\nPlease retry!");
    document.getElementById("registerBtn_id").disabled=false;
     //Very primitive error handling
  });
}

function extractMeasurementData(){
  let measurementData = {};

  measurementData.CPRNumber = document.getElementById("CPRRecord_id").value;
  measurementData.systolic = document.getElementById("SystolicPressure_id").value;
  measurementData.diastolic = document.getElementById("DiastolicPressure_id").value;
  measurementData.heartRate = document.getElementById("HeartRate_id").value;

  return measurementData;
}

function sendMeasurementRecord(event) {
  event.preventDefault();
  document.getElementById("recordBtn_id").disabled = true;
  const measurementData = extractMeasurementData();

  jsonPost(document.getElementById("recordMeasurementForm_id").action, measurementData)
    .then(todaysMeasurements => {
      const reminder = document.getElementById("output_id");
      reminder.textContent = computeReminderText(todaysMeasurements)
      showElem(reminder)

      document.getElementById("recordBtn_id").disabled = false;
    })
    .catch(e=>{
      console.error(`Oops ${e.message}`);
      alert("Encountered Error: " +e.message + "\nPlease retry!");
      document.getElementById("recordBtn_id").disabled = false;
    });
}

function isMorning(dateString){
  //convert a json string with a date to a Date object, and get the hours part the timestamp
  const hour=new Date(dateString).getHours();
  return (hour >= 6 && hour <= 11);
}
function isEvening(dateString) {
  const hour=new Date(dateString).getHours();
  return (hour >= 18 && hour <= 23);
}
function  computeReminderText(todaysMeasurements){
  let reminderText="Warning: measurement made outside expected hours.";

  let morningCounts = todaysMeasurements.filter(measurement => isMorning(measurement.measurementTimestamp)).length;
  let eveningCounts = todaysMeasurements.filter(measurement => isEvening(measurement.measurementTimestamp)).length

  // If any records have been made outside the expected hours, return the warning.
  if (morningCounts + eveningCounts !== todaysMeasurements.length)
    return reminderText;

  if (eveningCounts > 0) {
    // By not adding a default, the warning will also be displayed if a user makes more than 3 records in the morning or evening.
    switch (eveningCunts)
    {
      case 1:
        reminderText = "Make 2 more measurements this evening!";
        break;
      case 2:
        reminderText = "Make 1 more measurements this evening!";
        break;
      case 3:
        reminderText = "All done this evening!";
        break;
    }
  } else {
    switch (morningCounts)
    {
      case 1:
        reminderText = "Make 2 more measurements this morning!";
        break;
      case 2:
        reminderText = "Make 1 more measurements this morning!";
        break;
      case 3:
        reminderText = "Remember to measure this evening!";
        break;
    }
  }

  return reminderText;
}

//registers all event handlers: ready to go!!
document.getElementById("patientRegistrationForm_id").addEventListener("submit", sendPatientRegistration);
document.getElementById("recordMeasurementForm_id").addEventListener("submit", sendMeasurementRecord);

console.log("JS er klar!");