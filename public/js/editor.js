let editor;

// Initialize Monaco Editor
require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    // Configure Java language features
    monaco.languages.register({ id: 'java' });
    
    // Add Java language configuration
    monaco.languages.setLanguageConfiguration('java', {
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ],
        autoClosingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: '\'', close: '\'' }
        ],
        surroundingPairs: [
            { open: '{', close: '}' },
            { open: '[', close: ']' },
            { open: '(', close: ')' },
            { open: '"', close: '"' },
            { open: '\'', close: '\'' }
        ],
        folding: {
            markers: {
                start: /^\s*\/\*\s*region\b/,
                end: /^\s*\/\*\s*endregion\b/
            }
        }
    });

    // Create editor instance
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: `public class Program {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        language: 'java',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
            enabled: false
        },
        fontSize: 16,
        fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
        fontLigatures: true,
        fontFeatureSettings: '"liga" 1, "calt" 1, "ss01" 1, "ss02" 1, "ss03" 1, "ss04" 1, "ss05" 1, "ss06" 1, "ss07" 1',
        lineHeight: 1.5,
        letterSpacing: 0.25,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        readOnly: false,
        cursorStyle: 'line',
        tabSize: 4,
        insertSpaces: true,
        wordWrap: 'on',
        suggestOnTriggerCharacters: true,
        quickSuggestions: true,
        parameterHints: {
            enabled: true
        },
        snippetSuggestions: 'top',
        formatOnPaste: true,
        formatOnType: true,
        renderWhitespace: 'selection',
        renderLineHighlight: 'all',
        scrollbar: {
            vertical: 'visible',
            horizontal: 'visible',
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
            verticalSliderSize: 10,
            horizontalSliderSize: 10,
            arrowSize: 30
        },
        // Disable problems panel
        problems: {
            enabled: false
        }
    });

    // Set initial zoom level
    editor.updateOptions({ zoomLevel: 1 });

    // Initialize Java language server
    initializeJavaLanguageServer();
    
    // Apply font ligatures directly to the editor DOM element
    setTimeout(() => {
        const editorElement = document.querySelector('.monaco-editor');
        if (editorElement) {
            editorElement.style.fontFamily = "'Fira Code', 'Consolas', 'Courier New', monospace";
            editorElement.style.fontFeatureSettings = '"liga" 1, "calt" 1, "ss01" 1, "ss02" 1, "ss03" 1, "ss04" 1, "ss05" 1, "ss06" 1, "ss07" 1';
        }
    }, 1000);
});

// Export editor instance
window.getEditor = () => editor; 