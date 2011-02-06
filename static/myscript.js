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
  var $_add_dialog=$("#_add_todo");
  var $_edit_dialog=$("#_edit_todo");
  var $_login_dialog=$("#_login");
  
  var lists=new Array();
  var items=new Array();

  var lists_id=0, items_id=0;

  /****INIT ONLY FUNC*****/
  function set_ids(list, item) {
    lists_id = list; items_id = item;
  }

  /**********************************************
  * Event callbacks                             *
  **********************************************/

  function update_lists(event, ui) {
    /* update the order of the lists themselves */
  }

  function update_list(mylist) {
    /* update the order of a single list */
    var id=mylist.id; // who are we checking?
    var what=$("#"+id+" li");
    var arr = new Array();

    what.each(function() {
      arr.push($(this).attr("id"));
    });

    /* now we have all the id's in the correct order */
    console.log("UPDATE: ", mylist.id)
    $.each(arr, function(i, v){
      console.log("WTF: ",v);
      if (v) // ignore stuff that has no id
      items[v].order=i;
    });

    /* send ajax post for mylist and arr */
  }

  function change_list($item, listelem) {
    /* send new order of lists */
    /* listelem is the new list */
    var item = $item.attr("id");
    var oldlist = items[item].list;

    items[item].list = listelem; /* set the new list */

    // send item update, with new list
    change_todo(items[item]);
    // send order of old list and new list
    update_list(lists[oldlist]);
    update_list(lists[listelem]);
  }

  function new_list(mylist) {
    /* send new list */
  }

  function edit_todo(id) {
    /* edited the todo item */
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

  function finish_login(data, status, xmlhttp) {
    if (data.success) {
      /* login successful! omg!*/
      alert("login success");
    } else {
      login_dialog();
    }
  }
  /*****************************************************
  * UI callbacks - doesn't send updates, just ui stuff *
  *****************************************************/

  function login_dialog() {
    var dialog = $_login_dialog.clone();
    dialog.attr("id", null); // clear the id
    $("body").append(dialog);

    var $username = dialog.find(".username");
    var $password = dialog.find(".password"); // TODO fix this before actually using, passwords sent in clear! SSL fixes this, as does hashing

    dialog.dialog({
      close: function() {
        dialog.remove(); // i like cleaning up the dom
      },
      modal: true,
      buttons: [
        {
          text: "Login",
          click: function () {
            dialog.remove();
            $.post("/ajaj/login",
              {data: $.toJSON({"username": $username.val(), "password": $password.val()})},
              finish_login,
              "json"
            );
          }
        },
        {
          text: "Register",
          click: function () {alert("SHIT no registring yet")}
        }
      ]
    });
  }

  function add_list_dialog() {
    var dialog = $_add_dialog.clone();
    dialog.attr("id", null); // clear the id
    $("body").append(dialog);
    dialog.dialog({
      close: function() {
        dialog.remove();
      },
    });
    
    dialog.find(".datepicker").datepicker();
    
    dialog.find("._savechanges").click(function() {
      var title = dialog.find(".title").val();
      var date = dialog.find(".datepicker").val();
      
      if (!checktitle(title)) {
        dialog.find(".title").animate({backgroundColor: "red"}, 1000);
      } else {
        make_todo(list.id, title, date);
        dialog.dialog("close");
      }
    });
    
    dialog.find("._cancel").click(function(){dialog.dialog("close")});
    
  }
  
  function add_todo_dialog(list) {
    var dialog = $_add_dialog.clone();

    dialog.attr("id", null); // clear the id
    $("body").append(dialog);
    dialog.dialog({
      close: function() {
        dialog.remove();
      },
    });

    dialog.find(".datepicker").datepicker();

    dialog.find("._savechanges").click(function() {
      var title = dialog.find(".title").val();
      var date = dialog.find(".datepicker").val();

      if (!checktitle(title)) {
        dialog.find(".title").animate({backgroundColor: "red"}, 1000);
      } else {
        make_todo(list.id, title, date);
        dialog.dialog("close");
      }
    });

    dialog.find("._cancel").click(function(){dialog.dialog("close")});
  }

  function edit_todo_dialog(myitem) {
    var dialog = $_edit_dialog.clone();

    dialog.attr("id", null); // clear the id
    $("body").append(dialog);
    dialog.dialog({
      close: function() {
        dialog.remove();
      },
    });

    dialog.find(".datepicker").datepicker();
    dialog.find(".datepicker").val(myitem.due);
    dialog.find(".title").val(myitem.title);

    dialog.find("._savechanges").click(function() {
      var title = dialog.find(".title").val();
      var date = dialog.find(".datepicker").val();

      if (!checktitle(title)) {
        dialog.find(".title").animate({backgroundColor: "red"}, 1000);
      } else {

        /* update li */
        var $li = $("#todo_"+myitem.id);
        console.log($li.attr("id"));
        $li.find(".title").replaceWith("<span class='title'>"+title+"</span>");
        myitem.title=title;
        myitem.due = date;

        edit_todo(myitem);
        dialog.dialog("close");
      }
    });

    dialog.find("._cancel").click(function(){dialog.dialog("close")});
  }

  /**********************************************
  * Misc. functions                             *
  **********************************************/
  function checktitle(title) {
    if (title === "")
      return false;

    /*add more checks later*/

    return true;
  }

  /**********************************************
  * Creation functions                          *
  **********************************************/

  function make_todo(list, title, due) {
    var id=items_id++;
    var myitem={title: title, id: id, due: due, list: list, status: 0, order: lists[list].size++};

    items["todo_"+id]=myitem;

    var $sortlist=$(".connectedSortable", "#" + list);
    var $item = $('<li class="ui-state-default ui-corner-all" id="todo_'+id+
                  '"><span class="arrows ui-icon ui-icon-arrowthick-2-n-s"></span><span class="title">'+title+'</span>'+
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
      edit_todo_dialog(myitem);
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

        ui.draggable.hide( "slow", function() {
          ui.draggable.appendTo( $list ).show();
          change_list(ui.draggable, $item.find( "a" ).attr( "href" ).substr(1));
        });
      }
    });
  }

  function make_listbutt() {
    var butt = $("<button class='addlist'>Add new list</button>");
    $tabs.find('ul.ui-tabs-nav button').remove();
    $tabs.find('ul.ui-tabs-nav').append(butt);
    // insert code here about butts
    butt.click(function () {add_list_dialog()})
  }

  function make_list(title) {
    var id=lists_id++; /*which number are we now*/
    var mylist={id: "tab_"+id, title: title, size: 0};
    lists["tab_"+id]=mylist;

    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");

    newtab.attr("id","tab_"+id);
    newtab.find('.additem').button().click(function(){
      /* they asked to make a new item! */
      add_todo_dialog(mylist);
      $(this).blur();
    });
    
    sortable.sortable({
      update: function(event, ui) {
        update_list(mylist);
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
  
  /* init code */
  $tabs.tabs({tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Remove Tab</span></li>",})
       .addClass('ui-tabs-vertical ui-helper-clearfix')
       .find('.ui-tabs-nav').sortable({axis: "y", update: update_lists});

  $tabs.removeClass('ui-widget-content');

  make_listbutt();
  login_dialog();
});