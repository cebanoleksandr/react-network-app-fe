import React, { useRef, useState, type FC } from 'react';
import { Avatar, Box, IconButton, TextField, Button, CircularProgress, Chip } from "@mui/material";
import { 
  AddAPhotoOutlined as AddAPhotoIcon,
  VideoCameraFrontOutlined as VideoCallIcon,
  LibraryMusicOutlined as LibraryMusicIcon,
  Close as CloseIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { PostsService } from '../../../services/posts.service';

interface IProps {
  onPostCreated?: () => Promise<void>;
}

const CreatePostBlock: FC<IProps> = ({ onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
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
    setAcceptType(type);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handlePublishPost = async () => {
    if (!caption.trim() && files.length === 0) return;

    try {
      setIsLoading(true);
      await PostsService.createPost(caption, files);
      
      setCaption('');
      setFiles([]);
      
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Помилка при створенні поста:", error);
      alert("Не вдалося опублікувати пост.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: '15px 20px',
        border: '1px solid #DCE1E5',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        bgcolor: 'white',
        mb: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        accept={acceptType}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar 
          alt='User Avatar'
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
          sx={{ width: 32, height: 32, mt: 0.5 }}
        />
        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="outlined"
          size="small"
          placeholder='What is new?'
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={isLoading}
          sx={{
            "& .MuiOutlinedInput-root": {
              p: '6px 0',
              "& fieldset": { borderColor: "transparent" },
              "&:hover fieldset": { borderColor: "transparent" },
              "&.Mui-focused fieldset": { borderColor: "transparent" },
            },
          }}
        />
      </Box>

      {files.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: '48px' }}>
          {files.map((file, index) => (
            <Chip
              key={`${file.name}-${index}`}
              label={file.name}
              variant="outlined"
              size="small"
              onDelete={() => handleRemoveFile(index)}
              deleteIcon={<CloseIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                maxWidth: '220px',
                borderColor: '#E7E8EC',
                bgcolor: '#F5F6F8',
              }}
            />
          ))}
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #F0F2F5' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, pl: '40px' }}>
          <IconButton onClick={() => triggerFileInput('image/*')} disabled={isLoading} size="small" sx={{ color: '#828282' }}>
            <AddAPhotoIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => triggerFileInput('video/*')} disabled={isLoading} size="small" sx={{ color: '#828282' }}>
            <VideoCallIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => triggerFileInput('audio/*')} disabled={isLoading} size="small" sx={{ color: '#828282' }}>
            <LibraryMusicIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {(caption.trim() || files.length > 0) && (
            <Button
              variant="contained"
              size="small"
              onClick={handlePublishPost}
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon fontSize="small" />}
              sx={{
                bgcolor: '#4973a5',
                textTransform: 'none',
                borderRadius: '6px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#3b618c', boxShadow: 'none' }
              }}
            >
              Опубликовать
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePostBlock;
