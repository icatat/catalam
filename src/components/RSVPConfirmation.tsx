'use client';

import { useState } from 'react';
import { Location } from '@/models/RSVP';
import CustomButton from '@/components/Button';
import { Edit, RefreshCcw } from 'lucide-react';
import { Box, Card, CardContent, Typography, useTheme, Avatar } from '@mui/material';
import { CheckCircleOutline, Cancel, EmailOutlined } from '@mui/icons-material';
import { getUnifiedColors } from '@/lib/mui-theme';
import Cookies from 'js-cookie';

interface RSVPConfirmationProps {
  isVisible: boolean;
  attending: boolean;
  guestName: string;
  email: string;
  location: Location;
  onModify: () => void;
  onClose: () => void;
  onSubmitAnother?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
  emailSent?: boolean;
}

export default function RSVPConfirmation({
  isVisible,
  attending,
  guestName,
  email,
  location,
  onModify,
  onClose,
  onSubmitAnother,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  variant = 'primary', // Keep parameter but we don't use it for colors anymore
  emailSent = false
}: RSVPConfirmationProps) {
  const theme = useTheme();
  const [showEmailDetails, setShowEmailDetails] = useState(false);

  if (!isVisible) return null;

  const handleSubmitAnother = () => {
    // Clear the invite_id cookie to allow fresh RSVP
    Cookies.remove('invite_id');
    
    // Call the parent callback if provided
    if (onSubmitAnother) {
      onSubmitAnother();
    } else {
      // Default behavior: reload the page to start fresh
      window.location.reload();
    }
  };

  const locationName = location === Location.ROMANIA ? 'Romania' : 'Vietnam';
  const colors = getUnifiedColors();
  // Use unified colors for all variants
  const variantColors = {
    primary: colors.primary.main,
    light: colors.primary.light,
  };

  return (
    <Box 
      sx={{ 
        position: 'fixed', 
        inset: 0, 
        bgcolor: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 50, 
        p: 2 
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 3, boxShadow: theme.shadows[8] }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          {/* Header with status icon */}
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              bgcolor: attending ? variantColors.primary : theme.palette.grey[400], 
              mx: 'auto', 
              mb: 3 
            }}
          >
            {attending ? (
              <CheckCircleOutline sx={{ fontSize: '2rem', color: 'white' }} />
            ) : (
              <Cancel sx={{ fontSize: '2rem', color: 'white' }} />
            )}
          </Avatar>

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ color: attending ? variantColors.primary : theme.palette.text.primary, fontWeight: 600 }}
          >
            {attending
              ? 'RSVP Confirmed!'
              : 'RSVP Updated!'
            }
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ color: theme.palette.text.secondary, mb: 3 }}
          >
            {attending 
              ? `Thank you, ${guestName}! We're so excited to celebrate with you in ${locationName}!`
              : `Thank you for letting us know, ${guestName}. We'll miss you at our ${locationName} celebration.`
            }
          </Typography>

          {/* Email confirmation section */}
          <Card sx={{ bgcolor: theme.palette.grey[50], mb: 3 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <EmailOutlined 
                  sx={{ 
                    mr: 1, 
                    color: emailSent ? theme.palette.success.main : theme.palette.warning.main,
                    fontSize: '1.25rem'
                  }} 
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: emailSent ? theme.palette.success.dark : theme.palette.warning.dark,
                    fontWeight: 500
                  }}
                >
                  {emailSent 
                    ? 'Email sent!'
                    : 'Sending email...'
                  }
                </Typography>
              </Box>
              
              <Typography
                component="button"
                variant="body2"
                onClick={() => setShowEmailDetails(!showEmailDetails)}
                sx={{ 
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  '&:hover': { color: theme.palette.primary.dark }
                }}
              >
                {showEmailDetails ? 'Hide Details' : 'Email Details'}
              </Typography>

              {showEmailDetails && (
                <Box sx={{ mt: 2, textAlign: 'left' }}>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    <strong>{'To'}:</strong> {email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    <strong>{'Subject'}:</strong> Wedding RSVP Confirmation - {locationName}
                  </Typography>
                  {emailSent ? (
                    <Typography variant="body2" sx={{ color: theme.palette.success.main, mt: 1 }}>
                      ✓ {'Check your inbox'}
                    </Typography>
                  ) : (
                    <Typography variant="body2" sx={{ color: theme.palette.warning.main, mt: 1 }}>
                      ⏳ {'Email may take a few minutes'}
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CustomButton
                onClick={onModify}
                variant="outlined"
                size="medium"
                weddingVariant="primary"
                sx={{ flex: 1 }}
                startIcon={<Edit />}
              >
                {'Modify RSVP'}
              </CustomButton>
              <CustomButton
                onClick={onClose}
                variant="contained"
                size="medium"
                weddingVariant="primary"
                sx={{ flex: 1 }}
              >
                {'Done'}
              </CustomButton>
            </Box>
            
            {/* Submit Another Answer button */}
            <CustomButton
              onClick={handleSubmitAnother}
              variant="text"
              size="small"
              weddingVariant="primary"
              startIcon={<RefreshCcw />}
              sx={{
                fontSize: '0.875rem',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover
                }
              }}
            >
              {'Submit Another RSVP'}
            </CustomButton>
          </Box>

          {/* Contact info */}
          <Typography variant="body2" sx={{ color: theme.palette.text.disabled, mt: 2 }}>
            {'Have questions?'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}