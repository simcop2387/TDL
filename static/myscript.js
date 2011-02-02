$(function() {
  var $tabs=$("#tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  
  var lists=new Array();
  var items=new Array();
  var current_list=0;

  function makeitem(title, due) {
    var id=items.length;
    var myitem={title: title, id: id, due: due, list: current_list, status: 0};
    items.push(myitem);
    
    var $sortlist=$(".connectedSortable", "#tab_"+ current_list);
    var $item = $('<li class="ui-state-default ui-corner-all" id="todo_'+id+
                  '"><span class="arrows ui-icon ui-icon-arrowthick-2-n-s"></span>'+title+
                  '<span class="pullright ui-icon ui-icon-circle-check"></span><span class="pullright ui-icon ui-icon-wrench"></span></li>');
    
    $item.find("span.ui-icon-circle-check").click(function() {
      alert("you finished "+id+" ["+title+"]");
      $item.removeClass("ui-state-default").addClass("ui-state-highlight");
      myitem.status=1;
      /*sendupdate*/
    });
    
    $item.find("span.ui-icon-wrench").click(function() {
      alert("you configured "+id+" ["+title+"]");
      /*open edit dialog*/
      /*sendupdate*/
    });
    
    $sortlist.append($item);

    $sortlist.sortable("refresh");
    /*sendupdate*/
  };
  
  function setdroppable() {
    var $tab_items = $( "ul:first li", $tabs ).droppable({
      accept: ".connectedSortable li",
      hoverClass: "ui-state-hover",
      drop: function( event, ui ) {
        var $item = $( this );
        var $list = $( $item.find( "a" ).attr( "href" ) )
                    .find( ".connectedSortable" );

        ui.draggable.hide( "slow", function() {
          $tabs.tabs( "select", $tab_items.index( $item ) );
          $( this ).appendTo( $list ).show( "slow" );
        });
      }
    });
  }
  
  function adddialog(list) {
  }
  
  function editdialog(id) {
  }
    
  function maketab(title) {
    var id=lists.length; /*which number are we now*/
    lists.push({id: id, title: title});
    
    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");
    
    newtab.attr("id","tab_"+id);
    sortable.sortable();
    sortable.disableSelection();
    
    $tabs.append(newtab);
    $tabs.tabs("add", "#tab_"+id, title);
    setdroppable();
  }
    
  function checktitle(title) {
    if (title === "")
      return false;   

    /*add more checks later*/       

    return true;
  }
  
  $tabs.tabs({tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Remove Tab</span></li>",});
  $( "#tabs ul li" )
    .addClass( "ui-corner-all" );
  
  maketab("Testing");
  maketab("Testing2");
  maketab("Testing3");
  
  makeitem("Testing", "tet");
  makeitem("Testing2", "tet");
  makeitem("Testing3", "tet");
  makeitem("Testing4", "tet");
  makeitem("Testing5", "tet");
});