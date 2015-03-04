function getText(){
	var text = $("#wmd-input").val();
	return text;
};
var userID = '11111';
var docID = '11111';
var userName = 'lizhuoli';

$(document).ready(function(){
	$("#addButton").click(function(){
		$.ajax({
			type: 'POST',
			url: '/upload',
  			data: userID,
  			success: function(){
  				alert("Add OK!");
  			},
  			error: function(){
  				alert("Add Wrong!");
  			}
		});
	});

	$("#syncButton").click(function(){
		var markdownText = getText();
		$.ajax({
			type: 'POST',
			url: '/sync',
  			data: markdownText,
  			success: function(){
  				alert("Sync OK!");
  			},
  			error: function(){
  				alert("Sync Wrong!");
  			}
		});
	});

	$("#deleteButton").click(function(){
		var deleteText = '{\"'+docID+'\":\"'+userID+'\"}';
		$.ajax({
			type: 'POST',
			url: '/remove',
  			data: deleteText,
  			success: function(){
  				alert("Delete OK!");
  			},
  			error: function(){
  				alert("Delete Wrong!");
  			}
		});
	});

	$("#getButton").click(function(){
		var getDocText = '{\"'+docID+'\":\"'+userID+'\"}';
		$.ajax({
			type: 'POST',
			url: '/download',
  			data: getDocText,
  			success: function(data){
  				alert("Download OK! Show As:\n\n" + data);
  			},
  			error: function(){
  				alert("Download Wrong!");
  			}
		});
	});	
});