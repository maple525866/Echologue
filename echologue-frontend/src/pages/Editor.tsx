import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  createArticle,
  updateArticle,
  publishArticle,
  getArticleDetail,
  getCategoryList,
  getTagList,
} from '@/api/article';
import type { Category, Tag } from '@/api/article';
import MarkdownEditor from '@/components/MarkdownEditor';
import Header from '@/components/Header';
import { useUserStore } from '@/store/userStore';

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { checkLogin } = useUserStore();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState('');
  const justCreatedArticleIdRef = useRef<number | null>(null);

  const loadCategoriesAndTags = useCallback(async () => {
    try {
      const [categoryRes, tagRes] = await Promise.all([
        getCategoryList(),
        getTagList(),
      ]);
      setCategories(categoryRes.data);
      setTags(tagRes.data);
    } catch (error) {
      console.error('加载分类标签失败:', error);
    }
  }, []);

  const loadArticle = useCallback(async (articleId: number) => {
    setLoading(true);
    try {
      const res = await getArticleDetail(articleId);
      const article = res.data;
      setLoadError('');
      setTitle(article.title);
      setContent(article.content || '');
      setSummary(article.summary || '');
      setCategoryId(article.categoryId);
      setSelectedTags(article.tagIds || []);
    } catch (error) {
      console.error('加载文章失败:', error);
      setLoadError('草稿加载失败，请稍后重试，当前编辑内容不会丢失。');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveDraft = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      const data = {
        title: title.trim(),
        content,
        summary: summary.trim(),
        categoryId,
        tagIds: selectedTags,
      };

      if (id) {
        await updateArticle(Number(id), data);
      } else {
        const res = await createArticle(data);
        // 创建成功后跳转到编辑页面
        justCreatedArticleIdRef.current = res.data;
        navigate(`/editor/${res.data}`, { replace: true });
      }
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  }, [title, content, summary, categoryId, selectedTags, id, navigate]);

  useEffect(() => {
    // 检查登录状态
    if (!checkLogin()) {
      alert('请先登录');
      navigate('/login');
      return;
    }

    void loadCategoriesAndTags();

    if (id) {
      const currentId = Number(id);
      if (justCreatedArticleIdRef.current === currentId) {
        justCreatedArticleIdRef.current = null;
      } else {
        void loadArticle(currentId);
      }
    }
  }, [id, checkLogin, navigate, loadCategoriesAndTags, loadArticle]);

  // 自动保存（防抖）
  useEffect(() => {
    if (!title.trim() || !content.trim()) return;

    const timer = setTimeout(() => {
      if (!saving) {
        void handleSaveDraft();
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [title, content, summary, categoryId, selectedTags, saving, handleSaveDraft]);

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }

    if (!content.trim()) {
      alert('请输入内容');
      return;
    }

    setLoading(true);
    try {
      const data = {
        title: title.trim(),
        content,
        summary: summary.trim(),
        categoryId,
        tagIds: selectedTags,
      };

      let articleId = id ? Number(id) : null;

      // 如果是新文章，先创建
      if (!articleId) {
        const res = await createArticle(data);
        articleId = res.data;
      } else {
        await updateArticle(articleId, data);
      }

      // 发布文章
      await publishArticle(articleId);

      alert('发布成功！');
      navigate(`/article/${articleId}`);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : '发布失败');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      if (selectedTags.length >= 5) {
        alert('最多只能选择5个标签');
        return;
      }
      setSelectedTags([...selectedTags, tagId]);
    }
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* 顶部操作栏 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                返回
              </button>
              {saving && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  自动保存中...
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSaveDraft}
                disabled={loading || !title.trim() || !content.trim()}
                className="btn btn-secondary"
              >
                保存草稿
              </button>
              <button
                onClick={handlePublish}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? '发布中...' : '发布文章'}
              </button>
            </div>
          </div>

          {loadError && (
            <div className="mb-4 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200">
              {loadError}
            </div>
          )}

          {/* 编辑区域 */}
          <div className="card p-6 space-y-6">
            {/* 标题 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题..."
              className="w-full text-4xl font-bold focus:outline-none bg-transparent"
            />

            {/* 摘要 */}
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="文章摘要（选填）"
              className="w-full h-20 resize-none focus:outline-none bg-transparent text-gray-600 dark:text-gray-400"
            />

            {/* 分类和标签 */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* 分类选择 */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">分类:</label>
                <select
                  value={categoryId || ''}
                  onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-card focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">无分类</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 标签选择 */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">标签:</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        selectedTags.includes(tag.id)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Markdown编辑器 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <MarkdownEditor
                value={content}
                onChange={setContent}
                placeholder="开始写作..."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
