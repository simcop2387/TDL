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
      tolerance: 'pointer',
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
   
  function makeaddtab() {
    $tabs.find('ul.ui-tabs-nav button').remove();
    $tabs.find('ul.ui-tabs-nav').append("<button>testing</button>");
  }
  
  function maketab(title) {
    var id=lists.length; /*which number are we now*/
    lists.push({id: id, title: title});
    
    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");
    
    newtab.attr("id","tab_"+id);
    sortable.sortable();
    sortable.disableSelection();
    
    $tabs.prepend(newtab);
    $tabs.tabs("add", "#tab_"+id, title);
    setdroppable();
    $tabs.find('ul.ui-tabs-nav li').removeClass('ui-corner-top').addClass('ui-corner-all');
    
    makeaddtab();
  }
    
  function checktitle(title) {
    if (title === "")
      return false;   

    /*add more checks later*/       

    return true;
  }
  
  $tabs.tabs({tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Remove Tab</span></li>",})
       .addClass('ui-tabs-vertical ui-helper-clearfix');
  
  $tabs.removeClass('ui-widget-content');

  makeaddtab();
  
  maketab("Testing");
  maketab("Testing2");
  maketab("Testing3");
  maketab("Testing4");

  var i;
  for (i=0; i<10; i++)
    for (current_list=0; current_list<4; current_list++)
      makeitem("Testing "+i+"::"+current_list, "tet");
  
});