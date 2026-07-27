import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogPostMetadata } from '@/types/blog';

const postsDirectory = path.join(process.cwd(), 'src/content/blog');

export function getAllPosts(): BlogPost[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      console.log(slug);
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        content,
        title: data.title || '',
        date: data.date || '',
        location: data.location || '',
        tags: data.tags || [],
        image: data.image || '',
        excerpt: data.excerpt || '',
      } as BlogPost;
    });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug,
      content,
      title: data.title || '',
      date: data.date || '',
      location: data.location || '',
      tags: data.tags || [],
      image: data.image || '',
      excerpt: data.excerpt || '',
    } as BlogPost;
  } catch (error) {
    return null;
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fileName.replace(/\.md$/, ''));
}
