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

if (console == null) {
  var console = {log: function () {}};
}

$(function() {
  var $tabs=$("#tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  var $_add_dialog=$("#_add_todo");
  var $_edit_dialog=$("#_edit_todo");
  var $_add_list_dialog=$("#_add_list");
  var $_login_dialog=$("#_login");
  
  var lists=new Array();
  var items=new Array();

  var list_count=0;

  /****INIT ONLY FUNC*****/
  function set_ids(list, item) {
    lists_id = list; items_id = item;
  }

  /**********************************************
  * Event callbacks                             *
  **********************************************/

  function update_lists(event, ui) {
    /* send new order of lists */

    var nav=$tabs.find(".ui-tabs-nav");
    var what=nav.find('li a');

    var arr = new Array();
    var i=0;
    what.each(function() {
      var id=$(this).attr("href").substr(1);
      console.log("ARG: ", id);
      lists[id].order=i++;
      arr.push(lists[id].lid);
    });
    
    post_to('/ajaj/list/order', {lists: arr}, function(data) {
      if (!data.success) {
        console.log("ORDER ERROR: ", data.message);
      }
    });
  }

  function update_list(mylist) {
    /* update the order of a single list */
    if (mylist == null || mylist.lid == null) {
      console.log("WHO ARE YOU?"); // why do i need this? something down below triggers an update that causes this to shit itself. fun
      return; 
    }
    var lid=mylist.lid; // who are we checking?
    var what=$("#tab_"+lid+" li");
    var arr = new Array();

    var i=0;
    what.each(function() {
      var id=$(this).attr("id");
      console.log("ARG: ", $(this).attr("id"));
      items[id].order=i++;
      arr.push(items[id].tid);
    });

    mylist.size=i;
    updateprogress(mylist);
    
    /* send ajax post for mylist and arr */
    post_to('/ajaj/todo/order', {todos: arr}, function(data) {
      if (!data.success) {
        console.log("ORDER ERROR: ", data.message);
      }
    }); // we're going to "silently" ignore errors here due to the fact that it only puts things out of sync and all data is still around
  }

  function change_list($item, listelem) {
    if ($item == null || listelem == null)
      return;
    
    /* send new order of lists */
    /* listelem is the new list */
    var item = $item.attr("id");
    var lid = lists[listelem].lid;
    var oldlist = items[item].lid;

    console.log("change_list", item, lid, oldlist);

    items[item].lid = lid; /* set the new list */

    // send item update, with new list
    change_todo(items[item], function() {}, function () {});
    // send order of old list and new list
    update_list(lists["tab_"+oldlist]);
    update_list(lists[listelem]);
    return true;
  }

  function new_list(mylist, callback, errorback) {
    /* send new list */
    post_to('/ajaj/list/new', mylist,
            function (data) {
              if (data.success) {
                callback(data)
              } else {
                errorback(data)
              }
            });
  }

  function delete_list(mylist, succeed) {
    /* delete a todo */
    post_to('/ajaj/list/delete', mylist, succeed); // TODO we don't need no stinking confirmation
  }
  
  function change_todo(myitem, callback, errorback) {
    /* send the todo finish or unfinish event */
    updateprogress(lists["tab_"+myitem.lid]);
    post_to('/ajaj/todo/edit', myitem, function(data){
      console.log($.toJSON(data));
      if (data.success) {
        callback(data)
      } else {
        errorback(data)
      }
    });
  }

  function new_todo(mylist, callback, errorback) {
    /* send new todo */
    post_to('/ajaj/todo/new', mylist,
            function (data) {
              if (data.success) {
                callback(data)
              } else {
                errorback(data)
              }
            });
  }

  function delete_todo(myitem, succeed) {
    /* delete a todo */
    post_to('/ajaj/todo/delete', myitem, succeed); // TODO we don't need no stinking confirmation
  }

  function finish_login() {
    make_listbutt();
    get_data();
  }

  function get_data() {
    post_to('/ajaj/getdata', {}, function (data) {
      console.log($.toJSON(data));
      // TODO I NEED TO SORT THESE BASED ON .order OR THE DAMNED THING IS USELESS
      // I will do that on the database! that'll make it so fucking easy!
      for (var i in data.lists) {
        _make_list(data.lists[i]);
      }
      for (var i in data.todos) {
        _make_todo(data.todos[i]);
      }
    });
  }
  /*****************************************************
  * UI callbacks - doesn't send updates, just ui stuff *
  *****************************************************/

  function login_dialog() {
    var dialog = $_login_dialog.clone();
    dialog.attr("id", null); // clear the id
    var loggedin=0; // used to prevent the user from just closing the box because i can't get the damned thing to remove the X
    $("body").append(dialog);

    var $username = dialog.find(".username");
    var $password = dialog.find(".password"); // TODO fix this before actually using, passwords sent in clear! SSL fixes this, as does hashing

    var loginfunc = function () {
      dialog.find('.error').hide("slow");
      post_to("/ajaj/login",
            {"username": $username.val(), "password": $password.val()},
            function (data) {
              if (data.success) {
                loggedin=1;
                dialog.dialog("close"); finish_login()
              } else {
                dialog.find('.error').show("slow");
              }
            }
      );
    };
    var registerfunc = function () {
      if ($username.val() == '' || $password.val() == '') {
        dialog.find('.error').show('slow');
      };
      
      dialog.find('.error').hide('slow');
      post_to("/ajaj/register",
              {"username": $username.val(), "password": $password.val()},
              function (data) {
                if (data.success) {
                  loggedin=1;
                  dialog.dialog("close"); finish_login()
                } else {
                  dialog.find('.error').show("slow");
                }                
              }
      );
    };
    
    dialog.dialog({
      close: function() {if (loggedin) dialog.remove(); else login_dialog()},
      modal: true,
      buttons: [{ text: "Login", click: loginfunc },
                { text: "Register", click: registerfunc },],
      title: "Please login or register",
    });
  }

  function add_list_dialog() {
    var dialog = $_add_list_dialog.clone();
    dialog.attr("id", null); // clear the id
    $("body").append(dialog);

    var savelist = function () {
      var title = dialog.find(".title").val();

      if (!checktitle(title)) {
        dialog.find(".title").animate({backgroundColor: "red"}, 1000);
      } else {
        make_list(title);
        dialog.dialog("close");
      }
    }

    dialog.dialog({
      close: function() {
        dialog.remove();
      },
      buttons: [
        {text: "Add List", click: savelist},
        {text: "Cancel", click: function () {dialog.remove()}}
      ],
    });
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
        make_todo(list.lid, title, date);
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
        var $li = $("#todo_"+myitem.tid);
        console.log($li.attr("id"));
        $li.find(".title").replaceWith("<span class='title'>"+title+"</span>");
        myitem.title=title;
        myitem.due = date;

        change_todo(myitem);
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

    return true;
  }

  function post_to(url, data, success) {
    $.post(url, {"data": $.toJSON(data)}, function(data) {console.log("POSTOUT: ",$.toJSON(data)); success(data)}, "json");
  }

  function updateprogress(mylist) {
    console.log("inprogress", $.toJSON(mylist));
    if (mylist == null) // i've got a bug or two in here and i don't understand them
      return;

    if (mylist.size == 0) { // don't try to divide by 0
      $tabs.find('a[href="#tab_'+mylist.lid+'"]').parent().progressbar("value", 0);
    } else {
      var lid=mylist.lid; // who are we checking?
      var what=$("#tab_"+lid+" li");

      var n=0;
      what.each(function() {
        var id=$(this).attr("id");
        console.log(id, items[id].finished);
        if (items[id].finished)
          n++;
      });
      var p=100 * n/mylist.size;
      $tabs.find('a[href="#tab_'+mylist.lid+'"]').parent().progressbar("value", p);
    }
    
  }

  /**********************************************
  * Creation functions                          *
  **********************************************/
  function make_todo(list, title, due) {
    var myitem={title: title, tid: null, due: due, lid: list, finished: false, order: lists["tab_"+list].size};
    
    // we need to fetch the ID! do this by creating it in the DB and getting it back
    new_todo(myitem,
             function (data) {
               console.log($.toJSON(data));
               myitem.tid = data.tid;
               _make_todo(myitem);
             },
             function (data) {
               console.log($.toJSON(data));
             });
  };
  
  function _make_todo(myitem) {
    console.log($.toJSON(myitem));
    lists["tab_"+myitem.lid].size++;
    items["todo_"+myitem.tid]=myitem;

    var $sortlist=$(".connectedSortable", "#tab_" + myitem.lid);
    var $item = $('<li class="ui-state-default ui-corner-all" id="todo_'+myitem.tid+
                      '"><span class="arrows ui-icon ui-icon-arrowthick-2-n-s"></span><span class="pullleft ui-icon ui-icon-circle-check"></span><span class="title">'+myitem.title+'</span>'+
                  '<span class="pullright ui-icon ui-icon-close"></span><span class="pullright ui-icon ui-icon-pencil"></span></li>');

    var check=$item.find(".ui-icon-circle-check");
    var finishme=function() {
      myitem.finished=true;

      /* send updates */
      change_todo(myitem, function() {
        $item.removeClass("ui-state-default").addClass("ui-state-highlight");
        check.unbind('click');
        check.click(unfinishme);
      },
      function () {
        myitem.finished=false;
      });
    };

    var unfinishme=function() {
      myitem.finished=false;
      
      change_todo(myitem, function() {
        $item.removeClass("ui-state-highlight").addClass("ui-state-default");
        check.unbind('click');
        check.click(finishme);
      },
      function () {
        myitem.finished=true;
      });
    };

    if (myitem.finished) {
      $item.removeClass("ui-state-default").addClass("ui-state-highlight");
      check.click(unfinishme);
    } else {
      check.click(finishme); 
    }

    $item.find("span.ui-icon-close").click(function() {
      delete_todo(myitem, function () {
        $item.hide("slow", function () {$item.remove()})
      });
    });

    $item.find("span.ui-icon-pencil").click(function() {
      edit_todo_dialog(myitem);
    });

    $sortlist.append($item);

    $sortlist.sortable("refresh");
    updateprogress(lists["tab_"+myitem.lid]);
  };

  function setdroppable() {
    var $tab_items = $( "ul:first li", $tabs );
    $tab_items.droppable("destroy");
    $tab_items.droppable({
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
    butt.button();
    butt.click(function () {add_list_dialog()})
  }

  function make_list(title) {
    var mylist={id: null, title: title, size: 0, order: list_count};

    // we need to fetch the ID! do this by creating it in the DB and getting it back
    new_list(mylist,
      function (data) {
        console.log($.toJSON(data));
        mylist.lid = data.lid;
        _make_list(mylist);
      },
      function (data) {
        console.log($.toJSON(data));
    });
  };

  function _make_list(mylist) {
    list_count++; // increment this, used for naively ordering
    console.log($.toJSON(mylist));
    mylist.size=0; // make sure the size exists, it'll always be 0
    lists["tab_"+mylist.lid]=mylist;

    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");

    newtab.attr("id","tab_"+mylist.lid);
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
    $tabs.tabs("add", "#tab_"+mylist.lid, mylist.title);
    $tabs.find('a[href="#tab_'+mylist.lid+'"]').parent().progressbar({value: 0});
    
    $tabs.find(".ui-icon-close", "#tab_"+mylist.lid).click(function () {
      delete_list(mylist, function() {
        $tabs.tabs("remove", mylist.order);
      });
    });
    setdroppable();
    $tabs.find('ul.ui-tabs-nav li').removeClass('ui-corner-top').addClass('ui-corner-all');
    $tabs.find(".ui-tabs-nav").sortable("refresh");
    make_listbutt();
  }
  
  /* init code */
  $tabs.tabs({tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='progress_text'></span><span class='ui-icon ui-icon-close'>Remove Tab</span></li>",})
       .addClass('ui-tabs-vertical ui-helper-clearfix')
       .find('.ui-tabs-nav').sortable({axis: "y", update: update_lists});

  $tabs.removeClass('ui-widget-content');
  $tabs.oneTime(250, function() {login_dialog()});
});
