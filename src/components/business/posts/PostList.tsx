import { Box, Typography } from "@mui/material";
import { Article as ArticleIcon } from '@mui/icons-material';
import type { Post } from "../../../services/interfaces";
import type { FC } from "react";
import PostItem from "./PostItem";
import { AnimatePresence } from "framer-motion";

interface IProps {
  posts: Post[];
}

const PostList: FC<IProps> = ({ posts }) => {
  return (
    <Box
      sx={{
        height: "100%",
        overflowY: "auto",
        pr: 1,
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "rgba(0, 0, 0, 0.15)",
          borderRadius: "10px",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
          },
        },
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(0, 0, 0, 0.15) transparent",
      }}
    >
      {!posts.length && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            textAlign: 'center',
            padding: 4,
            opacity: 0.6
          }}
        >
          <ArticleIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" component="h3" gutterBottom>
            There are no posts yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            It looks like nothing has been posted here yet. Check back later!
          </Typography>
        </Box>
      )}

      <AnimatePresence mode="popLayout">
        {posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default PostList;
