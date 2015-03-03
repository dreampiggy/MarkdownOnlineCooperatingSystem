function getText(){
	var text = $("#wmd-input").val();
	return text;
};


$(document).ready(function(){
	$("#syncButton").click(function(){
		var markdownText = getText();
		$.ajax({
			type: 'POST',
			url: '/sync',
  			data: markdownText,
  			success: function(){
  				alert("OK!");
  			},
  			error: function(){
  				alert("Wrong!");
  			}
		});
	});
});