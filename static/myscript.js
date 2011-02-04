/**
* Function : dump()
* Arguments: The data - array,hash(associative array),object
*    The level - OPTIONAL
* Returns  : The textual representation of the array.
* This function was inspired by the print_r function of PHP.
* This will accept some data as the argument and return a
* text that will be a more readable version of the
* array/hash/object that is given.
*/
function dump(arr,level) {
var dumped_text = "";
if(!level) level = 0;

//The padding given at the beginning of the line.
var level_padding = "";
for(var j=0;j<level+1;j++) level_padding += "    ";

if(typeof(arr) == 'object') { //Array/Hashes/Objects
 for(var item in arr) {
  var value = arr[item];

  if(typeof(value) == 'object') { //If it is an array,
   dumped_text += level_padding + "'" + item + "' ...\n";
   dumped_text += dump(value,level+1);
  } else {
   dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
  }
 }
} else { //Stings/Chars/Numbers etc.
 dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
}
return dumped_text;
} 









$(function() {
  var $tabs=$("#tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  
  var lists=new Array();
  var items=new Array();
  var current_list="tab_0";

  var lists_id=0, items_id=0;

  /****INIT ONLY FUNC*****/
  function set_ids(list, item) {
    lists_id = list; items_id = item;
  }

  /**********************************************
  * Event callbacks                             *
  **********************************************/
  
  function update_lists(event, ui) {
    /* send tab updates */
  }

  function update_list(mylist) {
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

  function add_dialog(list) {
  }
  
  function edit_dialog(id) {
  }

  /**********************************************
  * Misc. functions                             *
  **********************************************/
  
  /**********************************************
  * Creation functions                          *
  **********************************************/
    
  function make_todo(title, due) {
    var id=items_id++;
    var myitem={title: title, id: id, due: due, list: current_list, status: 0, order: 0};

    items["todo_"+id]=myitem;
    
    var $sortlist=$(".connectedSortable", "#" + current_list);
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
        // i don't know what i want here, i think $item and $list are what i want but we'll see
        change_list($item, this, $list, $item.find( "a" ).attr( "href" ));

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
    var id=lists_id++; /*which number are we now*/
    var mylist={id: id, title: title, size: 0};
    lists["tab_"+id]=mylist;
    
    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");
    
    newtab.attr("id","tab_"+id);
    sortable.sortable({
      update: function(event, ui) {
        update_list(id);
      }
    });
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
       .find('.ui-tabs-nav').sortable({axis: "y", update: update_lists});
  
  $tabs.removeClass('ui-widget-content');

  make_listbutt();

  /* generate a few things for testing */
  make_list("Testing");
  make_list("Testing2");
  make_list("Testing3");
  make_list("Testing4");

  var i,cl;
  for (i=0; i<10; i++)
    for (cl=0; cl<4; cl++)
    {
      current_list="tab_"+cl;
      make_todo("Testing "+i+"::"+current_list, "tet"); 
    }
  
});