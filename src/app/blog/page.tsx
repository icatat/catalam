'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box, useTheme, Container, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
import Navigation from '@/components/Navigation';
import { MapPin, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { useInviteAccess } from '@/hooks/useInviteAccess';

export default function BlogPage() {
  const theme = useTheme();
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
      console.log(data);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

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
        {/* Header */}
        <Box
          component={motion.div}
          sx={{ textAlign: 'center', mb: 8 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 3
            }}
          >
            Travel Blog
          </Typography>
        </Box>

        {/* Blog Posts Grid */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography variant="body1" sx={{ color: theme.palette.text.secondary }}>
                Loading posts...
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
                gap: 4,
              }}
            >
              {posts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
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
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: theme.shadows[12],
                        },
                      }}
                    >
                      {post.image && (
                        <CardMedia
                          component="img"
                          height="240"
                          image={post.image}
                          alt={post.title}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h5"
                          component="h2"
                          gutterBottom
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            mb: 2,
                          }}
                        >
                          {post.title}
                        </Typography>

                        {post.excerpt && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              mb: 2,
                              lineHeight: 1.6,
                            }}
                          >
                            {post.excerpt}
                          </Typography>
                        )}

                        {/* Metadata */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                          {post.date && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Calendar size={16} color={theme.palette.text.secondary} />
                              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
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
                              <MapPin size={16} color={theme.palette.text.secondary} />
                              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                                {post.location}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {post.tags.map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.primary.light,
                                  color: theme.palette.primary.dark,
                                  fontWeight: 500,
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <Tag
                size={48}
                style={{
                  color: theme.palette.primary.main,
                  marginBottom: theme.spacing(2)
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: theme.palette.text.primary,
                  mb: 2,
                  textAlign: 'center'
                }}
              >
                No blog posts yet
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  textAlign: 'center',
                  maxWidth: 400
                }}
              >
                Check back soon for travel stories and adventures!
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
