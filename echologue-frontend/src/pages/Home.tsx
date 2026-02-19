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
    <div className="min-h-screen relative z-10">
      <Header />

      <main className="container-content py-16">
        {/* Hero */}
        <div className="mb-14">
          <h1 className="text-3xl font-semibold text-ink-primary tracking-tight mb-2">
            Echologue
          </h1>
          <p className="text-ink-secondary text-sm">
            简洁、优雅的写作空间
          </p>
        </div>

        {/* 文章列表 */}
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <div className="w-6 h-6 rounded-full border-2 border-ink-border border-t-ink-accent animate-spin" />
            <span className="text-sm text-ink-secondary">加载中</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink-secondary text-sm">还没有文章，快去创作吧</p>
          </div>
        ) : (
          <div className="space-y-px">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-3">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="btn btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              上一页
            </button>

            <span className="text-sm text-ink-secondary tabular-nums">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="btn btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
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
