var time = 0;
var marks = "";
var input = [document.getElementById("seconds"),document.getElementById("note"),document.getElementById("submit")]
var marker_list = [];

var Marker = function(start, end, note) {
  this.start = start;
  this.end = end;
  this.note = note;
}


function markerTest() {

}
function printToFile(data) {
  var link = document.createElement('a');
  link.download = '';
  var blob = new Blob([JSON.stringify(data)], {type: 'text/plain'});
  link.href = window.URL.createObjectURL(blob);
  link.click();
}

var data = "this is a test please work";
// Convert your object to a JSON string.
//
// var json_string = JSON.stringify(object, undefined, 2);
// Notes:
//
// If you already have a string, skip the step above.
// If you don't want it to be formatted nicely, remove the , undefined, 2.
// Create a download link and click it:

function record() {
  console.log("record pressed.");
  var rec_button = document.getElementById("rec");
  rec_button.onclick = "";

  navigator.mediaDevices.getUserMedia({ audio: true, video: false})
    .then(stream => {
      // Only works in firefox
      var options =  {
        mimeType: "audio/ogg",
        audioBitsPerSecond:320000
      };
      console.log("recording started");
      const mediaRecorder = new MediaRecorder(stream,options);
      mediaRecorder.start();

      var stop = document.getElementById("stop");

      const audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        var data = audioChunks;
        const audioBlob = new Blob(data);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        download(audioBlob,marker_list);
      });

      stop.onclick = function() {
        console.log("hey");
        console.log(mediaRecorder);
        mediaRecorder.stop();
        console.log(mediaRecorder);
        stop.onclick = "";
        clearInterval(timer);
      };
      var timer = setInterval( function() {
        time++;
        document.getElementById("timer").innerHTML= "" + "<b>"+time+"</b>";
      },1000);
    });


}
/*  Marks using the timer, not very accurate, though it's okay.
An alternative is to use the sample rate to calculate the time.
One chunk should be roughly 1024 samples
*/

function mark() {
  for(var i = 0; i < input.length; i++) {
    input[i].disabled = false;
  }
  var currentTime = time;
  input[2].onclick = function() {

    var offset = input[0].value;
    var note = input[1].value;
    if(offset != null && offset > 0) {
      for(var i = 0; i < input.length; i++) {
        input[i].disabled = true;
        input[i].value = null;
      }
      if(time-offset > 0) {
        var marker = new Marker(currentTime - offset, currentTime, note);
        marker_list.push(marker);
      }
    }


  };
}

function testPlayback(audio, text) {
  var reader = new FileReader();
  reader.onload = function() {
    var markers = JSON.parse(reader.result);

  }
  reader.readAsText(text);


}

var test_blob;
function download(audio, list) {
  var text = new Blob([JSON.stringify(list)], {type: 'text/plain'});
  test_blob = text;
  var url = URL.createObjectURL(audio);
  var li = document.createElement('li');
  var au = document.createElement('audio');
  au.id = "testAudio";
  var hf = document.createElement('a');
  var tf = document.createElement('a');
  var filename = new Date().toISOString();
  var text_url = URL.createObjectURL(text);
  tf.href = text_url;
  tf.download = filename + ".txt";
  tf.innerHTML = tf.download;
  au.controls = true;
  au.src = url;
  hf.href = url;
  hf.download =  filename + '.ogg';
  hf.innerHTML = hf.download;
  li.appendChild(au);
  li.appendChild(hf);
  li.appendChild(tf);
  console.log(text_url);
  document.getElementById("content").appendChild(li);
  testPlayback(au,text);
}
