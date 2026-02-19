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
      const [categoryRes, tagRes] = await Promise.all([getCategoryList(), getTagList()]);
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
    if (!checkLogin()) {
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

  useEffect(() => {
    if (!title.trim() || !content.trim()) return;
    const timer = setTimeout(() => {
      if (!saving) void handleSaveDraft();
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, content, summary, categoryId, selectedTags, saving, handleSaveDraft]);

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) return;
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
      if (!articleId) {
        const res = await createArticle(data);
        articleId = res.data;
      } else {
        await updateArticle(articleId, data);
      }
      await publishArticle(articleId);
      navigate(`/article/${articleId}`);
    } catch (error: unknown) {
      console.error('发布失败:', error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagId: number) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagId));
    } else {
      if (selectedTags.length >= 5) return;
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  if (loading && !title) {
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

  return (
    <div className="min-h-screen bg-ink-base">
      <Header />

      <main className="mx-auto max-w-4xl py-8 px-4">
        {/* 顶部操作栏 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="btn btn-ghost text-sm">
              ← 返回
            </button>
            {saving && (
              <span className="text-xs text-ink-secondary">正在保存…</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveDraft}
              disabled={loading || !title.trim() || !content.trim()}
              className="btn btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              保存草稿
            </button>
            <button
              onClick={handlePublish}
              disabled={loading || !title.trim() || !content.trim()}
              className="btn btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '发布中…' : '发布'}
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-[#2a2010] border border-[#4a3a20] text-[#d4a84b] text-sm">
            {loadError}
          </div>
        )}

        {/* 编辑主区域 */}
        <div className="bg-ink-surface rounded-xl border border-ink-border overflow-hidden">
          {/* 标题 */}
          <div className="px-6 pt-6 pb-4 border-b border-ink-border">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="文章标题"
              className="w-full text-2xl font-semibold bg-transparent focus:outline-none text-ink-primary placeholder:text-ink-secondary tracking-tight"
            />
          </div>

          {/* 摘要 */}
          <div className="px-6 py-3 border-b border-ink-border">
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="添加摘要（选填）"
              rows={2}
              className="w-full resize-none bg-transparent focus:outline-none text-sm text-ink-secondary placeholder:text-ink-secondary leading-relaxed"
            />
          </div>

          {/* 分类 & 标签 */}
          <div className="px-6 py-3 border-b border-ink-border flex flex-wrap items-center gap-4">
            {/* 分类 */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-ink-secondary">分类</span>
              <select
                value={categoryId ?? ''}
                onChange={(e) => setCategoryId(Number(e.target.value) || undefined)}
                className="text-xs bg-ink-hover text-ink-secondary border border-ink-border rounded px-2 py-1 focus:outline-none focus:border-ink-accent transition-colors"
              >
                <option value="">无分类</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* 标签 */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-ink-secondary">标签</span>
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`text-xs px-2.5 py-0.5 rounded border transition-colors duration-150 cursor-pointer ${
                      selectedTags.includes(tag.id)
                        ? 'bg-ink-accent border-ink-accent text-ink-base'
                        : 'bg-transparent border-ink-border text-ink-secondary hover:border-[#3e3e3e] hover:text-ink-primary'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Markdown 编辑器 */}
          <div className="p-4">
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="开始写作…"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Editor;
