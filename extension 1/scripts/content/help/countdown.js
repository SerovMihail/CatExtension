window.loadCountDownModule = function (e) {
  if (e.countDownThread) clearTimeout(e.countDownThread);
  e.countDownThread = null;
  var enableCountDownElem = $("#enable_countdown");
  var setPositionElem = $("#countdown_setPosition");
  var setTextElem = $("#countdown_setText");
  var setTimeElem = $("#countdown_setTime");
  var enableCountdown = function () {
    setPositionElem.val(localStorage.getItem("countdownPosition"));
    $(".countDown").removeClass("miniSize");
    $(".countDown").removeClass("center_center");
    if (localStorage.getItem("countdownPosition")) {
      if (localStorage.getItem("countdownPosition").toLowerCase() == "bottom center") {
        $(".countDown").removeClass("miniSize");
      } else if (localStorage.getItem("countdownPosition").toLowerCase() == "center") {
        $(".countDown").removeClass("miniSize");
        $(".countDown").addClass("center_center");
      } else {
        $(".countDown").addClass("miniSize");
      }
    }
    setTextElem.parent().parent().fadeIn();
    setTimeElem.parent().parent().fadeIn();
    setPositionElem.parent().parent().fadeIn();
    $("#countdown").fadeIn();
    setPositionElem.off("change");
    setPositionElem.on("change", function () {
      localStorage.setItem("countdownPosition", $(this).val());
      var e = $(this).val().toLowerCase();
      if (e === "bottom center") {
        $(".countDown").removeClass("miniSize");
        $(".countDown").removeClass("center_center");
      } else if (e === "center") {
        $(".countDown").removeClass("miniSize");
        $(".countDown").addClass("center_center");
      } else {
        $(".countDown").addClass("miniSize");
        $(".countDown").removeClass("center_center");
      }
      chrome.runtime.sendMessage({
        changeOptions: utils.getGlobalOpt()
      });
    });
    var countdownToTime = 0;
    var countdownText = "";
    if (localStorage.getItem("countdownToTime")) {
      setTimeElem.val(localStorage.getItem("countdownToTime"));
      countdownToTime = new Date(localStorage.getItem("countdownToTime")).getTime();
    }
    if (localStorage.getItem("countdownText")) {
      setTextElem.val(localStorage.getItem("countdownText"));
      countdownText = "Countdown to " + localStorage.getItem("countdownText");
      $("#countdownTitle").text(countdownText);
    }
    var setTimeElem = function (e) {
      if (e.handleObj.type == "blur" || e.keyCode == getKeyCode('ENTER')) {
        if ($(this).val() == "") {
          $(this).attr("type", "text");
          $(this).val("Invalid time");
          setTimeElem.off("focus");
          setTimeElem.on("focus", function () {
            $(this).attr("type", "datetime-local");
          });
        } else {
          countdownToTime = new Date($(this).val()).getTime();
          localStorage.setItem("countdownToTime", $(this).val());
          chrome.runtime.sendMessage({
            changeOptions: utils.getGlobalOpt()
          });
        }
        if (e.keyCode == getKeyCode('ENTER')) {
          $(this).trigger("blur");
        }
      }
    };
    var setTextElem = function (event) {
      if (event.handleObj.type == "blur" || event.keyCode == getKeyCode('ENTER')) {
        if ($(this).val().length > 0) {
          countdownText = "Countdown to " + $(this).val();
        } else {
          countdownText = "";
        }
        $("#countdownTitle").text(countdownText);
        localStorage.setItem("countdownText", $(this).val());
        chrome.runtime.sendMessage({
          changeOptions: utils.getGlobalOpt()
        });
        if (event.keyCode == getKeyCode('ENTER')) {
          $(this).trigger("blur");
        }
      }
    };
    setTimeElem.off("blur");
    setTimeElem.on("blur", setTimeElem);
    setTimeElem.off("keydown");
    setTimeElem.on("keydown", setTimeElem);
    setTextElem.off("blur");
    setTextElem.on("blur", setTextElem);
    setTextElem.off("keydown");
    setTextElem.on("keydown", setTextElem);
    var variableOne;
    var variableTwo;
    var variableThree;
    var variableFour;
    function m() {
      var e = new Date().getTime();
      if (e > countdownToTime) {
        variableOne = 0;
        variableTwo = 0;
        variableThree = 0;
        variableFour = 0;
      } else {
        var o = (e - countdownToTime) / 1e3;
        var min = 60;
        o = Math.abs(Math.floor(o));
        variableOne = Math.floor(o / (24 * min * min));
        variableFour = o - variableOne * 24 * min * min;
        variableTwo = Math.floor(variableFour / (min * min));
        variableFour = variableFour - variableTwo * min * min;
        variableThree = Math.floor(variableFour / min);
        variableFour = variableFour - variableThree * min;
      }
    }
    function setCountdown() {
      clearTimeout(e.countDownThread);
      m();
      $("#days .number").text(variableOne < 10 ? ("0" + variableOne).slice(-2) : variableOne);
      $("#hours .number").text(("0" + variableTwo).slice(-2));
      $("#minutes .number").text(("0" + variableThree).slice(-2));
      $("#seconds .number").text(("0" + variableFour).slice(-2));
      if (localStorage.getItem("enable_countdown") == "yes") e.countDownThread = setTimeout(setCountdown, 999);
    }
    e.countDownThread = setTimeout(setCountdown, 1);
    e.listAllThreads.threadCountdown = {
      pause: function () {
        clearInterval(e.countDownThread);
      },
      resume: function () {
        setCountdown();
      }
    };
  };
  if (localStorage.getItem("enable_countdown") == "yes") {
    enableCountDownElem.prop("checked", true);
    enableCountdown();
  } else {
    enableCountDownElem.prop("checked", false);
    setPositionElem.parent().parent().hide();
    setTimeElem.parent().parent().hide();
    setTextElem.parent().parent().hide();
    $("#countdown").hide();
  }
  enableCountDownElem.off("change");
  enableCountDownElem.on("change", function () {
    if ($(this).is(":checked")) {
      localStorage.setItem("enable_countdown", "yes");
      enableCountdown();
    } else {
      localStorage.setItem("enable_countdown", "no");
      setTextElem.parent().parent().fadeOut();
      setTimeElem.parent().parent().fadeOut();
      setPositionElem.parent().parent().fadeOut();
      $("#countdown").fadeOut();
      clearTimeout(e.countDownThread);
    }
    chrome.runtime.sendMessage({
      changeOptions: utils.getGlobalOpt()
    });
  });
};