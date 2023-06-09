import axios from "axios";
import { isEqual } from "lodash";
import { queryTypes } from "next-usequerystate";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { BROWSE_PLAYLIST_CONTEXT_QUERY } from "../constants";
import { NowPlaying, PlaylistContext } from "../types";
import { useQueryStates } from "./Query/useQueryStates";

const MODE_LOWER_BOUND = 0;
const MODE_UPPER_BOUND = 2;

// quick and dirty solution to autoplaying a new playlist
const AUTO_PLAY = [
  "shibuyuhh club mix",
  "soho",
  "jdm",
  "marmix",
  "pmixv6",
  "french_riviera",
  "espresso",
  "pmixv3",
  "smm",
  "pmixv1",
  "pmixv4",
  "pmixv2",
  "berlin",
];

export default function usePlayerState() {
  const [playlistContext, setPlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [browsePlaylistContext, setBrowsePlaylistContext] =
    useState<PlaylistContext | null>(null);
  const [currentTrack, setCurrentTrack] = useState<NowPlaying | null>(null);
  const [playerSrc, setPlayerSrc] = useState<string>();
  const [playing, setPlaying] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [playerDisplayMode, setPlayerDisplayMode] = useState(0);
  const [shuffled, setShuffled] = useState(false);
  const [autoplay, setAutoplay] = useState({ on: false, prevName: "" });

  const queryClient = useQueryClient();
  const [playerQueries, setPlayerQueries] = useQueryStates(
    {
      type: queryTypes.string,
      crate: queryTypes.string,
    },
    {
      history: "push",
    }
  );

  useEffect(() => {
    if (autoplay.on && autoplay.prevName !== browsePlaylistContext?.name) {
      setAutoplay((p) => ({ ...p, on: false }));
      selectSong(browsePlaylistContext?.songs[0].name!);
    }
  }, [browsePlaylistContext]);

  const updatePlayerState = async () => {
    if (!playlistContext || playlistContext.index === -1) return;

    const newTrack = playlistContext.songs[playlistContext.index];
    setCurrentTrack(newTrack);
    setLoading(true);

    const { data } = await axios.post("/api/track/generatePresignedUrl", {
      audioFilePath: newTrack.cdnPath,
    });
    const { signedUrl, error } = data;

    if (error) alert(error);
    else setPlayerSrc(signedUrl);

    setLoading(false);
    localStorage.setItem("lastSong", newTrack.name);
  };

  useEffect(() => {
    updatePlayerState();
  }, [playlistContext]);

  const nextSong = () => {
    if (!playlistContext || playlistContext.index === -1) return;
    if (shuffled) {
      const newShuffledIndex =
        (playlistContext.shuffledIndex + 1) % playlistContext.songs.length;
      const newSongIndex = playlistContext.shuffledOrder[newShuffledIndex];
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    } else {
      if (playlistContext.index + 1 == playlistContext.songs.length) {
        const curIndex =
          AUTO_PLAY.indexOf(playlistContext.routeAlias) !== -1
            ? AUTO_PLAY.indexOf(playlistContext.routeAlias)
            : 0;
        const nextIndex = (curIndex + 1) % AUTO_PLAY.length;
        setAutoplay({ on: true, prevName: browsePlaylistContext?.name! });
        browse(AUTO_PLAY[nextIndex]);
      } else {
        const newSongIndex = playlistContext.index + 1;
        const newShuffledIndex =
          playlistContext.shuffledOrder.indexOf(newSongIndex);
        setPlaylistContext({
          ...playlistContext,
          index: newSongIndex,
          shuffledIndex: newShuffledIndex,
        });
      }
    }
  };

  const prevSong = () => {
    if (!playlistContext || playlistContext.index === -1) return;
    if (playlistContext.index === 0 && !shuffled) return;
    if (shuffled) {
      const newShuffledIndex =
        playlistContext.shuffledIndex === 0
          ? playlistContext.songs.length - 1
          : playlistContext.shuffledIndex - 1;
      const newSongIndex = playlistContext.shuffledOrder[newShuffledIndex];
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    } else {
      const newSongIndex = playlistContext.index - 1;
      const newShuffledIndex =
        playlistContext.shuffledOrder.indexOf(newSongIndex);
      setPlaylistContext({
        ...playlistContext,
        index: newSongIndex,
        shuffledIndex: newShuffledIndex,
      });
    }
  };

  const selectSong = (name: string) => {
    if (!isEqual(playlistContext, browsePlaylistContext)) {
      if (!browsePlaylistContext || currentTrack?.name === name) return;

      const index = browsePlaylistContext.songs.findIndex(
        (song) => song.name === name
      );
      if (index === null || index === undefined) return;
      const shuffledIndex = browsePlaylistContext.shuffledOrder.indexOf(index);

      setPlaylistContext({ ...browsePlaylistContext, index, shuffledIndex });
    } else {
      if (!playlistContext || currentTrack?.name === name) return;

      const index = playlistContext.songs.findIndex(
        (song) => song.name === name
      );
      if (index === null || index === undefined) return;
      const shuffledIndex = playlistContext.shuffledOrder.indexOf(index);

      setPlaylistContext({
        ...playlistContext,
        index,
        shuffledIndex,
      });
    }

    setTimeout(() => setPlaying(true), 1000);
  };

  const toggle = () => {
    if (browsePlaylistContext && !playlistContext) {
      setPlaylistContext({ ...browsePlaylistContext, index: 0 });
      setPlaying(true);
    } else if (!playlistContext) {
      return;
    } else if (playlistContext.index === -1) {
      setPlaylistContext({ ...playlistContext, index: 0 });
      setPlaying(true);
    } else {
      setPlaying((p) => !p);
    }
  };

  const toggleShuffle = () => {
    setShuffled((p) => !p);
  };

  const setMode = async (mode: number) => {
    setPlayerDisplayMode(mode);
    setPlayerQueries((prevQueries) => ({
      ...prevQueries,
      type: mode.toString(),
    }));
  };

  const prevMode = async () => {
    setPlayerDisplayMode((prevMode) => {
      const newMode =
        prevMode === MODE_LOWER_BOUND ? MODE_UPPER_BOUND : prevMode - 1;
      setPlayerQueries((prevQueries) => ({
        ...prevQueries,
        type: newMode.toString(),
      }));
      return newMode;
    });
  };

  const nextMode = () => {
    setPlayerDisplayMode((prevMode) => {
      const newMode =
        prevMode === MODE_UPPER_BOUND ? MODE_LOWER_BOUND : prevMode + 1;
      setPlayerQueries((prevQueries) => ({
        ...prevQueries,
        type: newMode.toString(),
      }));
      return newMode;
    });
  };

  const browse = (routeAlias: string) => {
    setPlayerQueries((prevQueries) => ({ ...prevQueries, crate: routeAlias }));
    queryClient.invalidateQueries(BROWSE_PLAYLIST_CONTEXT_QUERY);
  };

  return {
    playlistContext,
    setPlaylistContext,
    currentTrack,
    setCurrentTrack,
    nextSong,
    prevSong,
    selectSong,
    playerSrc,
    playing,
    setPlaying,
    toggle,
    loading,
    browsePlaylistContext,
    setBrowsePlaylistContext,
    setMode,
    nextMode,
    prevMode,
    playerDisplayMode,
    toggleShuffle,
    shuffled,
    browse,
  };
}
