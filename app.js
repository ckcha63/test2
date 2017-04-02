var admin = require("firebase-admin");
var b = require('bonescript');

//Initialize all var needed for beaglebone
var led = "P8_8";
b.pinMode(led, 'out');
var motion = "P8_7";
var motionInterval=null;
b.pinMode(motion, b.INPUT);
// Fetch the service account key JSON file contents
var serviceAccount = require("./serviceAccountKey.json");
var currentCount=0;
var seq4='0000'
// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://assignment-2-team-94-482d5.firebaseio.com/"
});

// As an admin, the app has access to read and write all data, regardless of Security Rules
var db = admin.database();
var stateRef = db.ref("/State"); // channel name
var motionData= db.ref("/motionData")
// ledRef.off()

// ref.on("value", function(snapshot) {   //this callback will be invoked with each new object
//   console.log(snapshot.val());         // How to retrive the new added object
// }, function (errorObject) {             // if error
//   console.log("The read failed: " + errorObject.code);
// });

// How to push new object
// ref.push({
//     id:2,
//     type:'paradise',
//     action:'on',
//     time:127818271
// });

stateRef.limitToLast(50).on('child_changed', toggle);
    
function toggle(data){
  var val = data.val();
  if (val.type=='led'){
  toggleLed(val.state);
  }
  else{
  toggleMotion(val.state)
  }
}


function toggleLed (state) {
  b.digitalWrite(led, state);
}

function toggleMotion(state){
  if (state===1)// if checked activate motion detector
  {
    motionInterval=setInterval(checkPIR, 1000); // Checks the Sensor Every Second
    function checkPIR(){
    b.digitalRead(motion, printStatus);
  }
  

    
    function printStatus(x) 
    {
        if(x.value === 1){
        console.log("Motion Detected");
        // socket.emit("motionDetected", currentCount)
        currentCount+=1
    }
            
        else
        {
        console.log("No Motion Detected");
              if (currentCount>=3)// if motion more than 3 seconds
              {
                 motionData.once('value', function(Snapshot) {
                    longCount = parseInt(Snapshot.val().longMotion);
                    motionCount = parseInt(Snapshot.val().motion);
                    motionCount+=1;
                    longCount+=1;
                    motionData.update({'/longMotion':longCount, '/motion':motionCount});
                    
                 });
                  seq4+='L'
                  seq4=seq4.substr(1)
                  console.log(seq4)

                  //pass long count and motion count to be updated in client html 
                  // socket.emit('longMotionPoll',longCount, motionCount)
                  currentCount=0;
              }
              else if(currentCount>=1){// if 1<= motion<3 
                    motionData.once('value', function(Snapshot) {
                    shortCount = parseInt(Snapshot.val().shortMotion);
                    motionCount = parseInt(Snapshot.val().motion);
                    motionCount+=1;
                    shortCount+=1;
                    motionData.update({'/shortMotion':shortCount, '/motion':motionCount});
                 });
              
                  //pass short count and motion count to be updated in client html 
                  // socket.emit('shortMotionPoll',shortCount, motionCount)
                  seq4+='S'
                  seq4=seq4.substr(1)
                  console.log(seq4)
                  currentCount=0;
              }
    }
if (seq4=='LSLL'){
  console.log('Intruder Alert!!')
   motionData.once('value', function(Snapshot) {
    intruderCount = parseInt(Snapshot.val().intruder);
    intruderCount+=1
    motionData.update({'/intruder':intruderCount});
    seq4='0000'
  });
}
else{
  console.log('no intruder')
}
      
    }

  }
  else
  {
      // if unchecked stop interval
      console.log('stop');
      clearInterval(motionInterval);
  }

}