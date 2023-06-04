import { extendTheme } from "@chakra-ui/react";

import "@fontsource/inconsolata";
import "@fontsource/archivo";
import "@fontsource/arimo";
import "@fontsource/share-tech";
import "@fontsource/share-tech-mono";
import "@fontsource/vt323";

import Button from "./Button";

const theme = extendTheme({
  components: {
    Button,
  },
  colors: {
    hl: "#f97470",
    bright_pink: "#FD0089",
    bg: "#dcdcdc",
    orange: "#E96034",
    purple: "#A463FF",
    dark_purple: "#7e4ac7",
    green: "#00ED95",
  },
  fonts: {
    body: `'Arimo', sans-serif`,
    bodyalt: `'Inconsolata', monospace`,
    tech: `'Share Tech Mono', sans-serif`,
  },
  textStyles: {},
});

export default theme;
