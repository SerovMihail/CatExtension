
function showModal(dialogHtml, opt) {
  opt = opt || {};

  opt.closeMethods = opt.closeMethods || ["overlay", "escape"];

  let modal = new tingle.modal(opt);
  modal.setContent(dialogHtml);

  applyLanguage();

  return modal;
}

function BackgroundDialog() {
  let modalContent = null;

  this.checkFavAvailable = settings => {
    let hasItem = false;
    for (let key of Object.keys(settings.favorites)) {
      if (settings.favorites[key]) {
        hasItem = true;
        break;
      }
    }

    return hasItem;
  };

  this.getShuffleRadio = opt => {
    return (
      modalContent.querySelector(
        "input[name='shuffle-settings'][value='" + opt + "']"
      ) || this.getShuffleRadio("all")
    );
  };

  this.onBackgroundSelected = targetElement => {
    let bgInfo = newTab.bgInfo;
    let selectingBg = settingsScreen.getSelectingBg();

    let item = targetElement.closest("[data-index]");
    let index = Number(item.getAttribute("data-index"));

    let lstBackgrounds = modalContent.querySelector("#lst-backgrounds");
    lstBackgrounds
      .querySelectorAll(".item")
      .forEach(q => q.classList.remove("selecting"));

    item.classList.add("selecting");

    selectingBg.index = index;
    settingsScreen.setSelectingBg(selectingBg);

    newTab.showBg(selectingBg, true);
  };

  this.onShuffleOptionChanged = targetElement => {
    if (!targetElement.checked) {
      return;
    }

    let value = targetElement.value;
    let settings = settingsScreen.getSelectingBg();

    if (value == "fav") {
      let hasItem = this.checkFavAvailable(settings);

      if (!hasItem) {
        Swal.fire("", getLanguageText("Backgrounds_Shuffle_NoFav"), "error");
        let optShuffle = this.getShuffleRadio(settings.shuffle);
        optShuffle.checked = true;

        return;
      }
    }

    settings.shuffle = value;
    settingsScreen.setSelectingBg(settings);
  };

  this.onFavButtonClick = targetElement => {
    targetElement.classList.toggle("active");
    let isFav = targetElement.classList.contains("active");

    let element = targetElement.closest("[data-index]");
    let index = Number(element.getAttribute("data-index"));

    let settings = settingsScreen.getSelectingBg();
    settings.favorites[index] = isFav;
    settingsScreen.setSelectingBg(settings);

    if (settings.shuffle == "fav" && !isFav) {
      let hasItem = this.checkFavAvailable(settings);

      if (!hasItem) {
        let radio = this.getShuffleRadio("all");
        radio.checked = true;
        this.onShuffleOptionChanged(radio);
      }
    }
  };

  this.addEventListeners = () => {
    addEventDelegate(
      modalContent.querySelector("#lst-commands"),
      "change",
      "input[name='shuffle-settings']",
      this.onShuffleOptionChanged
    );

    addEventDelegate(
      modalContent.querySelector("#lst-backgrounds"),
      "click",
      ".fav > i.fa",
      this.onFavButtonClick
    );

    addEventDelegate(
      modalContent.querySelector("#lst-backgrounds"),
      "click",
      "[data-background]",
      this.onBackgroundSelected
    );
  };

  this.loadBackgroundList = () => {
    let contentPanel = modalContent.querySelector("#panel-backgrounds-content");

    let bgInfo = newTab.bgInfo;
    let itemTemplate = modalContent.querySelector("#template-background-item")
      .innerHTML;

    let backgroundList = modalContent.querySelector("#lst-backgrounds");

    let selectingBg = settingsScreen.getSelectingBg();
    let counter = 0;

    for (let bg of bgInfo) {
      let itemEl = template(itemTemplate);

      itemEl.querySelector(
        "[data-background]"
      ).style.backgroundImage = `url(/img/${bg.FileName})`;
      itemEl.querySelector("[data-title]").setAttribute("title", bg.Title);
      backgroundList.appendChild(itemEl);

      itemEl.setAttribute("data-index", counter);

      if (counter == newTab.showingBgIndex) {
        itemEl.classList.add("selecting");
      }

      if (selectingBg.favorites[counter]) {
        const fav = itemEl.querySelector(".fav i.fa");
        fav && fav.classList.add("active");
      }

      counter++;
    }

    let optShuffle = this.getShuffleRadio(selectingBg.shuffle);
    optShuffle.checked = true;

    toggleVisibility(contentPanel);
  };

  this.showDialog = () => {
    return new Promise(async resolve => {
      let diagContent = await fetch("/parts/communication/tpl.html").then(response =>
        response.text()
      );

      let modal = showModal(diagContent, {
        cssClass: ["with-tabs"],
        onClose: resolve
      });

      const content = modal.getContent();

      modalContent = content;

      /* document
        .querySelector("[data-for=btn-more-wallpapers]")
        .appendChild(modalContent.querySelector(".tab-content")); */

      //console.log("child", child);
      //console.log("DIAL", child);

      this.loadBackgroundList();
      this.addEventListeners();

      modalContent = modalContent.querySelector(".tab-content");

      !document
        .querySelector("[data-for=btn-more-wallpapers]")
        .querySelector("#lst-backgrounds") &&
        document
          .querySelector("[data-for=btn-more-wallpapers]")
          .appendChild(modalContent);

      console.log("DIAL1", modalContent);
    });
  };

  return this;
}

