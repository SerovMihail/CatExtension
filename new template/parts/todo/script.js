function TodoListItem() {
  this.completed = false;
  this.text = getLanguageText("Todo_DefaultMessage");

  return this;
}

function TodoList() {
  let containerElement = document.querySelector("#panel-todo-list");
  let panelElement = document.querySelector("#panel-todo-list-content");
  let btnShowPanelElement = document.querySelector("#btn-todo");
  let panelContentHTMLTemplate;
  let itemHTMLTemplate;
  let popper;

  this.data = null;
  const LocalStorageKey = "todo-list";

  this.load = async () => {
    return settingsScreen.fromLocalStorageOrDefault(LocalStorageKey, () => ({
      items: []
    }));
  };

  this.save = async data => {
    data = data || this.data;

    settingsScreen.setLocalStorage(LocalStorageKey, data);
  };

  this.addTodo = () => {
    this.data.items.push(new TodoListItem());
    this.save();
    this.showTodoList(this.data);

    let item = containerElement.querySelector(".item:last-child");
    item.querySelector(".btn-rename").click();
  };

  this.showTodoList = data => {
    let listElement = panelElement.querySelector(".todo-list-items");
    listElement.innerHTML = "";

    for (var i = 0; i < data.items.length; i++) {
      let item = data.items[i];
      let itemEl = template(itemHTMLTemplate);
      itemEl.setAttribute("data-index", i);

      itemEl.querySelector("[data-check]").checked = item.completed;
      itemEl.querySelector("[data-text]").innerText = item.text;

      listElement.appendChild(itemEl);
    }

    if (popper) {
      popper.scheduleUpdate();
    }
  };

  this.show = async () => {
    panelElement.innerHTML = "";
    let content = template(panelContentHTMLTemplate);
    panelElement.appendChild(content);

    itemHTMLTemplate = content.querySelector("#template-todo-list-item").innerHTML;

    this.data = await this.load();
    this.showTodoList(this.data);

    applyLanguage();
    popper = newTab.showPopper(containerElement, btnShowPanelElement, "top-start");
  };

  this.onDeleteButtonClick = async (target, ev) => {
    event.stopPropagation();
    event.stopImmediatePropagation();

    let confirmDialogue = await Swal.fire({
      text: getLanguageText("Todo_ConfirmMessage"),
      confirmButtonText: getLanguageText("Todo_ConfirmYes"),
      cancelButtonText: getLanguageText("Todo_ConfirmNo"),
      showCancelButton: true
    });

    if (confirmDialogue.value) {
      let item = target.closest(".item[data-index]");
      let index = Number(item.getAttribute("data-index"));

      this.data.items.splice(index, 1);
      await this.save();

      clickOutside();
    }
  };

  this.onRenameButtonClick = async (target, ev) => {
    event.stopPropagation();
    event.stopImmediatePropagation();

    let item = target.closest(".item[data-index]");
    let index = Number(item.getAttribute("data-index"));

    let dataItem = this.data.items[index];

    let result = await Swal.fire({
      title: getLanguageText("Todo_Rename"),
      input: "text",
      inputValue: dataItem.text,
      confirmButtonText: getLanguageText("Todo_RenameConfirm"),
      cancelButtonText: getLanguageText("Todo_ConfirmNo"),
      showCancelButton: true
    });

    if (result.value) {
      dataItem.text = result.value;
      await this.save();
    }

    clickOutside();
  };

  this.onTodoItemClick = (target, ev) => {
    let chk = target.querySelector("input[data-check]");
    chk.click();
  };

  this.onItemCheckChanged = async (target, ev) => {
    let item = target.closest(".item[data-index]");
    let index = Number(item.getAttribute("data-index"));

    let dataItem = this.data.items[index];
    dataItem.completed = target.checked;
    await this.save();
  };

  this.addEventListeners = () => {
    btnShowPanelElement.addEventListener("click", () => this.show());

    addEventDelegate(containerElement, "click", "#btn-new-todo", () => this.addTodo());

    addEventDelegate(
      containerElement,
      "click",
      ".btn-delete",
      this.onDeleteButtonClick
    );
    addEventDelegate(
      containerElement,
      "click",
      ".btn-rename",
      this.onRenameButtonClick
    );

    addEventDelegate(containerElement, "click", ".item", this.onTodoItemClick);
    addEventDelegate(
      containerElement,
      "change",
      "input[data-check]",
      this.onItemCheckChanged
    );
  };

  this.initialize = async () => {
    panelContentHTMLTemplate = await fetch("/parts/todo/template.html").then(response =>
      response.text()
    );

    this.addEventListeners();
  };

  return this;
}
