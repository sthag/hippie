var hippie_brand = "|-| | |^ |^ | [- ";

var view_width = Math.max(document.documentElement.offsetWidth, document.documentElement.clientWidth, window.innerWidth, 0);
var view_height = Math.max(document.documentElement.clientHeight, window.innerHeight, 0);
var html_height = Math.max(document.documentElement.offsetHeight, document.documentElement.clientHeight, 0);
var body_height = Math.max(document.body.offsetHeight, document.body.clientHeight, 0);
var body_width = Math.max(document.body.offsetWidth, document.body.clientWidth, window.innerWidth, 0);

var full_view_hover = true;

var doc_pos_y = 0;
var basic_ease = 600;
var scroll_y_margin = view_height;

var onerow_alphabet = "/\\ ]3 ( |) [- /= (_, |-| | _T /< |_ |\\/| |\\| () |^ ()_ /? _\\~ ~|~ |_| \\/ \\/\\/ >< `/ ~/_ ";
var onerow_digits = "\'| ^/_ -} +| ;~ (o \"/ {} \"| (\\) ";
