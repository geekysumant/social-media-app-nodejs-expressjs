let text = "Welcome to the hex!";
let elem = document.getElementById("typing-text");
let speed = 70;
var i = 0;

function type() {
  if (i < text.length) {
    elem.innerHTML += text.charAt(i);
    i++;
    setTimeout(type, speed);
  }
}

$("document").ready(() =>{
    type();
});
