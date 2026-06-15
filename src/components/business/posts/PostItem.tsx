import { useEffect, useState } from "react";
import { Avatar, Box, Typography, IconButton, Portal, Menu, MenuItem } from "@mui/material"
import { 
  MoreHoriz as MoreHorizIcon, 
  Close as CloseIcon,
  BookmarkBorderOutlined as BookmarkBorderOutlinedIcon,
  NotificationsOutlined as NotificationsOutlinedIcon,
  VisibilityOffOutlined as VisibilityOffOutlinedIcon,
  EditOutlined as EditOutlinedIcon,
  DeleteForeverOutlined as DeleteForeverOutlinedIcon,
  ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
  FavoriteBorderOutlined as FavoriteBorderOutlinedIcon,
  ModeCommentOutlined as ModeCommentOutlinedIcon,
  ReplyOutlined as ReplyOutlinedIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from "framer-motion";
import type { Post } from "../../../services/interfaces";
import type { FC, MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import PostComments from "./PostComments";
import PostSharePopover from "./PostSharePopover";
import { PostsService } from "../../../services/posts.service";

interface IProps {
  post: Post;
}

const PostItem: FC<IProps> = ({ post }) => {
  const navigate = useNavigate();
  const [activeImgUrl, setActiveImgUrl] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const isMenuOpen = Boolean(anchorEl);

  const getLikes = async () => {
    try {
      const response = await PostsService.getLikes(post.id);
      setLikesCount(response.count);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const getLikes = async () => {
      try {
        const response = await PostsService.getLikes(post.id);
        setLikesCount(response.count);
      } catch (error) {
        console.error(error);
      }
    }

    getLikes();
  }, [post.id]);

  const onOpenProfile = (profileId: string) => {
    navigate(`/app/profile/${profileId}`);
  }

  const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleLike = async () => {
    try {
      await PostsService.toggleLike(post.id);
      getLikes();
      setIsLiked(!isLiked);
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = () => {
    console.log("Редагувати пост:", post.id);
    handleMenuClose();
  };

  const handleSave = () => {
    console.log("Save post:", post.id);
    handleMenuClose();
  };
  
  const handleEnableТotifications = () => {
    console.log("handleEnableТotifications:", post.id);
    handleMenuClose();
  };
  
  const handleHideFromFeed = () => {
    console.log("handleHideFromFeed:", post.id);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log("Видалити пост:", post.id);
    handleMenuClose();
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleShareOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setShareAnchorEl(event.currentTarget);
  };

  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  return (
    <Box
      sx={{
        p: '10px 20px',
        border: '1px solid #DCE1E5',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        bgcolor: 'white',
        mb: '8px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            alt={`${post.user.firstName} ${post.user.lastName}`}
            src={post.user.avatarUrl}
            sx={{ width: 50, height: 50, cursor: 'pointer' }}
            onClick={() => onOpenProfile(post.user.id)}
          />

          <Box>
            <Typography 
              sx={{ fontSize: 20, fontWeight: 600, cursor: 'pointer' }} 
              onClick={() => onOpenProfile(post.user.id)}
            >
              {post.user.firstName} {post.user.lastName}
            </Typography>

            <Typography sx={{ color: '#6F7985', fontSize: 12 }}>user profile</Typography>
          </Box>
        </Box>
        
        <IconButton onClick={handleMenuOpen}>
          <MoreHorizIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                boxShadow: '0px 5px 15px rgba(0,0,0,0.08)',
                borderRadius: '8px',
                border: '1px solid #EAEAEA',
                minWidth: '150px'
              }
            }
          }}
        >
          <MenuItem onClick={handleSave} sx={{ fontSize: 14 }}><BookmarkBorderOutlinedIcon sx={{ mr: 2 }} /> Save</MenuItem>
          <MenuItem onClick={handleEnableТotifications} sx={{ fontSize: 14 }}><NotificationsOutlinedIcon sx={{ mr: 2 }} /> Enable notifications</MenuItem>
          <MenuItem onClick={handleHideFromFeed} sx={{ fontSize: 14 }}><VisibilityOffOutlinedIcon sx={{ mr: 2 }} /> Hide from feed</MenuItem>
          <MenuItem onClick={handleEdit} sx={{ fontSize: 14 }}><EditOutlinedIcon sx={{ mr: 2 }} /> Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ fontSize: 14, color: '#FF3B30' }}><DeleteForeverOutlinedIcon sx={{ mr: 2 }} /> Delete</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ fontSize: 14 }}><ErrorOutlineOutlinedIcon sx={{ mr: 2 }} /> Complain</MenuItem>
        </Menu>
      </Box>

      <Typography sx={{ mb: '12px' }}>{post.caption}</Typography>

      {!!post.media.length && (
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: post.media.length === 1 ? '1fr' : '1fr 1fr',
            gap: '4px', 
            mb: '12px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        >
          {post.media.map((m, index) => {
            const isLastOdd = post.media.length % 2 !== 0 && index === post.media.length - 1;

            return (
              <Box 
                key={m.id} 
                sx={{ 
                  width: '100%', 
                  height: post.media.length === 1 ? 'auto' : '250px', 
                  bgcolor: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gridColumn: isLastOdd && post.media.length > 1 ? 'span 2' : 'auto',
                }}
              >
                {m.type === 'AUDIO' && (
                  <Box sx={{ width: '100%', p: 1 }}>
                    <audio controls src={m.url} style={{ width: '100%' }} />
                  </Box>
                )}
                
                {m.type === 'VIDEO' && (
                  <video 
                    controls 
                    src={m.url} 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: post.media.length === 1 ? 'contain' : 'cover' 
                    }} 
                  />
                )}
                
                {m.type === 'IMAGE' && (
                  <img 
                    src={m.url} 
                    alt="Post attachment" 
                    onClick={() => setActiveImgUrl(m.url)}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: post.media.length === 1 ? 'contain' : 'cover',
                      cursor: 'pointer'
                    }} 
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <Box sx={{ pt: 1, borderTop: '1px solid #EAEAEA', display: 'flex', alignItems: 'center', gap: 3 }}>
        <IconButton onClick={handleToggleLike} sx={{ color: isLiked ? '#E64646' : '' }}>
          {isLiked ? (
            <FavoriteIcon sx={{ mr: 1 }} />
          ) : (
            <FavoriteBorderOutlinedIcon sx={{ mr: 1 }} />
          )}          
          <Typography>{likesCount}</Typography>
        </IconButton>

        <IconButton onClick={handleToggleComments} sx={{ color: showComments ? '#1976d2' : '' }}>
          <ModeCommentOutlinedIcon sx={{ mr: 1 }} />
          {!!post.commentsCount && <Typography>{post.commentsCount}</Typography>}
        </IconButton>

        <IconButton onClick={handleShareOpen} sx={{ color: shareAnchorEl ? '#1976d2' : '' }}>
          <ReplyOutlinedIcon sx={{ mr: 1 }} />
          <Typography>123</Typography>
        </IconButton>
      </Box>

      <PostSharePopover
        postId={post.id}
        anchorEl={shareAnchorEl} 
        onClose={handleShareClose} 
      />

      <AnimatePresence>
        {showComments && <PostComments postId={post.id} />}
      </AnimatePresence>

      <Portal>
        <AnimatePresence>
          {activeImgUrl && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setActiveImgUrl(null)}
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(0, 0, 0, 0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1300,
                cursor: 'zoom-out',
              }}
            >
              <Box 
                component={motion.div}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                sx={{
                  position: 'relative',
                  maxWidth: '90%',
                  maxHeight: '85vh',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <IconButton
                  onClick={() => setActiveImgUrl(null)}
                  sx={{
                    position: 'absolute',
                    top: -45,
                    right: 0,
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  <CloseIcon />
                </IconButton>

                <Box
                  component="img"
                  src={activeImgUrl}
                  alt="Enlarged view"
                  sx={{
                    maxWidth: '100%',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    borderRadius: '4px',
                    boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
                  }}
                />
              </Box>
            </Box>
          )}
        </AnimatePresence>
      </Portal>
    </Box>
  )
}

export default PostItem;
