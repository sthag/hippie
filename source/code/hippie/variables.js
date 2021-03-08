var hippie = {
  brand: "|-| | |^ |^ | [- ",
  screen: {
    w: Math.max(document.documentElement.offsetWidth, document.documentElement.clientWidth, window.innerWidth, 0),
    vh: Math.max(document.documentElement.clientHeight, window.innerHeight, 0),
    dh: Math.max(document.documentElement.offsetHeight, document.documentElement.clientHeight, 0),
    y: Math.min($(document).scrollTop(), document.documentElement.scrollTop)
    // hippie.screen.y: document.documentElement.scrollTop
  },
  body: {
    w: Math.max(document.body.offsetWidth, document.body.clientWidth, window.innerWidth, 0),
    h: Math.max(document.body.offsetHeight, document.body.clientHeight, 0),
  }
};

var viewHover = true;
var basicEase = 600;

var onerowAlphabet = "/\\ ]3 ( |) [- /= (_, |-| | _T /< |_ |\\/| |\\| () |^ ()_ /? _\\~ ~|~ |_| \\/ \\/\\/ >< `/ ~/_ ";
var onerowDigits = "\'| ^/_ -} +| ;~ (o \"/ {} \"| (\\) ";
