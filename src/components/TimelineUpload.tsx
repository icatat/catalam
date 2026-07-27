'use client';

import { useState, useEffect } from 'react';
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
import { Upload, X, Image as ImageIcon, Pencil } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import Image from 'next/image';

export interface EditableTimelineEvent {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  date?: string | null;
  tag?: string | null;
  from?: string | null;
  image?: string;
}

interface TimelineUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  defaultFromValue?: string;
  /** When provided, the dialog edits this entry instead of creating a new one (admin only). */
  editEvent?: EditableTimelineEvent | null;
  /** Required for edit mode: the admin's invite id, used for server-side authorization. */
  adminInviteId?: string | null;
}

interface UploadFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  tag: string;
  from: string;
}

const emptyForm = (defaultFrom?: string): UploadFormData => ({
  title: '',
  description: '',
  location: '',
  date: '',
  tag: '',
  from: defaultFrom || ''
});

export default function TimelineUpload({
  open,
  onClose,
  onUploadSuccess,
  defaultFromValue,
  editEvent,
  adminInviteId,
}: TimelineUploadProps) {
  const theme = useTheme();
  const isEditMode = !!editEvent;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState<UploadFormData>(emptyForm(defaultFromValue));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  // Sync the form whenever the dialog opens or the target entry changes.
  useEffect(() => {
    if (!open) return;
    setSelectedFile(null);
    setPreviewUrl('');
    setError('');
    if (editEvent) {
      setFormData({
        title: editEvent.title || '',
        description: editEvent.description || '',
        location: editEvent.location || '',
        date: editEvent.date || '',
        tag: editEvent.tag || '',
        from: editEvent.from || '',
      });
    } else {
      setFormData(emptyForm(defaultFromValue));
    }
  }, [open, editEvent, defaultFromValue]);

  // The image shown in the preview area: a newly picked file wins, otherwise
  // (in edit mode) the entry's existing image.
  const effectivePreview = previewUrl || (isEditMode ? editEvent?.image || '' : '');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
      setError('');

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
    if (!formData.title.trim()) {
      setError('Please provide a title');
      return;
    }
    // A new memory requires an image; an edit can keep the existing one.
    if (!isEditMode && (!selectedFile || !formData.from.trim())) {
      setError('Please select an image and provide a title and your name');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const body = new FormData();
      if (selectedFile) body.append('file', selectedFile);
      body.append('title', formData.title);
      body.append('description', formData.description);
      body.append('location', formData.location);
      body.append('date', formData.date);
      body.append('tag', formData.tag);
      body.append('from', formData.from);

      let response: Response;
      if (isEditMode) {
        body.append('admin_invite_id', adminInviteId || '');
        response = await fetch(`/api/timeline/${editEvent!.id}`, {
          method: 'PATCH',
          body,
        });
      } else {
        response = await fetch('/api/timeline/upload', {
          method: 'POST',
          body,
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      onUploadSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setFormData(emptyForm(defaultFromValue));
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

  const submitDisabled =
    uploading ||
    !formData.title.trim() ||
    (!isEditMode && (!selectedFile || !formData.from.trim()));

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
        {isEditMode
          ? <Pencil size={24} color={theme.palette.primary.main} />
          : <Upload size={24} color={theme.palette.primary.main} />}
        {isEditMode ? 'Edit Memory' : 'Add New Memory'}
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* File Upload Area */}
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: theme.palette.text.primary }}>
              Photo {isEditMode ? '' : '*'}
            </Typography>

            {!effectivePreview ? (
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
              <Box>
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
                      src={effectivePreview}
                      alt="Preview"
                      fill
                      sizes="300px"
                      style={{
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                  {/* Only offer removal for a freshly picked file; the existing
                      image can be replaced but not cleared. */}
                  {selectedFile && (
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
                  )}
                </Box>
                <Box sx={{ mt: 1 }}>
                  <Button
                    size="small"
                    onClick={() => document.getElementById('file-input')?.click()}
                    sx={{ textTransform: 'none' }}
                  >
                    {selectedFile ? 'Choose a different photo' : 'Replace photo'}
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </Box>
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

          <TextField
            label="From"
            required={!isEditMode}
            fullWidth
            value={formData.from}
            onChange={(e) => handleFormChange('from', e.target.value)}
            placeholder="Your name"
            helperText="Who is sharing this memory?"
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
          disabled={submitDisabled}
          startIcon={uploading ? <CircularProgress size={16} /> : (isEditMode ? <Pencil size={16} /> : <Upload size={16} />)}
          sx={{
            borderRadius: 2,
            minWidth: 120
          }}
        >
          {uploading ? 'Saving...' : (isEditMode ? 'Save changes' : 'Upload')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
