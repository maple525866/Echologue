import { useState, useEffect, useCallback } from 'react';
import { getArticleList } from '@/api/article';
import type { Article } from '@/api/article';
import ArticleCard from '@/components/ArticleCard';
import Header from '@/components/Header';

const Home = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getArticleList({
        page,
        size: pageSize,
        status: 'PUBLISHED',
      });
      setArticles(res.data.records);
      setTotal(res.data.total);
    } catch (error) {
      console.error('加载文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void loadArticles();
  }, [loadArticles]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container-content py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Echologue</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            简洁、优雅的博客写作平台
          </p>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">还没有文章，快去创作吧！</p>
          </div>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center space-x-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            <span className="text-gray-600 dark:text-gray-400">
              第 {page} / {totalPages} 页
            </span>
            
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
