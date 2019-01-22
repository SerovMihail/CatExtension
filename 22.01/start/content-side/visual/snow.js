window.loadAutoHideModule = function (event) {
  if (event.autoHideThread) clearTimeout(event.autoHideThread);
  event.autoHideThread = null;
  function show() {
    $("#wrapper").fadeIn(1e3);
    delay();
  }
  function delay() {
    clearTimeout(event.autoHideThread);
    event.autoHideThread = setTimeout(a, 1e4);
  }
  
  function hide() {
    if ($("#background_selector_widget").css("display") == "none") {
      $("#wrapper").fadeOut(1e3);
    }
  }

  function deleteEvents() {
    clearTimeout(event.autoHideThread);
    $("body").off("mousemove", show);
    $("input[type=text]").off("focus", deleteEvents);
    $("input[type=search]").off("keypress", deleteEvents);
    $("input[type=text], input[type=search]").off("focusout", addEvents);
  }
  function addEvents() {
    event.listAllThreads.threadAutoHide = {
      pause: function () {
        clearTimeout(event.autoHideThread);
        hide();
      },
      resume: function () {
        show();
      }
    };
    delay();
    $("body").off("mousemove", show);
    $("input[type=text]").off("focus", deleteEvents);
    $("input[type=search]").off("keypress", deleteEvents);
    $("input[type=text], input[type=search]").off("focusout", addEvents);
    $("body").on("mousemove", show);
    $("input[type=text]").on("focus", deleteEvents);
    $("input[type=search]").on("keypress", deleteEvents);
    $("input[type=text], input[type=search]").on("focusout", addEvents);
  }

  if (localStorage.getItem("enable_autohide") == "yes") {
    addEvents();
  } else {
    deleteEvents();
  }
  $("#enable_autohide").prop("checked", localStorage.getItem("enable_autohide") === "yes");
  $("#enable_autohide").off("change");
  $("#enable_autohide").on("change", function () {
    localStorage.setItem("enable_autohide", $("#enable_autohide").is(":checked") ? "yes" : "no");
    if ($("#enable_autohide").is(":checked")) {
      addEvents();
    } else {
      deleteEvents();
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOpt()
    });
  });
};

window.loadSnowModule = function (e) {
  if (e.change_interval) clearInterval(e.change_interval);
  e.change_interval = null;
  var t = function () {
    var type;
    var a = $('<div id="flake" class="snow" />').css({
      position: "absolute",
      "z-index": 999999999,
      top: "-50px",
      cursor: "default",
      "user-select": "none"
    }).html("&#10052;");
    var changeAnimationState = function () {
      var h = $(document).height(),
        w = $(document).width();
      var leftDistance = Math.random() * w - 100,
        customOpacity = 0.5 + Math.random(),
        customFontSize = type.minSize + Math.random() * type.maxSize,
        customTop = h - 40,
        customLeftDistance = leftDistance - 250 + Math.random() * 200,
        duration = h * 10 + Math.random() * 5e3;
      a.clone().appendTo("body").html(type.snow_type).css({
        left: leftDistance,
        opacity: customOpacity,
        "font-size": customFontSize,
        color: type.flakeColor
      }).animate({
        top: customTop,
        left: customLeftDistance,
        opacity: 0.3
      }, duration, "linear", function () {
        $(this).remove();
      });
    };
    if (!localStorage.getItem("snow_type")) localStorage.setItem("snow_type", "flake");
    switch (localStorage.getItem("snow_type")) {
      case "flake":
        type = {
          minSize: 10,
          maxSize: 25,
          newOn: 500,
          flakeColor: "#0099FF",
          snow_type: "&#10052;"
        };
        break;

      case "ball":
        type = {
          minSize: 5,
          maxSize: 20,
          newOn: 500,
          flakeColor: "#bbb",
          snow_type: "&#x2022;"
        };
        break;
    }
    if (e.listAllThreads.threadSnow) {
      e.listAllThreads.threadSnow.pause();
    }
    e.listAllThreads.threadSnow = {
      pause: function () {
        $(".snow").pause();
        clearInterval(e.change_interval);
      },
      resume: function () {
        $(".snow").resume();
        clearInterval(e.change_interval);
        e.change_interval = setInterval(changeAnimationState, type.newOn);
      }
    };
    e.listAllThreads.threadSnow.resume();
  };
  var a = function () {
    $(".snow").resume();
    clearInterval(e.change_interval);
  };
  if (localStorage.getItem("enable_snow") == "yes") {
    t();
    $("#snow_type").parent().parent().parent().show();
  } else {
    a();
    $("#snow_type").parent().parent().parent().hide();
  }
  $("#enable_snow").prop("checked", localStorage.getItem("enable_snow") === "yes");
  $("#enable_snow").off("change").on("change", function () {
    localStorage.setItem("enable_snow", $("#enable_snow").is(":checked") ? "yes" : "no");
    if ($("#enable_snow").is(":checked")) {
      t();
      $("#snow_type").parent().parent().parent().fadeIn();
    } else {
      a();
      $("#snow_type").parent().parent().parent().fadeOut();
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOpt()
    });
  });
  if (localStorage.getItem("snow_type")) {
    $("#snow_type").val(localStorage.getItem("snow_type"));
  }
  $("#snow_type").off("change").on("change", function () {
    localStorage.setItem("snow_type", $(this).val());
    a();
    t();
  });
};