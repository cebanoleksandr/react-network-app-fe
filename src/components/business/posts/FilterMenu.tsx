import { 
  Box, List, ListItem, ListItemButton, ListItemText, Switch, Typography,
} from '@mui/material';
import { FEED_FILTERS, type FeedFilter } from './types';
import type { FC } from 'react';

interface IProps {
  selectedFilter: FeedFilter;
  setSelectedFilter: (value: FeedFilter) => void;
}

const FilterMenu: FC<IProps> = ({ selectedFilter, setSelectedFilter }) => {
  return (
    <Box sx={{ position: { xs: 'static', md: 'sticky' }, top: '76px' }}>
    <Box
      sx={(theme) => ({
        p: '4px',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        bgcolor: theme.palette.background.paper,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        mb: '8px',
      })}
    >
      <List disablePadding>
        <ListItem
          disablePadding
          sx={(theme) => ({
            borderRadius: '8px',
            mb: '4px',
            ...(selectedFilter === FEED_FILTERS.FEED ? { bgcolor: theme.palette.action.hover } : {}),
          })}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }} onClick={() => setSelectedFilter(FEED_FILTERS.FEED)}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>Feed</Typography>}
            />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          sx={(theme) => ({
            borderRadius: '8px',
            mb: '4px',
            ...(selectedFilter === FEED_FILTERS.SAVED ? { bgcolor: theme.palette.action.hover } : {}),
          })}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }} onClick={() => setSelectedFilter(FEED_FILTERS.SAVED)}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>Saved</Typography>}
            />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          sx={(theme) => ({
            borderRadius: '8px',
            mb: '4px',
            ...(selectedFilter === FEED_FILTERS.FAVORITE ? { bgcolor: theme.palette.action.hover } : {}),
          })}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }} onClick={() => setSelectedFilter(FEED_FILTERS.FAVORITE)}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: 'text.primary' }}>Favorite</Typography>}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>

    <Box
      sx={(theme) => ({
        p: '4px',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
        bgcolor: theme.palette.background.paper,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      })}
    >
      <Typography>🔥 Interesting first</Typography>
      <Switch />
    </Box>
    </Box>
  );
};

export default FilterMenu;
