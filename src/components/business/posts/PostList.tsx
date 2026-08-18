import { Box, Typography } from "@mui/material";
import { Article as ArticleIcon } from '@mui/icons-material';
import { useTranslation } from "react-i18next";
import type { Post } from "../../../services/interfaces";
import type { FC } from "react";
import PostItem from "./PostItem";
import { AnimatePresence } from "framer-motion";

interface IProps {
  posts: Post[];
}

const PostList: FC<IProps> = ({ posts }) => {
  const { t } = useTranslation();

  return (
    <Box>
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
            {t('posts.empty.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('posts.empty.description')}
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
