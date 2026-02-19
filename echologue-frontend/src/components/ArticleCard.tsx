import { Link } from 'react-router-dom';
import type { Article } from '@/api/article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/article/${article.id}`} className="block group">
      <article className="py-6 border-b border-ink-border last:border-0 cursor-pointer">
        {/* 标题 */}
        <h2 className="text-base font-medium text-ink-primary mb-2 group-hover:text-ink-accent transition-colors duration-200 leading-snug">
          {article.title}
        </h2>

        {/* 摘要 */}
        {article.summary && (
          <p className="text-sm text-ink-secondary mb-3 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        )}

        {/* 元信息行 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-ink-secondary">
            {/* 作者 */}
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              {article.authorName || '匿名'}
            </span>

            {/* 时间 */}
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              {formatDate(article.publishedAt || article.createdAt)}
            </span>
          </div>

          {/* 统计 */}
          <div className="flex items-center gap-3 text-xs text-ink-secondary">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {article.views}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {article.likes}
            </span>
          </div>
        </div>

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
};

export default ArticleCard;
