'use client';

import { useState, createContext, useContext, ReactNode } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  IconButton,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Info,
  Email,
  Favorite,
} from '@mui/icons-material';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationData {
  message: string;
  type: NotificationType;
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  showNotification: (data: NotificationData) => void;
  showRSVPSuccess: (name: string, location: string) => void;
  showEmailSent: (email: string) => void;
  showError: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<NotificationData | null>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const showNotification = (data: NotificationData) => {
    setNotification(data);
    setOpen(true);
  };

  const showRSVPSuccess = (name: string, location: string) => {
    showNotification({
      type: 'success',
      title: 'RSVP Confirmed!',
      message: `Thank you, ${name}! Your RSVP for ${location} has been confirmed.`,
      duration: 6000,
    });
  };

  const showEmailSent = (email: string) => {
    showNotification({
      type: 'info',
      title: 'Email Sent!',
      message: `Confirmation email sent to ${email}`,
      duration: 4000,
    });
  };

  const showError = (message: string) => {
    showNotification({
      type: 'error',
      title: 'Error',
      message,
      duration: 5000,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <Warning />;
      case 'info':
        return <Info />;
    }
  };

  const getWeddingIcon = (title?: string) => {
    if (title?.includes('RSVP')) return <Favorite sx={{ mr: 1 }} />;
    if (title?.includes('Email')) return <Email sx={{ mr: 1 }} />;
    return null;
  };

  return (
    <NotificationContext.Provider value={{
      showNotification,
      showRSVPSuccess,
      showEmailSent,
      showError,
    }}>
      {children}
      
      {notification && (
        <Snackbar
          open={open}
          autoHideDuration={notification.duration || 4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Slide}
          sx={{
            '& .MuiSnackbarContent-root': {
              padding: 0,
            },
          }}
        >
          <Alert
            severity={notification.type}
            onClose={handleClose}
            icon={getIcon(notification.type)}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              '& .MuiAlert-icon': {
                fontSize: '1.5rem',
              },
              '& .MuiAlert-action': {
                padding: 0,
              },
            }}
            action={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {notification.action && (
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontWeight: 600,
                      '&:hover': {
                        opacity: 0.8,
                      },
                    }}
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </Typography>
                )}
                <IconButton
                  size="small"
                  onClick={handleClose}
                  sx={{ color: 'inherit' }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            }
          >
            {notification.title && (
              <AlertTitle sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                {getWeddingIcon(notification.title)}
                {notification.title}
              </AlertTitle>
            )}
            <Typography variant="body2">
              {notification.message}
            </Typography>
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
}