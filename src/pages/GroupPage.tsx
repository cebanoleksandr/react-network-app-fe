import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import GroupIcon from '@mui/icons-material/Group';
import { groupsService } from '../services/groupsService';
import type { IGroup } from '../services/interfaces';
import { useAppSelector } from '../store/hooks';

export const GroupPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [group, setGroup] = useState<IGroup | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const { item: me } = useAppSelector(state => state.user);
  const currentUserId = me?.id ?? '';

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        setError(null);
        const data = await groupsService.getGroupBySlug(slug);
        setGroup(data);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || 'Не вдалося завантажити спільноту');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupData();
  }, [slug]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !group) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error" variant="outlined" sx={{ borderRadius: '8px' }}>
          {error || 'Спільноту не знайдено'}
        </Alert>
        <Button onClick={() => navigate('/groups')} sx={{ mt: 2, textTransform: 'none' }}>
          Назад до списку груп
        </Button>
      </Container>
    );
  }

  const isOwner = group.owner?.id === currentUserId;
  const isMember = group.members?.some((m) => m.user?.id === currentUserId);
  const memberCount = group.members?.length || 0;

  const handleJoin = async () => {
    if (!slug) return;
    try {
      setIsActionLoading(true);
      await groupsService.joinGroup(slug);
      const updatedGroup = await groupsService.getGroupBySlug(slug);
      setGroup(updatedGroup);
    } catch (err) {
      console.error(err);
      alert('Не вдалося вступити в групу');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!slug) return;
    if (isOwner) {
      alert('Власник не може залишити групу!');
      return;
    }
    try {
      setIsActionLoading(true);
      await groupsService.leaveGroup(slug);
      const updatedGroup = await groupsService.getGroupBySlug(slug);
      setGroup(updatedGroup);
    } catch (err) {
      console.error(err);
      alert('Не вдалося вийти з групи');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec', mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '21px' }}>
                  {group.name}
                </Typography>
                {group.isPrivate && <LockIcon sx={{ fontSize: '18px', color: '#818c99' }} />}
              </Box>

              <Typography variant="body2" sx={{ color: '#818c99', fontSize: '13px', mb: 2 }}>
                {group.isPrivate ? 'Закрита спільнота' : 'Відкрита спільнота'}
              </Typography>

              <Divider sx={{ my: 2, borderColor: '#e7e8ec' }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5 }}>
                  Інформація
                </Typography>
                <Typography variant="body2" sx={{ color: '#000000', fontSize: '14px', lineHeight: 1.5 }}>
                  {group.description || 'Опис спільноти відсутній.'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {!group.isPrivate || isMember || isOwner ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Блок створення поста в групі (показувати за логікою прав) */}
              {/* <CreatePostBlock groupId={group.id} /> */}
              
              {/* Список постів */}
              {/* <PostList groupId={group.id} /> */}
              
              <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec', p: 3, textCenter: 'center' }}>
                <Typography color="text.secondary" variant="body2" align="center">
                  Тут будуть відображатися пости спільноти `{group.name}`
                </Typography>
              </Card>
            </Box>
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec', p: 4, textAlign: 'center' }}>
              <LockIcon sx={{ fontSize: 40, color: '#818c99', mb: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 1 }}>
                Це закрита спільнота
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Вступіть до спільноти, щоб отримати доступ к її публікаціям та матеріалам.
              </Typography>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec', p: 2, textAlign: 'center' }}>
              <Avatar
                src={group.avatarUrl}
                alt={group.name}
                variant="rounded"
                sx={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                  backgroundColor: '#f0f2f5',
                  color: '#828282',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  mb: 2,
                  border: '1px solid #e7e8ec'
                }}
              >
                {group.name.charAt(0).toUpperCase()}
              </Avatar>

              {isOwner ? (
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(`/groups/${group.slug}/edit`)}
                  sx={{ textTransform: 'none', fontWeight: 500, borderRadius: '8px' }}
                >
                  Керування спільнотою
                </Button>
              ) : isMember ? (
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  disabled={isActionLoading}
                  onClick={handleLeave}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    backgroundColor: '#f0f2f5',
                    color: '#2a5885',
                    '&:hover': { backgroundColor: '#e4e6e9' }
                  }}
                >
                  Ви учасник (Вийти)
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  disableElevation
                  disabled={isActionLoading}
                  onClick={handleJoin}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    backgroundColor: '#2688eb',
                    '&:hover': { backgroundColor: '#227ad2' }
                  }}
                >
                  Вступити до спільноти
                </Button>
              )}
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 0.5 }}>
                <GroupIcon sx={{ color: '#818c99', fontSize: '20px' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                  Учасники ({memberCount})
                </Typography>
              </Box>

              {group.members && group.members.length > 0 ? (
                <List disablePadding>
                  {group.members.slice(0, 5).map((member) => (
                    <ListItem key={member.id} disableGutters sx={{ py: 0.75 }}>
                      <ListItemAvatar sx={{ minWidth: 36 }}>
                        <Avatar
                          src={member.user?.avatarUrl}
                          sx={{ width: 28, height: 28, fontSize: '12px' }}
                        >
                          {member.user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: '13px',
                              color: '#2a5885',
                              fontWeight: 500,
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {member.user?.firstName && member.user?.lastName
                              ? `${member.user.firstName} ${member.user.lastName}`
                              : `@${member.user?.username}`}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textCenter: 'center', py: 1 }}>
                  Учасників ще немає
                </Typography>
              )}
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default GroupPage;
