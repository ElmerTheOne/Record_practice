var time = 0;
var marks = "";
var input = [document.getElementById("seconds"),document.getElementById("note"),document.getElementById("submit")]
var marker_list = [];
let dropArea = document.getElementById('drop-area');

function handleFiles(files) {
  ([...files]).forEach(uploadFile)
}

function setAudio(file) {

  console.log("file");
  var url = URL.createObjectURL(file);
  var au = document.createElement('audio');
  au.id = "testAudio";
  var content_body = document.getElementById("audio_elem");
  au.src = url;
  au.controls = true;
  content_body.appendChild(au);
}

function setList(file) {
  console.log(file);

  var reader = new FileReader();
  reader.readAsText(file, "utf-8");
  reader.onload = function(e) {
    marker_list = JSON.parse(reader.result);
    console.log(marker_list);
    markerTestFromScratch(null, marker_list);
  }
}


function uploadFile(file) {
  var fileEnding = file.name.match(/\.txt|.ogg/g);
  var type;
  if(fileEnding != null) {
    //  Last elem if there are multiple hits on the pattern
    type = fileEnding[fileEnding.length-1];
    console.log(type);
    if(type == ".txt") {
      console.log("text");
      setList(file);
    } else {
      setAudio(file);
    }



  } else {
    alert("That filetype is not supported.");
  }
}

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  handleFiles(files);
}

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

var Marker = function(start, end, note) {
  this.start = start;
  this.end = end;
  this.note = note;
}


function markerTest(audio,list) {
  console.log(marker_list);
  var content_body = document.getElementById("content");
  var li = document.createElement("li");
  for(var i = 0; i < list.length; i++) {
    console.log("append");
    var ul = document.createElement("ul");
    var node = document.createTextNode(i+". "+list[i].note);
    var btn = document.createElement("button");
    btn.innerText = "Play Subclip";
    var test = list[i].start;
    btn.onclick = function() {

      audio.currentTime= test;
    };
    ul.appendChild(node);
    ul.appendChild(btn);
    li.appendChild(ul);
  }
  content_body.appendChild(li);
}

function markerTestFromScratch(audio, list) {
  var content_body = document.getElementById("content");
  var audioDiv = document.getElementById("audio_elem");

  if(audioDiv.children.length == 0) {

    audioDiv.addEventListener('DOMNodeInserted',function() {
      console.log("ri");
      var audio = document.getElementsByTagName("audio")[0];
      var content_body = document.getElementById("content");
      var list = marker_list;
      var li = document.createElement("li");
      for(var i = 0; i < list.length; i++) {
        var ul = document.createElement("ul");
        var node = document.createTextNode(i+". "+list[i].note);
        var btn = document.createElement("button");
        btn.innerText = "Play Subclip";
        var test = list[i].start;
        btn.onclick = function() {

          audio.currentTime= test;
        };
        ul.appendChild(node);
        ul.appendChild(btn);
        li.appendChild(ul);
      }
      content_body.appendChild(li);
    });
  } else{
    console.log("ri");
    var audio = document.getElementsByTagName("audio")[0];
    var content_body = document.getElementById("content");
    var list = marker_list;
    var li = document.createElement("li");
    for(var i = 0; i < list.length; i++) {
      var ul = document.createElement("ul");
      var node = document.createTextNode(i+". "+list[i].note);
      var btn = document.createElement("button");
      btn.innerText = "Play Subclip";
      var test = list[i].start;
      btn.onclick = function() {

        audio.currentTime= test;
      };
      ul.appendChild(node);
      ul.appendChild(btn);
      li.appendChild(ul);
    }
    content_body.appendChild(li);
  }

  // var li = document.createElement("li");
  // for(var i = 0; i < list.length; i++) {
  //   var ul = document.createElement("ul");
  //   var node = document.createTextNode(i+". "+list[i].note);
  //   var btn = document.createElement("button");
  //   btn.innerText = "Play Subclip";
  //   var test = list[i].start;
  //   btn.onclick = function() {
  //
  //     audio.currentTime= test;
  //   };
  //   ul.appendChild(node);
  //   ul.appendChild(btn);
  //   li.appendChild(ul);
  // }
  // content_body.appendChild(li);
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
  var audio_element = document.getElementsByTagName("audio");
  var currentTime;
  console.log(audio_element);
  if(audio_element.length == 1) {
    console.log("This branch");
    currentTime = audio_elem.children[0].currentTime;
  } else {
    console.log("What time is it " + time);
    currentTime = time;
  }
  for(var i = 0; i < input.length; i++) {
    input[i].disabled = false;
  }

  input[2].onclick = function() {

    console.log(audio_element.length);
    console.log(currentTime);
    var offset = input[0].value;
    var note = input[1].value;
    if(offset != null && offset > 0) {
      for(var i = 0; i < input.length; i++) {
        input[i].disabled = true;
        input[i].value = null;
      }
    }
    if(currentTime-offset > 0) {
      var marker = new Marker(currentTime - offset, currentTime, note);
      console.log(currentTime)

      if(audio_element.length == 1) {
        console.log("adding markers");
        addMarker(audio_element[0],marker_list);
      } else {  // If start is out of bounds
        var marker = new Marker(currentTime-offset, currentTime, note);
        marker_list.push(marker);
        if(audio_element.length == 1) {
          console.log("adding markers");
          addMarker(audio_element[0],marker_list);
        }
      }
    } else {
      var marker = new Marker(0, currentTime, note);
      console.log()

      if(audio_element.length == 1) {
        console.log("adding markers");
        addMarker(audio_element[0],marker_list);
      } else {  // If start is out of bounds
        var marker = new Marker(0, currentTime, note);
        marker_list.push(marker);
        if(audio_element.length == 1) {
          console.log("adding markers");
          addMarker(audio_element[0],marker_list);
        }
      }
    }


  };
}


function addMarker(audio, list) {

  var content_body = document.getElementById("content");
  var previous = content_body.getElementsByTagName("li");
  console.log(previous);
  if(previous.length == 1) {
    previous[0].remove();
  }
  var li = document.createElement("li");
  for(var i = 0; i < list.length; i++) {
    console.log("hey append");
    var ul = document.createElement("ul");
    var node = document.createTextNode(i+". "+list[i].note);
    var btn = document.createElement("button");
    btn.innerText = "Play Subclip";
    var test = list[i].start;
    btn.onclick = function() {

      audio.currentTime= test;
    };
    ul.appendChild(node);
    ul.appendChild(btn);
    li.appendChild(ul);
  }
  content_body.appendChild(li);
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
  markerTest(au,list);
}
