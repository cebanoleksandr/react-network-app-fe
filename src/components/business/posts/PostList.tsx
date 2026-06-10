import { Box } from "@mui/material";
import type { Post } from "../../../services/interfaces";
import type { FC } from "react";
import PostItem from "./PostItem";

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
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </Box>
  );
};

export default PostList;
