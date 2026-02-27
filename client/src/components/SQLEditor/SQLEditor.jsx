import { useRef, useEffect, useCallback } from 'react';
import { FiPlay } from 'react-icons/fi';
import './SQLEditor.scss';

const SQLEditor = ({ value, onChange, onExecute, loading }) => {
  const textareaRef = useRef(null);
  const lineCountRef = useRef(null);

  /* ── Update line numbers whenever value changes ── */
  const updateLineNumbers = useCallback(() => {
    if (!lineCountRef.current) return;
    const lines = (value || '').split('\n').length;
    lineCountRef.current.innerHTML = Array.from(
      { length: lines },
      (_, i) => `<span>${i + 1}</span>`,
    ).join('');
  }, [value]);

  useEffect(() => {
    updateLineNumbers();
  }, [updateLineNumbers]);

  /* ── Sync scroll between line numbers and textarea ── */
  const handleScroll = () => {
    if (lineCountRef.current && textareaRef.current) {
      lineCountRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  /* ── Ctrl/Cmd + Enter  → execute ── */
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
      return;
    }
    /* Tab inserts 2 spaces instead of moving focus */
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
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

      <div className="sql-editor__body">
        <div className="sql-editor__lines" ref={lineCountRef} aria-hidden="true">
          <span>1</span>
        </div>
        <textarea
          ref={textareaRef}
          className="sql-editor__textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          placeholder="-- Write your SQL query here..."
        />
      </div>
    </section>
  );
};

export default SQLEditor;
