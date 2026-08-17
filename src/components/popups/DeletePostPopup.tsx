import { type FC } from 'react';
import BasePopup from './BasePopup';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, IconButton, Typography, Box } from '@mui/material';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeletePostPopup: FC<IProps> = ({ isVisible, onClose, onDelete }) => {
  return (
    <BasePopup isVisible={isVisible} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton
            onClick={onClose}
            sx={(theme) => ({ color: theme.palette.text.secondary, '&:hover': { bgcolor: theme.palette.action.hover } })}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h4"
          component="h3"
          align='center'
          sx={(theme) => ({ fontWeight: 500, color: theme.palette.text.primary, mb: '8px' })}
        >
          Delete post
        </Typography>

        <Typography variant="body2" align="center" sx={(theme) => ({ color: theme.palette.text.secondary, mb: '24px' })}>
          Are you sure that you want to delete this post?
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={(theme) => ({
              color: theme.palette.text.primary,
              borderColor: theme.palette.divider,
              fontWeight: 500,
            })}
            startIcon={<ArrowBackIcon />}
          >
            Cancel
          </Button>

          <Button
            onClick={onDelete}
            sx={{
              color: 'white',
              bgcolor: '#E64646',
              fontWeight: 500,
              '&:hover': { opacity: 0.8 },
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </BasePopup>
  );
};

export default DeletePostPopup;
