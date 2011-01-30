   var items=new Array();

   function makeitem(title, due) {
     var id=items.length;
     var myitem={title: title, id: id, due: due};
     items.push(myitem);
     
	  $("#sortable").append('<li class="ui-state-default ui-corner-all" id="todo_'+id+
	          '"><span class="arrows ui-icon ui-icon-arrowthick-2-n-s"></span>'+title+
	          '<span class="pullright ui-icon ui-icon-close"></span><span class="pullright ui-icon ui-icon-wrench"></span></li>');
     //$(".ui-icon-wrench","#todo_"+id).hover();
	          
	  $("#sortable").sortable("refresh");
	  
	  sendlist();
   };
   
   function makejson() {
     var order = $( "#sortable" ).sortable("toArray");

	  var json={order: order, items: items};  
     
     // I don't know what the json we actually want should look like so i'm just going to do everything
     console.log(uneval(json));
     return json;
   }
   
   function sendlist() {
     var json=makejson();
     
     console.log("sending list");
   }
   
   function checktitle(title) {
     if (title === "")
       return false;   

     /*add more checks later*/       
            
     return true;
   }
   
   /* init function */   
	$(function() {
		$( "#sortable" ).sortable({
			update: function(event, ui) {
				sendlist();
			},
			placeholder: "ui-state-highlight"
		});
		$( "#sortable" ).disableSelection();
		
      /* setup add item dialog */		
		$( "#additem" ).button();
		$( "#additem" ).click(function() { $("#adddialog").dialog('open'); $("#additem").blur(); return false; });
		
		/* setup dialogs */
		$( "#adddialog" ).dialog({ autoOpen: false });
      $( "._datepicker", "#adddialog" ).datepicker();
      		
		$( "#editdialog" ).dialog({ autoOpen: false });		
		$( "._datepicker", "#editdialog" ).datepicker();
		
		/* Save dialog functions */
		$( "._savechanges", "#adddialog" ).button();
		$( "._cancel", "#adddialog" ).button();
		$( "._savechanges", "#adddialog").click(function() {
			var title=$("#addtitle").val();
			var dueon=$("#adddatepicker").val();

			/*i should do some checking here to see if it's all sane, don't give a shit right now*/
			if (!checktitle(title)) {
				$("#addtitle").animate({backgroundColor: "red"}, 1000);
			} else {
			   makeitem(title, dueon);
				/*clear the dialog*/			
				$("#adddialog").dialog("close");
				$("#adddatepicker").val("");
				$("#addtitle").val("").animate({backgroundColor: "white"}, 10);
			}
		});
      $( "._cancel", "#adddialog").click(function() {
			/*clear the dialog*/			
			$("#adddialog").dialog("close");
			$("#adddatepicker").val("");
			$("#addtitle").val("").animate({backgroundColor: "white"}, 10);
		});
		
		/* edit dialog functions */
		$( "._savechanges", "#editdialog" ).button();
		$( "._cancel", "#editdialog" ).button();
		$( "._savechanges", "#editdialog").click(function() {
			var title=$("#edittitle").val();
			var dueon=$("#editdatepicker").val();
			var id = $("#editid").val();

			/*i should do some checking here to see if it's all sane, don't give a shit right now*/
			if (!checktitle(title)) {
				$("#edittitle").animate({backgroundColor: "red"}, 1000);
			} else {
			   //makeitem(title, dueon); # need different function here
				/*clear the dialog*/			
				$("#editdialog").dialog("close");
				$("#editdatepicker").val("");
				$("#edittitle").val("").animate({backgroundColor: "white"}, 10);
			}
			
			$("#additem").button();
		});
		
      $( "._cancel", "#editdialog").click(function() {
			/*clear the dialog*/			
			$("#editdialog").dialog("close");
			$("#editdatepicker").val("");
			$("#edittitle").val("").animate({backgroundColor: "white"}, 10);
		});

	});