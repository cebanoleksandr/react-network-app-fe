import { 
  Box, List, ListItem, ListItemButton, ListItemText, Typography,
} from '@mui/material';
import { FEED_FILTERS, type FeedFilter } from './types';
import type { FC } from 'react';

interface IProps {
  selectedFilter: FeedFilter;
  setSelectedFilter: (value: FeedFilter) => void;
}

const FilterMenu: FC<IProps> = ({ selectedFilter, setSelectedFilter }) => {
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
          sx={{
            borderRadius: '8px',
            mb: '4px',
            ...(selectedFilter === FEED_FILTERS.FEED ? { bgcolor: '#F5F6F8' } : {}),
          }}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }} onClick={() => setSelectedFilter(FEED_FILTERS.FEED)}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>Feed</Typography>}
            />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          sx={{
            borderRadius: '8px',
            mb: '4px',
            ...(selectedFilter === FEED_FILTERS.SAVED ? { bgcolor: '#F5F6F8' } : {}),
          }}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }} onClick={() => setSelectedFilter(FEED_FILTERS.SAVED)}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>Saved</Typography>}
            />
          </ListItemButton>
        </ListItem>

        <ListItem
          disablePadding
          sx={{
            borderRadius: '8px',
            mb: '4px',
            ...(selectedFilter === FEED_FILTERS.FAVORITE ? { bgcolor: '#F5F6F8' } : {}),
          }}
        >
          <ListItemButton dense sx={{ p: '8px 16px', borderRadius: '8px' }} onClick={() => setSelectedFilter(FEED_FILTERS.FAVORITE)}>
            <ListItemText
              primary={<Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>Favorite</Typography>}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default FilterMenu;
