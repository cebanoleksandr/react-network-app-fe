import { type FC } from 'react';
import BasePopup from './BasePopup';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button, IconButton, Typography, Box, alpha } from '@mui/material';

interface IProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

const DeleteAvaPopup: FC<IProps> = ({ isVisible, onClose, onDelete }) => {
  return (
    <BasePopup isVisible={isVisible} onClose={onClose}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton
            onClick={onClose}
            sx={{ color: '#6B7280', '&:hover': { bgcolor: alpha('#ffffff', 0.8) } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography
          variant="h4"
          component="h3"
          align='center'
          sx={{ fontWeight: 500, color: '#111827', mb: '8px' }}
        >
          Delete avatar
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#6B7280', mb: '24px' }}>
          Are you sure that you want to delete your avatar?
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            color="inherit"
            sx={{
              color: '#374151',
              borderColor: alpha('#ffffff', 0.8),
              fontWeight: 500,
            }}
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

export default DeleteAvaPopup;
