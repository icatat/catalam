'use client';

import { FormControl, Select, MenuItem, Box, Typography, SelectChangeEvent, useTheme } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useLanguage, type Language } from '@/contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  { code: 'ro' as Language, name: 'Română', flag: '🇷🇴' },
  { code: 'vi' as Language, name: 'Tiếng Việt', flag: '🇻🇳' }
];

interface LanguageToggleProps {
  variant?: 'navigation' | 'subtle';
  size?: 'small' | 'medium';
}

export default function LanguageToggle({ 
  variant = 'navigation', 
  size = 'medium' 
}: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const theme = useTheme();

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as Language);
  };

  return (
    <FormControl size={size}>
      <Select
        value={language}
        onChange={handleLanguageChange}
        displayEmpty
        IconComponent={ExpandMore}
        renderValue={() => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontSize: '1.1em' }}>{currentLanguage.flag}</span>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {currentLanguage.name}
            </Typography>
          </Box>
        )}
        sx={{
          minWidth: 140,
          height: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          color: theme.palette.primary.main,
          fontWeight: 600,
          fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            boxShadow: theme.shadows[4],
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            paddingY: 1,
            paddingX: 2,
          },
          '& .MuiSelect-icon': {
            color: 'rgba(0, 0, 0, 0.54)',
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              mt: 1,
            }
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem 
            key={lang.code} 
            value={lang.code}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 1.5,
              px: 2,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.main',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
            }}
          >
            <span style={{ fontSize: '1.1em' }}>{lang.flag}</span>
            <Typography variant="body2" sx={{ fontWeight: 'inherit' }}>
              {lang.name}
            </Typography>
            {language === lang.code && (
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  marginLeft: 'auto',
                }}
              />
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}