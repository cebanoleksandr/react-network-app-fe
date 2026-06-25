import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import PostList from '../components/business/posts/PostList';
import CreatePostBlock from '../components/business/posts/CreatePostBlock';
import type { User } from '../services/interfaces';
import { PostsService } from '../services/posts.service';
import { UsersService } from '../services/users.service';
import { ChatsService } from '../services/chats.service';
import { MediaService } from '../services/mediaService';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import {
  Box,
  Container,
  Grid,
  Card,
  Avatar,
  Button,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Link,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { setUserAC } from '../store/userSlice';
import { setPostsAC } from '../store/postsSlice';
import { setAlertAC } from '../store/alertSlice';
import DeleteAvaPopup from '../components/popups/DeleteAvaPopup';

const VkCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  border: '1px solid #e7e8ec',
  boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  padding: theme.spacing(2),
  boxSizing: 'border-box',
}));

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { userId: urlUserId } = useParams<{ userId: string }>();
  const { items: posts } = useAppSelector(state => state.posts);
  const { item: currentUser } = useAppSelector((state) => state.user);
  
  const isForeignProfile = Boolean(urlUserId && urlUserId !== currentUser?.id);

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [isDeleteAvaPopupVisible, setIsDeleteAvaPopupVisible] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    bio: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        let targetUser: User | null = null;

        if (isForeignProfile && urlUserId) {
          targetUser = await UsersService.getUserById(urlUserId);
        } else {
          targetUser = currentUser;
        }

        setProfileUser(targetUser);

        if (targetUser) {
          const postsData = await PostsService.getFeed(1, 20);
          const userPosts = postsData.data.filter((post) => post.user.id === targetUser?.id);
          dispatch(setPostsAC(userPosts));
          setTotalPosts(userPosts.length);

          const followersData = await UsersService.getFollowers(targetUser.id);
          setFollowers(followersData);

          const followingData = await UsersService.getFollowing(targetUser.id);
          setFollowing(followingData);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
        setIsDeleteAvaPopupVisible(false);
      }
    };

    fetchProfileData();

    return () => {
      dispatch(setPostsAC([]));
    }
  }, [urlUserId, currentUser, isForeignProfile]);

  const handleOpenViewer = () => {
    if (profileUser?.avatarUrl) {
      setIsViewerOpen(true);
    }
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!avatarLoading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Будь ласка, оберіть зображення.');
      return;
    }

    try {
      setAvatarLoading(true);

      const { uploadUrl, path } = await MediaService.getUploadUrl(file.name, file.type);

      await MediaService.uploadToStorage(uploadUrl, file);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'ВАШ_SUPABASE_URL';
      const generatedAvatarUrl = `https://${supabaseUrl}.supabase.co/storage/v1/object/public/network/${path}`;

      const updatedUser = await UsersService.updateProfile({ avatarUrl: generatedAvatarUrl });
      
      dispatch(setUserAC(updatedUser));
      setProfileUser(updatedUser);
      dispatch(setAlertAC({ text: t('alerts.avatar_updated_success'), mode: 'success' }));
    } catch (error) {
      console.error('Помилка при завантаженні аватарки:', error);
      dispatch(setAlertAC({ text: t('alerts.avatar_updated_error'), mode: 'error' }));
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleDeleteAvatar = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setAvatarLoading(true);
      const updatedUser = await UsersService.updateProfile({ avatarUrl: '' });
      
      dispatch(setUserAC(updatedUser));
      setProfileUser(updatedUser);
      dispatch(setAlertAC({ text: t('alerts.avatar_deleted_success'), mode: 'success' }));
    } catch (error) {
      console.error('Помилка при видаленні аватарки:', error);
      dispatch(setAlertAC({ text: t('alerts.avatar_deleted_error'), mode: 'error' }));
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!profileUser) return;
    try {
      setCreatingChat(true);
      const chatRoom = await ChatsService.getOrCreateRoom(profileUser.id);
      navigate(`/app/chat/${chatRoom.id}`);
    } catch (error) {
      console.error('Failed to create or open chat room:', error);
    } finally {
      setCreatingChat(false);
    }
  };

  const handleOpenEdit = () => {
    if (currentUser) {
      setEditForm({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        bio: currentUser.bio || ''
      });
      setIsEditOpen(true);
    }
  };

  const handleCloseEdit = () => {
    setIsEditOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const updatedUser = await UsersService.updateProfile(editForm);
      dispatch(setUserAC(updatedUser));
      setIsEditOpen(false);
      dispatch(setAlertAC({ text: t('alerts.profile_updated_success'), mode: 'success' }));
    } catch (error) {
      console.error('Error updating profile:', error);
      dispatch(setAlertAC({ text: t('alerts.profile_updated_error'), mode: 'error' }));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePostCreated = async () => {
    if (profileUser) {
      const postsData = await PostsService.getFeed(1, 20);
      const userPosts = postsData.data.filter((post) => post.user.id === profileUser.id);
      dispatch(setPostsAC(userPosts));
      setTotalPosts(userPosts.length);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64vh', color: 'text.secondary' }}>
        <CircularProgress size={40} sx={{ color: '#2a5885', mr: 2 }} />
        <Typography variant="body1">{t('common.loading', 'Loading...')}</Typography>
      </Box>
    );
  }

  if (!profileUser) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64vh', color: 'error.main' }}>
        <Typography variant="h6">User not found</Typography>
      </Box>
    );
  }

  const fullName = profileUser.firstName && profileUser.lastName 
    ? `${profileUser.firstName} ${profileUser.lastName}` 
    : profileUser.username;

  const currentAvatarUrl = profileUser.avatarUrl || 'https://placehold.co/230x230?text=No+Avatar';

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        maxWidth: '960px !important', 
        height: '100%', 
        px: { xs: 2, sm: 2 }, 
        py: 2,
        fontFamily: 'sans-serif',
        color: '#000000'
      }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <Grid container spacing={2.5} sx={{ height: '100%', alignItems: 'flex-start' }}>
        <Grid size={{ xs: 12, md: 'auto' }} sx={{ width: { md: '230px' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <VkCard>
              <Box 
                onMouseEnter={() => setIsAvatarHovered(true)}
                onMouseLeave={() => setIsAvatarHovered(false)}
                onClick={handleOpenViewer}
                sx={{ 
                  width: '100%', 
                  aspectRatio: '1/1', 
                  backgroundColor: '#f0f2f5', 
                  borderRadius: '8px', 
                  overflow: 'hidden', 
                  mb: 1.5,
                  position: 'relative',
                  cursor: profileUser.avatarUrl ? 'pointer' : 'default'
                }}
              >
                {avatarLoading ? (
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 2 }}>
                    <CircularProgress size={30} sx={{ color: '#2a5885' }} />
                  </Box>
                ) : null}

                <Box
                  component="img"
                  src={currentAvatarUrl}
                  alt={fullName}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {!isForeignProfile && isAvatarHovered && !avatarLoading && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 0, left: 0, right: 0, 
                      backgroundColor: 'rgba(0, 0, 0, 0.6)', 
                      color: '#fff', 
                      display: 'flex', 
                      justifyContent: 'space-around', 
                      alignItems: 'center',
                      p: 0.5,
                      transition: 'all 0.2s',
                      zIndex: 1
                    }}
                  >
                    <IconButton 
                      size="small" 
                      sx={{ color: '#fff' }} 
                      title="Оновити фото"
                      onClick={handleUploadClick}
                    >
                      <CloudUploadIcon fontSize="small" />
                    </IconButton>
                    
                    {profileUser.avatarUrl && (
                      <IconButton 
                        size="small" 
                        sx={{ color: '#ff4d4d' }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsDeleteAvaPopupVisible(true);
                        }}
                        title="Видалити фото"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>
              
              {isForeignProfile ? (
                <Button 
                  fullWidth 
                  variant="contained"
                  startIcon={<ChatIcon />}
                  onClick={handleStartChat}
                  disabled={creatingChat}
                  sx={{ 
                    backgroundColor: '#2a5885', 
                    color: '#ffffff',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#244d75', boxShadow: 'none' }
                  }}
                >
                  {creatingChat ? 'Opening the chat...' : 'Send a message'}
                </Button>
              ) : (
                <Button 
                  fullWidth 
                  variant="contained"
                  onClick={handleOpenEdit}
                  sx={{ 
                    backgroundColor: '#e1e3e6', 
                    color: '#2a5885',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontSize: '13px',
                    fontWeight: 500,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#d7d8db', boxShadow: 'none' }
                  }}
                >
                  Edit profile
                </Button>
              )}
            </VkCard>

            <VkCard>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                  Followers <Box component="span" sx={{ color: '#828282', ml: 0.5 }}>{followers.length}</Box>
                </Typography>
                <Link href="#followers" underline="hover" sx={{ color: '#2a5885', fontSize: '13px' }}>all</Link>
              </Box>
              
              <Grid container spacing={1} sx={{ textAlign: 'center', mb: 3 }}>
                {followers.map((friend) => (
                  <Grid 
                    size={{ xs: 4 }} 
                    key={friend.id} 
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} 
                    onClick={() => navigate(`/app/profile/${friend.id}`)}
                  >
                    <Avatar 
                      src={friend.avatarUrl} 
                      alt={friend.username} 
                      sx={{ width: 48, height: 48, mb: 0.5, '&:hover': { opacity: 0.9 } }} 
                    />
                    <Typography 
                      noWrap 
                      sx={{ color: '#2a5885', fontSize: '11px', width: '100%', textAlign: 'center', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {`${friend.firstName || ''} ${friend.lastName || ''}`.trim() || friend.username}
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>
                  Following <Box component="span" sx={{ color: '#828282', ml: 0.5 }}>{following.length}</Box>
                </Typography>
                <Link href="#following" underline="hover" sx={{ color: '#2a5885', fontSize: '13px' }}>all</Link>
              </Box>
              
              <Grid container spacing={1} sx={{ textAlign: 'center' }}>
                {following.map((friend) => (
                  <Grid 
                    size={{ xs: 4 }} 
                    key={friend.id} 
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }} 
                    onClick={() => navigate(`/app/profile/${friend.id}`)}
                  >
                    <Avatar 
                      src={friend.avatarUrl} 
                      alt={friend.username} 
                      sx={{ width: 48, height: 48, mb: 0.5, '&:hover': { opacity: 0.9 } }} 
                    />
                    <Typography 
                      noWrap 
                      sx={{ color: '#2a5885', fontSize: '11px', width: '100%', textAlign: 'center', '&:hover': { textDecoration: 'underline' } }}
                    >
                      {`${friend.firstName || ''} ${friend.lastName || ''}`.trim() || friend.username}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </VkCard>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 'grow' }} sx={{ maxHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <VkCard sx={{ p: 2.5, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1.5, mb: 2, borderBottom: '1px solid #e7e8ec' }}>
              <Box>
                <Typography variant="h1" sx={{ fontSize: '21px', fontWeight: 400, color: '#000', mb: 0.5 }}>
                  {fullName}
                </Typography>
                <Typography sx={{ color: '#656565', fontSize: '13px' }}>
                  {profileUser.bio || 'Статус відсутній'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#828282' }}>
                <Badge variant="dot" color="success" sx={{ mr: 1, '& .MuiBadge-badge': { width: 8, height: 8, borderRadius: '50%' } }} />
                Online
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 4, mt: 2.5, pt: 2, borderTop: '1px solid #e7e8ec', px: 1 }}>
              <Box sx={{ cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '19px', color: '#2a5885', fontWeight: 300 }}>
                  {totalPosts}
                </Typography>
                <Typography sx={{ color: '#828282', fontSize: '12px', mt: 0.5 }}>posts</Typography>
              </Box>
              <Box sx={{ cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '19px', color: '#2a5885', fontWeight: 300 }}>
                  {followers.length}
                </Typography>
                <Typography sx={{ color: '#828282', fontSize: '12px', mt: 0.5 }}>followers</Typography>
              </Box>
              <Box sx={{ cursor: 'pointer' }}>
                <Typography sx={{ fontSize: '19px', color: '#2a5885', fontWeight: 300 }}>
                  {following.length}
                </Typography>
                <Typography sx={{ color: '#828282', fontSize: '12px', mt: 0.5 }}>following</Typography>
              </Box>
            </Box>
          </VkCard>

          {!isForeignProfile && <CreatePostBlock onPostCreated={handlePostCreated} />}

          <Box 
            sx={{ 
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e7e8ec',
              boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: 0, 
              overflow: 'hidden'
            }}
          >
            <Box sx={{ borderBottom: '1px solid #e7e8ec', px: 2.5, flexShrink: 0, backgroundColor: '#ffffff' }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{
                  minHeight: '44px',
                  '& .MuiTabs-indicator': { backgroundColor: '#2a5885', height: '2px' },
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 500,
                    minWidth: 'auto',
                    paddingLeft: 1,
                    paddingRight: 1,
                    mr: 3,
                    minHeight: '44px',
                    color: '#828282',
                    '&.Mui-selected': { color: '#000000' }
                  }
                }}
              >
                <Tab label="Всі записи" />
                <Tab label="Архіви" />
              </Tabs>
            </Box>

            <Box 
              sx={{ 
                p: 1, 
                backgroundColor: '#f0f2f5', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1.5, 
                overflowY: 'auto', 
                flex: 1 
              }}
            >
              {activeTab === 0 && (
                posts.length > 0 ? (
                  <PostList posts={posts} />
                ) : (
                  <Box sx={{ backgroundColor: '#fff', borderRadius: '12px', p: 4, textAlign: 'center', color: 'text.secondary', border: '1px solid #e7e8ec', flexShrink: 0 }}>
                    <Typography variant="body1">На стіні ще немає жодного запису.</Typography>
                  </Box>
                )
              )}
              {activeTab === 1 && (
                <Box sx={{ backgroundColor: '#fff', borderRadius: '12px', p: 4, textAlign: 'center', color: 'text.secondary', border: '1px solid #e7e8ec', flexShrink: 0 }}>
                  <Typography variant="body1">Архів порожній.</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={isViewerOpen}
        onClose={handleCloseViewer}
        maxWidth="md"
        slotProps={{
          paper: {
            sx: { 
              backgroundColor: 'transparent', 
              boxShadow: 'none',
              overflow: 'hidden',
              m: 2
            }
          }
        }}
      >
        <Box 
          onClick={handleCloseViewer}
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            cursor: 'pointer',
            maxWidth: '90vw',
            maxHeight: '90vh'
          }}
        >
          <Box
            component="img"
            src={profileUser.avatarUrl}
            alt={fullName}
            onClick={(e) => e.stopPropagation()}
            sx={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          />
        </Box>
      </Dialog>

      <Dialog 
        open={isEditOpen} 
        onClose={handleCloseEdit}
        fullWidth
        maxWidth="xs"
        slotProps={{
          paper: {
            sx: { borderRadius: '12px', p: 1 }
          }
        }}
      >
        <DialogTitle sx={{ pb: 1, fontSize: '18px', fontWeight: 500 }}>
          Редагування профілю
        </DialogTitle>
        <form onSubmit={handleSaveProfile}>
          <DialogContent sx={{ py: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Ім'я"
              name="firstName"
              fullWidth
              size="small"
              value={editForm.firstName}
              onChange={handleInputChange}
            />
            <TextField
              label="Прізвище"
              name="lastName"
              fullWidth
              size="small"
              value={editForm.lastName}
              onChange={handleInputChange}
            />
            <TextField
              label="Про себе (Статус)"
              name="bio"
              fullWidth
              multiline
              rows={3}
              size="small"
              value={editForm.bio}
              onChange={handleInputChange}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
            <Button 
              onClick={handleCloseEdit} 
              disabled={isSaving}
              sx={{ textTransform: 'none', color: '#656565' }}
            >
              Скасувати
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={isSaving}
              sx={{ 
                textTransform: 'none', 
                backgroundColor: '#2a5885',
                '&:hover': { backgroundColor: '#244d75' },
                boxShadow: 'none'
              }}
            >
              {isSaving ? <CircularProgress size={20} color="inherit" /> : 'Зберегти'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <DeleteAvaPopup
        isVisible={isDeleteAvaPopupVisible}
        onClose={() => setIsDeleteAvaPopupVisible(false)}
        onDelete={handleDeleteAvatar}
      />
    </Container>
  );
};

export default Profile;
