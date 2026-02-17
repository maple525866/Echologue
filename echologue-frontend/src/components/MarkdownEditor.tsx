import { useState } from 'react';
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

  return (
    <div className="w-full h-full flex flex-col">
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded transition-colors"
            title="加粗 (Ctrl+B)"
            onClick={() => {
              const textarea = document.querySelector('textarea');
              if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selectedText = value.substring(start, end);
                const newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
                onChange(newText);
              }
            }}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded transition-colors italic"
            title="斜体 (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded transition-colors"
            title="插入链接"
          >
            🔗
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded transition-colors"
            title="插入图片"
          >
            🖼️
          </button>
          <button
            type="button"
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded transition-colors"
            title="代码块"
          >
            {'</>'}
          </button>
        </div>

        {/* 预览/编辑切换 */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className={`px-3 py-1 rounded transition-colors ${
              !isPreview
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 dark:hover:bg-dark-card'
            }`}
            onClick={() => setIsPreview(false)}
          >
            编辑
          </button>
          <button
            type="button"
            className={`px-3 py-1 rounded transition-colors ${
              isPreview
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100 dark:hover:bg-dark-card'
            }`}
            onClick={() => setIsPreview(true)}
          >
            预览
          </button>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 overflow-hidden">
        {!isPreview ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || '在这里写下你的想法...（支持Markdown语法）'}
            className="w-full h-full p-6 resize-none focus:outline-none bg-white dark:bg-dark-bg"
            style={{ minHeight: '500px' }}
          />
        ) : (
          <div className="h-full overflow-y-auto p-6 prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {value || '*暂无内容*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
