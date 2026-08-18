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
import { useTranslation } from 'react-i18next';
import { groupsService } from '../services/groupsService';
import type { IGroup } from '../services/interfaces';
import { useAppSelector } from '../store/hooks';

export const GroupPage = () => {
  const { t } = useTranslation();
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
        setError(t('group_page.load_error'));
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
          {error || t('group_page.not_found')}
        </Alert>
        <Button onClick={() => navigate('/groups')} sx={{ mt: 2, textTransform: 'none' }}>
          {t('group_page.back_to_groups')}
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
      alert(t('group_page.join_error'));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!slug) return;
    if (isOwner) {
      alert(t('group_page.owner_cannot_leave'));
      return;
    }
    try {
      setIsActionLoading(true);
      await groupsService.leaveGroup(slug);
      const updatedGroup = await groupsService.getGroupBySlug(slug);
      setGroup(updatedGroup);
    } catch (err) {
      console.error(err);
      alert(t('group_page.leave_error'));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', mb: 2 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, fontSize: '21px' }}>
                  {group.name}
                </Typography>
                {group.isPrivate && <LockIcon sx={{ fontSize: '18px', color: 'text.secondary' }} />}
              </Box>

              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '13px', mb: 2 }}>
                {group.isPrivate ? t('group_page.private') : t('group_page.public')}
              </Typography>

              <Divider sx={{ my: 2, borderColor: 'divider' }} />

              <Box sx={{ mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5 }}>
                  {t('group_page.info')}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.primary', fontSize: '14px', lineHeight: 1.5 }}>
                  {group.description || t('group_page.no_description')}
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
              
              <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', p: 3, textCenter: 'center' }}>
                <Typography color="text.secondary" variant="body2" align="center">
                  {t('group_page.posts_placeholder', { name: group.name })}
                </Typography>
              </Card>
            </Box>
          ) : (
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', p: 4, textAlign: 'center' }}>
              <LockIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '16px', fontWeight: 600, mb: 1 }}>
                {t('group_page.private_title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('group_page.private_description')}
              </Typography>
            </Card>
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', p: 2, textAlign: 'center' }}>
              <Avatar
                src={group.avatarUrl}
                alt={group.name}
                variant="rounded"
                sx={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '1/1',
                  borderRadius: '12px',
                  backgroundColor: 'action.hover',
                  color: 'text.secondary',
                  fontSize: '48px',
                  fontWeight: 'bold',
                  mb: 2,
                  border: '1px solid',
                  borderColor: 'divider'
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
                  {t('group_page.manage')}
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
                    backgroundColor: 'action.hover',
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'action.selected' }
                  }}
                >
                  {t('group_page.member_leave')}
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
                  {t('group_page.join')}
                </Button>
              )}
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, px: 0.5 }}>
                <GroupIcon sx={{ color: 'text.secondary', fontSize: '20px' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '14px' }}>
                  {t('group_page.members', { count: memberCount })}
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
                              color: 'primary.main',
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
                  {t('group_page.no_members')}
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
