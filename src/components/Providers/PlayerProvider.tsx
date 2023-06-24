"use client";

import usePlayerState from "@/lib/hooks/usePlayerState";
import { NowPlaying, PlaylistContext } from "@/lib/types";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

interface PlayerContext {
  playlistContext: PlaylistContext | null;
  setPlaylistContext: Dispatch<SetStateAction<PlaylistContext | null>>;
  browsePlaylistContext: PlaylistContext | null;
  setBrowsePlaylistContext: Dispatch<SetStateAction<PlaylistContext | null>>;
  currentTrack: NowPlaying | null;
  nextSong: () => void;
  prevSong: () => void;
  selectSong: (name: string) => void;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  toggle: () => void;
  playTime: number;
  playerLoading: boolean;
  nextMode: () => void;
  prevMode: () => void;
  playerDisplayMode: number;
  setMode: (mode: number) => void;
  shuffled: boolean;
  toggleShuffle: () => void;
  browse: (routeAlias: string, startOnBrowse: boolean) => void;
}

const playerContext = createContext({} as PlayerContext);

export default function PlayerProvider(props: { children: ReactNode }) {
  const [hasWindow, setHasWindow] = useState(false);
  const [playTime, setPlaytime] = useState(0);
  const [player, setPlayer] = useState<JSX.Element | null>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const {
    playlistContext,
    setPlaylistContext,
    currentTrack,
    nextSong,
    prevSong,
    selectSong,
    playerSrc,
    playing,
    setPlaying,
    toggle,
    loading: playerLoading,
    browsePlaylistContext,
    setBrowsePlaylistContext,
    nextMode,
    prevMode,
    playerDisplayMode,
    setMode,
    toggleShuffle,
    shuffled,
    browse,
  } = usePlayerState();

  useEffect(() => {
    if (typeof window !== undefined) setHasWindow(true);
  }, []);

  useEffect(() => {
    if (!playerSrc) setPlayer(null);
    else {
      const newPlayer = (
        <ReactPlayer
          ref={playerRef}
          url={playerSrc}
          playing={playing}
          onEnded={nextSong}
          onProgress={handleProgress}
        />
      );
      setPlayer(newPlayer);
    }
  }, [playerSrc, playing]);

  const handleProgress = useCallback((progress: OnProgressProps) => {
    const { playedSeconds } = progress;
    setPlaytime(playedSeconds);
  }, []);

  return (
    <playerContext.Provider
      value={{
        playlistContext,
        setPlaylistContext,
        browsePlaylistContext,
        setBrowsePlaylistContext,
        currentTrack,
        nextSong,
        prevSong,
        selectSong,
        playing,
        setPlaying,
        toggle,
        playTime,
        playerLoading,
        nextMode,
        prevMode,
        playerDisplayMode,
        setMode,
        shuffled,
        toggleShuffle,
        browse,
      }}
    >
      {hasWindow ? <div style={{ display: "none" }}>{player}</div> : null}
      {props.children}
    </playerContext.Provider>
  );
}

const usePlayer = () => useContext(playerContext);
export { usePlayer };
