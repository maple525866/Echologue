import { Link } from 'react-router-dom';
import type { Article } from '@/api/article';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link to={`/article/${article.id}`}>
      <article className="card p-6 cursor-pointer">
        {/* 标题 */}
        <h2 className="text-2xl font-bold mb-3 hover:text-primary transition-colors">
          {article.title}
        </h2>

        {/* 摘要 */}
        {article.summary && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {article.summary}
          </p>
        )}

        {/* 元信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {/* 作者 */}
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{article.authorName || '匿名'}</span>
            </span>

            {/* 发布时间 */}
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{formatDate(article.publishedAt || article.createdAt)}</span>
            </span>
          </div>

          {/* 统计信息 */}
          <div className="flex items-center space-x-4">
            {/* 浏览量 */}
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{article.views}</span>
            </span>

            {/* 点赞数 */}
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{article.likes}</span>
            </span>
          </div>
        </div>

        {/* 标签 */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
};

export default ArticleCard;
