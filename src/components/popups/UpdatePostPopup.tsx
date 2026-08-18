import { useState, useRef, type FC } from 'react';
import BasePopup from './BasePopup';
import { 
  Close as CloseIcon,
  AddAPhotoOutlined as AddAPhotoIcon,
  VideoCameraFrontOutlined as VideoCallIcon,
  LibraryMusicOutlined as LibraryMusicIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { Button, IconButton, Typography, Box, TextField, Chip, CircularProgress } from '@mui/material';
import type { Post } from '../../services/interfaces';
import { PostsService } from '../../services/posts.service';

interface IProps {
  isVisible: boolean;
  post: Post;
  onClose: () => void;
  onUpdate: (caption: string, files: File[]) => Promise<void>;
}

const UpdatePostPopup: FC<IProps> = ({ isVisible, post, onClose, onUpdate }) => {
  const [caption, setCaption] = useState(post.caption);
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [changeMedia, setChangeMedia] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [acceptType, setAcceptType] = useState('*');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const chosenFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...chosenFiles]);
    }
    e.target.value = '';
  };

  const triggerFileInput = (type: 'image/*' | 'video/*' | 'audio/*') => {
    setChangeMedia(true);
    setAcceptType(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleUpdatePost = async () => {
    if (!caption?.trim() && !changeMedia && post.media.length === 0) return;
    if (changeMedia && !caption?.trim() && files.length === 0) return;

    try {
      setIsLoading(true);
      
      await PostsService.updatePost(
        post.id, 
        caption, 
        changeMedia ? files : undefined
      );

      await onUpdate(caption as string, files);
      onClose();
    } catch (error) {
      console.error("Помилка при оновленні поста:", error);
      alert("Не вдалося оновити пост.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setCaption(post.caption);
    setFiles([]);
    setChangeMedia(false);
    onClose();
  };

  return (
    <BasePopup isVisible={isVisible} onClose={handleCancel}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 1, minWidth: { xs: '100%', sm: '450px' } }}>
        <Box sx={(theme) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}`, pb: 1 })}>
          <Typography variant="h6" sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}>
            Edit post
          </Typography>
          <IconButton onClick={handleCancel} disabled={isLoading} sx={(theme) => ({ color: theme.palette.text.secondary })}>
            <CloseIcon />
          </IconButton>
        </Box>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          accept={acceptType}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          placeholder="Що нового?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isLoading}
          sx={(theme) => ({
            "& .MuiOutlinedInput-root": {
              p: '8px 12px',
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset": { borderColor: theme.palette.text.secondary },
              "&.Mui-focused fieldset": { borderColor: '#4973a5' },
            },
          })}
        />

        {!changeMedia && post.media.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="caption" color="textSecondary">Current mediafiles:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {post.media.map((m) => (
                <Chip
                  key={m.id}
                  label={m.type === 'IMAGE' ? 'Зображення' : m.type === 'VIDEO' ? 'Відео' : 'Аудіо'}
                  variant="outlined"
                  size="small"
                  sx={(theme) => ({ borderColor: theme.palette.divider, bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F5F6F8' })}
                />
              ))}
              <Button 
                size="small" 
                variant="text" 
                onClick={() => { setChangeMedia(true); setFiles([]); }}
                sx={{ textTransform: 'none', color: '#FF3B30' }}
              >
                Replace all files
              </Button>
            </Box>
          </Box>
        )}

        {changeMedia && files.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {files.map((file, index) => (
              <Chip
                key={`${file.name}-${index}`}
                label={file.name}
                variant="outlined"
                size="small"
                onDelete={() => handleRemoveFile(index)}
                deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
                sx={(theme) => ({
                  maxWidth: '220px',
                  borderColor: theme.palette.divider,
                  bgcolor: theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F5F6F8',
                })}
              />
            ))}
          </Box>
        )}

        <Box sx={(theme) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: `1px solid ${theme.palette.divider}` })}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={() => triggerFileInput('image/*')} disabled={isLoading} size="small" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              <AddAPhotoIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => triggerFileInput('video/*')} disabled={isLoading} size="small" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              <VideoCallIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={() => triggerFileInput('audio/*')} disabled={isLoading} size="small" sx={(theme) => ({ color: theme.palette.text.secondary })}>
              <LibraryMusicIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              size="small"
              disabled={isLoading}
              sx={(theme) => ({
                color: theme.palette.text.primary,
                borderColor: theme.palette.divider,
                textTransform: 'none',
                borderRadius: '6px',
                '&:hover': { bgcolor: theme.palette.action.hover, borderColor: theme.palette.text.secondary }
              })}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={handleUpdatePost}
              disabled={isLoading || (!caption.trim() && changeMedia && files.length === 0)}
              endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon fontSize="small" />}
              sx={{
                bgcolor: '#4973a5',
                textTransform: 'none',
                borderRadius: '6px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#3b618c', boxShadow: 'none' }
              }}
            >
              Update
            </Button>
          </Box>
        </Box>

      </Box>
    </BasePopup>
  );
};

export default UpdatePostPopup;
