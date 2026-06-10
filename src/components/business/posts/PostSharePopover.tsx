import type { FC } from "react";
import { Popover, Box, MenuItem, ListItemIcon, ListItemText, MenuList, Typography } from "@mui/material";
import { 
  ContentCopy as ContentCopyIcon, 
  Send as SendIcon, 
  Campaign as CampaignIcon 
} from '@mui/icons-material';
import { motion } from "framer-motion";

interface IShareProps {
  postId: string;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const PostSharePopover: FC<IShareProps> = ({ postId, anchorEl, onClose }) => {
  const isOpen = Boolean(anchorEl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://yourapp.com/post/${postId}`);
    console.log("Посилання скопійовано для поста:", postId);
    onClose();
  };

  const handleSendDirect = () => {
    console.log("Надіслати в ПП пост:", postId);
    onClose();
  };

  const handleShareToFeed = () => {
    console.log("Опублікувати у своїй стрічці пост:", postId);
    onClose();
  };

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
            mt: -1
          }
        }
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 15, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        sx={{
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          border: '1px solid #EAEAEA',
          overflow: 'hidden',
          p: 0.5,
          minWidth: '200px'
        }}
      >
        <MenuList>
          <MenuItem onClick={handleShareToFeed} sx={{ py: 1, borderRadius: '8px' }}>
            <ListItemIcon><CampaignIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: 14 }}>Поділитись у стрічці</Typography>} />
          </MenuItem>
          
          <MenuItem onClick={handleSendDirect} sx={{ py: 1, borderRadius: '8px' }}>
            <ListItemIcon><SendIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: 14 }}>Надіслати в ПП</Typography>} />
          </MenuItem>

          <MenuItem onClick={handleCopyLink} sx={{ py: 1, borderRadius: '8px' }}>
            <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
            <ListItemText primary={<Typography sx={{ fontSize: 14 }}>Скопіювати посилання</Typography>} />
          </MenuItem>
        </MenuList>
      </Box>
    </Popover>
  );
};

export default PostSharePopover;
