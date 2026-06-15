import { useState } from 'react';
import { 
  Box, List, ListItem, ListItemButton, ListItemText, Typography, 
  IconButton, Divider, Menu, MenuItem
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';

const FilterMenu = () => {
  const allTabs = ['Фотографии', 'Друзья', 'Сообщества'];
  const [activeTabs, setActiveTabs] = useState(['Фотографии', 'Друзья', 'Сообщества']);
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const mainBottomMenu = ['Рекомендации', 'Поиск'];
  const absoluteBottomMenu = ['Реакции', 'Обновления', 'Комментарии'];

  const handlePlusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleTab = (tab) => {
    if (activeTabs.includes(tab)) {
      setActiveTabs(activeTabs.filter((t) => t !== tab));
    } else {
      setActiveTabs([...activeTabs, tab]);
    }
  };

  return (
    <Box
      sx={{
        p: '4px',
        border: '1px solid #E7E8EC',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        bgcolor: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <List disablePadding>
        <ListItem
          disablePadding
          secondaryAction={
            <Box sx={{ display: 'flex', gap: '4px' }}>
              <IconButton edge="end" size="small" sx={{ color: '#99A2AD' }}>
                <TuneIcon fontSize="small" />
              </IconButton>
              <IconButton 
                edge="end" 
                size="small" 
                onClick={handlePlusClick}
                sx={{ 
                  color: '#99A2AD',
                  bgcolor: isMenuOpen ? '#F0F2F5' : 'transparent' 
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          }
          sx={{ bgcolor: '#F5F6F8', borderRadius: '8px', mb: '4px' }}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>Новости</Typography>}
            />
          </ListItemButton>
        </ListItem>

        {activeTabs.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '6px', '&:hover': { bgcolor: '#F0F2F5' } }}>
              <ListItemText primary={<Typography sx={{ fontSize: '14px', color: '#2c2c2c' }}>{text}</Typography>} />
            </ListItemButton>
          </ListItem>
        ))}

        {mainBottomMenu.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '6px', '&:hover': { bgcolor: '#F0F2F5' } }}>
              <ListItemText primary={<Typography sx={{ fontSize: '14px', color: '#2c2c2c' }}>{text}</Typography>} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: '6px', borderColor: '#E7E8EC' }} />

        {absoluteBottomMenu.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '6px', '&:hover': { bgcolor: '#F0F2F5' } }}>
              <ListItemText primary={<Typography sx={{ fontSize: '14px', color: '#2c2c2c' }}>{text}</Typography>} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        disableScrollLock
        elevation={0}
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
              width: '220px',
              mt: '8px',
              border: '1px solid #E7E8EC',
              borderRadius: '10px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              p: '4px',
            }
          }
        }}
      >
        {allTabs.map((tab) => {
          const isChecked = activeTabs.includes(tab);
          return (
            <MenuItem
              key={tab}
              onClick={() => handleToggleTab(tab)}
              dense
              sx={{
                p: '6px 12px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: '#2c2c2c',
                '&:hover': { bgcolor: '#F0F2F5' },
              }}
            >
              <Box sx={{ width: '20px', display: 'flex', justifyContent: 'center', color: '#5288c1' }}>
                {isChecked ? <CheckIcon sx={{ fontSize: '18px' }} /> : null}
              </Box>
              <ListItemText primary={<Typography sx={{ fontSize: '14px' }}>{tab}</Typography>} />
            </MenuItem>
          );
        })}

        <Divider sx={{ my: '4px', borderColor: '#E7E8EC' }} />

        <MenuItem
          onClick={handleMenuClose}
          dense
          sx={{
            p: '6px 12px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#5288c1',
            fontWeight: 500,
            '&:hover': { bgcolor: '#F0F2F5' },
          }}
        >
          <Box sx={{ width: '20px', display: 'flex', justifyContent: 'center' }}>
            <AddIcon sx={{ fontSize: '18px' }} />
          </Box>
          <ListItemText primary={<Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Добавить вкладку</Typography>} />
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FilterMenu;
