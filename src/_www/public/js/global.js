!function(){
jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
};
function expandMenu() {
	$("#site-menu-icon").rotate(90);
	$("#site-menu").show();
}

function collapseMenu() {
	$("#site-menu-icon").rotate(0);
	$("#site-menu").hide();
}

function toggleMenu() {
	if ($("#site-menu").is(":visible")) {
		collapseMenu();
	} else {
		expandMenu();
	}
}

function addEvents() {
	if ($("#main-container").width() > 500)
		$("#site-menu-container").hover(toggleMenu);
	$("#site-menu-icon").click(toggleMenu);
}
	
$(document).ready(function(){
	addEvents();
});
}();

/* Auto Link https://github.com/bryanwoods/autolink-js */
(function(){var h=[].slice;String.prototype.autoLink=function(){var b,f,d,a,e,g;a=1<=arguments.length?h.call(arguments,0):[];e=/(^|[\s\n]|<br\/?>)((?:https?|ftp):\/\/[\-A-Z0-9+\u0026\u2019@#\/%?=()~_|!:,.;]*[\-A-Z0-9+\u0026@#\/%=~()_|])/gi;if(!(0<a.length))return this.replace(e,"$1<a href='$2'>$2</a>");d=a[0];f=function(){var c;c=[];for(b in d)g=d[b],"callback"!==b&&c.push(" "+b+"='"+g+"'");return c}().join("");return this.replace(e,function(c,b,a){c=("function"===typeof d.callback?d.callback(a):void 0)||"<a href='"+
a+"'"+f+">"+a+"</a>";return""+b+c})}}).call(this);
/* End Auto Link */