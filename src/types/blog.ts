export interface BlogPostMetadata {
  title: string;
  date: string;
  location: string;
  tags: string[];
  image: string;
  excerpt?: string;
}

export interface BlogPost extends BlogPostMetadata {
  slug: string;
  content: string;
}
