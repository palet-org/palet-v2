import { HStack, Spinner } from "@chakra-ui/react";
import {
  RiSkipBackFill,
  RiPauseFill,
  RiPlayFill,
  RiSkipForwardFill,
} from "react-icons/ri";
import { BiShuffle } from "react-icons/bi";
import { usePlayer } from "../Providers/PlayerProvider";
import ClickIcon from "../Common/ClickIcon";

export default function Controls() {
  const {
    nextSong,
    prevSong,
    playing,
    toggle,
    playerLoading,
    toggleShuffle,
    shuffled,
  } = usePlayer();

  return (
    <HStack zIndex={5} fontSize={{ base: "30px" }} spacing={{ base: 5, md: 3 }}>
      <ClickIcon as={RiSkipBackFill} onClick={prevSong} />
      {playerLoading ? (
        <Spinner />
      ) : (
        <ClickIcon as={playing ? RiPauseFill : RiPlayFill} onClick={toggle} />
      )}
      <ClickIcon as={RiSkipForwardFill} onClick={nextSong} />
      <ClickIcon
        as={BiShuffle}
        onClick={toggleShuffle}
        color={shuffled ? "orange" : "black"}
      />
    </HStack>
  );
}
