import { useState, useRef, useEffect, type ChangeEvent } from "react";
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
import type { IStory } from "../services/interfaces";
import { StoriesService } from "../services/storyService";
import { StoriesViewerPopup } from "../components/popups/StoriesViewerPopup";

const Feed = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoriesLoading, setIsStoriesLoading] = useState(true);
  const [isStoryCreating, setIsStoryCreating] = useState(false);
  const [stories, setStories] = useState<IStory[]>([]);
  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<FeedFilter>(FEED_FILTERS.FEED);
  const [selectedGroup, setSelectedGroup] = useState<{ username: string; avatarUrl: string | null; stories: IStory[] } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const { items: posts } = useAppSelector(state => state.posts);
  const { item: currentUser } = useAppSelector(state => state.user);
  
  const dispatch = useAppDispatch();

  const getPosts = async () => {
    try {
      const response = await PostsService.getFeed(page);
      dispatch(setPostsAC(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const getSavedPosts = async () => {
    setPage(() => 1);
    try {
      const response = await PostsService.getBookmarkedPosts(page);
      dispatch(setPostsAC(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const getFavoritePosts = async () => {
    setPage(() => 1);
    try {
      const response = await PostsService.getFavoritePosts(page);
      dispatch(setPostsAC(response.data));
    } catch (error) {
      console.error(error);
    }
  };

  const loadStories = async () => {
    try {
      const data = await StoriesService.getFeedStories();
      setStories(data);
    } catch (error) {
      console.error("Помилка при завантаженні історій:", error);
    } finally {
      setIsStoriesLoading(false);
    }
  };

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
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStories();
    }, 0);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData();
    }, 0);
    return () => {
      clearTimeout(timer);
      dispatch(setPostsAC([]));
    };
  }, [selectedFilter]);

  const groupedStories = Object.values(
    stories.reduce((acc, story) => {
      if (!acc[story.user.id]) {
        acc[story.user.id] = {
          userId: story.user.id,
          username: story.user.username,
          avatarUrl: story.user.avatarUrl,
          stories: [],
        };
      }
      acc[story.user.id].stories.push(story);
      return acc;
    }, {} as Record<string, { userId: string; username: string; avatarUrl: string | null; stories: IStory[] }>)
  );

  const checkScrollLimits = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftBtn(scrollLeft > 1);
      setShowRightBtn(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
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
  }, [stories]);

  const handleOpenStories = (group: { username: string; avatarUrl: string | null; stories: IStory[] }) => {
    setSelectedGroup(group);
    setIsViewerOpen(true);
  };

  const handleCreateStoryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const file = files[0];
    setIsStoryCreating(true);
  
    try {
      const newStory = await StoriesService.createStory(file);
  
      setStories((prev) => [newStory, ...prev]);
    } catch (error) {
      console.error("Не вдалося створити історію:", error);
    } finally {
      setIsStoryCreating(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, maxWidth: '100%', overflow: 'hidden', height: '100%' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        style={{ display: "none" }}
      />

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
              alignItems: 'center', minHeight: '82px'
            }}
          >
            <Box 
              onClick={handleCreateStoryClick}
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                minWidth: '64px', 
                flexShrink: 0, 
                cursor: 'pointer',
                opacity: isStoryCreating ? 0.6 : 1,
                pointerEvents: isStoryCreating ? 'none' : 'auto'
              }}
            >
              <Box sx={{ position: 'relative', width: 56, height: 56, mb: 0.5 }}>
                <Avatar 
                  src={currentUser?.avatarUrl || undefined} 
                  sx={{ width: '100%', height: '100%', border: '2px solid white' }}
                >
                  {currentUser?.username?.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box sx={{ position: 'absolute', bottom: -2, right: -2, bgcolor: '#4A76A8', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid white', color: 'white' }}>
                  {isStoryCreating ? (
                    <CircularProgress size={10} color="inherit" />
                  ) : (
                    <AddIcon sx={{ fontSize: '14px' }} />
                  )}
                </Box>
              </Box>
              <Typography variant="caption" noWrap sx={{ maxWidth: 64, color: '#65676B', fontSize: '11px' }}>
                {isStoryCreating ? "Uploading..." : "Your story"}
              </Typography>
            </Box>

            {isStoriesLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              groupedStories.map((group) => (
                <Box 
                  key={group.userId} 
                  onClick={() => handleOpenStories(group)}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '64px', flexShrink: 0, cursor: 'pointer', '&:hover img': { transform: 'scale(1.05)' } }}
                >
                  <Box sx={{ p: '2px', borderRadius: '50%', background: 'linear-gradient(45deg, #06B6D4 0%, #4F46E5 50%, #FF007A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                    <Avatar src={group.avatarUrl || undefined} sx={{ width: 52, height: 52, border: '2px solid white', transition: 'transform 0.2s ease' }}>
                      {group.username.substring(0, 2).toUpperCase()}
                    </Avatar>
                  </Box>
                  <Typography variant="caption" noWrap sx={{ maxWidth: 64, color: '#222222', fontSize: '11px' }}>
                    {group.username}
                  </Typography>
                </Box>
              ))
            )}
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
          <Typography>🔥 Interesting first</Typography>
          <Switch />
        </Box>
      </Box>

      {selectedGroup && (
        <StoriesViewerPopup
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedGroup(null);
          }}
          username={selectedGroup.username}
          avatarUrl={selectedGroup.avatarUrl}
          stories={selectedGroup.stories}
        />
      )}
    </Box>
  );
};

export default Feed;
