import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  const [isPreview, setIsPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (prefix: string, suffix = prefix) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  };

  const insertLine = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  type ToolDef = { label: string; title: string; action: () => void };

  const tools: ToolDef[] = [
    {
      label: 'B',
      title: '加粗 (Ctrl+B)',
      action: () => wrapSelection('**'),
    },
    {
      label: 'I',
      title: '斜体',
      action: () => wrapSelection('_'),
    },
    {
      label: 'H',
      title: '标题',
      action: () => insertLine('## '),
    },
    {
      label: '—',
      title: '分割线',
      action: () => onChange(value + '\n\n---\n\n'),
    },
    {
      label: '</>',
      title: '代码块',
      action: () => wrapSelection('`'),
    },
    {
      label: '≡',
      title: '引用',
      action: () => insertLine('> '),
    },
  ];

  return (
    <div className="w-full flex flex-col bg-ink-base rounded-lg border border-ink-border overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-ink-border bg-ink-surface">
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <button
              key={tool.title}
              type="button"
              title={tool.title}
              onClick={tool.action}
              className={`px-2.5 py-1 rounded text-sm text-ink-secondary hover:text-ink-primary hover:bg-ink-hover transition-colors duration-150 font-mono leading-none ${
                tool.label === 'B' ? 'font-bold' : tool.label === 'I' ? 'italic' : ''
              }`}
            >
              {tool.label}
            </button>
          ))}
        </div>

        {/* 编辑 / 预览 切换 */}
        <div className="flex items-center bg-ink-hover rounded-md p-0.5">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded text-xs transition-colors duration-150 ${
              !isPreview
                ? 'bg-ink-surface text-ink-primary'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded text-xs transition-colors duration-150 ${
              isPreview
                ? 'bg-ink-surface text-ink-primary'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            预览
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-hidden">
        {!isPreview ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder ?? '在这里写下你的想法…（支持 Markdown 语法）'}
            className="w-full p-5 resize-none focus:outline-none bg-ink-base text-ink-primary text-sm leading-relaxed placeholder:text-ink-secondary font-mono"
            style={{ minHeight: '520px' }}
          />
        ) : (
          <div className="prose-content overflow-y-auto p-5" style={{ minHeight: '520px' }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {value || '*暂无内容*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
