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
      alert('文章加载失败');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (id) {
      void loadArticle(Number(id));
    }
  }, [id, loadArticle]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEdit = () => {
    navigate(`/editor/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
        <Header />
        <div className="container-content py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  // 检查是否是作者
  const isAuthor = userInfo && userInfo.id === article.authorId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-content py-12">
        <article className="card p-12 max-w-4xl mx-auto">
          {/* 文章头部 */}
          <header className="mb-12 pb-8 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {article.title}
            </h1>
            
            {/* 文章元信息 */}
            <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-6">
                {/* 作者 */}
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    {(article.authorName || '匿名').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {article.authorName || '匿名'}
                    </p>
                    <p className="text-sm">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="flex items-center space-x-6 text-sm">
                <span className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <span className="flex items-center space-x-1">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            {article.tagIds && article.tagIds.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {article.tagIds.map((tagId) => (
                  <span
                    key={tagId}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-400"
                  >
                    #标签{tagId}
                  </span>
                ))}
              </div>
            )}

            {/* 编辑按钮（仅作者可见） */}
            {isAuthor && (
              <div className="mt-6">
                <button onClick={handleEdit} className="btn btn-primary">
                  编辑文章
                </button>
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <div className="article-content">
            <MarkdownViewer content={article.content || ''} />
          </div>

          {/* 文章底部 */}
          <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center space-x-4">
              <button className="btn btn-secondary flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>点赞</span>
              </button>
              <button className="btn btn-secondary flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <span>收藏</span>
              </button>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetail;
