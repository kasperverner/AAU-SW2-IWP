
//We use EC6 modules!
import {extractJSON, fileResponse, htmlResponse,extractForm,jsonResponse,errorResponse,reportError,startServer} from "./server.js";
const ValidationError="Validation Error";
const NoResourceError="No Such Resource";
export {ValidationError, NoResourceError, processReq};

startServer();


/* ***************************************************
 * Application code for the Coffee order application
 ***************************************************** */

//constants for validating input from the network client
const maxStrength=10;
const minStrength=1;
const minNameLength=1;
const maxNameLength=30;
const oatmilk="oatmilk";
const cowmilk="cowmilk";
const nomilk="nomilk";

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

function validateCoffeeStatusFormData(coffeeStatusData){
  console.log("Validating");
  console.log(coffeeStatusData);

  let requestedOrderID;

  try { //ensure that object has a orderID property
    requestedOrderID=parseInt(coffeeStatusData.orderID);
  }catch(e){console.log("Invalid "+e);throw(new Error(ValidationError));}

  //ensure correct ranges of values (order must exist in coffeeOrdersDB)
  if((requestedOrderID>=0 ) && (requestedOrderID<orderID)) {
      //return a fresh object only including validated properties
      let validStatusData={orderID:requestedOrderID};
      console.log("Validated: "); console.log(validStatusData);
      return validStatusData;
    }
    else throw(new Error(ValidationError));
}

//function that validates the constraints of the coffe order form data object
//order data must contain valid name,strength,milk choice attributes
function validateCoffeeFormData(coffeeData){}


/* "Database" emulated by maintained an in-memory array of coffeeOrder objects
   Higher index means newer data record: */

//global counter that should increase whenever a new order is created and inserted
//For simplicity it can be used as index: coffeeOrdersDB[orderID]
let orderID=0;
let coffeeOrdersDB=[];

let sampleCoffeeOrder={name:"Mickey", strength: 4, milk: nomilk, orderID: orderID, orderTime: new Date(), isReady:false};
coffeeOrdersDB[orderID]=sampleCoffeeOrder;
orderID++;

function statusLookup(requestedOrder){
  console.log("looking up "+requestedOrder.orderID);
  return coffeeOrdersDB[requestedOrder.orderID];
}

//Process the POST request that adds a new order to the DB
//It is to return order back to the client.
function processOrder(coffeeOrder){}

/* *********************************************************************
   Setup HTTP route handling: Called when a HTTP request is received
   ******************************************************************** */
function processReq(req,res){
  console.log("GOT: " + req.method + " " +req.url);

  let baseURL = 'http://' + req.headers.host + '/';    //https://github.com/nodejs/node/issues/12682
  let url=new URL(req.url,baseURL);
  let searchParms=new URLSearchParams(url.search);
  let queryPath=decodeURIComponent(url.pathname); //Convert uri encoded special letters (eg æøå that is escaped by "%number") to JS string

  switch(req.method){
    case "POST": {
      let pathElements=queryPath.split("/");
      console.log(pathElements[1]);
       switch(pathElements[1]){

        case "coffee-orders":
          extractJSON(req)
            .then(coffeeFormData => validateCoffeeFormData(coffeeFormData))
            .then(validCoffeeFormData => jsonResponse(res, processOrder(validCoffeeFormData)))
            .catch(err => reportError(err))
          break;

          case "test": // endpoint POST /test
          extractJSON(req)
          .then(data => {console.log("todo: validate data:"+JSON.stringify(data)); return {validated :"ok"}})
          .then(validData => jsonResponse(res,validData))
          .catch(err=>reportError(res,err));
          break;
        default:
          console.error("Resource doesn't exist");
          reportError(res, NoResourceError);
        }
      }
      break; //POST URL
    case "GET":{
      let pathElements=queryPath.split("/");
      console.log(pathElements);
      //USE "sp" from above to get query search parameters
      switch(pathElements[1]){
        case "": //
           fileResponse(res,"/html/coffee.html");
           break;
        case "date": {    // endpoint GET /date
          const date=new Date();
          console.log(date);
          jsonResponse(res,date);
        }
        break;
        case "coffee-orders":
          if(pathElements.length===3) {// endpoint GET /coffee-orders/{orderID}"
            let coffeeStatusFormData={}; //encapsulate orderID in an object (to make it future extensible)
            coffeeStatusFormData.orderID=pathElements[2];
            let validatedCoffeeStatusData=validateCoffeeStatusFormData(coffeeStatusFormData);
            jsonResponse(res,statusLookup(validatedCoffeeStatusData));
          }
        break;

       default: //for anything else we assume it is a file to be served
          fileResponse(res, req.url);
       break;
      }//path
    }//switch GET URL
    break;
    default:
     reportError(res, NoResourceError);
  } //end switch method
}

