import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleDetail } from '@/api/article';
import type { Article } from '@/api/article';
import MarkdownViewer from '@/components/MarkdownViewer';
import Header from '@/components/Header';
import { useUserStore } from '@/store/userStore';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userInfo } = useUserStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const loadArticle = useCallback(async (articleId: number) => {
    setLoading(true);
    try {
      const res = await getArticleDetail(articleId);
      setArticle(res.data);
    } catch (error) {
      console.error('加载文章失败:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (id) void loadArticle(Number(id));
  }, [id, loadArticle]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-base">
        <Header />
        <div className="container-content py-20 flex flex-col items-center gap-4">
          <div className="w-6 h-6 rounded-full border-2 border-ink-border border-t-ink-accent animate-spin" />
          <span className="text-sm text-ink-secondary">加载中</span>
        </div>
      </div>
    );
  }

  if (!article) return null;

  const isAuthor = userInfo && userInfo.id === article.authorId;

  return (
    <div className="min-h-screen bg-ink-base">
      <Header />

      <main className="container-content py-14">
        <article>
          {/* 文章头部 */}
          <header className="mb-10 pb-8 border-b border-ink-border">
            <h1 className="text-3xl font-semibold text-ink-primary leading-tight mb-6 tracking-tight">
              {article.title}
            </h1>

            {/* 元信息 */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-ink-accent flex items-center justify-center text-xs font-semibold text-ink-base shrink-0">
                  {(article.authorName || '匿名').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-primary leading-none mb-1">
                    {article.authorName || '匿名'}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {formatDate(article.publishedAt || article.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-ink-secondary">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {article.views}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {article.likes}
                </span>
              </div>
            </div>

            {/* 标签 */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-1.5">
                {article.tags.map((tag) => (
                  <span key={tag.id} className="tag">{tag.name}</span>
                ))}
              </div>
            )}

            {/* 编辑按钮 */}
            {isAuthor && (
              <div className="mt-6">
                <button
                  onClick={() => navigate(`/editor/${id}`)}
                  className="btn btn-secondary text-sm"
                >
                  编辑文章
                </button>
              </div>
            )}
          </header>

          {/* 正文 */}
          <div className="article-content">
            <MarkdownViewer content={article.content || ''} />
          </div>

          {/* 文章底部操作 */}
          <footer className="mt-14 pt-8 border-t border-ink-border">
            <div className="flex items-center gap-3">
              <button className="btn btn-secondary flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                点赞
              </button>
              <button className="btn btn-secondary flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
                收藏
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetail;
