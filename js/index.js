function toMap1() {
    document.getElementById("map").style.display = "block";
    document.getElementById("timeSlider1").style.display = "block";
    document.getElementById("timeSlider2").style.display = "none";
    document.getElementById("timeSlider3").style.display = "none";
    document.getElementById("timeSlider4").style.display = "none";
    document.getElementById("heatMap").style.display = "none";
    document.getElementById("startHex").style.display = "none";
    document.getElementById("destHex").style.display = "none";
}
function toMap2() {
    document.getElementById("heatMap").style.display = "block";
    document.getElementById("timeSlider2").style.display = "block";
    document.getElementById("timeSlider1").style.display = "none";
    document.getElementById("timeSlider3").style.display = "none";
    document.getElementById("timeSlider4").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("startHex").style.display = "none";
    document.getElementById("destHex").style.display = "none";
}
function toMap3() {
    document.getElementById("startHex").style.display = "block";
    document.getElementById("timeSlider3").style.display = "block";
    document.getElementById("timeSlider1").style.display = "none";
    document.getElementById("timeSlider2").style.display = "none";
    document.getElementById("timeSlider4").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("heatMap").style.display = "none";
    document.getElementById("destHex").style.display = "none";
}
function toMap4() {
    document.getElementById("destHex").style.display = "block";
    document.getElementById("timeSlider4").style.display = "block";
    document.getElementById("timeSlider1").style.display = "none";
    document.getElementById("timeSlider2").style.display = "none";
    document.getElementById("timeSlider3").style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("heatMap").style.display = "none";
    document.getElementById("startHex").style.display = "none";
}
window.onload = function () {
    toMap1(); 
};
var globalVariable = "2017-5-19";