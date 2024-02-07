// 1) Declare an object "msgBoard" that represents a message board that a set of clients can use to exchange messages.
// It should have a property for the  name of the message board, initialized to "IWP Chat", and another property (array) for storing the history of messages.
// Add a function (method) to the object called "putMessage" that takes a string message as argument at stores it in the message array.
// Add a function (method) that prints the received messages to the console. I.e, the messageBoard could be used like:
// msgBoard.putMessage("Hej, dette er en test");
// msgBoard.putMessage("Hej IWP");
// msgBoard.printMessages();
//
// It should result in the following output
// Messages History in board IWP Chat:
// Hej, dette er en test
// Hej IWP

console.log("Part 1");

const msgBoard = {
    name: "IWP Chat",
    messages: [],
    putMessage: function(message) {
        this.messages.push(message);
    },
    printMessages: function() {
        console.log(`Messages History in board ${this.name}:`);
        this.messages.forEach(m => console.log(m));
    },
};

msgBoard.putMessage("Hej, dette er en test");
msgBoard.putMessage("Hej IWP");
msgBoard.printMessages();

// 2) Add a function "register(f)" to the object that clients use to be notified when new messages arrives (a so-called call-back function):
// The register function takes a function f as argument, and stores the passed function in a different array "callBacks".
// f itself takes two parameters: the name of the message board, and the message. Then prints them to the console, possibly in an client specific manner (eg language).
//
// Based on the putMessage method, add a similar one "sendAndNotify" that in addition to storing the message (eg using putMessage) also calls all registered call-back
// functions whenever a message arrives (supplying the registered function with the new message, and boardname.
//
// function briansHandler(boardName,message){
//      console.log(`Brian! A message from ${boardName}: ${message}`);
// }
//
// msgBoard.register(briansHandler);
// msgBoard.register((board,message)=>console.log(`Board ${board} says to Michele: ${message}`));
// msgBoard.sendAndNotifyMessage("URGENT: Opgaveregning nu!")
//
// It should result in the following output
// Brian! A message from IWP Chat: URGENT: Opgaveregning nu!
// Board IWP Chat says to Michele: URGENT: Opgaveregning nu!

console.log("Part 2");

const msgBoard2 = {
    name: "IWP Chat",
    messages: [],
    callBacks: [],
    putMessage: function(message) {
        this.messages.push(message);
    },
    printMessages: function() {
        console.log(`Messages History in board ${this.name}:`);
        this.messages.forEach(m => console.log(m));
    },
    register: function(f) {
        this.callBacks.push(f);
    },
    sendAndNotifyMessage: function(message) {
        this.putMessage(message);
        this.callBacks.forEach(f => f(this.name, message));
    }
};

function briansHandler(boardName, message){
    console.log(`Brian! A message from ${boardName}: ${message}`);
}

msgBoard2.register(briansHandler);
msgBoard2.register((board,message)=> console.log(`Board ${board} says to Michele: ${message}`));
msgBoard2.sendAndNotifyMessage("URGENT: Opgaveregning nu!")

// 3) Make a constructor function  MessageBoard(name) that makes message boards.
// Create a few message boards.
// let board2= new MessageBoard("Opgave Regning");
// board2.putMessage("Hej, dette er en test");

console.log("Part 3");

function MessageBoard(name) {
    this.name = name;
    this.messages = [];
    this.callBacks = [];
    this.putMessage = function(message) {
        this.messages.push(message);
    };
    this.printMessages = function() {
        console.log(`Messages History in board ${this.name}:`);
        this.messages.forEach(m => console.log(m));
    };
    this.register = function(f) {
        this.callBacks.push(f);
    };
    this.sendAndNotifyMessage = function(message) {
        this.putMessage(message);
        this.callBacks.forEach(f => f(this.name, message));
    };
}

let board2 = new MessageBoard("Opgave Regning");
board2.putMessage("Hej, dette er en test");
board2.printMessages();
