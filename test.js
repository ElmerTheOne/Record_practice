

var wavesurfer = WaveSurfer.create({
    container: document.getElementById("wave"),
    scrollParent: true
});
wavesurfer.onready = function() {
  console.log("yo");
};
