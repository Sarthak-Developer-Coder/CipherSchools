import Editor from '@monaco-editor/react';
import { FiPlay } from 'react-icons/fi';
import './SQLEditor.scss';

const SQLEditor = ({ value, onChange, onExecute, loading }) => {
  const handleEditorMount = (editor, monaco) => {
    // Ctrl / Cmd + Enter  → execute
    editor.addAction({
      id: 'execute-query',
      label: 'Execute Query',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => onExecute(),
    });
  };

  return (
    <section className="sql-editor">
      <div className="sql-editor__toolbar">
        <span className="sql-editor__label">SQL Editor</span>
        <button
          className="sql-editor__run"
          onClick={onExecute}
          disabled={loading}
        >
          <FiPlay />
          {loading ? 'Running…' : 'Execute'}
        </button>
      </div>

      <div className="sql-editor__monaco">
        <Editor
          height="100%"
          language="sql"
          theme="vs-dark"
          value={value}
          onChange={onChange}
          onMount={handleEditorMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 12 },
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>
    </section>
  );
};

export default SQLEditor;
