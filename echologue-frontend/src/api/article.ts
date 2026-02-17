import request from '@/utils/request';

// 文章列表查询参数
export interface ArticleQueryParams {
  page: number;
  size: number;
  categoryId?: number;
  tagId?: number;
  status?: string;
}

// 文章信息
export interface Article {
  id: number;
  authorId: number;
  authorName?: string;
  title: string;
  slug?: string;
  summary?: string;
  cover?: string;
  content?: string;
  status: string;
  categoryId?: number;
  categoryName?: string;
  tagIds?: number[];
  tags?: Tag[];
  views: number;
  likes: number;
  commentCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// 标签信息
export interface Tag {
  id: number;
  name: string;
  slug: string;
}

// 分类信息
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

// 分页结果
export interface PageResult<T> {
  records: T[];
  total: number;
  page: number;
  size: number;
  pages?: number;
}

// 创建文章请求参数
export interface CreateArticleParams {
  title: string;
  content: string;
  summary?: string;
  cover?: string;
  categoryId?: number;
  tagIds?: number[];
}

// 更新文章请求参数
export interface UpdateArticleParams extends CreateArticleParams {
  id: number;
}

// 获取文章列表
export const getArticleList = (params: ArticleQueryParams) => {
  return request.get<PageResult<Article>>('/article', { params });
};

// 获取文章详情
export const getArticleDetail = (id: number) => {
  return request.get<Article>(`/article/${id}`);
};

// 创建文章
export const createArticle = (data: CreateArticleParams) => {
  return request.post<number>('/article', data);
};

// 更新文章
export const updateArticle = (id: number, data: CreateArticleParams) => {
  return request.put(`/article/${id}`, data);
};

// 发布文章
export const publishArticle = (id: number) => {
  return request.post(`/article/${id}/publish`);
};

// 删除文章
export const deleteArticle = (id: number) => {
  return request.delete(`/article/${id}`);
};

// 获取分类列表
export const getCategoryList = () => {
  return request.get<Category[]>('/category');
};

// 获取标签列表
export const getTagList = () => {
  return request.get<Tag[]>('/tag');
};
