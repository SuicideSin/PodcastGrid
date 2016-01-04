var Php = {
	stripslashes: function(str) {
		//       discuss at: http://phpjs.org/functions/stripslashes/
		//      original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
		//      improved by: Ates Goral (http://magnetiq.com)
		//      improved by: marrtins
		//      improved by: rezna
		//         fixed by: Mick@el
		//      bugfixed by: Onno Marsman
		//      bugfixed by: Brett Zamir (http://brett-zamir.me)
		//         input by: Rick Waldron
		//         input by: Brant Messenger (http://www.brantmessenger.com/)
		// reimplemented by: Brett Zamir (http://brett-zamir.me)

		return (str + '')
		.replace(/\\(.?)/g, function(s, n1) {
		  switch (n1) {
			case '\\':
			  return '\\';
			case '0':
			  return '\u0000';
			case '':
			  return '';
			default:
			  return n1;
		  }
		});
	},
	nl2br: function(str, is_xhtml) {
	  //  discuss at: http://phpjs.org/functions/nl2br/
	  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  // improved by: Philip Peterson
	  // improved by: Onno Marsman
	  // improved by: Atli Þór
	  // improved by: Brett Zamir (http://brett-zamir.me)
	  // improved by: Maximusya
	  // bugfixed by: Onno Marsman
	  // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	  //    input by: Brett Zamir (http://brett-zamir.me)

	  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

	  return (str + '')
		.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}
};

module.exports = Php;