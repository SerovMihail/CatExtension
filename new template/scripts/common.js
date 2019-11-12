(function() {
  this.initialize = async () => {
    // Sticky Note
    stickyNoteScreen = new Notes();
    stickyNoteScreen.initialize();

    // Todo List
    todoList = new TodoList();
    await todoList.initialize();

    // Settings Screen
    settingsScreen = new Setup();
    settingsScreen.initialize();

    // Main Screen
    newTab = new NewTab();
    await newTab.initialize();
    timeChecker() && newTab.addSearchListener();

    // I18n
    applyLanguage();
  };

  this.initialize();
})();






