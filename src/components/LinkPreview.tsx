'use client';

import { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, useTheme, Link as MuiLink, Skeleton } from '@mui/material';
import { ExternalLink } from 'lucide-react';

interface LinkPreviewProps {
  url: string;
  title?: string;
  description?: string;
  image?: string;
}

export function LinkPreview({ url, title, description, image }: LinkPreviewProps) {
  const theme = useTheme();
  const [loading, setLoading] = useState(!title && !description && !image);
  const [previewData, setPreviewData] = useState({
    title: title || '',
    description: description || '',
    image: image || '',
    url: url,
    domain: ''
  });

  useEffect(() => {
    // If all data is provided, don't fetch
    if (title && description && image) {
      setPreviewData({
        title,
        description,
        image,
        url,
        domain: new URL(url).hostname
      });
      setLoading(false);
      return;
    }

    // Fetch preview data from API
    const fetchPreview = async () => {
      try {
        const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch preview');

        const data = await response.json();
        setPreviewData({
          title: data.title || url,
          description: data.description || '',
          image: data.image || '',
          url: data.url || url,
          domain: data.domain || new URL(url).hostname
        });
      } catch (error) {
        console.error('Error fetching link preview:', error);
        setPreviewData({
          title: url,
          description: '',
          image: '',
          url: url,
          domain: new URL(url).hostname
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url, title, description, image]);

  if (loading) {
    return (
      <Box sx={{ my: 3 }}>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Skeleton variant="rectangular" sx={{ width: { xs: '100%', sm: 180 }, height: { xs: 200, sm: 120 } }} />
          <CardContent sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" height={30} />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="60%" />
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <MuiLink
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ textDecoration: 'none', display: 'block', my: 3 }}
    >
      <Card
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          transition: 'all 0.3s ease',
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
          '&:hover': {
            boxShadow: theme.shadows[8],
            transform: 'translateY(-2px)',
          },
        }}
      >
        {previewData.image && (
          <CardMedia
            component="img"
            sx={{
              width: { xs: '100%', sm: 180 },
              height: { xs: 200, sm: 120 },
              objectFit: 'cover',
              flexShrink: 0,
            }}
            image={previewData.image}
            alt={previewData.title}
          />
        )}
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2 }}>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 0.5,
            }}
          >
            {previewData.title}
          </Typography>
          {previewData.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1,
                fontSize: '0.85rem',
              }}
            >
              {previewData.description}
            </Typography>
          )}
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem' }}>
            {previewData.domain}
          </Typography>
        </CardContent>
      </Card>
    </MuiLink>
  );
}
