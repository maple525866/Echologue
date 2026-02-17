import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { ComponentPropsWithoutRef } from 'react';
import type { ExtraProps } from 'react-markdown';
import 'highlight.js/styles/github-dark.css';

interface MarkdownViewerProps {
  content: string;
}

type MarkdownCodeProps = ComponentPropsWithoutRef<'code'> & ExtraProps & {
  inline?: boolean;
};
type MarkdownImgProps = ComponentPropsWithoutRef<'img'> & ExtraProps;
type MarkdownAnchorProps = ComponentPropsWithoutRef<'a'> & ExtraProps;

const MarkdownViewer = ({ content }: MarkdownViewerProps) => {
  return (
    <div className="prose dark:prose-invert max-w-none prose-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 自定义代码块样式
          code({ inline, className, children, ...props }: MarkdownCodeProps) {
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code
                className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-dark-card text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          // 自定义图片样式
          img({ ...props }: MarkdownImgProps) {
            return (
              <img
                {...props}
                className="rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow"
                alt={props.alt || ''}
              />
            );
          },
          // 自定义链接样式
          a({ ...props }: MarkdownAnchorProps) {
            return (
              <a
                {...props}
                className="text-primary hover:text-primary-dark underline"
                target="_blank"
                rel="noopener noreferrer"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
