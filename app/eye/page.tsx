import ClientBg from "@/components/client-bg";
import { ScrambleText } from "@/components/scramble-text";
import { Brand } from "@/components/brand";
import { Crumbs } from "@/components/crumbs";
import { EyeHero } from "@/components/eye/hero";
import { EyeAbout } from "@/components/eye/about";
import { EyeInstall } from "@/components/eye/install";
import { Share } from "@/components/site/share";
import Link from "next/link";

export const metadata = {
  title: "eye — zbs.gg",
  description:
    "ZBS Eye — eternal memory for your Mac. Continuously records screen + audio, on-device: OCR, transcription, hybrid search, timeline, Ask over a local LLM. 100% local, no cloud, no account, no subscription. Notarized Developer ID — not in the Mac App Store.",
};

const repoUrl = "https://github.com/zbs-gg/eye";

const shareText =
  "ZBS Eye — eternal memory for your Mac. it records your screen + audio on-device and remembers everything. 100% local, notarized, not in the App Store.";
const shareUrl = "https://zbs.gg/eye";

export default function EyePage() {
  return (
    <>
      <ClientBg
        src="/eye-hero.mp4"
        fallbackSrc="/pulse-demo.mp4"
        cellSize={8}
        mouseGlowEnabled
        mouseGlowIntensity={0.16}
        mouseGlowRadius={200}
        contrastAdjust={1.0}
        brightnessAdjust={-0.24}
        vignetteIntensity={0.85}
      />

      <main className="page">
        <header className="topbar">
          <Brand />
          <nav className="ascii-nav" aria-label="primary">
            <Link href="/">
              <ScrambleText text="home" />
            </Link>
            <a href="#about">
              <ScrambleText text="what it is" />
            </a>
            <a href="#install">
              <ScrambleText text="install" />
            </a>
            <a href={repoUrl} target="_blank" rel="noopener">
              <ScrambleText text="source" />
            </a>
            <a href="mailto:team@zbs.gg">
              <ScrambleText text="contact" />
            </a>
          </nav>
        </header>

        <Crumbs
          trail={[
            { label: "zbs.gg", href: "/" },
            { label: "eye" },
          ]}
        />

        <EyeHero />

        <EyeAbout />

        <EyeInstall />

        <section className="evidence" id="share">
          <Share text={shareText} url={shareUrl} label="share the eye" />
        </section>

        <footer className="contact" id="contact">
          <div className="col">
            <p className="col-title">contact</p>
            <p>
              <a href="mailto:team@zbs.gg">team@zbs.gg</a>
            </p>
          </div>
          <div className="col">
            <p className="col-title">writing</p>
            <p>
              <a href="https://nik.care" target="_blank" rel="noopener">
                nik.care
              </a>
            </p>
            <p>long-form: manifesto,</p>
            <p>notes, decisions.</p>
          </div>
          <div className="col">
            <p className="col-title">entity</p>
            <p>ZBS GG Consulting</p>
            <p>Delaware LLC</p>
            <p>Phuket, Thailand</p>
          </div>
          <div className="col">
            <p className="col-title">available</p>
            <p>code, corpora, judge prompts,</p>
            <p>replication scripts, paper drafts.</p>
            <p>independent eval welcome.</p>
          </div>
        </footer>
      </main>
    </>
  );
}
