import { Box, Flex, Icon, Input, Text } from "@chakra-ui/react";
import PlaybackIndicator from "./PlaybackIndicator";
import { usePlayer } from "@/components/Providers/PlayerProvider";
import { PlaylistPreview } from "@/lib/types";
import { msToTime } from "@/lib/util";
import Image from "next/image";
import { useModal } from "@/components/Providers/ModalProvider";
import { usePlayerController } from "../../PlayerController";
import { BiFilter } from "react-icons/bi";

export default function DiscoverMode() {
  const { playlistPreviews, previewsLoading, previewsError } =
    usePlayerController();

  return (
    <>
      <Flex
        direction="column"
        flex={1}
        position="absolute"
        w="calc(100% - 15px)"
      >
        <Text
          fontSize="120px"
          lineHeight="100px"
          wordBreak="break-all"
          position="relative"
          left="-15px"
          _hover={{ cursor: "pointer" }}
          ml="5px"
          mt="10px"
          color="dark_orange"
          noOfLines={1}
        >
          DISCOVER
        </Text>
        <PlaybackIndicator color="dark_orange" />
      </Flex>

      <Flex
        w="100%"
        flex={1}
        mt="10px"
        direction="column"
        position="relative"
        maxH="calc(100% - 150px)"
        top="150px"
        overflowY="scroll"
      >
        {previewsLoading || previewsError ? (
          <Text color="white">Loading...</Text>
        ) : (
          playlistPreviews?.map((preview) => (
            <ScrollPiece key={preview.id} preview={preview} />
          ))
        )}
      </Flex>
    </>
  );
}

function ScrollPiece({ preview }: { preview: PlaylistPreview }) {
  const { browse } = usePlayer();
  const { setDiscoverModal } = useModal();

  const handleSelect = () => {
    browse(preview.routeAlias, false);
    setDiscoverModal(false);
  };

  return (
    <Flex
      flex={1}
      w="100%"
      h="120px"
      maxH="120px"
      direction="row"
      p="10px"
      color="white"
      _hover={{
        cursor: "pointer",
      }}
      transition="0.3s"
      onClick={handleSelect}
      bg="black"
      boxShadow="inset -15px 0px 10px -5px rgba(255,255,255,0.25)"
    >
      <Flex
        borderRadius="25%"
        overflow="hidden"
        mr="5px"
        minW="100px"
        minH="100px"
      >
        <Image
          src={
            preview.imageUrl ??
            "https://d1770vzirffftt.cloudfront.net/public/default.jpg"
          }
          alt="Playlist Cover"
          width={100}
          height={100}
          quality={90}
        />
      </Flex>

      <Flex flex={1} direction="column" ml="10px" fontFamily="body">
        <Text fontSize="50px" lineHeight="50px" fontFamily="tech" noOfLines={1}>
          {preview.name.toUpperCase()}
        </Text>
        <Text ml="5px" fontSize="15px" lineHeight="15px" noOfLines={1}>
          Kandi: {preview.kandiCount}
        </Text>
        <Text ml="5px" fontSize="15px" lineHeight="15px" noOfLines={2}>
          {preview.description ? `"${preview.description}"` : ""}
        </Text>
      </Flex>
    </Flex>
  );
}
