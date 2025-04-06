// Keyboard shortcuts configuration
window.setupKeyboardShortcuts = function(editor) {
    // Add VSCode-like keyboard shortcuts
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, function() {
        const selection = editor.getSelection();
        if (selection) {
            const line = selection.startLineNumber;
            if (line > 1) {
                const lineContent = editor.getModel().getLineContent(line);
                editor.executeEdits('', [{
                    range: new monaco.Range(line - 1, 1, line - 1, lineContent.length + 1),
                    text: lineContent + '\n'
                }]);
                editor.executeEdits('', [{
                    range: new monaco.Range(line, 1, line, lineContent.length + 1),
                    text: ''
                }]);
            }
        }
    });

    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, function() {
        const selection = editor.getSelection();
        if (selection) {
            const line = selection.startLineNumber;
            const lineCount = editor.getModel().getLineCount();
            if (line < lineCount) {
                const lineContent = editor.getModel().getLineContent(line);
                editor.executeEdits('', [{
                    range: new monaco.Range(line + 1, 1, line + 1, 1),
                    text: lineContent + '\n'
                }]);
                editor.executeEdits('', [{
                    range: new monaco.Range(line, 1, line, lineContent.length + 1),
                    text: ''
                }]);
            }
        }
    });

    // Add Ctrl+S shortcut for compiling
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, function() {
        // Call the global compile function
        window.compile();
    });

    // Add Ctrl+/ for commenting
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, function() {
        const selection = editor.getSelection();
        if (selection) {
            const model = editor.getModel();
            const startLine = selection.startLineNumber;
            const endLine = selection.endLineNumber;
            
            for (let i = startLine; i <= endLine; i++) {
                const lineContent = model.getLineContent(i);
                if (lineContent.trim().startsWith('//')) {
                    // Uncomment
                    editor.executeEdits('', [{
                        range: new monaco.Range(i, 1, i, 3),
                        text: ''
                    }]);
                } else {
                    // Comment
                    editor.executeEdits('', [{
                        range: new monaco.Range(i, 1, i, 1),
                        text: '// '
                    }]);
                }
            }
        }
    });
} 