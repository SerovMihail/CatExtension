function TodoListItem() {
  this.completed = false;
  this.text = getLanguageText("Todo_DefaultMessage");

  return this;
}

function TodoList() {
  let container = document.querySelector("#panel-todo-list");
  let panel = document.querySelector("#panel-todo-list-content");
  let btnShowPanel = document.querySelector("#btn-todo");
  let panelContentTemplate;
  let itemTemplate;
  let popper;

  this.data = null;
  const StorageKey = "todo-list";

  this.load = async () => {
    return settingsScreen.fromLocalStorageOrDefault(StorageKey, () => ({
      items: []
    }));
  };

  this.save = async data => {
    data = data || this.data;

    settingsScreen.setLocalStorage(StorageKey, data);
  };

  this.addTodo = () => {
    this.data.items.push(new TodoListItem());
    this.save();
    this.showTodoList(this.data);

    let item = container.querySelector(".item:last-child");
    item.querySelector(".btn-rename").click();
  };

  this.showTodoList = data => {
    let list = panel.querySelector(".todo-list-items");
    list.innerHTML = "";

    for (var i = 0; i < data.items.length; i++) {
      let item = data.items[i];
      let itemEl = template(itemTemplate);
      itemEl.setAttribute("data-index", i);

      itemEl.querySelector("[data-check]").checked = item.completed;
      itemEl.querySelector("[data-text]").innerText = item.text;

      list.appendChild(itemEl);
    }

    if (popper) {
      popper.scheduleUpdate();
    }
  };

  this.show = async () => {
    panel.innerHTML = "";
    let content = template(panelContentTemplate);
    panel.appendChild(content);

    itemTemplate = content.querySelector("#template-todo-list-item").innerHTML;

    this.data = await this.load();
    this.showTodoList(this.data);

    applyLanguage();
    popper = newTab.showPopper(container, btnShowPanel, "top-start");
  };

  this.onDeleteButtonClick = async (target, ev) => {
    event.stopPropagation();
    event.stopImmediatePropagation();

    let confirm = await Swal.fire({
      text: getLanguageText("Todo_ConfirmMessage"),
      confirmButtonText: getLanguageText("Todo_ConfirmYes"),
      cancelButtonText: getLanguageText("Todo_ConfirmNo"),
      showCancelButton: true
    });

    if (confirm.value) {
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
    btnShowPanel.addEventListener("click", () => this.show());

    addEventDelegate(container, "click", "#btn-new-todo", () => this.addTodo());

    addEventDelegate(
      container,
      "click",
      ".btn-delete",
      this.onDeleteButtonClick
    );
    addEventDelegate(
      container,
      "click",
      ".btn-rename",
      this.onRenameButtonClick
    );

    addEventDelegate(container, "click", ".item", this.onTodoItemClick);
    addEventDelegate(
      container,
      "change",
      "input[data-check]",
      this.onItemCheckChanged
    );
  };

  this.initialize = async () => {
    panelContentTemplate = await fetch("/blocks/list/tpl.html").then(response =>
      response.text()
    );

    this.addEventListeners();
  };

  return this;
}
