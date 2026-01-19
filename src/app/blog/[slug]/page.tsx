'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Chip, IconButton } from '@mui/material';
import { MainPageCard } from '@/components/MainPageCard';
import Navigation from '@/components/Navigation';
import { MapPin, Calendar, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { LinkPreview } from '@/components/LinkPreview';
import { AutoLinkPreview } from '@/components/AutoLinkPreview';
import { useInviteAccess } from '@/hooks/useInviteAccess';

export default function BlogPostPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { showRomania, showVietnam } = useInviteAccess();

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug);
    }
  }, [slug]);

  const fetchBlogPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/background-main.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          backgroundAttachment: 'fixed',
        }}
      >
        <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/background-main.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'contain',
          backgroundAttachment: 'fixed',
          p: { xs: theme.spacing(2), md: theme.spacing(3) },
          position: 'relative'
        }}
      >
        <Navigation currentPage="blog" showRomania={showRomania} showVietnam={showVietnam} />
        <Container maxWidth="xl" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" sx={{ color: theme.palette.text.primary, mb: 2 }}>
              Post not found
            </Typography>
            <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
              The blog post you are looking for does not exist.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}25 0%, ${theme.palette.primary.light}20 25%, ${theme.palette.primary.light}30 50%, ${theme.palette.primary.light}15 75%, ${theme.palette.primary.light}20 100%), url(/background-main.png)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        backgroundAttachment: 'fixed',
        p: { xs: theme.spacing(2), md: theme.spacing(3) },
        position: 'relative'
      }}
    >

      <Navigation currentPage="blog" showRomania={showRomania} showVietnam={showVietnam} />

      <Container maxWidth="md" sx={{ py: 10 }}>
        {/* Back Button */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ mb: 4 }}
        >
          <IconButton
            onClick={() => router.push('/blog')}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '30',
              },
            }}
          >
            <ArrowLeft size={24} />
          </IconButton>
        </Box>

        {/* Featured Image */}
        {post.image && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              mb: 4,
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: theme.shadows[8],
              position: 'relative',
              height: { xs: 300, sm: 400, md: 500 },
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
        )}

        {/* Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{ mb: 4 }}
        >
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 3,
            }}
          >
            {post.title}
          </Typography>

          {/* Metadata */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {post.date && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
              </Box>
            )}
            {post.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={18} color={theme.palette.text.secondary} />
                <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                  {post.location}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  sx={{
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.dark,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Content */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            boxShadow: theme.shadows[4],
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 2,
              my: 2,
            },
            '& iframe': {
              maxWidth: '100%',
              borderRadius: 2,
              my: 2,
            },
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: theme.palette.primary.main,
              fontWeight: 600,
              mt: 3,
              mb: 2,
            },
            '& p': {
              color: theme.palette.text.primary,
              lineHeight: 1.8,
              mb: 2,
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              '&:hover': {
                color: theme.palette.primary.dark,
              },
            },
            '& ul, & ol': {
              color: theme.palette.text.primary,
              lineHeight: 1.8,
              pl: 3,
              mb: 2,
            },
            '& blockquote': {
              borderLeft: `4px solid ${theme.palette.primary.main}`,
              pl: 2,
              ml: 0,
              my: 2,
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
            },
            '& code': {
              backgroundColor: theme.palette.grey[100],
              padding: '2px 6px',
              borderRadius: 1,
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: theme.palette.grey[100],
              p: 2,
              borderRadius: 2,
              overflow: 'auto',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
          }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {post.content}
          </ReactMarkdown>
          <AutoLinkPreview />
        </Box>
      </Container>
    </Box>
  );
}
