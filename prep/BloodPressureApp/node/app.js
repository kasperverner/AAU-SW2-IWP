//DISCLAIMER: This program has been developed for educational purposes at an introductory level. Certain simplifications has been made
//to keep it comphrehensible.

//We use EC6 modules!
export {ValidationError, NoResourceError, processReq};
import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";

/* ***************************************************
 * Application code for the BloodPressure recorder application
 ***************************************************** */

//constants for validating input from the client
const maxSystolic=200;
const minSystolic=30;
const maxDiastolic=200;
const minDiastolic=30;
const maxHeartRate=240;
const minHeartRate=30;
const CPRLength=10;
const maxEmailLength=50;
//Error messages for client

const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
//remove potentially dangerous/undesired characters
function sanitize(str){
  str=str
.replace(/&/g, "")
.replace(/</g, "")
.replace(/>/g, "")
.replace(/"/g, "")
.replace(/'/g, "")
.replace(/`/g, "")
.replace(/\//g, "");
return str.trim();
}

//Simple validation of CPR numbers is OK for this app.
function validateCPR(cprString){
  if(cprString.length!=CPRLength) return false;

  for(let i=0; i<cprString.length;i++)
       if(cprString[i]<'0' || cprString[i] >'9') return false;
  return true;
  //or, when you have learned regexp, write it similarly to validateEmail :-)
}

//returns true if email matches most email xxx@yyy.yy.zzz patterns (regular expression)
function validateEmail(email){
  const emailPattern =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return ((email.length<maxEmailLength) && (emailPattern.test(email)));
}
//returns the patient record of CPRNumber (empty array if not registered) in database
function lookupByCPR(CPRNumber){
  let found= patientDB.filter(p=>p.CPRNumber===CPRNumber);
  return found;
}

function validateNumberMin(number, min)
{
  return number >= min;
}

function validateNumberMax(number, max)
{
  return number <= max;
}

function validateNumberBetween(number, min, max)
{
  return validateNumberMin(number, min)
    && validateNumberMax(number, max);
}

//validates the constraints of the user input of PatientData object
//patientData must contain valid e-mail and CPR number.
//patientData is here a JavaScript object originating from JSON.
function validatePatientRegistrationForm(patientData){
  console.log("Validating"); console.log(patientData);

  if( (patientData.CPRNumber!==undefined) &&
      (patientData.patientEmail!==undefined)){
    let CPRNumber=String(patientData.CPRNumber);
    let patientEmail=String(patientData.patientEmail);

    if( (validateCPR(CPRNumber)) && (validateEmail(patientEmail))) {
        //return a fresh object with ONLY the validated fields
        let validPatientData={CPRNumber: CPRNumber, patientEmail: patientEmail};
        console.log("Validated: "); console.log(validPatientData);
        return validPatientData;
    }
  }
  throw(new Error(ValidationError));
}

//Create or update patient by CPRNumber
function registerPatient(patientData){
  let patientNo=patientDB.findIndex(p=>p.CPRNumber===patientData.CPRNumber);
  if(patientNo===-1)                  //doesn't exist
    patientDB.push(patientData);      //create patient
  else
    patientDB[patientNo]=patientData; //update patient
  console.log(patientDB);
  return {};                          //empty response object
}

function validateRecordMeasurementForm(measurementData)
{
  if(
    measurementData.CPRNumber !== undefined
    && measurementData.systolic !== undefined
    && measurementData.diastolic !== undefined
    && measurementData.heartRate !== undefined
  ) {
    let CPRNumber = String(measurementData.CPRNumber);
    let systolic = Number(measurementData.systolic);
    let diastolic = Number(measurementData.diastolic);
    let heartRate = Number(measurementData.heartRate);

    if (validateCPR(CPRNumber)) {
      let patientNo = patientDB.findIndex(p => p.CPRNumber === CPRNumber);

      if (
        patientNo !== -1
        && validateNumberBetween(systolic, 30, 200)
        && validateNumberBetween(diastolic, 30, 200)
        && validateNumberBetween(heartRate, 30, 240)
      )
      {
        let validMeasurementData={
          CPRNumber,
          systolic,
          diastolic,
          heartRate
        };

        return validMeasurementData;
      }
    }
  }

  throw(new Error(ValidationError));
}

function recordMeasurement(measurementData)
{
  measurementData.measurementTimestamp = new Date();

  BPDB.push(measurementData);

  let todaysMeasurements = findMeasurementsByDate(
    measurementData.measurementTimestamp,
    measurementData.CPRNumber);

  return todaysMeasurements;
}

//helper functions for comparing dates and times, given Date object
function isSameDate(date1, date2){
  return (date1.getYear() ===date2.getYear() &&date1.getDay()===date2.getDay() && date1.getMonth()===date2.getMonth());
}

//finds all measurements that CPRNumber has completed on 'date'
//filter preserves order of the underlying array, thereby insertion order.
function findMeasurementsByDate(date,CPRNumber) {
  return BPDB.filter(m=>isSameDate(m.measurementTimestamp,date) && m.CPRNumber===CPRNumber);
}

function round2Decimals(floatNumber){
  return Math.round(floatNumber*100)/100;
}

/* "Patient Database" emulated by maintained an in-memory array of patient objects
   Higher index means newer data record: you can insert by simply
  'push'ing new data records.
*/
let samplePatientData={CPRNumber:"1234990000", patientEmail: "Mickey@Disney.com"};
let patientDB=[samplePatientData];


let testDate1=new Date("2024-05-28T08:01:00.689Z");
let testNowDate= new Date("2024-05-28T08:10:00.689Z");
let sampleMeasurement1={CPRNumber:"1234990000", systolic: 115, diastolic:77, heartrate:60, measurementTimestamp: testDate1 }

let BPDB=[sampleMeasurement1];


/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received
   ******************************************************************** */

function processReq(req,res){
  console.log("GOT: " + req.method + " " +req.url);

  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname);      //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){
    case "PUT":
    break;

    case "POST": {
      let pathElements=queryPath.split("/");
      console.log(pathElements[1]);
      switch(pathElements[1]){
        case "measurements":
          extractJSON(req)
            .then(measurementData => validateRecordMeasurementForm(measurementData))
            .then(validMeasurementData => jsonResponse(res, recordMeasurement(validMeasurementData)))
            .catch(err=>reportError(res, err));
          break;

        case "patients":
          extractJSON(req)
          .then(patientData => validatePatientRegistrationForm(patientData))
          .then(validPatientData => jsonResponse(res,registerPatient(validPatientData)))
          .catch(err=>reportError(res,err));
          break;

        default:
          console.error("Resource doesn't exist");
          reportError(res, new Error(NoResourceError));
        }
      }
      break; //END POST URL
    case "GET":{
      let pathElements=queryPath.split("/");
      console.log(pathElements);
      //USE "sp" from above to get query search parameters
      switch(pathElements[1]){
        case "": // "/"
          fileResponse(res,"/html/bp-reg.html");
          break;
        case "test": {
          jsonResponse(res,{message:"Hello to You"});
        }
        break;
        default: //for anything else we assume it is a file to be served
          fileResponse(res, req.url);
        break;
      }//path
    }//switch GET URL
    break;
    default:
     reportError(res, new Error(NoResourceError));
  } //end switch METHOD
}

startServer();