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
    <div className="prose-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ inline, className, children, ...props }: MarkdownCodeProps) {
            return !inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <code {...props}>
                {children}
              </code>
            );
          },
          img({ ...props }: MarkdownImgProps) {
            return (
              <img
                {...props}
                alt={props.alt || ''}
              />
            );
          },
          a({ ...props }: MarkdownAnchorProps) {
            return (
              <a
                {...props}
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
