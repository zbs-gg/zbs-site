"use client";

import dynamic from "next/dynamic";
import type { AsciiBgProps } from "./ascii-bg";

const AsciiBg = dynamic(() => import("./ascii-bg"), { ssr: false });

export default function ClientBg(props: AsciiBgProps) {
  return <AsciiBg {...props} />;
}
