'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Chip, IconButton } from '@mui/material';
import Navigation from '@/components/Navigation';
import { MapPin, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { AutoLinkPreview } from '@/components/AutoLinkPreview';
import { useInviteAccess } from '@/hooks/useInviteAccess';
import { getUnifiedColors } from '@/lib/mui-theme';

function BackgroundTexture() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(/background-main.webp)`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'contain',
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default function BlogPostPage() {
  const theme = useTheme();
  const colors = getUnifiedColors();
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
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <BackgroundTexture />
        <Typography
          sx={{
            fontFamily: '"Cormorant Garamond", serif',
            fontStyle: 'italic',
            color: theme.palette.text.secondary,
            fontSize: '1.1rem',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Loading…
        </Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: 'background.default' }}>
        <BackgroundTexture />
        <Navigation currentPage="blog" showRomania={showRomania} showVietnam={showVietnam} />
        <Container maxWidth="md" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography
              sx={{
                fontFamily: '"Cormorant Garamond", serif',
                fontStyle: 'italic',
                color: theme.palette.primary.dark,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontWeight: 500,
                mb: 2,
              }}
            >
              Post not found
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              The blog post you are looking for does not exist.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: 'background.default' }}>
      <BackgroundTexture />
      <Navigation currentPage="blog" showRomania={showRomania} showVietnam={showVietnam} />

      <Container maxWidth="md" sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
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
            sx={{ color: theme.palette.primary.dark }}
            aria-label="Back to blog"
          >
            <ArrowLeft size={22} />
          </IconButton>
        </Box>

        {/* Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ textAlign: 'center', mb: { xs: 5, md: 7 } }}
        >
          {/* Date eyebrow */}
          {post.date && (
            <Typography
              sx={{
                fontFamily: '"Thasadith", sans-serif',
                color: colors.accent.dark,
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.32em',
                mb: 2,
              }}
            >
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          )}

          {/* Title */}
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              color: theme.palette.primary.dark,
              fontWeight: 500,
              fontSize: { xs: '2.25rem', md: '3.25rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              mb: post.location || (post.tags && post.tags.length > 0) ? 2.5 : 0,
            }}
          >
            {post.title}
          </Typography>

          {/* Location */}
          {post.location && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mb: post.tags && post.tags.length > 0 ? 2 : 0 }}>
              <MapPin size={14} style={{ color: colors.accent.main }} />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                }}
              >
                {post.location}
              </Typography>
            </Box>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, justifyContent: 'center' }}>
              {post.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    bgcolor: colors.ornament.light,
                    color: colors.ornament.dark,
                    fontFamily: '"Thasadith", sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    height: 24,
                    border: 'none',
                  }}
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Featured Image */}
        {post.image && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            sx={{
              mb: { xs: 5, md: 7 },
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 16px 36px -16px rgba(32, 72, 91, 0.24)',
              position: 'relative',
              height: { xs: 280, sm: 400, md: 520 },
            }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </Box>
        )}

        {/* Content */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '12px',
            p: { xs: 3.5, md: 6 },
            border: '1px solid rgba(32, 72, 91, 0.08)',
            boxShadow: '0 1px 2px rgba(32, 72, 91, 0.04), 0 12px 28px -16px rgba(32, 72, 91, 0.18)',
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
              my: 2.5,
              display: 'block',
            },
            '& iframe': {
              maxWidth: '100%',
              borderRadius: 1,
              my: 2.5,
            },
            '& h1, & h2, & h3': {
              fontFamily: '"Cormorant Garamond", serif',
              color: theme.palette.primary.dark,
              fontWeight: 500,
              mt: 4,
              mb: 1.5,
              lineHeight: 1.2,
              '&:first-of-type': { mt: 0 },
            },
            '& h2': { fontSize: { xs: '1.6rem', md: '2rem' } },
            '& h3': { fontSize: { xs: '1.3rem', md: '1.55rem' } },
            '& h4, & h5, & h6': {
              fontFamily: '"Thasadith", sans-serif',
              color: theme.palette.primary.dark,
              fontWeight: 700,
              fontSize: { xs: '1rem', md: '1.05rem' },
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              mt: 3,
              mb: 1,
            },
            '& p': {
              fontFamily: '"Thasadith", sans-serif',
              color: theme.palette.text.primary,
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              mb: 1.75,
            },
            '& p:first-of-type::first-letter': {
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '3.5rem',
              fontWeight: 500,
              float: 'left',
              lineHeight: 0.9,
              paddingRight: '8px',
              paddingTop: '6px',
              color: colors.accent.dark,
            },
            '& a': {
              color: colors.accent.main,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(184, 136, 128, 0.4)',
              textUnderlineOffset: '3px',
              '&:hover': { color: colors.accent.dark, textDecorationColor: colors.accent.dark },
            },
            '& ul, & ol': {
              color: theme.palette.text.primary,
              fontSize: '1.0625rem',
              lineHeight: 1.7,
              pl: 3,
              mb: 2,
              '& li': { mb: 0.5 },
            },
            '& blockquote': {
              borderLeft: `3px solid ${colors.accent.main}`,
              pl: 2.5,
              ml: 0,
              my: 3,
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontSize: '1.25rem',
              lineHeight: 1.5,
              color: theme.palette.text.secondary,
            },
            '& hr': {
              border: 'none',
              borderTop: `1px solid ${colors.ornament.light}`,
              my: 4,
            },
            '& code': {
              backgroundColor: '#f5f1ed',
              padding: '2px 6px',
              borderRadius: 1,
              fontSize: '0.9em',
              fontFamily: 'monospace',
            },
            '& pre': {
              backgroundColor: '#f5f1ed',
              p: 2,
              borderRadius: 1,
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
