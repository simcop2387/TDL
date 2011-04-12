/* work around old browsers that don't have a console */
if (console == null) {
  var console = {log: function () {}};
}

$(function() {
  var $tabs;
  var $_tabs=$("#_tabs");
  var $_tab=$("#_tab");
  var $hidden=$("#hidden");
  var $_add_dialog=$("#_add_todo");
  var $_add_list_dialog=$("#_add_list");
  var $_login_dialog=$("#_login");
  var $_password_dialog=$("#_password_dialog");
  var $_email_dialog=$("#_email_dialog");
  var $_about_dialog=$("#_about_dialog");
  //var $_password_dialog=$("#_password_dialog");
  
  var lists=new Array();
  var items=new Array();

  var master_list_count=0;
  var alive_todo=0;
  var finished_todo=0;
  var username=null; // needed for changing it later!

  /****INIT ONLY FUNC*****/
  function set_ids(list, item) {
    lists_id = list; items_id = item;
  }

/***
 * Task Class
 ***/

function Task(title, lid, order, description, due, tid, finished) {
  this.title = title;
  this.lid = lid;
  this.order = order;
  this.finished=false;
  this.due = due;
  this.description = description;

  var _task = this; // since this changes too fucking often
  // TODO make this use external functions!
  var _make_task = function() {
    items["todo_"+_task.tid]=_task;
    alive_todo++;

    // TODO most of these should be calling methods, haven't written them or cleaned it yet
    var $sortlist=$(".connectedSortable", "#tab_" + _task.lid);
    var $item = $('<li id="todo_'+_task.tid+'"></li>');

    var $inner = $('<div class="ui-state-default ui-corner-all todo_inner" title="Drag me around"></div>');
    var $desc = $('<div class="ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content-active" id="todo_desc_'+_task.tid+'"></div>');

    var $icon = $('<span class="arrows ui-icon" title="Expand description"></span>');

    $inner.append($icon);
    $inner.append('<span class="pullleft ui-icon ui-icon-circle-check" title="Finish todo">Finish todo</span>'+
                  '<span class="title">'+_task.title+'</span>'+
                  '<span class="pullright ui-icon ui-icon-close" title="Delete todo">Delete todo</span>'+
                  '<span class="pullright ui-icon ui-icon-pencil" title="Edit todo">Edit todo</span>');

    $item.append($inner);
    $item.append($desc);

    $desc.hide();
    
    if (_task.description) {
      $desc.text(_task.description);
    }

    var $arrows = $('div:first .arrows', '#todo_'+_task.tid);

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
      if (_task.description) {
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
      _task.finished=true;
      finished_todo++;

      /* send updates */
      _task.update(function() {
        $inner.removeClass("ui-state-default").addClass("ui-state-highlight");
        check.unbind('click');
        check.click(unfinishme);
      },
      function () {
        finished_todo--;
        _task.finished=false;
      });
    };

    var unfinishme=function() {
      _task.finished=false;
      finished_todo--;

      _task.update(function() {
        $inner.removeClass("ui-state-highlight").addClass("ui-state-default");
        check.unbind('click');
        check.click(finishme);
      },
      function () {
        _task.finished=true;
        finished_todo++;
      });
    };

    if (_task.finished) {
      $inner.removeClass("ui-state-default").addClass("ui-state-highlight");
      check.click(unfinishme);
      finished_todo++;
    } else {
      check.click(finishme);
    }

    $inner.find("span.ui-icon-close").click(function() {
      _task.delete(function () {
        $inner.hide("slow", function () {
          $item.remove();

          if (_task.finished)
            finished_todo--;
          alive_todo--;

          lists["tab_"+_task.lid].size--;
          lists["tab_"+_task.lid].update_progress();
          _task.lid=null; // set it null so i can filter later
        })
      });
    });

    $inner.find("span.ui-icon-pencil").click(function() {
      _task.edit_dialog();
    });

    $sortlist.append($item);

    $sortlist.sortable("refresh");
    _task._setup_arrows();
    lists["tab_"+_task.lid].update_progress();
  };

  console.log("DAMASCUS", tid);
  if (tid) {
    this.tid = tid;
    this.finished = finished;
    _make_task();
  } else {
    // we need to fetch the ID! do this by creating it in the DB and getting it back
    post_to('/ajaj/todo/new', this,
      function (data) {
        console.log("DISCUS!");
        console.log($.toJSON(data));
        if (data.success) {
          _task.tid = data.tid;
          _make_task(_task);
        }
      });
  }
};

Task.prototype.update = function(callback, errorback) {
  lists["tab_"+this.lid].update_progress();
  console.log($.toJSON(this));
  post_to('/ajaj/todo/edit', this, function(data){
    console.log($.toJSON(data));
    if (data.success) {
      callback(data)
    } else {
      errorback(data)
    }
  });
}

Task.prototype._setup_arrows = function() {
  var $arrows = $('div:first .arrows', '#todo_'+this.tid);

  if (this.description) {
    $arrows.addClass('ui-icon-triangle-1-e')
    .removeClass('hide-icon');
  } else {
    $arrows.removeClass('ui-icon-triangle-1-e')
    .removeClass('ui-icon-triangle-1-s')
    .addClass('hide-icon');
  }
}

Task.prototype.delete = function(succeed) {
  /* delete a todo */
  post_to('/ajaj/todo/delete', this, succeed); // TODO we don't need no stinking confirmation
}

Task.prototype.edit_dialog = function() {
  var dialog = $_add_dialog.clone();
  var _task = this; // save it for the callbacks

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
          var $li = $("#todo_"+_task.tid);
          var $desc = $("#todo_desc_"+_task.tid);
          console.log($li.attr("id"));
          $li.find(".title").text(title);
          _task.title=title;
          _task.due = date;
          _task.description=description;
          $desc.text(description);

          _task._setup_arrows();

          _task.update(function() {
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
  dialog.find(".datepicker").val(_task.due);
  dialog.find(".title").val(_task.title);
  dialog.find(".description").val(_task.description);
}

/***********************
 *Main List type Class *
 ***********************/

function MainList(title, lid, order) {
  this.title=title;
  this.lid=null;
  this.size=0;
  this.order=master_list_count;

  console.log("ListConstructor: title="+title+" lid="+lid+" order="+order);
  var _list=this; // does this suck horribly in javascript?
  
  var _make_list = function () {
    master_list_count++;

    lists["tab_"+_list.lid]=_list; // TODO this should be done externally!!!

    var newtab=$_tab.clone();
    var sortable=newtab.find("ul");

    newtab.attr("id","tab_"+_list.lid);
    newtab.find('.additem').button().click(function(){
      /* they asked to make a new item! */
      _list.addtask(); // call the dialog method here
      $(this).blur();
    });

    sortable.sortable({
      update: function(event, ui) {
        _list.update();
      }
    });

    sortable.disableSelection();

    // TODO This code needs to be moved to a better OO style, somewhere else.  e.g. i shouldn't be touching $tabs myself
    $tabs.prepend(newtab);
    $tabs.tabs("add", "#tab_"+_list.lid, _list.title);

    $tabs.find('a[href="#tab_'+_list.lid+'"]').parent().progressbar({value: 0});

    $tabs.find('a[href="#tab_'+_list.lid+'"]').parent().find(".ui-icon-close").click(function () {
      if (_list.size == 0)
        _list.delete();
    });

    setdroppable();
    $tabs.find('ul.ui-tabs-nav li').removeClass('ui-corner-top').addClass('ui-corner-all');
    $tabs.find(".ui-tabs-nav").sortable("refresh");
  }
  
  if (lid) {
    this.lid=lid;
    this.order=order;
    _make_list();
  } else {
    post_to('/ajaj/list/new', this,
      function (data) {
        console.log($.toJSON(data));
        if (data.success) {
          _list.lid = data.lid;
          _make_list();
        }});
  }
};

MainList.prototype.addtask = function() {
  var dialog = $_add_dialog.clone();
  var _list = this; // save an alias of the object

  dialog.attr("id", null); // clear the id
  $("body").append(dialog);

  dialog.dialog({
    close: function() {
      dialog.remove();
    },
    buttons: [
      {text: "Save Changes",
      click: function() {
        var title = dialog.find(".title").val();
        var date = dialog.find(".datepicker").val();
        var description = dialog.find(".description").val();

        if (!checktitle(title)) {
          dialog.find(".title").animate({backgroundColor: "red"}, 1000);
        } else {
          //TODO i should be saving this in the list
          var temptask = new Task(title, _list.lid, _list.size++, description);
          dialog.dialog("close");
        }
        }},
      {text: "Cancel", click: function(){dialog.dialog("close")}}
    ]});

  dialog.find(".datepicker").datepicker();
}

MainList.prototype.delete = function() {
  post_to('/ajaj/list/delete', this, function () {
    $tabs.tabs("remove", this.order);
  }); // TODO we don't need no stinking confirmation
};

MainList.prototype.update = function() {
  //this was left over from the spaghetti code, never understood why it was happening.  shouldn't need it then or now.  will try removing it later
  if (this == null || this.lid == null) {
    console.log("WHO ARE YOU?"); // why do i need this? something down below triggers an update that causes this to shit itself. fun
    return;
  }

  // the object should be able to cache this later, making it faster
  var what=$("#tab_"+this.lid+" li");
  var arr = new Array();

  var i=0;
  what.each(function() {
    var id=$(this).attr("id");
      //console.log("ARG: ", $(this).attr("id"));
    items[id].order=i++;
    arr.push(items[id].tid);
  });

  this.size=i;
  this.update_progress();

  /* TODO fuck i don't understand my own code... why doesn't this require a list?
     I suspect because I just ignore them in the backend... */
  /* send ajax post for mylist and arr */
  post_to('/ajaj/todo/order', {todos: arr}, function(data) {
    if (!data.success) {
      console.log("ORDER ERROR: ", data.message);
    }
  }); // we're going to "silently" ignore errors here due to the fact that it only puts things out of sync and all data is still around
};

MainList.prototype.update_progress = function () {
  console.log("inprogress", $.toJSON(this));
  // this was left from the old sphagetti code, shouldn't need it
  if (this == null) // i've got a bug or two in here and i don't understand them
    return;

  if (this.size == 0) { // don't try to divide by 0
    var $parent = $tabs.find('a[href="#tab_'+this.lid+'"]').parent();
    $parent.progressbar("value", 0);
    //$parent.find('.progress_text').text(""); // we have nothing in the list
  } else {
    var $parent = $tabs.find('a[href="#tab_'+this.lid+'"]').parent();
    var what=$("#tab_"+this.lid+" li");

    var n=0;
    what.each(function() {
      var id=$(this).attr("id");
      if (items[id].finished)
      n++;
    });

    var p=100 * n/this.size;
    $parent.progressbar("value", p);
    //$parent.find('.progress_text').text(""+Math.floor(p)+"%");
  }

  update_master_progress();
};

/***************
 * END Main List Class
 */


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
    items[item].update(function() {}, function () {});
    // send order of old list and new list
    lists["tab_"+oldlist].update();
    lists[listelem].update();
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

    $("#chemail").click(email_dialog);
    $("#chpass").click(password_dialog);
    $("#about").click(about_dialog);
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
        var listinf = data.lists[i];
        console.log("GOTLIST: title="+listinf.title+" lid="+listinf.lid+" order="+listinf.order);
        var templist = new MainList(listinf.title, listinf.lid, listinf.order);
        templist.update_progress();
      }
      for (var i in data.todos) {
        var taskinf = data.todos[i]; // TODO this should also save them to the lists
        var temptodo = new Task(taskinf.title, taskinf.lid, taskinf.order, taskinf.description, taskinf.due, taskinf.tid, taskinf.finished);
      }
    });
  }
  /*****************************************************
  * UI callbacks - doesn't send updates, just ui stuff *
  *****************************************************/

  function about_dialog() {
    $_about_dialog.dialog({width: 400});
  }

  function password_dialog() {
    var dialog=$_password_dialog.clone();
    var $newpass=dialog.find(".newpass");
    var $reppass=dialog.find(".reppass");
    var $error = dialog.find(".error");
    $error.hide();

    var changefunc = function () {
      if ($newpass.val() == $reppass.val() && $newpass.val() != '') {
        post_to("/ajaj/user/change", {password: hashpass(username, $newpass.val())}, function() {dialog.dialog("close")});
      } else {
        $error.text('Passwords do not match').show('slow');
      }
    };
    
    dialog.dialog({width: 350,
      buttons: [
        {text: "Save Changes", click: changefunc},
        {text: "Cancel", click: function() {dialog.dialog("close")}}
      ],
      close: function() {dialog.remove()}
    });
  }

  function email_dialog() {
    var dialog=$_email_dialog.clone();
    var $email=dialog.find(".emailaddr");

    // should do basic client side verification here, at the moment since i don't use them i don't care
    var changefunc = function(data) {
      post_to("/ajaj/user/change", {email: $email.val()}, function() {dialog.dialog("close")})
    };
    
    dialog.dialog({width: 350,
      buttons: [
        {text: "Save Changes", click: changefunc},
        {text: "Cancel", click: function() {dialog.dialog("close")}}
      ],
      close: function() {dialog.remove()}
    });
  }

  function login_dialog() { // no longer really a dialog
    //var dialog = $_login_dialog.clone();
    var dialog = $("#loginform");
    var loggedin=0; // used to prevent the user from just closing the box because i can't get the damned thing to remove the X
    //$("body").append(dialog);

    var $username = dialog.find("#username");
    var $password = dialog.find("#password");
    var $passrepeat = dialog.find("#repeated");
    var $emailaddr = dialog.find("#email");
    var $error = dialog.find(".error");

    var loginfunc = function () {
      $error.hide();

      if ($username.val() == '' || $password.val() == '') {
        $error.text('Invalid username or password').show('slow');
        return;
      };
      
      /*var*/ username = $username.val();
      var passhash = hashpass($username.val(), $password.val());
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

      /*var*/ username = $username.val();
      $error.hide('slow');

      post_to("/ajaj/register",
              {"email": $emailaddr.val(), "username": $username.val(), "password": hashpass($username.val(), $password.val())},
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

    var enterfunc=function(e) {
      if(e.which == 13){
        if (showreg) {
          registerfunc()
        } else {
          loginfunc()
        }
        return;
      }
    };

    $username.keypress(enterfunc);
    $password.keypress(enterfunc);
    $passrepeat.keypress(enterfunc);
    $emailaddr.keypress(enterfunc);
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
        // TODO switch this
        var templistvar = new MainList(title);
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

  /**********************************************
  * Misc. functions                             *
  **********************************************/
  function hashpass(username, password) {
    /* I know that using hmac for salting isn't really any better than concatenation.  i know i should be using PKDBF2 here but i haven't found a library i like for javascript yet*/
    /* and using the username as a salt may have less entropy but it really isn't going to be that much of a problem since someone can always get the salt from the system anyway if i do it "properly"*/
    return callhmac(SHA256_hash(username), SHA256_hash(password));
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
  
  /* init code */
  $("#mainprogress").hide().progressbar({value: 0});
  login_dialog();
});
