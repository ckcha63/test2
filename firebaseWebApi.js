var led=document.getElementById("cmn-toggle-1");
var motion=document.getElementById("cmn-toggle-2");
var motionCount=document.getElementById('motionCount');
var longHTML=document.getElementById('longMotionHTML');
var shortHTML=document.getElementById('shortMotionHTML');
var intruderHTML=document.getElementById('intruderHTML');

function Server() {
  this.checkSetup();
  this.initFirebase();
  // this.loadMessages();
  this.ledDB();
this.motionDB();
}
    // this.switchLED();



  Server.prototype.initFirebase = function () {
    this.database = firebase.database();
    this.storage = firebase.storage();
  };


  // Server.prototype.loadMessages = function () {
  //   // Reference to the /messages/ database path.
  //   this.messagesRef = this.database.ref('motionSensorData');
  //   // Make sure we remove all previous listeners.
  //   this.messagesRef.off();
//
      // Loads the last 50 messages and listen for new ones.
  //   var setMessage = function (data) {
  //     var val = data.val();
  //     this.displayMessage(val.action, val.id, val.time, val.type);
  //   }.bind(this);
  //   this.messagesRef.limitToLast(50).on('child_added', setMessage);
  //   this.messagesRef.limitToLast(50).on('child_changed', setMessage);
  // };
Server.prototype.ledDB = function () {
    ledState = this.database.ref('ledState');
    // Make sure we remove all previous listeners.
    ledState.off();
}
Server.prototype.motionDB = function () {
    motionState = this.database.ref('motionState');
    // Make sure we remove all previous listeners.
    motionState.off();
}
//   Server.prototype.switchLED = function () {
//     // Reference to the /messages/ database path.
//     this.ledState = this.database.ref('ledState');
//     // Make sure we remove all previous listeners.
//     this.ledState.off();

//     var setMessage = function (data) {
//       var val = data.val();
//     //   this.displayMessage(val.action, val.id, val.time, val.type);
//     // }.bind(this);
//         if (val.type=='ledToggle'){
//             motionCount.innerText = val.type;
//             console.log('test')
//     }
// console.log('wowo')  
// }
    // ledState.limitToLast(50).on('child_added', setMessage);
    // ledState.limitToLast(50).on('child_changed', setMessage);
//   ;}
    
     function ledSwitch(){
       if (led.checked===true) {
         console.log('onled')
        firebase.database().ref("/State").update({'/led/state':1, '/led/type':'led'});
       }
      else {
        console.log('off')
        firebase.database().ref("/State").update({'/led/state':0, '/led/type':'led'});
      }

     }

function motionSwitch(){
       if (motion.checked===true) {
         console.log('on')
        firebase.database().ref("/State").update({'/motion/state':1, '/motion/type':'motion'});
       }
      else {
        console.log('off')
        firebase.database().ref("/State").update({'/motion/state':0, '/motion/type':'motion'});
      }

     }

function reset(){
  console.log('reset')
  firebase.database().ref("/motionData").update({'/longMotion':0, '/shortMotion':0,'/intruder':0,'/motion':0});
}


  // // Saves a new message on the Firebase DB.
  // Server.prototype.saveMessage = function () {
  //   // Add a new message entry to the Firebase Database.
  //   this.messagesRef.push({
  //     action: 'off',
  //     id: 2,
  //     time: 123456, // you can use Date.now()
  //     type: 'motion'
  //   }).then(function () {
  //     console.log('Done')
  //   }.bind(this)).catch(function (error) {
  //     console.error('Error writing new message to Firebase Database', error);
  //   });
  // };

  // Server.prototype.displayMessage = function (action, id, time, type) {
  //  document.getElementById('msg').innerHTML = action + '  ' + time + '  ' + type;
  // };


  // Checks that the Firebase SDK has been correctly setup and configured.
  Server.prototype.checkSetup = function () {
    if (!window.firebase || !(firebase.app instanceof Function) || !window.config) {
      window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions.');
    } else if (config.storageBucket === '') {
      window.alert('Your Firebase Storage bucket has not been enabled.');
    }
  };


window.onload = function () {
  window.Server = new Server();
};

var motionDataRef = firebase.database().ref('/motionData');
motionDataRef.on('value', function(snapshot) {
  updateHTML(snapshot.val());
});

function updateHTML(data){
  console.log('update running')
  motionCount.innerHTML=data.motion;
  longHTML.innerHTML=data.longMotion;
  shortHTML.innerHTML=data.shortMotion;
  intruderHTML.innerHTML=data.intruder;
}



