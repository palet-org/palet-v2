import { usePlayer } from "@/components/Providers/PlayerProvider";
import { artistsToString, msToTime } from "@/lib/util";
import { Flex, Tab, Text } from "@chakra-ui/react";
import { useState } from "react";
import { usePlayerController } from "../../PlayerController";
import PlaybackIndicator from "./PlaybackIndicator";
import { BiPlayCircle } from "react-icons/bi"

export default function PlayingMode() {
  const {
    playlistContext,
    currentTrack,
    playTime,
    browsePlaylistContext,
    browse,
  } = usePlayer();

  return (
    <>
      <Text
        color="white"
        mb="10px"
        mt={currentTrack ? "10px" : "0px"}
        noOfLines={1}
        zIndex={10}
        bg="transparent"
      >
        {playlistContext
          ? playlistContext.index !== -1
            ? "Now Playing: " +
              currentTrack?.name! +
              " by " +
              artistsToString(currentTrack?.artists) +
              " (" +
              msToTime(playTime * 1000) +
              "/" +
              msToTime(currentTrack?.durationMs) +
              ")"
            : ""
          : ""}
      </Text>
      <Text
        fontSize="190px"
        lineHeight="155px"
        wordBreak="break-all"
        noOfLines={2}
        color="dark_purple"
        position="relative"
        left="-15px"
        _hover={{ cursor: "pointer" }}
        onClick={() =>
          browse(
            currentTrack
              ? playlistContext!.routeAlias
              : browsePlaylistContext!.routeAlias,
              false
          )
        }
      >
        {currentTrack
          ? playlistContext?.name.padEnd(10, " ").toUpperCase()
          : browsePlaylistContext?.name.padEnd(10, " ").toUpperCase()}
      </Text>

      <PlaybackIndicator />

      <PlaylistDashboard />
    </>
  );
}

function PlaylistDashboard() {
  const { browsePlaylistContext } = usePlayer();
  const { browse } = usePlayer();
  const {
    previewsLoading,
    previewsError,
    previewsErrorMessage,
    playlistPreviews,
  } = usePlayerController();
  const [displayMode, setDisplayMode] = useState("browse");

  if (previewsLoading)
    return (
      <Text color="white" mt="15px">
        Loading...
      </Text>
    );

  if (previewsError)
    return (
      <Text color="white" mt="15px">
        Error: {(previewsErrorMessage as { message: "string" }).message}
      </Text>
    );

  return (
    <Flex direction="column" color="white" mt="15px" overflow="auto">
      <Flex
        direction="row"
        w="calc(100% - 15px)"
        borderBottom="1px solid"
        borderColor="lightgrey"
        mb="5px"
      >
        <Text
          _hover={{ cursor: "pointer" }}
          fontWeight={displayMode === "browse" ? "bold" : "regular"}
          color={displayMode === "browse" ? "white" : "grey"}
          onClick={() => setDisplayMode("browse")}
        >
          Browse
        </Text>
        <Text
          _hover={{ cursor: "pointer" }}
          ml={2}
          fontWeight={displayMode === "waveform" ? "bold" : "regular"}
          color={displayMode === "waveform" ? "white" : "grey"}
          onClick={() => setDisplayMode("waveform")}
        >
          Waveform
        </Text>
      </Flex>

      <Flex direction="column">
        {displayMode === "browse" ? (
          playlistPreviews!.map((p) => (
            <Flex
              key={p.id}
              color={browsePlaylistContext?.id === p.id ? "purple" : "white"}
              _hover={{ cursor: "pointer", color: "purple" }}
              alignItems="center"
            >
              <Flex 
              fontSize="21px"
              _hover={{ cursor: "pointer", color: "orange" }}
              onClick={() => browse(p.routeAlias, true)}> 
                <BiPlayCircle/> {/*TODO: add space here, no idea how????*/}
              </Flex>

              <Flex
              onClick={() => browse(p.routeAlias, false)}>
                {p.name} 
              </Flex>

            </Flex>
          ))
        ) : (
          <Text>Coming soon...</Text>
        )}
      </Flex>
    </Flex>
  );
}
