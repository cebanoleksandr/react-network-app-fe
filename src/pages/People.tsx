import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Tabs,
  Tab,
  TextField,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  InputAdornment,
  Divider,
  IconButton
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ChatIcon from "@mui/icons-material/Chat";
import type { User } from "../services/interfaces";
import { UsersService } from "../services/users.service";
import { ChatsService } from "../services/chats.service";
import { useAppSelector } from "../store/hooks";

const People = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [globalUsers, setGlobalUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [loadingRelations, setLoadingRelations] = useState(false);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);

  const { item: currentUser } = useAppSelector(state => state.user);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchGlobalUsers = async (pageNum: number, search: string) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await UsersService.getAllUsers({
        page: pageNum,
        limit: 10,
        search: search || undefined,
      });

      setGlobalUsers((prev) => {
        return pageNum === 1 ? response.data : [...prev, ...response.data];
      });
      setHasMore(response.meta.currentPage < response.meta.totalPages);
    } catch (error) {
      console.error("Помилка завантаження користувачів:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadRelations = async () => {
    if (!currentUser?.id) return;
    setLoadingRelations(true);
    try {
      const [followersData, followingData] = await Promise.all([
        UsersService.getFollowers(currentUser.id),
        UsersService.getFollowing(currentUser.id),
      ]);
      setFollowers(followersData);
      setFollowing(followingData);
    } catch (error) {
      console.error("Помилка завантаження зв'язків:", error);
    } finally {
      setLoadingRelations(false);
    }
  };

  useEffect(() => {
    const startFetching = async () => {
      if (activeTab === 0) {
        await fetchGlobalUsers(page, searchQuery);
      } else if (activeTab === 1 || activeTab === 2) {
        await loadRelations();
      }
    };

    startFetching();
  }, [searchQuery, activeTab, page]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setPage(1); 
    setHasMore(true);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1); 
    setHasMore(true);
  };

  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && activeTab === 0) {
          setPage((prevPage) => prevPage + 1); 
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, activeTab]
  );

  const handleToggleFollow = async (userId: string) => {
    try {
      await UsersService.toggleFollow(userId);
      await loadRelations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartChat = async (userId: string) => {
    try {
      setLoadingChatId(userId);
      const chatRoom = await ChatsService.getOrCreateRoom(userId);
      navigate(`/app/chat/${chatRoom.id}`);
    } catch (error) {
      console.error("Не вдалося відкрити діалог:", error);
    } finally {
      setLoadingChatId(null);
    }
  };

  const handleNavigateToProfile = (userId: string) => {
    if (userId === currentUser?.id) {
      navigate(`/app/profile/${currentUser?.id}`);
    } else {
      navigate(`/app/profile/${userId}`);
    }
  };

  const filterLocalUsers = (usersList: User[]) => {
    return usersList.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.username}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  };

  const displayedUsers = activeTab === 0 
    ? globalUsers 
    : activeTab === 1 
      ? filterLocalUsers(followers) 
      : filterLocalUsers(following);

  const isFollowingUser = (userId: string) => following.some((f) => f.id === userId);

  return (
    <Box sx={{ bgcolor: "#ededf0", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="sm">
        <Card variant="outlined" sx={{ borderRadius: "12px", mb: 2, borderColor: "#e7e8ec", boxShadow: "none" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              px: 2,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": { textTransform: "none", fontWeight: 500, fontSize: "15px" },
            }}
          >
            <Tab label={t("pages.people")} />
            <Tab label={`${t("pages.followers")} ${followers.length ? `(${followers.length})` : ""}`} />
            <Tab label={`${t("pages.following")} ${following.length ? `(${following.length})` : ""}`} />
          </Tabs>

          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder={t("actions.search")}
              value={searchQuery}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#939393" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#f5f5f7",
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "#e7e8ec" },
                  "&.Mui-focused fieldset": { borderColor: "#447bba", borderWidth: "1px" },
                },
              }}
            />
          </Box>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: "12px", borderColor: "#e7e8ec", boxShadow: "none" }}>
          <CardContent sx={{ p: "0px !important" }}>
            {loadingRelations && displayedUsers.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={30} sx={{ color: "#447bba" }} />
              </Box>
            ) : displayedUsers.length === 0 ? (
              <Typography align="center" sx={{ color: "#828282", py: 4, fontSize: "14px" }}>
                Users not found
              </Typography>
            ) : (
              displayedUsers.map((user, index) => {
                const isLast = index === displayedUsers.length - 1;
                const amIFollowing = isFollowingUser(user.id);
                const isMe = user.id === currentUser?.id;
                const isChatRoomOpening = loadingChatId === user.id;

                return (
                  <div key={user.id} ref={isLast && activeTab === 0 ? lastUserElementRef : null}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        "&:hover": { bgcolor: "#f9f9fa" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={user.avatarUrl}
                          onClick={() => handleNavigateToProfile(user.id)}
                          sx={{ width: 60, height: 60, bgcolor: "#447bba", cursor: "pointer" }}
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography
                            onClick={() => handleNavigateToProfile(user.id)}
                            sx={{
                              fontWeight: 600,
                              color: "#2a5885",
                              cursor: "pointer",
                              fontSize: "14px",
                              "&:hover": { textDecoration: "underline" },
                            }}
                          >
                            {user.firstName || user.lastName
                              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                              : `@${user.username}`}
                            {isMe && ` (${t("Перегляд профілю") || "Ви"})`}
                          </Typography>
                          {user.firstName && user.lastName && (
                            <Typography sx={{ color: "#828282", fontSize: "12px" }}>
                              @{user.username}
                            </Typography>
                          )}
                          {user.bio && (
                            <Typography sx={{ color: "#000", fontSize: "13px", mt: 0.5 }} noWrap>
                              {user.bio}
                            </Typography>
                          )}
                        </Box>
                      </Box>

                      {!isMe && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleStartChat(user.id)}
                            disabled={isChatRoomOpening}
                            sx={{
                              color: "#447bba",
                              bgcolor: "#f0f2f5",
                              borderRadius: "8px",
                              p: "7px",
                              "&:hover": { bgcolor: "#e4e6e9" }
                            }}
                          >
                            {isChatRoomOpening ? (
                              <CircularProgress size={18} sx={{ color: "#447bba" }} />
                            ) : (
                              <ChatIcon fontSize="small" />
                            )}
                          </IconButton>

                          <Button
                            variant={amIFollowing ? "outlined" : "contained"}
                            size="small"
                            onClick={() => handleToggleFollow(user.id)}
                            sx={{
                              textTransform: "none",
                              borderRadius: "8px",
                              boxShadow: "none",
                              fontSize: "13px",
                              fontWeight: 500,
                              px: 2,
                              ...(amIFollowing
                                ? {
                                    borderColor: "#e7e8ec",
                                    color: "#555",
                                    "&:hover": { bgcolor: "#f0f2f5", borderColor: "#ceccd1" },
                                  }
                                : {
                                    bgcolor: "#447bba",
                                    "&:hover": { bgcolor: "#3b699f", boxShadow: "none" },
                                  }),
                            }}
                          >
                            {amIFollowing ? "Unfollow" : "Follow"}
                          </Button>
                        </Box>
                      )}
                    </Box>
                    {!isLast && <Divider sx={{ borderColor: "#f0f2f5", mx: 2 }} />}
                  </div>
                );
              })
            )}

            {loading && activeTab === 0 && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={24} sx={{ color: "#447bba" }} />
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default People;
