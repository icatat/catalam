'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
import Navigation from '@/components/Navigation';
import { MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { useInviteAccess } from '@/hooks/useInviteAccess';
import { getUnifiedColors } from '@/lib/mui-theme';

export default function BlogPage() {
  const theme = useTheme();
  const colors = getUnifiedColors();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { showRomania, showVietnam } = useInviteAccess();

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', bgcolor: 'background.default' }}>
      {/* Subtle textured background — image only */}
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

      <Navigation currentPage="blog" showRomania={showRomania} showVietnam={showVietnam} />

      <Container maxWidth="xl" sx={{ py: { xs: 8, md: 10 }, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box
          component={motion.div}
          sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            sx={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              color: colors.ornament.main,
              fontSize: '1.25rem',
              letterSpacing: '0.4em',
              mb: 2,
            }}
          >
            ·   ·   ·
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: '"Arizonia", cursive',
              color: theme.palette.primary.dark,
              fontWeight: 400,
              mb: 1.5,
              fontSize: { xs: '3.5rem', md: '5rem' },
              lineHeight: 1.05,
            }}
          >
            Travel Blog
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Thasadith", sans-serif',
              color: colors.accent.dark,
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.32em',
            }}
          >
            Notes from the road
          </Typography>
        </Box>

        {/* Blog Posts Grid */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  color: theme.palette.text.secondary,
                  fontSize: '1.1rem',
                }}
              >
                Loading…
              </Typography>
            </Box>
          ) : posts.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: { xs: 4, md: 5 },
                maxWidth: 1280,
                mx: 'auto',
              }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 4px 8px rgba(32, 72, 91, 0.06), 0 24px 40px -16px rgba(32, 72, 91, 0.22)',
                        },
                      }}
                    >
                      {post.image && (
                        <CardMedia
                          component="img"
                          height="260"
                          image={post.image}
                          alt={post.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: { xs: 3, md: 3.5 } }}>
                        {/* Date eyebrow */}
                        {post.date && (
                          <Typography
                            sx={{
                              fontFamily: '"Thasadith", sans-serif',
                              color: colors.accent.dark,
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.3em',
                              mb: 1.25,
                            }}
                          >
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                            })}
                          </Typography>
                        )}

                        <Typography
                          component="h2"
                          sx={{
                            fontFamily: '"Cormorant Garamond", serif',
                            fontWeight: 500,
                            color: theme.palette.primary.dark,
                            fontSize: '1.6rem',
                            lineHeight: 1.2,
                            mb: 1.5,
                            letterSpacing: '-0.005em',
                          }}
                        >
                          {post.title}
                        </Typography>

                        {post.excerpt && (
                          <Typography
                            sx={{
                              fontFamily: '"Cormorant Garamond", serif',
                              fontStyle: 'italic',
                              color: theme.palette.text.primary,
                              fontSize: '1.05rem',
                              lineHeight: 1.55,
                              mb: 2.5,
                            }}
                          >
                            {post.excerpt}
                          </Typography>
                        )}

                        {/* Location */}
                        {post.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: post.tags && post.tags.length > 0 ? 2 : 0 }}>
                            <MapPin size={13} color={colors.accent.main} />
                            <Typography
                              sx={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontStyle: 'italic',
                                color: theme.palette.text.secondary,
                                fontSize: '0.95rem',
                              }}
                            >
                              {post.location}
                            </Typography>
                          </Box>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                            {post.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  bgcolor: colors.ornament.light,
                                  color: colors.ornament.dark,
                                  fontFamily: '"Thasadith", sans-serif',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  letterSpacing: '0.15em',
                                  textTransform: 'uppercase',
                                  height: 22,
                                  border: 'none',
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 10 }}>
              <Calendar
                size={36}
                style={{
                  color: colors.accent.main,
                  marginBottom: theme.spacing(3),
                  strokeWidth: 1.25,
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontStyle: 'italic',
                  color: theme.palette.primary.dark,
                  fontSize: { xs: '1.5rem', md: '1.75rem' },
                  fontWeight: 500,
                  mb: 1.5,
                  textAlign: 'center',
                }}
              >
                No posts yet
              </Typography>
              <Typography
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 420,
                }}
              >
                Check back soon for travel stories and adventures.
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
