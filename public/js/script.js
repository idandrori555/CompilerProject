// Initialize all components when the editor is ready
document.addEventListener("DOMContentLoaded", function () {
  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs",
    },
  });
  require(["vs/editor/editor.main"], function () {
    // Wait for editor to be initialized
    const checkEditor = setInterval(() => {
      if (globalThis.getEditor()) {
        clearInterval(checkEditor);
        const editor = globalThis.getEditor();

        // Init Language Server
        globalThis.initializeJavaLanguageServer();

        // Setup keyboard shortcuts
        globalThis.setupKeyboardShortcuts(editor);

        // Setup compile button (as a backup)
        globalThis.setupCompileButton();
      }
    }, 100);
  });
});
