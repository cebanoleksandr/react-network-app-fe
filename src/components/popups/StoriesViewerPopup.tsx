import React, { useState, useEffect } from "react";
import { Box, IconButton, Avatar, Typography, LinearProgress } from "@mui/material";
import { Close as CloseIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { type IStory } from "../../services/interfaces";
import { StoriesService } from "../../services/storyService"; // Імпортуємо сервіс історій

interface StoriesViewerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  avatarUrl: string | null;
  stories: IStory[];
}

const STORY_DURATION = 5000;

export const StoriesViewerPopup: React.FC<StoriesViewerPopupProps> = ({
  isOpen,
  onClose,
  username,
  avatarUrl,
  stories,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let resetTimer: ReturnType<typeof setTimeout> | null = null;
    if (isOpen) {
      resetTimer = setTimeout(() => {
        setCurrentIndex(0);
        setProgress(0);
      }, 0);
    }
    return () => {
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [isOpen, username]);

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;

    const currentStory = stories[currentIndex];
    if (currentStory?.id) {
      StoriesService.viewStory(currentStory.id).catch((error) => {
        console.error("Не вдалося зафіксувати перегляд історії:", error);
      });
    }
  }, [currentIndex, isOpen, stories]);

  useEffect(() => {
    if (!isOpen || stories.length === 0) return;
  
    let resetTimeout: ReturnType<typeof setTimeout> | null = null;
    resetTimeout = setTimeout(() => {
      setProgress(0);
    }, 0);

    const startTime = Date.now();
  
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const calculatedProgress = (elapsedTime / STORY_DURATION) * 100;
  
      if (calculatedProgress >= 100) {
        clearInterval(interval);
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          onClose();
        }
      } else {
        setProgress(calculatedProgress);
      }
    }, 50);
  
    return () => {
      if (resetTimeout) clearTimeout(resetTimeout);
      clearInterval(interval);
    };
  }, [currentIndex, isOpen, stories.length, onClose]);
  
  if (!isOpen || stories.length === 0) return null;
  
  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        bgcolor: "rgba(0, 0, 0, 0.9)", zIndex: 1300, display: "flex",
        alignItems: "center", justifyContent: "center",
      }}
    >
      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 16, right: 16, color: "white", bgcolor: "rgba(255,255,255,0.1)", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
      >
        <CloseIcon />
      </IconButton>

      {currentIndex > 0 && (
        <IconButton onClick={handlePrev} sx={{ position: "absolute", left: 16, color: "white", bgcolor: "rgba(255,255,255,0.05)" }}>
          <ChevronLeftIcon sx={{ fontSize: 40 }} />
        </IconButton>
      )}

      <IconButton onClick={handleNext} sx={{ position: "absolute", right: 16, color: "white", bgcolor: "rgba(255,255,255,0.05)" }}>
        <ChevronRightIcon sx={{ fontSize: 40 }} />
      </IconButton>

      <Box sx={{ width: "100%", maxWidth: "420px", height: "90vh", position: "relative", display: "flex", flexDirection: "column", borderRadius: "8px", overflow: "hidden", bgcolor: "black" }}>
        <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, p: "10px", display: "flex", gap: "4px", zIndex: 10 }}>
          {stories.map((_, index) => (
            <LinearProgress
              key={index}
              variant="determinate"
              value={index === currentIndex ? progress : index < currentIndex ? 100 : 0}
              sx={{
                flexGrow: 1, height: "3px", borderRadius: "2px", bgcolor: "rgba(255, 255, 255, 0.3)",
                "& .MuiLinearProgress-bar": { bgcolor: "white" },
              }}
            />
          ))}
        </Box>

        <Box sx={{ position: "absolute", top: "15px", left: 0, right: 0, p: "0 16px", display: "flex", alignItems: "center", gap: 1.5, zIndex: 10, color: "white" }}>
          <Avatar src={avatarUrl || undefined} sx={{ width: 36, height: 36, border: "1px solid white" }}>
            {username.substring(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{username}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              {new Date(currentStory.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {currentStory.mediaType === 'VIDEO' ? (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story content"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          )}
        </Box>

        {currentStory.caption && (
          <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: "20px", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", color: "white", textAlign: "center" }}>
            <Typography variant="body2">{currentStory.caption}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
