import type { FC } from "react";
import { Box, Typography, Avatar, TextField, Button } from "@mui/material";
import { motion } from "framer-motion";

interface ICommentsProps {
  postId: string;
}

const PostComments: FC<ICommentsProps> = ({ postId }) => {
  // Тут буде твоя майбутня логіка отримання коментарів з API
  // Для прикладу додамо мокові дані
  const mockComments = [
    { id: "1", user: { name: "Ivan Dobronravov", avatar: "" }, text: "Крутий пост! Чекаю на продовження." },
    { id: "2", user: { name: "Anna Kovalenko", avatar: "" }, text: "Дуже гарні фото, на що знімали?" },
    { id: "3", user: { name: "Ivan Dobronravov", avatar: "" }, text: "Крутий пост! Чекаю на продовження." },
    { id: "4", user: { name: "Anna Kovalenko", avatar: "" }, text: "Дуже гарні фото, на що знімали?" },
    { id: "5", user: { name: "Ivan Dobronravov", avatar: "" }, text: "Крутий пост! Чекаю на продовження." },
    { id: "6", user: { name: "Anna Kovalenko", avatar: "" }, text: "Дуже гарні фото, на що знімали?" },
  ];

  return (
    <Box
      component={motion.div}
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      sx={{ 
        overflow: "hidden",
        borderTop: "1px solid #EAEAEA",
        mt: 1,
        pt: 2 
      }}
    >
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Напишіть коментар..."
          variant="outlined"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <Button variant="contained" size="small" sx={{ borderRadius: '20px', textTransform: 'none' }}>
          OK
        </Button>
      </Box>

      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2, 
        maxHeight: "300px", 
        overflowY: "auto",
        scrollbarWidth: "thin",
      }}>
        {mockComments.map((comment) => (
          <Box key={comment.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
            <Avatar src={comment.user.avatar} sx={{ width: 32, height: 32 }} />
            <Box sx={{ bgcolor: "#F0F2F5", p: "8px 12px", borderRadius: "12px", maxWidth: "85%" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{comment.user.name}</Typography>
              <Typography sx={{ fontSize: 13, color: "#1C1F23" }}>{comment.text}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PostComments;
