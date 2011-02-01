  /* init function */   
  $(function() {
    $( "#sortable" ).sortable({
      update: function(event, ui) {/*sendlist();*/},
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
