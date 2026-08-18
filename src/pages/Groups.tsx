import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { IGroup } from '../services/interfaces';
import { groupsService } from '../services/groupsService';

const Groups = () => {
  const { t } = useTranslation();
  const [groups, setGroups] = useState<IGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (activeTab === 2) return;

    const fetchGroups = async () => {
      try {
        setLoading(true);
        setGroups([]);

        let data: IGroup[] = [];
        if (activeTab === 0) {
          data = await groupsService.getAllGroups();
        } else if (activeTab === 1) {
          data = await groupsService.getMyGroups();
        }
        
        setGroups(data);
      } catch (err) {
        console.error('Ошибка при загрузке групп:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [activeTab]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!name.trim() || !slug.trim()) {
      setError(t('groups.create.name_slug_required'));
      setIsSubmitting(false);
      return;
    }

    try {
      const newGroup = await groupsService.createGroup({
        name,
        slug: slug.toLowerCase().replace(/\s+/g, '_'),
        description,
        isPrivate,
      });

      setGroups((prev) => [newGroup, ...prev]);
      setName('');
      setSlug('');
      setDescription('');
      setIsPrivate(false);
      setActiveTab(1);
      alert(t('groups.create.success'));
    } catch (err) {
      console.error(err);
      setError(t('groups.create.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: 'divider' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            px: 2,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '14px',
              minWidth: 'auto',
              px: 2,
            },
          }}
        >
          <Tab label={t('groups.tabs.all')} />
          <Tab label={t('groups.tabs.mine')} />
          <Tab label={t('groups.tabs.create')} />
        </Tabs>
      </Card>

      {(activeTab === 0 || activeTab === 1) && (
        <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {activeTab === 0 ? t('groups.all_available') : t('groups.my_communities')}
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : groups.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 6 }}>
                {activeTab === 0
                  ? t('groups.empty_all')
                  : t('groups.empty_mine')}
              </Typography>
            ) : (
              <List disablePadding>
                {groups.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {index > 0 && <Divider component="li" sx={{ borderColor: 'divider' }} />}
                    <ListItem
                      sx={{ px: 0, py: 1.5 }}
                      secondaryAction={
                        <Button
                          variant="contained"
                          disableElevation
                          href={`/app/groups/${group.slug}`}
                          sx={{
                            backgroundColor: 'action.hover',
                            color: 'primary.main',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '13px',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: 'action.selected' },
                          }}
                        >
                          {t('groups.go_to')}
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={group.avatarUrl}
                          alt={group.name}
                          sx={{
                            width: 48,
                            height: 48,
                            backgroundColor: 'action.hover',
                            color: 'text.secondary',
                            fontWeight: 'bold',
                            border: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          {group.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            component="a"
                            href={`/app/groups/${group.slug}`}
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                              fontWeight: 500,
                              fontSize: '14px',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {group.name}
                          </Typography>
                        }
                        secondary={group.description || t('groups.no_description')}
                        slotProps={{
                          secondary: {
                            noWrap: true,
                            sx: { 
                              fontSize: '12px',
                              color: 'text.secondary',
                              maxWidth: '80%' 
                            }
                          }
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 2 && (
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'divider', p: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 3 }}>
                {t('groups.create.title')}
              </Typography>

              {error && (
                <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: '8px' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleCreateGroup} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '13px', fontWeight: 500 }}>
                    {t('groups.create.name_label')}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('groups.create.name_placeholder')}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'action.hover',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused': { backgroundColor: 'background.paper' },
                        borderRadius: '8px',
                      },
                      '& input': { fontSize: '14px' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '13px', fontWeight: 500 }}>
                    {t('groups.create.slug_label')}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                    placeholder="my_community"
                    required
                    slotProps={{
                      input: {
                        startAdornment: (
                          <Typography variant="body2" sx={{ color: 'text.secondary', mr: 0.5, userSelect: 'none', fontSize: '14px' }}>
                            network/groups/
                          </Typography>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'action.hover',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused': { backgroundColor: 'background.paper' },
                        borderRadius: '8px',
                      },
                      '& input': { fontSize: '14px' }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block', fontSize: '11px' }}>
                    {t('groups.create.slug_hint')}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, fontSize: '13px', fontWeight: 500 }}>
                    {t('groups.create.description_label')}
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('groups.create.description_placeholder')}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'action.hover',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused': { backgroundColor: 'background.paper' },
                        borderRadius: '8px',
                      },
                      '& textarea': { fontSize: '14px' }
                    }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      color="primary"
                      size="small"
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: '14px', userSelect: 'none' }}>
                      {t('groups.create.private_label')}
                    </Typography>
                  }
                />

                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  disabled={isSubmitting}
                  sx={{
                    mt: 1,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    py: 1.2,
                    borderRadius: '8px',
                    backgroundColor: '#2688eb',
                    '&:hover': { backgroundColor: '#227ad2' }
                  }}
                >
                  {isSubmitting ? t('groups.create.submitting') : t('groups.create.submit')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default Groups;
