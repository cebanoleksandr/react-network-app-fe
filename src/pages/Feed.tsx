import { useState, useRef, useEffect } from "react";
import { Avatar, Box, IconButton, Typography, Switch, CircularProgress } from "@mui/material";
import {
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import PostList from "../components/business/posts/PostList";
import FilterMenu from "../components/business/posts/FilterMenu";
import CreatePostBlock from "../components/business/posts/CreatePostBlock";
import { PostsService } from "../services/posts.service";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setPostsAC } from "../store/postsSlice";
import { FEED_FILTERS, type FeedFilter } from "../components/business/posts/types";

const dummyStories = [
  { id: 1, name: 'Дмитро', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' },
  { id: 2, name: 'Ольга', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
  { id: 3, name: 'Іван', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80' },
  { id: 4, name: 'Анна', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80' },
  { id: 5, name: 'Катерина', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80' },
  { id: 6, name: 'Михайло', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
  { id: 7, name: 'Сергій', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
  { id: 8, name: 'Олена', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80' },
  { id: 9, name: 'Дмитро', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80' },
  { id: 10, name: 'Ольга', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80' },
  { id: 11, name: 'Іван', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80' },
  { id: 12, name: 'Анна', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80' },
  { id: 13, name: 'Катерина', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80' },
  { id: 14, name: 'Михайло', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
  { id: 15, name: 'Сергій', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80' },
  { id: 16, name: 'Олена', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80' },
];

const Feed = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<FeedFilter>(FEED_FILTERS.FEED);

  const { items: posts } = useAppSelector(state => state.posts);

  const dispatch = useAppDispatch();

  const getPosts = async () => {
    try {
      const response = await PostsService.getFeed(page);
      dispatch(setPostsAC(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  const getSavedPosts = async () => {
    setPage(() => 1);
    try {
      const response = await PostsService.getBookmarkedPosts(page);
      dispatch(setPostsAC(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  const getFavoritePosts = async () => {
    setPage(() => 1);
    try {
      const response = await PostsService.getFavoritePosts(page);
      dispatch(setPostsAC(response.data));
    } catch (error) {
      console.error(error);
    }
  }

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (selectedFilter === FEED_FILTERS.FEED) {
        await getPosts();
      }
      if (selectedFilter === FEED_FILTERS.SAVED) {
        await getSavedPosts();
      }
      if (selectedFilter === FEED_FILTERS.FAVORITE) {
        await getFavoritePosts();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => {
      clearTimeout(timer);
      dispatch(setPostsAC([]));
    };
  }, [selectedFilter]);

  const checkScrollLimits = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftBtn(scrollLeft > 1);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth * 0.75 : clientWidth * 0.75;
      
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    checkScrollLimits();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollLimits);
      window.addEventListener("resize", checkScrollLimits);
    }
    return () => {
      if (container) container.removeEventListener("scroll", checkScrollLimits);
      window.removeEventListener("resize", checkScrollLimits);
    };
  }, []);

  return (
    <Box sx={{ display: 'flex', gap: 2, maxWidth: '100%', overflow: 'hidden', height: '100%' }}>
      <Box 
        sx={{ 
          flexGrow: 1, 
          minWidth: 0, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <CreatePostBlock onPostCreated={getPosts} />

        <Box
          sx={{
            p: '12px 20px',
            border: '1px solid #DCE1E5',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
            bgcolor: 'white',
            mb: '16px',
            maxWidth: '100%',
            position: 'relative',
            flexShrink: 0,
            '&:hover .story-nav-btn': { opacity: 1 }
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 1.5, color: '#222222' }}>
            Stories
          </Typography>

          {showLeftBtn && (
            <IconButton
              className="story-nav-btn"
              onClick={() => handleScroll("left")}
              sx={{
                position: 'absolute', left: 8, top: '55%', transform: 'translateY(-50%)', zIndex: 2,
                bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #E1E3E6',
                width: 32, height: 32, opacity: 0.8, transition: 'all 0.2s', '&:hover': { bgcolor: '#F5F7FA', opacity: 1 }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          )}

          {showRightBtn && (
            <IconButton
              className="story-nav-btn"
              onClick={() => handleScroll("right")}
              sx={{
                position: 'absolute', right: 8, top: '55%', transform: 'translateY(-50%)', zIndex: 2,
                bgcolor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', border: '1px solid #E1E3E6',
                width: 32, height: 32, opacity: 0.8, transition: 'all 0.2s', '&:hover': { bgcolor: '#F5F7FA', opacity: 1 }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          )}

          <Box
            ref={scrollContainerRef}
            sx={{
              display: 'flex', gap: 2, overflowX: 'auto', whiteSpace: 'nowrap', pb: 1, WebkitOverflowScrolling: 'touch',
              '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '64px', flexShrink: 0, cursor: 'pointer' }}>
              <Box sx={{ position: 'relative', width: 56, height: 56, mb: 0.5 }}>
                <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" sx={{ width: '100%', height: '100%', border: '2px solid white' }} />
                <Box sx={{ position: 'absolute', bottom: -2, right: -2, bgcolor: '#4A76A8', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', color: 'white' }}>
                  <AddIcon sx={{ fontSize: '14px' }} />
                </Box>
              </Box>
              <Typography variant="caption" noWrap sx={{ maxWidth: 64, color: '#65676B', fontSize: '11px' }}>Your story</Typography>
            </Box>

            {dummyStories.map((story) => (
              <Box key={story.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '64px', flexShrink: 0, cursor: 'pointer', '&:hover img': { transform: 'scale(1.05)' } }}>
                <Box sx={{ p: '2px', borderRadius: '50%', background: 'linear-gradient(45deg, #06B6D4 0%, #4F46E5 50%, #FF007A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                  <Avatar src={story.avatar} sx={{ width: 52, height: 52, border: '2px solid white', transition: 'transform 0.2s ease' }} />
                </Box>
                <Typography variant="caption" noWrap sx={{ maxWidth: 64, color: '#222222', fontSize: '11px' }}>{story.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : (
            <PostList posts={posts} />
          )}
        </Box>
      </Box>
      <Box sx={{ width: '280px', flexShrink: 0 }}>
        <FilterMenu selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} />

        <Box
          sx={{
            p: '4px',
            border: '1px solid #DCE1E5',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
            bgcolor: 'white',
            my: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography>
            🔥 Interesting first
          </Typography>

          <Switch />
        </Box>
      </Box>
    </Box>
  );
};

export default Feed;
