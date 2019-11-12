function Notes() {
    let board;
    let useDrive = false;
  
    this.onCreateStickyNoteButtonClick = () => {
      let note = board.addNote();
      let noteEl = note.element;
      let boardEl = board.container;
  
      let noteSize = [noteEl.clientWidth, noteEl.clientHeight];
      let boardSize = [boardEl.clientWidth, boardEl.clientHeight];
  
      note.move(
        (boardSize[0] - noteSize[0]) / 2,
        (boardSize[1] - noteSize[1]) / 2
      );
    };
  
    const StickyNoteKey = "sticky";
    this.saveToStorage = async content => {
      settingsScreen.setLocalStorage(StickyNoteKey, content);
    };
  
    this.loadFromStorage = async () => {
      return settingsScreen.fromLocalStorageOrDefault(StickyNoteKey, () => {
        return {
          notes: []
        };
      });
    };
  
    this.load = async () => {
      let data;
      data = await this.loadFromStorage();
  
      if (data && data.notes && data.notes.length) {
        board.clearNotes();
        board.addSerializableObject(data);
      }
    };
  
    this.save = async () => {
      let content = board.toSerializableObject();
  
      if (useDrive) {
        await this.saveToDrive(content);
      } else {
        await this.saveToStorage(content);
      }
    };
  
    this.onNoteCloseButtonClick = (target, ev) => {
      event.preventDefault();
  
      (async () => {
        let confirm = await Swal.fire({
          text: getLanguageText("StickyNotes_CloseConfirm"),
          confirmButtonText: getLanguageText("Todo_ConfirmYes"),
          cancelButtonText: getLanguageText("Todo_ConfirmNo"),
          showCancelButton: true
        });
  
        if (confirm.value) {
          ev.detail.remove();
        }
      })();
    };
  
    this.addListeners = () => {
      document
        .querySelector("#btn-sticky-notes")
        .addEventListener("click", () => this.onCreateStickyNoteButtonClick());
  
      let boardEl = board.container;
      addEventDelegate(boardEl, "focusout", "input,textarea", () =>
        this.onNoteUpdated()
      );
      addEventDelegate(boardEl, "move", ".pi-note", () => this.onNoteUpdated());
      addEventDelegate(boardEl, "close", ".pi-note", this.onNoteCloseButtonClick);
  
      boardEl.addEventListener("note-closed", () => this.onNoteUpdated());
    };
  
    this.onNoteUpdated = async () => {
      await this.save();
    };
  
    this.switchStorageMode = async shouldUseDrive => {
      useDrive = shouldUseDrive;
  
      await this.load();
    };
  
    this.initialize = () => {
      board = new PostIt(document.querySelector("#board-sticky-notes"));
  
      this.addListeners();
    };
  
    return this;
  }