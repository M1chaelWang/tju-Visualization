function toMap1() {
    document.getElementById("map").style.display = "block";
    document.getElementById("heatMap").style.display = "none";
    document.getElementById("startHex").style.display = "none";
    document.getElementById("destHex").style.display = "none";
}
function toMap2() {
    document.getElementById("heatMap").style.display = "block";
    document.getElementById("map").style.display = "none";
    document.getElementById("startHex").style.display = "none";
    document.getElementById("destHex").style.display = "none";
}
function toMap3() {
    document.getElementById("startHex").style.display = "block";
    document.getElementById("map").style.display = "none";
    document.getElementById("heatMap").style.display = "none";
    document.getElementById("destHex").style.display = "none";
}
function toMap4() {
    document.getElementById("destHex").style.display = "block";
    document.getElementById("map").style.display = "none";
    document.getElementById("heatMap").style.display = "none";
    document.getElementById("startHex").style.display = "none";
}
window.onload = function () {
    toMap1(); 
};
