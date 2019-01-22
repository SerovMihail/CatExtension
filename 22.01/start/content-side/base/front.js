(function (e) {
  e.getAllImages = function () {
    chrome.runtime.getPackageDirectoryEntry(function (s) {
      s.getDirectory('start/static/pictures', {}, function (imagesDirectory) {
        var dirReader = imagesDirectory.createReader();
        var buffer = [];
        getEntries = function (callback) {
          dirReader.readEntries(function (results) {
            if (results.length) {
              for (var idx in results) {
                buffer.push(results[idx]);
              }
              getEntries(callback);
            } else {
              callback(buffer);
            }
          }, function (error) {
            /* handle error -- error is a FileError object */
          });
        };
        getEntries(function (buffer) {
          e.imageBuffer = buffer.map(function (el) {
            return {
              fullPath: el.fullPath.replace('/crxfs', '')
            }
          });
          def('bg_img_list', e.imageBuffer.length);
          e.setNewTabBackground();
        });
      });
    });

  };

  e.listAllThreads = {};
  e.chosenRandomBG = "";

  e.setBackgroundGIFOrJPG = function (e) {

    var t = e.replace("bg-0", "").replace("bg-", "").replace(".jpg", "");
    var imagePath = window.imageBuffer[parseInt(t)] && window.imageBuffer[parseInt(t)].fullPath
      ? window.imageBuffer[parseInt(t)].fullPath
      : window.imageBuffer[0].fullPath;
    localStorage.setItem("last_bg", imagePath);

    document.getElementById("__bg").style.backgroundImage = "url(" + chrome.extension.getURL(imagePath);
    document.getElementById("__bg").style.backgroundColor = "none";
    document.getElementById("__bg").style.backgroundSize = "cover";
    if (document.getElementById("frame_bg")) {
      document.getElementById("frame_bg").remove();
    }

  };

  e.setNewTabBackground = function () {

    var lastBg = "" + localStorage.getItem("last_bg");
    var favorArr = [], newArr = [];
    if (localStorage.getItem("mark_favor")) {
      favorArr = JSON.parse(localStorage.getItem("mark_favor"));
      if (favorArr.length >= 2 && favorArr.indexOf(lastBg) > -1) {
        favorArr.splice(favorArr.indexOf(lastBg), 1);
      }
      if (favorArr.length) newArr = favorArr.join("|").split("|");
    }
    for (var n = 1; n <= user["bg_img_list"]; n++) {
      if ("" + n !== lastBg) newArr.push("" + n);
    }
    if (localStorage.getItem("shuffle_background") == "yes" || localStorage.getItem("shuffle_favorites") == "yes" && favorArr.length == 0) {
      var gIndex;
      if (lastBg == "0") {
        gIndex = 1;
      } else {
        gIndex = newArr[Math.floor(Math.random() * newArr.length)];
      }
      chosenRandomBG = "bg-" + ("0" + gIndex).slice(-2) + ".jpg";
    } else if (localStorage.getItem("shuffle_favorites") == "yes") {
      var gIndex = favorArr[Math.floor(Math.random() * favorArr.length)];
      chosenRandomBG = "bg-" + ("0" + gIndex).slice(-2) + ".jpg";
    } else {
      chosenRandomBG = "bg-" + ("0" + lastBg).slice(-2) + ".jpg";
    }
    e.setBackgroundGIFOrJPG(chosenRandomBG);
  };


  e.getAllImages();

})(this);