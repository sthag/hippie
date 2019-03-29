var hippie = {
  brand: "|-| | |^ |^ | [- "
};

var viewW = Math.max(document.documentElement.offsetWidth, document.documentElement.clientWidth, window.innerWidth, 0);
var viewH = Math.max(document.documentElement.clientHeight, window.innerHeight, 0);
var htmlH = Math.max(document.documentElement.offsetHeight, document.documentElement.clientHeight, 0);
var bodyW = Math.max(document.body.offsetWidth, document.body.clientWidth, window.innerWidth, 0);
var bodyH = Math.max(document.body.offsetHeight, document.body.clientHeight, 0);

var docPosY = 0;
var docInitleft = false;
var docInitY = viewH;

var viewHover = true;
var basicEase = 600;

var onerowAlphabet = "/\\ ]3 ( |) [- /= (_, |-| | _T /< |_ |\\/| |\\| () |^ ()_ /? _\\~ ~|~ |_| \\/ \\/\\/ >< `/ ~/_ ";
var onerowDigits = "\'| ^/_ -} +| ;~ (o \"/ {} \"| (\\) ";
