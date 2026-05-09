"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";
import { Vector2 } from "three";
import { AsciiEffect, type AsciiPostFx, type AsciiEffectProps } from "./ascii-effect";

const COVER_VS = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const COVER_FS = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uViewAR;
  uniform float uVidAR;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    float r = uVidAR / uViewAR;
    if (r > 1.0) {
      uv.x = (uv.x - 0.5) / r + 0.5;
    } else {
      uv.y = (uv.y - 0.5) * r + 0.5;
    }
    gl_FragColor = texture2D(uMap, uv);
  }
`;

function VideoQuad({ src }: { src: string }) {
  const { size } = useThree();
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const video = useMemo(() => {
    if (typeof document === "undefined") return null;
    const v = document.createElement("video");
    v.src = src;
    v.crossOrigin = "anonymous";
    v.loop = true;
    v.muted = true;
    v.playsInline = true;
    v.autoplay = true;
    v.preload = "auto";
    // Required to satisfy autoplay policies: muted+playsinline + .play()
    v.play().catch(() => {
      // First user gesture will unblock playback.
      const onClick = () => {
        v.play().finally(() => window.removeEventListener("pointerdown", onClick));
      };
      window.addEventListener("pointerdown", onClick, { once: true });
    });
    return v;
  }, [src]);

  const texture = useMemo(() => {
    if (!video) return null;
    const t = new THREE.VideoTexture(video);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    return t;
  }, [video]);

  useEffect(() => {
    if (!video || !matRef.current) return;
    const onMeta = () => {
      if (matRef.current && video.videoWidth) {
        matRef.current.uniforms.uVidAR.value = video.videoWidth / video.videoHeight;
      }
    };
    video.addEventListener("loadedmetadata", onMeta);
    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, [video]);

  useFrame(() => {
    if (matRef.current) {
      matRef.current.uniforms.uViewAR.value = size.width / size.height;
    }
  });

  if (!texture) return null;

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={COVER_VS}
        fragmentShader={COVER_FS}
        uniforms={{
          uMap: { value: texture },
          uViewAR: { value: 16 / 9 },
          uVidAR: { value: 16 / 9 },
        }}
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

export type VideoSceneProps = {
  src: string;
  cellSize?: number;
  colorMode?: boolean;
  invert?: boolean;
  style?: AsciiEffectProps["style"];
  /** Full pass-through for any AsciiPostFx field; merges over the top-level shortcuts below. */
  postfx?: AsciiPostFx;
  // Top-level shortcuts (overridden by `postfx` if both supplied).
  mouseGlowEnabled?: boolean;
  mouseGlowRadius?: number;
  mouseGlowIntensity?: number;
  contrastAdjust?: number;
  brightnessAdjust?: number;
  vignetteIntensity?: number;
  scanlineIntensity?: number;
};

export function VideoScene({
  src,
  cellSize = 9,
  mouseGlowEnabled = true,
  mouseGlowRadius = 220,
  mouseGlowIntensity = 0.35,
  contrastAdjust = 1.15,
  brightnessAdjust = -0.05,
  vignetteIntensity = 0.35,
  scanlineIntensity = 0,
  colorMode = false,
  invert = false,
  style = "standard",
  postfx,
}: VideoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [resolution, setResolution] = useState(() => new Vector2(1920, 1080));
  const [mousePos, setMousePos] = useState(() => new Vector2(0, 0));

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateRes = () => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      setResolution(new Vector2(rect.width * dpr, rect.height * dpr));
    };
    updateRes();
    window.addEventListener("resize", updateRes);

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const x = (e.clientX - rect.left) * dpr;
      const y = (rect.height - (e.clientY - rect.top)) * dpr;
      setMousePos(new Vector2(x, y));
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("resize", updateRes);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-canvas">
      <Canvas
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 2]}
        orthographic
        camera={{ position: [0, 0, 1], near: 0, far: 1, zoom: 1 }}
        style={{ background: "#000" }}
      >
        <color attach="background" args={["#000"]} />
        <VideoQuad src={src} />
        <EffectComposer enabled>
          <AsciiEffect
            style={style}
            cellSize={cellSize}
            invert={invert}
            color={colorMode}
            resolution={resolution}
            mousePos={mousePos}
            postfx={{
              scanlineIntensity,
              scanlineCount: 200,
              targetFPS: 0,
              jitterIntensity: 0,
              jitterSpeed: 1,
              mouseGlowEnabled,
              mouseGlowRadius,
              mouseGlowIntensity,
              vignetteIntensity,
              vignetteRadius: 0.85,
              colorPalette: "original",
              curvature: 0,
              aberrationStrength: 0,
              noiseIntensity: 0,
              noiseScale: 1,
              noiseSpeed: 1,
              waveAmplitude: 0,
              waveFrequency: 10,
              waveSpeed: 1,
              glitchIntensity: 0,
              glitchFrequency: 0,
              brightnessAdjust,
              contrastAdjust,
              ...postfx,
            }}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
