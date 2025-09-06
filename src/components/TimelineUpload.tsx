'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

interface TimelineUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

interface UploadFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  tag: string;
}

export default function TimelineUpload({ open, onClose, onUploadSuccess }: TimelineUploadProps) {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<UploadFormData>({
    title: '',
    description: '',
    location: '',
    date: '',
    tag: ''
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFormChange = (field: keyof UploadFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFile || !formData.title.trim()) {
      setError('Please select an image and provide a title');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Create FormData for multipart upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('location', formData.location);
      uploadFormData.append('date', formData.date);
      uploadFormData.append('tag', formData.tag);

      const response = await fetch('/api/timeline/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload');
      }

      // Success
      onUploadSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPreviewUrl('');
      setFormData({
        title: '',
        description: '',
        location: '',
        date: '',
        tag: ''
      });
      setError('');
      onClose();
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        pb: 2
      }}>
        <Upload size={24} color={theme.palette.primary.main} />
        Add New Memory
      </DialogTitle>
      
      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* File Upload Area */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
              Photo *
            </Typography>
            
            {!selectedFile ? (
              <Box
                sx={{
                  border: `2px dashed ${theme.palette.primary.main}40`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: `${theme.palette.primary.main}08`
                  }
                }}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <ImageIcon size={48} color={theme.palette.primary.main} style={{ marginBottom: 16 }} />
                <Typography variant="body1" sx={{ mb: 1, color: theme.palette.text.primary }}>
                  Click to select an image
                </Typography>
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Supports JPG, PNG, GIF, WebP • Max 10MB
                </Typography>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </Box>
            ) : (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 300,
                    height: 200,
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    style={{
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <IconButton
                  onClick={removeImage}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    backgroundColor: theme.palette.error.main,
                    color: 'white',
                    width: 24,
                    height: 24,
                    '&:hover': {
                      backgroundColor: theme.palette.error.dark
                    }
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Box>
            )}
          </Box>

          {/* Form Fields */}
          <TextField
            label="Title"
            required
            fullWidth
            value={formData.title}
            onChange={(e) => handleFormChange('title', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            fullWidth
            value={formData.description}
            onChange={(e) => handleFormChange('description', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label="Location"
            fullWidth
            value={formData.location}
            onChange={(e) => handleFormChange('location', e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label="Date"
            type="date"
            fullWidth
            value={formData.date}
            onChange={(e) => handleFormChange('date', e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            label="Tag People"
            fullWidth
            value={formData.tag}
            onChange={(e) => handleFormChange('tag', e.target.value)}
            placeholder="e.g., Cata, Lam, Family"
            helperText="Separate multiple names with commas"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={handleClose}
          disabled={uploading}
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || !selectedFile || !formData.title.trim()}
          startIcon={uploading ? <CircularProgress size={16} /> : <Upload size={16} />}
          sx={{ 
            borderRadius: 2,
            minWidth: 120
          }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}