"use client";

import dynamic from "next/dynamic";
import type { VideoSceneProps } from "./video-scene";

const VideoScene = dynamic(
  () => import("./video-scene").then((m) => m.VideoScene),
  { ssr: false }
);

export default function ClientBg(props: VideoSceneProps) {
  return <VideoScene {...props} />;
}
