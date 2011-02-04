$(function() {
  var $tabs=$("#tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  
  var lists=new Array();
  var items=new Array();
  var current_list=0;

  /**********************************************
  * Event callbacks                             *
  **********************************************/
  
  function updatelists(event, ui) {
    /* send tab updates */
  }
  
  function changelist($item, that, $list, listelem) {
    /* send new order of lists */
  }

  function new_list(mylist) {
    /* send new list */
  }

  function change_todo(myitem) {
    /* send the todo finish or unfinish event */
  }

  function new_todo(myitem) {
    /* send a new todo */
  }

  function delete_todo(myitem) {
    /* delete a todo */
  }

  /*****************************************************
  * UI callbacks - doesn't send updates, just ui stuff *
  *****************************************************/

  function adddialog(list) {
  }
  
  function editdialog(id) {
  }
  
  /**********************************************
  * Creation functions                          *
  **********************************************/
    
  function make_todo(title, due) {
    var id=items.length;
    var myitem={title: title, id: id, due: due, list: current_list, status: 0};
    items.push(myitem);
    
    var $sortlist=$(".connectedSortable", "#tab_"+ current_list);
    var $item = $('<li class="ui-state-default ui-corner-all" id="todo_'+id+
                  '"><span class="arrows ui-icon ui-icon-arrowthick-2-n-s"></span>'+title+
                  '<span class="pullright ui-icon ui-icon-circle-check"></span><span class="pullright ui-icon ui-icon-wrench"></span></li>');

    var check=$item.find(".ui-icon-circle-check");
    var finishme=function() {
      $item.removeClass("ui-state-default").addClass("ui-state-highlight");
      myitem.status=1;

      /* send updates */
      change_todo(myitem);
      check.click(unfinishme);
    };
    
    var unfinishme=function() {
      $item.removeClass("ui-state-highlight").addClass("ui-state-default");
      myitem.status=0;

      /* send updates */
      change_todo(myitem);
      check.click(finishme);
    };

    check.click(finishme);
    
    $item.find("span.ui-icon-wrench").click(function() {
      /*open edit dialog*/
    });
    
    $sortlist.append($item);

    $sortlist.sortable("refresh");

    /*sendupdate*/
    new_todo(myitem);
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
        // i don't know what i want here
        changelist($item, this, $list, $item.find( "a" ).attr( "href" ));

        ui.draggable.hide( "slow", function() {
          $tabs.tabs( "select", $tab_items.index( $item ) );
          $( this ).appendTo( $list ).show( "slow" );
        });
      }
    });
  }

  function make_listbutt() {
    $tabs.find('ul.ui-tabs-nav button').remove();
    $tabs.find('ul.ui-tabs-nav').append("<button>testing</button>");
  }
  
  function make_list(title) {
    var id=lists.length; /*which number are we now*/
    var mylist={id: id, title: title};
    lists.push(mylist);
    
    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");
    
    newtab.attr("id","tab_"+id);
    sortable.sortable();
    sortable.disableSelection();
    
    $tabs.prepend(newtab);
    $tabs.tabs("add", "#tab_"+id, title);
    setdroppable();
    $tabs.find('ul.ui-tabs-nav li').removeClass('ui-corner-top').addClass('ui-corner-all');
    $tabs.find(".ui-tabs-nav").sortable("refresh");
    make_listbutt();

    /* send new list */
    new_list(mylist);
  }
    
  function checktitle(title) {
    if (title === "")
      return false;   

    /*add more checks later*/       

    return true;
  }

  /* init code */
  $tabs.tabs({tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Remove Tab</span></li>",})
       .addClass('ui-tabs-vertical ui-helper-clearfix')
       .find('.ui-tabs-nav').sortable({axis: "y", updated: updatelists});
  
  $tabs.removeClass('ui-widget-content');

  make_listbutt();

  /* generate a few things for testing */
  make_list("Testing");
  make_list("Testing2");
  make_list("Testing3");
  make_list("Testing4");

  var i;
  for (i=0; i<10; i++)
    for (current_list=0; current_list<4; current_list++)
      make_todo("Testing "+i+"::"+current_list, "tet");
  
});