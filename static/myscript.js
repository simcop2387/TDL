$(function() {
  var $tabs=$("#tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  
  var lists=new Array();
  var items=new Array();
  var current_list=0;

  function makeitem(title, due) {
    var id=items.length;
    var myitem={title: title, id: id, due: due, list: current_list};
    items.push(myitem);
    
    var sortlist=$(".sortable", "#tab_"+ current_list);
    
    sortlist.append('<li class="ui-state-default ui-corner-all" id="todo_'+id+
                    '"><span class="arrows ui-icon ui-icon-arrowthick-2-n-s"></span>'+title+
                    '<span class="pullright ui-icon ui-icon-close"></span><span class="pullright ui-icon ui-icon-wrench"></span></li>');

    sortable.sortable("refresh");
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
  
  function maketab(title) {
    var id=lists.length; /*which number are we now*/
    lists.push({id: id, title: title});
    
    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");
    
    newtab.attr("id","tab_"+id);
    sortable.sortable({
      update: function(event, ui) {/*sendlist();*/},
      placeholder: "ui-state-highlight"
    });
    sortable.disableSelection();
    
    $tabs.append(newtab);
    $tabs.tabs("add", "#tab_"+id, title);
  }
    
  function checktitle(title) {
    if (title === "")
      return false;   

    /*add more checks later*/       

    return true;
  }
  
  $("#tabs").tabs();
  maketab("Testing");
  maketab("Testing2");
  maketab("Testing3");
});