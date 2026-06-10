import { useState, useRef, useEffect } from "react";
import { Avatar, Box, TextField, IconButton, Typography } from "@mui/material";
import { 
  AddAPhotoOutlined as AddAPhotoIcon,
  VideoCameraFrontOutlined as VideoCallIcon,
  LibraryMusicOutlined as LibraryMusicIcon,
  Add as AddIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import type { Post } from "../services/interfaces";
import PostList from "../components/business/posts/PostList";

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

const dummyPosts: Post[] = [
  {
    id: "post-1",
    caption: "Створив новий напівпрозорий хедер з ефектом розмиття (blur) за допомогою Material UI! Оцініть дизайн у коментарях. 🚀 #reactjs #materialui #webdesign",
    createdAt: "2026-06-08T14:30:00Z",
    updatedAt: "2026-06-08T14:35:00Z",
    user: {
      id: "user-101",
      email: "alex.dmitrenko@example.com",
      username: "alex_dev",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
      bio: "Frontend Engineer | React & TypeScript enthusiast",
      firstName: "Олексій",
      lastName: "Дмитренко"
    },
    media: [
      {
        id: "media-1",
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        thumbnailUrl: null,
        type: "IMAGE"
      }
    ]
  },
  {
    id: "post-2",
    caption: "Короткий туторіал, як правильно налаштувати `slotProps` замість застарілого `InputProps` у нових версіях MUI v6. Дивіться демо-відео. 🎥",
    createdAt: "2026-06-08T11:15:00Z",
    updatedAt: "2026-06-08T11:15:00Z",
    user: {
      id: "user-102",
      email: "anna.kovalenko@example.com",
      username: "anna_codes",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      bio: "UI/UX Designer & Mobile Developer",
      firstName: "Анна",
      lastName: "Коваленко"
    },
    media: [
      {
        id: "media-2",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
        type: "VIDEO"
      }
    ]
  },
  {
    id: "post-3",
    caption: "Записав новий подкаст про тренди фронтенд-розробки, використання i18next та архітектуру сучасних SPA додатків. Слухайте прямо тут! 🎧👇",
    createdAt: "2026-06-07T18:00:00Z",
    updatedAt: "2026-06-07T18:22:00Z",
    user: {
      id: "user-103",
      email: "ivan.p@example.com",
      username: "ivan_p",
      avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80",
      bio: null,
      firstName: "Іван",
      lastName: null
    },
    media: [
      {
        id: "media-3",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        thumbnailUrl: null,
        type: "AUDIO"
      }
    ]
  },
  {
    id: "post-4",
    caption: "Просто гарний сонячний день у горах. Всім продуктивного тижня та чистого коду без багів! 🌲⛰️",
    createdAt: "2026-06-06T09:00:00Z",
    updatedAt: "2026-06-06T09:00:00Z",
    user: {
      id: "user-104",
      email: "kateryna.shev@example.com",
      username: "katya_travel",
      avatarUrl: null, // Користувач без аватарки (для тестування дефолтних ініціалів у MUI Avatar)
      bio: "Traveler & Lifestyle blogger",
      firstName: "Катерина",
      lastName: "Шевченко"
    },
    media: [
      {
        id: "media-4_1",
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
        thumbnailUrl: null,
        type: "IMAGE"
      },
      {
        id: "media-4_2",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        thumbnailUrl: null,
        type: "IMAGE"
      }
    ]
  },
  {
    id: "post-5",
    caption: null,
    createdAt: "2026-06-05T21:40:00Z",
    updatedAt: "2026-06-05T21:40:00Z",
    user: {
      id: "user-105",
      email: "incognito@example.com",
      username: "anonymous",
      avatarUrl: null,
      bio: null,
      firstName: null,
      lastName: null
    },
    media: [
      {
        id: "media-5",
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
        thumbnailUrl: null,
        type: "IMAGE"
      }
    ]
  }
];

const Feed = () => {
  const scrollContainerRef = useRef(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

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
        <Box
          sx={{
            p: '10px 20px',
            border: '1px solid #DCE1E5',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
            bgcolor: 'white',
            mb: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexShrink: 0
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Avatar 
              alt='ava'
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              sx={{ width: 32, height: 32 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder='What is new?'
              sx={{
                "& .MuiOutlinedInput-root": {
                  width: '100%',
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "transparent" },
                  "&.Mui-focused fieldset": { borderColor: "transparent" },
                },
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton><AddAPhotoIcon /></IconButton>
            <IconButton><VideoCallIcon /></IconButton>
            <IconButton><LibraryMusicIcon /></IconButton>
          </Box>
        </Box>

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
          <PostList posts={dummyPosts} />
        </Box>
      </Box>
      <Box sx={{ width: '200px', flexShrink: 0 }}>FILTER</Box>
    </Box>
  );
};

export default Feed;
