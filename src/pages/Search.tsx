import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Container,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  CircularProgress,
  Divider,
  IconButton
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import type { User } from "../services/interfaces";
import { UsersService } from "../services/users.service";
import { ChatsService } from "../services/chats.service";
import { useAppSelector } from "../store/hooks";

const Search = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState<User[]>([]);
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);

  const { item: currentUser } = useAppSelector(state => state.user);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchUsers = async (pageNum: number, search: string) => {
    if (!search) {
      setUsers([]);
      return;
    }
    setLoading(true);
    try {
      const response = await UsersService.getAllUsers({
        page: pageNum,
        limit: 10,
        search,
      });

      setUsers((prev) => (pageNum === 1 ? response.data : [...prev, ...response.data]));
      setHasMore(response.meta.currentPage < response.meta.totalPages);
    } catch (error) {
      console.error("Помилка пошуку користувачів:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadFollowing = async () => {
    if (!currentUser?.id) return;
    try {
      const followingData = await UsersService.getFollowing(currentUser.id);
      setFollowing(followingData);
    } catch (error) {
      console.error("Помилка завантаження підписок:", error);
    }
  };

  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setPage(1);
    setHasMore(true);
  }

  useEffect(() => {
    const startFetching = async () => {
      await fetchUsers(page, query);
    };

    startFetching();
  }, [query, page]);

  useEffect(() => {
    const startLoadingFollowing = async () => {
      await loadFollowing();
    };

    startLoadingFollowing();
  }, [currentUser?.id]);

  const lastUserElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const isFollowingUser = (userId: string) => following.some((f) => f.id === userId);

  const handleToggleFollow = async (userId: string) => {
    try {
      await UsersService.toggleFollow(userId);
      await loadFollowing();
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
    navigate(`/app/profile/${userId}`);
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          {query ? `${t("pages.search")}: "${query}"` : t("pages.search")}
        </Typography>

        <Card variant="outlined" sx={{ borderRadius: "12px", borderColor: "divider", boxShadow: "none" }}>
          <CardContent sx={{ p: "0px !important" }}>
            {!query ? (
              <Typography align="center" sx={{ color: "text.secondary", py: 4, fontSize: "14px" }}>
                {t('search.prompt')}
              </Typography>
            ) : loading && users.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                <CircularProgress size={30} sx={{ color: "#447bba" }} />
              </Box>
            ) : users.length === 0 ? (
              <Typography align="center" sx={{ color: "text.secondary", py: 4, fontSize: "14px" }}>
                {t('people.not_found')}
              </Typography>
            ) : (
              users.map((user, index) => {
                const isLast = index === users.length - 1;
                const amIFollowing = isFollowingUser(user.id);
                const isMe = user.id === currentUser?.id;
                const isChatRoomOpening = loadingChatId === user.id;

                return (
                  <div key={user.id} ref={isLast ? lastUserElementRef : null}>
                    <Box
                      sx={(theme) => ({
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        "&:hover": { bgcolor: theme.palette.action.hover },
                      })}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar
                          src={user.avatarUrl || undefined}
                          alt={user.username}
                          onClick={() => handleNavigateToProfile(user.id)}
                          sx={{ width: 60, height: 60, bgcolor: "#447bba", cursor: "pointer" }}
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography
                            onClick={() => handleNavigateToProfile(user.id)}
                            sx={(theme) => ({
                              fontWeight: 600,
                              color: theme.palette.mode === "dark" ? "#8FB8E0" : "#2a5885",
                              cursor: "pointer",
                              fontSize: "14px",
                              "&:hover": { textDecoration: "underline" },
                            })}
                          >
                            {user.firstName || user.lastName
                              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                              : `@${user.username}`}
                            {isMe && ` (${t('people.you_suffix')})`}
                          </Typography>
                          {user.firstName && user.lastName && (
                            <Typography sx={{ color: "text.secondary", fontSize: "12px" }}>
                              @{user.username}
                            </Typography>
                          )}
                          {user.bio && (
                            <Typography sx={{ color: "text.primary", fontSize: "13px", mt: 0.5 }} noWrap>
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
                                    borderColor: "divider",
                                    color: "text.secondary",
                                    "&:hover": { bgcolor: "action.hover", borderColor: "text.disabled" },
                                  }
                                : {
                                    bgcolor: "#447bba",
                                    "&:hover": { bgcolor: "#3b699f", boxShadow: "none" },
                                  }),
                            }}
                          >
                            {amIFollowing ? t('people.unfollow') : t('people.follow')}
                          </Button>
                        </Box>
                      )}
                    </Box>
                    {!isLast && <Divider sx={{ borderColor: "divider", mx: 2 }} />}
                  </div>
                );
              })
            )}

            {loading && users.length > 0 && (
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

export default Search;
