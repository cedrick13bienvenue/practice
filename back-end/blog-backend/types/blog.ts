export interface BlogInterface {
  _id: string;
  slug: string;
  title: string;
  author: string;
  content: string;
  description: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null | undefined;
}

export interface InterfaceAddBlog extends Omit<BlogInterface, '_id' | 'slug' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface GetAllBlogs {
  blogs: BlogInterface[];
}
