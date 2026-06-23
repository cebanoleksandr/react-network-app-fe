export const FEED_FILTERS = {
  FEED: 'FEED',
  SAVED: 'SAVED',
  FAVORITE: 'FAVORITE',
} as const;

export type FeedFilter = typeof FEED_FILTERS[keyof typeof FEED_FILTERS];
