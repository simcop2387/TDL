/* work around old browsers that don't have a console */
/*if (console == null) {
  var console = {log: function () {}};
}*/

function reflow () {document.body.offsetWidth-=1; document.body.offsetWidth+=1}
$(function() {
  var $tabs;
  var $_tabs=$("#_tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  var $_add_dialog=$("#_add_todo");
  var $_add_list_dialog=$("#_add_list");
  var $_login_dialog=$("#_login");
  
  var lists=new Array();
  var items=new Array();

  var list_count=0;
  var alive_todo=0;
  var finished_todo=0;

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
      lists[id].order=i++;
      arr.push(lists[id].lid);
    });
    
    post_to('/ajaj/list/order', {lists: arr}, function(data) {
      if (!data.success) {
        console.log("ORDER ERROR: ", data.message);
      }
    });
    reflow();
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
      //console.log("ARG: ", $(this).attr("id"));
      items[id].order=i++;
      arr.push(items[id].tid);
    });

    mylist.size=i;
    update_list_progress(mylist);
    
    /* send ajax post for mylist and arr */
    post_to('/ajaj/todo/order', {todos: arr}, function(data) {
      if (!data.success) {
        console.log("ORDER ERROR: ", data.message);
      }
    }); // we're going to "silently" ignore errors here due to the fact that it only puts things out of sync and all data is still around
    reflow();
  }

  function change_list($item, listelem) {
    if ($item == null || listelem == null)
      return;
    
    /* send new order of lists */
    /* listelem is the new list */
    var item = $item.attr("id");
    var lid = lists[listelem].lid;
    var oldlist = items[item].lid;

    //console.log("change_list", item, lid, oldlist);

    items[item].lid = lid; /* set the new list */

    // send item update, with new list
    change_todo(items[item], function() {}, function () {});
    // send order of old list and new list
    update_list(lists["tab_"+oldlist]);
    update_list(lists[listelem]);
    reflow();
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
    reflow();
  }

  function delete_list(mylist, succeed) {
    /* delete a todo */
    post_to('/ajaj/list/delete', mylist, succeed); // TODO we don't need no stinking confirmation
    reflow();
  }
  
  function change_todo(myitem, callback, errorback) {
    /* send the todo finish or unfinish event */
    update_list_progress(lists["tab_"+myitem.lid]);
    post_to('/ajaj/todo/edit', myitem, function(data){
      console.log($.toJSON(data));
      if (data.success) {
        callback(data)
      } else {
        errorback(data)
      }
    });
    reflow();
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
    reflow();
  }

  function finish_login() {
    
    $tabs = $_tabs.clone();
    
    $tabs.tabs({tabTemplate: "<li><a href='#{href}'>#{label}<div class='progress_text'></div></a><span class='ui-icon ui-icon-close' title='Remove list'>Remove List</span></li>"})
         .addClass('ui-tabs-vertical ui-helper-clearfix')
         .find('.ui-tabs-nav').sortable({axis: "y", update: update_lists});
    
    $tabs.removeClass('ui-widget-content');
    $(".content").html("").append($tabs);
    make_listbutt();
    get_data();
    reflow();
  }

  function get_login_challenge(username, success, error) {
    $.get('/ajaj/login', {data: $.toJSON({username: username})},
      function (data) {
        console.log($.toJSON(data));
        if (data.success) {
          success(data);
        } else {
          error(data);
        }
      }
    );
  }

  function get_data() {
    post_to('/ajaj/getdata', {}, function (data) {
      console.log($.toJSON(data));
      // TODO I NEED TO SORT THESE BASED ON .order OR THE DAMNED THING IS USELESS
      // I will do that on the database! that'll make it so fucking easy!
      for (var i in data.lists) {
        _make_list(data.lists[i]);
        update_list_progress(lists["tab_"+data.lists[i].lid]);
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
    //var dialog = $_login_dialog.clone();
    var dialog = $("#loginform");
    var loggedin=0; // used to prevent the user from just closing the box because i can't get the damned thing to remove the X
    //$("body").append(dialog);

    var $username = dialog.find("#username");
    var $password = dialog.find("#password");
    var $passrepeat = dialog.find("#repeated");
    var $emailaddr = dialog.find("#email");
    var $error = dialog.find("#loginerror");

    var loginfunc = function () {
      $error.hide();

      if ($username.val() == '' || $password.val() == '') {
        $error.text('Invalid username or password').show('slow');
        return;
      };
      
      var username = $username.val();
      var passhash = callhmac(hashpass($username.val()), hashpass($password.val()));
      //console.log(passhash);

      get_login_challenge(username, function (data) {
        var hmac=callhmac(data.challenge, passhash);
        post_to("/ajaj/login",
                {"username": $username.val(), "password": hmac},
                function (data) {
                  if (data.success) {
                    loggedin=1;
                    dialog.dialog("close"); finish_login()
                  } else {
                    dialog.find('.error').show("slow");
                  }
                });
      },
      function (data) {
        $error.text('Invalid username or password').show('slow');
      });
    }

    var showreg = false;
    var registerfunc = function () {
      if (!showreg) {
        $("#regfields").hide().removeClass('hidden').show("slide",{ direction: "up" },500);
        showreg = true;
        return;
      } else if ($username.val() == '' || $password.val() == '') {
        $error.text('Invalid username or password').show('slow');
        return;
      } else if ($passrepeat.val() != $password.val()) {
        $error.text('Passwords do not match').show('slow');
        return;
      }
      
      $error.hide('slow');

      post_to("/ajaj/register",
              {"email": $emailaddr.val(), "username": $username.val(), "password": callhmac(hashpass($username.val()), hashpass($password.val()))},
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

    $("#loginbutt").button().click(loginfunc);
    $("#registerbutt").button().click(registerfunc);

    dialog.find("form").submit(function() {
      if (showreg) {
        registerfunc()
      } else {
        loginfunc()
      }
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
      ]
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
      buttons: [
        {text: "Save Changes", click: function() {
          var title = dialog.find(".title").val();
          var date = dialog.find(".datepicker").val();
          var description = dialog.find(".description").val();

          if (!checktitle(title)) {
            dialog.find(".title").animate({backgroundColor: "red"}, 1000);
          } else {
            make_todo(list.lid, title, date, description);
            dialog.dialog("close");
          }
        }},
        {text: "Cancel", click: function(){dialog.dialog("close")}}
      ]
    });

    dialog.find(".datepicker").datepicker();
  }

  function edit_todo_dialog(myitem) {
    var dialog = $_add_dialog.clone();

    dialog.attr("id", null); // clear the id
    $("body").append(dialog);
    dialog.dialog({
      title: "Edit this todo",
      close: function() {
        dialog.remove();
      },
      buttons: [
        {text: "Save Changes", click: function() {
          var title = dialog.find(".title").val();
          var date = dialog.find(".datepicker").val();
          var description = dialog.find(".description").val();

          if (!checktitle(title)) {
            dialog.find(".title").animate({backgroundColor: "red"}, 1000);
          } else {

            /* update li */
            var $li = $("#todo_"+myitem.tid);
            var $desc = $("#todo_desc_"+myitem.tid);
            console.log($li.attr("id"));
            $li.find(".title").text(title);
            myitem.title=title;
            myitem.due = date;
            myitem.description=description;
            $desc.text(description);
            
            _setup_todo_arrows(myitem);

            change_todo(myitem, function() {
              dialog.dialog("close");
            },
            function () {
              /*display error!*/
            });
          }
        }},
        {text: "Cancel", click: function(){dialog.dialog("close")}}
      ]
    });

    dialog.find(".datepicker").datepicker();
    dialog.find(".datepicker").val(myitem.due);
    dialog.find(".title").val(myitem.title);
    dialog.find(".description").val(myitem.description);
  }

  /**********************************************
  * Misc. functions                             *
  **********************************************/
  function hashpass(password) {
    return SHA256_hash(password);
  }

  function callhmac(challenge, passhash) {
    return HMAC_SHA256_MAC(challenge, passhash);
  }

  function checktitle(title) {
    if (title === "")
      return false;

    return true;
  }

  function post_to(url, data, success) {
    console.log(url);
    $.ajax({
      async: false,
      error: function (jqXHR, textStatus, errorthrown) {
        success({success: false, jqXHR: jqXHR, status: textStatus}); // send back the error
      },
      data: {"data": $.toJSON(data)},
      success: function(data) {console.log("POSTOUT: ",$.toJSON(data)); success(data)},
      type: "post",
      dataType: "json",
      url: url
    });
    
    //$.post(url, {"data": $.toJSON(data)}, , "json");
  }

  function update_list_progress(mylist) {
    //console.log("inprogress", $.toJSON(mylist));
    if (mylist == null) // i've got a bug or two in here and i don't understand them
      return;

    if (mylist.size == 0) { // don't try to divide by 0
      var $parent = $tabs.find('a[href="#tab_'+mylist.lid+'"]').parent();
      $parent.progressbar("value", 0);
      $parent.find('.progress_text').text(""); // we have nothing in the list
    } else {
      var $parent = $tabs.find('a[href="#tab_'+mylist.lid+'"]').parent();
      var lid=mylist.lid; // who are we checking?
      var what=$("#tab_"+lid+" li");

      var n=0;
      what.each(function() {
        var id=$(this).attr("id");
        if (items[id].finished)
          n++;
      });
      var p=100 * n/mylist.size;
      $parent.progressbar("value", p);
      $parent.find('.progress_text').text(""+Math.floor(p)+"%");
    }

    update_master_progress();
  }

  function update_master_progress() {
    var $mainprog = $("#mainprogress");
    if (alive_todo==0) {
      $mainprog.hide().progressbar("value", 0);
    } else {
      $mainprog.show().progressbar("value", 100*finished_todo/alive_todo);
    }
  }

  /**********************************************
  * Creation functions                          *
  **********************************************/
  function make_todo(list, title, due, description) {
    var myitem={title: title, tid: null, due: due, lid: list, finished: false, order: lists["tab_"+list].size, description: description};
    
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

  function _setup_todo_arrows(myitem) {
    var $arrows = $('div:first .arrows', '#todo_'+myitem.tid);
    
    if (myitem.description) {
      $arrows.addClass('ui-icon-triangle-1-e')
             .removeClass('hide-icon');
    } else {
      $arrows.removeClass('ui-icon-triangle-1-e')
             .removeClass('ui-icon-triangle-1-s')
             .addClass('hide-icon');
    }
  }
  
  function _make_todo(myitem) {
    console.log($.toJSON(myitem));
    lists["tab_"+myitem.lid].size++;
    items["todo_"+myitem.tid]=myitem;
    alive_todo++;

    var $sortlist=$(".connectedSortable", "#tab_" + myitem.lid);
    var $item = $('<li id="todo_'+myitem.tid+'"></li>');
    
    var $inner = $('<div class="ui-state-default ui-corner-all todo_inner" title="Drag me around"></div>');
    var $desc = $('<div class="ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active" id="todo_desc_'+myitem.tid+'"></div>');

    var $icon = $('<span class="arrows ui-icon" title="Expand description"></span>');

    $inner.append($icon);
    $inner.append('<span class="pullleft ui-icon ui-icon-circle-check" title="Finish todo">Finish todo</span>'+
                  '<span class="title">'+myitem.title+'</span>'+
                  '<span class="pullright ui-icon ui-icon-close" title="Delete todo">Delete todo</span>'+
                  '<span class="pullright ui-icon ui-icon-pencil" title="Edit todo">Edit todo</span>');
    
    $item.append($inner);
    $item.append($desc);

    $desc.hide();

    //myitem.desc="foo";
    if (myitem.description) {
      $desc.text(myitem.description);
    }

    var $arrows = $('div:first .arrows', '#todo_'+myitem.tid);
    
    var hidedesc = function () {
      $arrows.removeClass('ui-icon-triangle-1-s')
             .addClass('ui-icon-triangle-1-e');
      
      $desc.hide("slide",{ direction: "up" },500);
      $inner.unbind("dblclick");
      $inner.dblclick(showdesc);
      $arrows.unbind("click");
      $arrows.click(showdesc);
    };
    
    var showdesc = function () {
      if (myitem.description) {
        $arrows.removeClass('ui-icon-triangle-1-e')
               .addClass('ui-icon-triangle-1-s');

        $desc.show("slide",{ direction: "up" },500);
        $inner.unbind("dblclick");
        $inner.dblclick(hidedesc);
        $arrows.unbind("click");
        $arrows.click(hidedesc);
      }
    };
    
    $inner.dblclick(showdesc);
    $arrows.click(showdesc);
    
    var check=$inner.find(".ui-icon-circle-check");
    var finishme=function() {
      myitem.finished=true;
      finished_todo++;

      /* send updates */
      change_todo(myitem, function() {
        $inner.removeClass("ui-state-default").addClass("ui-state-highlight");
        check.unbind('click');
        check.click(unfinishme);
      },
      function () {
        finished_todo--;
        myitem.finished=false;
      });
    };

    var unfinishme=function() {
      myitem.finished=false;
      finished_todo--;
      
      change_todo(myitem, function() {
        $inner.removeClass("ui-state-highlight").addClass("ui-state-default");
        check.unbind('click');
        check.click(finishme);
      },
      function () {
        myitem.finished=true;
        finished_todo++;
      });
    };

    if (myitem.finished) {
      $inner.removeClass("ui-state-default").addClass("ui-state-highlight");
      check.click(unfinishme);
      finished_todo++;
    } else {
      check.click(finishme); 
    }

    $inner.find("span.ui-icon-close").click(function() {
      delete_todo(myitem, function () {
        $inner.hide("slow", function () {
          $item.remove();

          if (myitem.finished)
            finished_todo--;
          alive_todo--;

          lists["tab_"+myitem.lid].size--;
          update_list_progress(lists["tab_"+myitem.lid]);
          myitem.lid=null; // set it null so i can filter later
        })
      });
    });

    $inner.find("span.ui-icon-pencil").click(function() {
      edit_todo_dialog(myitem);
    });

    $sortlist.append($item);

    $sortlist.sortable("refresh");
    _setup_todo_arrows(myitem); // setup the arrows
    update_list_progress(lists["tab_"+myitem.lid]);
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
    
    $tabs.find('a[href="#tab_'+mylist.lid+'"]').parent().find(".ui-icon-close").click(function () {
      if (mylist.size == 0)
        delete_list(mylist, function() {
          $tabs.tabs("remove", mylist.order);
        });
    });
    setdroppable();
    $tabs.find('ul.ui-tabs-nav li').removeClass('ui-corner-top').addClass('ui-corner-all');
    $tabs.find(".ui-tabs-nav").sortable("refresh");
    //make_listbutt(); // leave the button at the top, lets see how that works
  }
  
  /* init code */
  $("#mainprogress").hide().progressbar({value: 0});
  $_tabs.oneTime(250, function() {login_dialog()});
});
