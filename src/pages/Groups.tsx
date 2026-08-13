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
import type { IGroup } from '../services/interfaces';
import { groupsService } from '../services/groupsService';

const Groups = () => {
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
      setError('Название сообщества и короткий адрес обязательны для заполнения');
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
      alert('Сообщество успешно создано!');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Не удалось создать сообщество. Возможно, этот адрес уже занят.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 3, mb: 4 }}>
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, borderColor: '#e7e8ec' }}>
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
          <Tab label="Все сообщества" />
          <Tab label="Мои сообщества" />
          <Tab label="Создать сообщество" />
        </Tabs>
      </Card>

      {(activeTab === 0 || activeTab === 1) && (
        <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              {activeTab === 0 ? 'Все доступные сообщества' : 'Мои сообщества'}
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress size={30} />
              </Box>
            ) : groups.length === 0 ? (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 6 }}>
                {activeTab === 0 
                  ? 'В системе пока нет ни одного публичного сообщества.' 
                  : 'Вы еще не подписаны ни на одно сообщество. Вы можете найти их во вкладке "Все сообщества" или создать своё!'}
              </Typography>
            ) : (
              <List disablePadding>
                {groups.map((group, index) => (
                  <React.Fragment key={group.id}>
                    {index > 0 && <Divider component="li" sx={{ borderColor: '#e7e8ec' }} />}
                    <ListItem
                      sx={{ px: 0, py: 1.5 }}
                      secondaryAction={
                        <Button
                          variant="contained"
                          disableElevation
                          href={`/app/groups/${group.slug}`}
                          sx={{
                            backgroundColor: '#f0f2f5',
                            color: '#2a5885',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '13px',
                            borderRadius: '8px',
                            '&:hover': { backgroundColor: '#e4e6e9' },
                          }}
                        >
                          Перейти
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
                            backgroundColor: '#f0f2f5',
                            color: '#828282',
                            fontWeight: 'bold',
                            border: '1px solid #e7e8ec'
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
                              color: '#2a5885',
                              textDecoration: 'none',
                              fontWeight: 500,
                              fontSize: '14px',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            {group.name}
                          </Typography>
                        }
                        secondary={group.description || 'Описание отсутствует'}
                        slotProps={{
                          secondary: {
                            noWrap: true,
                            sx: { 
                              fontSize: '12px',
                              color: '#818c99',
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
          <Card variant="outlined" sx={{ borderRadius: 3, borderColor: '#e7e8ec', p: 2 }}>
            <CardContent>
              <Typography variant="h6" align="center" sx={{ fontWeight: 600, mb: 3 }}>
                Создание сообщества
              </Typography>

              {error && (
                <Alert severity="error" variant="outlined" sx={{ mb: 3, borderRadius: '8px' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleCreateGroup} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#656975', mb: 0.5, fontSize: '13px', fontWeight: 500 }}>
                    Название сообщества
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Например, Любители React"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f2f3f5',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
                        borderRadius: '8px',
                      },
                      '& input': { fontSize: '14px' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#656975', mb: 0.5, fontSize: '13px', fontWeight: 500 }}>
                    Короткий адрес страницы (slug)
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
                          <Typography variant="body2" sx={{ color: '#818c99', mr: 0.5, userSelect: 'none', fontSize: '14px' }}>
                            network/groups/
                          </Typography>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f2f3f5',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
                        borderRadius: '8px',
                      },
                      '& input': { fontSize: '14px' }
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#818c99', mt: 0.5, display: 'block', fontSize: '11px' }}>
                    Можно использовать латиницу, цифры, дефис и нижнее подчеркивание.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#656975', mb: 0.5, fontSize: '13px', fontWeight: 500 }}>
                    Описание сообщества (необязательно)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Добавьте информацию о вашей группе..."
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f2f3f5',
                        '& fieldset': { borderColor: 'transparent' },
                        '&:hover fieldset': { borderColor: 'transparent' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused': { backgroundColor: '#fff' },
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
                      Сделать группу закрытой (вступление только по одобрению)
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
                  {isSubmitting ? 'Создание...' : 'Создать сообщество'}
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
