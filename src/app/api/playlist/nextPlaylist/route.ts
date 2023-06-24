import { fetchPlaylistPreviews } from "./../../../../lib/services/client/playlist";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const data = await request.json();
  const { routeAlias } = data;

  try {
    const playlistPreviews = await fetchPlaylistPreviews();
    playlistPreviews.sort((a, b) => b.kandiCount - a.kandiCount); // sort in decreasing order
    const curIndex = playlistPreviews.findIndex(
      (preview) => preview.routeAlias === routeAlias
    );
    if (curIndex === playlistPreviews.length) {
      return NextResponse.json({ routeAlias: playlistPreviews[0].routeAlias });
    }
    return NextResponse.json({
      routeAlias: playlistPreviews[curIndex + 1].routeAlias,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 400,
    });
  }
}
