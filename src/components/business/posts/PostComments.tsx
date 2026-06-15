import { type FC, useState, useEffect } from "react";
import { Box, Typography, Avatar, TextField, Button, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import { PostsService } from "../../../services/posts.service";
import type { Comment } from "../../../services/interfaces";

interface ICommentsProps {
  postId: string;
}

const PostComments: FC<ICommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const data = await PostsService.getComments(postId);
        setComments(data);
      } catch (error) {
        console.error("Помилка завантаження коментарів:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await PostsService.addComment(postId, commentText);
      
      setComments((prev) => [...prev, newComment]); 
      
      setCommentText("");
    } catch (error) {
      console.error("Помилка при додаванні коментаря:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

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
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSubmitting}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <Button 
          variant="contained" 
          size="small" 
          onClick={handleAddComment}
          disabled={isSubmitting || !commentText.trim()}
          sx={{ borderRadius: '20px', textTransform: 'none', minWidth: '60px' }}
        >
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "OK"}
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
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : comments.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 1 }}>
            Коментарів поки немає. Будьте першим!
          </Typography>
        ) : (
          comments.map((comment) => (
            <Box key={comment.id} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Avatar src={comment.user?.avatarUrl} sx={{ width: 32, height: 32 }} />
              <Box sx={{ bgcolor: "#F0F2F5", p: "8px 12px", borderRadius: "12px", maxWidth: "85%" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                  {comment.user?.firstName} {comment.user?.lastName}
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#1C1F23" }}>
                  {comment.text}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default PostComments;
