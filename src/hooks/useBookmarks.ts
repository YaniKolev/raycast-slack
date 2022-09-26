import { sortBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { channelsBookmarks } from "../slack/channelBookmarks";
import { ChannelBookmark } from "../types/ChannelBookmark";
import { SlackEntry } from "../types/SlackEntry";
import { TeamInfo } from "../types/TeamInfo";
import { useConfig } from "./useConfig";

export function useBookmarks(channel: SlackEntry, team: TeamInfo) {
  const {
    config: { cookie },
  } = useConfig();
  const [bookmarks, setBookmarks] = useState<ChannelBookmark[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    channelsBookmarks({ cookie, token: team.token }, channel.id)
      .then(setBookmarks)
      .finally(() => setLoading(false));
  }, [channel, team]);

  return { bookmarks, loading };
}
