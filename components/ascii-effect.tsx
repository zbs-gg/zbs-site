"use client";

import { forwardRef, useMemo } from "react";
import { Effect, BlendFunction } from "postprocessing";
import { Uniform, Vector2 } from "three";

const fragmentShader = /* glsl */ `
uniform float cellSize;
uniform bool invert;
uniform bool colorMode;
uniform int asciiStyle;

uniform float time;
uniform vec2 resolution;
uniform vec2 mousePos;
uniform float scanlineIntensity;
uniform float scanlineCount;
uniform float targetFPS;
uniform float jitterIntensity;
uniform float jitterSpeed;
uniform bool mouseGlowEnabled;
uniform float mouseGlowRadius;
uniform float mouseGlowIntensity;
uniform float vignetteIntensity;
uniform float vignetteRadius;
uniform int colorPalette;
uniform float curvature;
uniform float aberrationStrength;
uniform float noiseIntensity;
uniform float noiseScale;
uniform float noiseSpeed;
uniform float waveAmplitude;
uniform float waveFrequency;
uniform float waveSpeed;
uniform float glitchIntensity;
uniform float glitchFrequency;
uniform float brightnessAdjust;
uniform float contrastAdjust;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 applyColorPalette(vec3 color, int palette) {
  if (palette == 1) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.1, lum * 0.9, 0.1);
  } else if (palette == 2) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(lum * 1.0, lum * 0.6, lum * 0.2);
  } else if (palette == 3) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.0, lum * 0.8, lum);
  } else if (palette == 4) {
    float lum = dot(color, vec3(0.299, 0.587, 0.114));
    return vec3(0.1, 0.2, lum);
  }
  return color;
}

float getChar(float brightness, vec2 p, int style) {
  vec2 grid = floor(p * 4.0);
  float val = 0.0;

  if (style == 2) {
    // MINIMAL — sparse dots / + / x / # by luminance
    if (brightness < 0.22) {
      val = 0.0;
    } else if (brightness < 0.40) {
      // single tiny dot, off-centre
      val = (grid.x == 2.0 && grid.y == 1.0) ? 1.0 : 0.0;
    } else if (brightness < 0.55) {
      // plus +
      val = ((grid.x == 1.0 || grid.x == 2.0) && grid.y == 1.0)
         || (grid.x == 1.0 && (grid.y == 0.0 || grid.y == 1.0 || grid.y == 2.0))
         ? 1.0 : 0.0;
    } else if (brightness < 0.72) {
      // x-cross
      val = (grid.x == grid.y) || (grid.x + grid.y == 3.0) ? 1.0 : 0.0;
    } else if (brightness < 0.88) {
      // hash #
      val = (grid.x == 1.0 || grid.x == 2.0 || grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    } else {
      val = 1.0;
    }
  } else if (style == 3) {
    // BLOCKS — quadrant fills only
    float t = brightness;
    if (t < 0.20) val = 0.0;
    else if (t < 0.40) val = (grid.x < 2.0 && grid.y < 2.0) ? 1.0 : 0.0;
    else if (t < 0.60) val = (grid.x < 2.0) ? 1.0 : 0.0;
    else if (t < 0.80) val = (grid.x < 2.0) || (grid.y < 2.0) ? 1.0 : 0.0;
    else val = 1.0;
  } else if (style == 1) {
    // DENSE — fills earlier than standard
    if (brightness < 0.10) val = 0.0;
    else if (brightness < 0.25) val = (grid.x == 1.0 || grid.x == 2.0) && (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.45) val = (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.3;
    else if (brightness < 0.65) val = (grid.x == 0.0 || grid.x == 3.0 || grid.y == 0.0 || grid.y == 3.0) ? 0.6 : 1.0;
    else if (brightness < 0.85) val = 0.85;
    else val = 1.0;
  } else {
    // STANDARD (0) — original ramp
    if (brightness < 0.2) val = (grid.x == 1.0 && grid.y == 1.0) ? 0.3 : 0.0;
    else if (brightness < 0.35) val = (grid.x == 1.0 || grid.x == 2.0) && (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.5) val = (grid.y == 1.0 || grid.y == 2.0) ? 1.0 : 0.0;
    else if (brightness < 0.65) val = (grid.y == 0.0 || grid.y == 3.0) ? 1.0 : (grid.y == 1.0 || grid.y == 2.0) ? 0.5 : 0.0;
    else if (brightness < 0.8) val = (grid.x == 0.0 || grid.x == 2.0 || grid.y == 0.0 || grid.y == 2.0) ? 1.0 : 0.3;
    else val = 1.0;
  }

  return val;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 workUV = uv;

  if (curvature > 0.0) {
    vec2 centered = workUV * 2.0 - 1.0;
    centered *= 1.0 + curvature * dot(centered, centered);
    workUV = centered * 0.5 + 0.5;
    if (workUV.x < 0.0 || workUV.x > 1.0 || workUV.y < 0.0 || workUV.y > 1.0) {
      outputColor = vec4(0.0);
      return;
    }
  }

  if (waveAmplitude > 0.0) {
    workUV.x += sin(workUV.y * waveFrequency + time * waveSpeed) * waveAmplitude;
    workUV.y += cos(workUV.x * waveFrequency + time * waveSpeed) * waveAmplitude;
  }

  vec4 sampledColor;
  if (aberrationStrength > 0.0) {
    float offset = aberrationStrength;
    vec2 uvR = workUV + vec2(offset, 0.0);
    vec2 uvG = workUV;
    vec2 uvB = workUV - vec2(offset, 0.0);
    float r = texture2D(inputBuffer, uvR).r;
    float g = texture2D(inputBuffer, uvG).g;
    float b = texture2D(inputBuffer, uvB).b;
    sampledColor = vec4(r, g, b, 1.0);
  } else {
    sampledColor = texture2D(inputBuffer, workUV);
  }

  sampledColor.rgb = (sampledColor.rgb - 0.5) * contrastAdjust + 0.5 + brightnessAdjust;

  if (noiseIntensity > 0.0) {
    float noiseVal = noise(workUV * noiseScale + time * noiseSpeed);
    sampledColor.rgb += (noiseVal - 0.5) * noiseIntensity;
  }

  vec2 cellCount = resolution / cellSize;
  vec2 cellCoord = floor(uv * cellCount);

  if (jitterIntensity > 0.0) {
    float jitterTime = time * jitterSpeed;
    float jitterX = (random(vec2(cellCoord.y, floor(jitterTime))) - 0.5) * jitterIntensity * 2.0;
    float jitterY = (random(vec2(cellCoord.x, floor(jitterTime + 1000.0))) - 0.5) * jitterIntensity * 2.0;
    cellCoord += vec2(jitterX, jitterY);
  }

  if (glitchIntensity > 0.0 && glitchFrequency > 0.0) {
    float glitchTime = floor(time * glitchFrequency);
    float glitchRand = random(vec2(glitchTime, cellCoord.y));
    if (glitchRand < glitchIntensity) {
      float shift = (random(vec2(glitchTime + 1.0, cellCoord.y)) - 0.5) * 20.0;
      cellCoord.x += shift;
    }
  }

  vec2 cellUV = (cellCoord + 0.5) / cellCount;
  vec4 cellColor = texture2D(inputBuffer, cellUV);
  float brightness = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));

  if (invert) brightness = 1.0 - brightness;

  vec2 localUV = fract(uv * cellCount);
  float charValue = getChar(brightness, localUV, asciiStyle);

  vec3 finalColor;
  if (colorMode) {
    finalColor = cellColor.rgb * charValue;
  } else {
    finalColor = vec3(brightness * charValue);
  }

  finalColor = applyColorPalette(finalColor, colorPalette);

  if (mouseGlowEnabled) {
    vec2 pixelPos = uv * resolution;
    float dist = length(pixelPos - mousePos);
    float glow = exp(-dist / mouseGlowRadius) * mouseGlowIntensity;
    finalColor += glow;
  }

  if (scanlineIntensity > 0.0) {
    float scanline = sin(uv.y * scanlineCount * 3.14159) * 0.5 + 0.5;
    finalColor *= 1.0 - (scanline * scanlineIntensity);
  }

  if (vignetteIntensity > 0.0) {
    vec2 centered = uv * 2.0 - 1.0;
    float vignette = 1.0 - dot(centered, centered) / vignetteRadius;
    finalColor *= mix(1.0, vignette, vignetteIntensity);
  }

  outputColor = vec4(finalColor, cellColor.a);
}
`;

export type AsciiPostFx = {
  scanlineIntensity?: number;
  scanlineCount?: number;
  targetFPS?: number;
  jitterIntensity?: number;
  jitterSpeed?: number;
  mouseGlowEnabled?: boolean;
  mouseGlowRadius?: number;
  mouseGlowIntensity?: number;
  vignetteIntensity?: number;
  vignetteRadius?: number;
  colorPalette?: "original" | "green" | "amber" | "cyan" | "blue" | number;
  curvature?: number;
  aberrationStrength?: number;
  noiseIntensity?: number;
  noiseScale?: number;
  noiseSpeed?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  glitchIntensity?: number;
  glitchFrequency?: number;
  brightnessAdjust?: number;
  contrastAdjust?: number;
};

export type AsciiEffectProps = {
  style?: "standard" | "dense" | "minimal" | "blocks";
  cellSize?: number;
  invert?: boolean;
  color?: boolean;
  resolution?: Vector2;
  mousePos?: Vector2;
  postfx?: AsciiPostFx;
};

const styleMap: Record<NonNullable<AsciiEffectProps["style"]>, number> = {
  standard: 0,
  dense: 1,
  minimal: 2,
  blocks: 3,
};

const paletteMap: Record<string, number> = {
  original: 0,
  green: 1,
  amber: 2,
  cyan: 3,
  blue: 4,
};

function paletteToInt(p: AsciiPostFx["colorPalette"]): number {
  if (typeof p === "number") return p;
  if (typeof p === "string" && p in paletteMap) return paletteMap[p];
  return 0;
}

class AsciiEffectImpl extends Effect {
  constructor(opts: Required<Pick<AsciiEffectProps, "cellSize" | "invert" | "color" | "resolution" | "mousePos">> & {
    asciiStyle: number;
    postfx: AsciiPostFx;
  }) {
    const { cellSize, invert, color, asciiStyle, resolution, mousePos, postfx } = opts;
    super("AsciiEffect", fragmentShader, {
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, Uniform<unknown>>([
        ["cellSize", new Uniform(cellSize)],
        ["invert", new Uniform(invert)],
        ["colorMode", new Uniform(color)],
        ["asciiStyle", new Uniform(asciiStyle)],
        ["time", new Uniform(0)],
        ["resolution", new Uniform(resolution)],
        ["mousePos", new Uniform(mousePos)],
        ["scanlineIntensity", new Uniform(postfx.scanlineIntensity ?? 0)],
        ["scanlineCount", new Uniform(postfx.scanlineCount ?? 200)],
        ["targetFPS", new Uniform(postfx.targetFPS ?? 0)],
        ["jitterIntensity", new Uniform(postfx.jitterIntensity ?? 0)],
        ["jitterSpeed", new Uniform(postfx.jitterSpeed ?? 1)],
        ["mouseGlowEnabled", new Uniform(postfx.mouseGlowEnabled ?? false)],
        ["mouseGlowRadius", new Uniform(postfx.mouseGlowRadius ?? 200)],
        ["mouseGlowIntensity", new Uniform(postfx.mouseGlowIntensity ?? 1.5)],
        ["vignetteIntensity", new Uniform(postfx.vignetteIntensity ?? 0)],
        ["vignetteRadius", new Uniform(postfx.vignetteRadius ?? 0.8)],
        ["colorPalette", new Uniform(paletteToInt(postfx.colorPalette))],
        ["curvature", new Uniform(postfx.curvature ?? 0)],
        ["aberrationStrength", new Uniform(postfx.aberrationStrength ?? 0)],
        ["noiseIntensity", new Uniform(postfx.noiseIntensity ?? 0)],
        ["noiseScale", new Uniform(postfx.noiseScale ?? 1)],
        ["noiseSpeed", new Uniform(postfx.noiseSpeed ?? 1)],
        ["waveAmplitude", new Uniform(postfx.waveAmplitude ?? 0)],
        ["waveFrequency", new Uniform(postfx.waveFrequency ?? 10)],
        ["waveSpeed", new Uniform(postfx.waveSpeed ?? 1)],
        ["glitchIntensity", new Uniform(postfx.glitchIntensity ?? 0)],
        ["glitchFrequency", new Uniform(postfx.glitchFrequency ?? 0)],
        ["brightnessAdjust", new Uniform(postfx.brightnessAdjust ?? 0)],
        ["contrastAdjust", new Uniform(postfx.contrastAdjust ?? 1)],
      ]),
    });
    this.elapsed = 0;
    this.frameAccumulator = 0;
  }

  elapsed: number;
  frameAccumulator: number;

  // postprocessing v6 calls update(renderer, inputBuffer, deltaTime)
  override update(_renderer: unknown, _inputBuffer: unknown, deltaTime: number): void {
    const fpsUniform = this.uniforms.get("targetFPS") as Uniform<number> | undefined;
    const targetFPS = fpsUniform?.value ?? 0;
    if (targetFPS > 0) {
      const frameDuration = 1 / targetFPS;
      this.frameAccumulator += deltaTime;
      if (this.frameAccumulator >= frameDuration) {
        this.elapsed += frameDuration;
        this.frameAccumulator = this.frameAccumulator % frameDuration;
      }
    } else {
      this.elapsed += deltaTime;
    }
    const t = this.uniforms.get("time") as Uniform<number> | undefined;
    if (t) t.value = this.elapsed;
  }

  setRuntime(opts: {
    cellSize: number;
    invert: boolean;
    colorMode: boolean;
    asciiStyle: number;
    resolution: Vector2;
    mousePos: Vector2;
  }) {
    (this.uniforms.get("cellSize") as Uniform<number>).value = opts.cellSize;
    (this.uniforms.get("invert") as Uniform<boolean>).value = opts.invert;
    (this.uniforms.get("colorMode") as Uniform<boolean>).value = opts.colorMode;
    (this.uniforms.get("asciiStyle") as Uniform<number>).value = opts.asciiStyle;
    (this.uniforms.get("resolution") as Uniform<Vector2>).value = opts.resolution;
    (this.uniforms.get("mousePos") as Uniform<Vector2>).value = opts.mousePos;
  }
}

export const AsciiEffect = forwardRef<AsciiEffectImpl, AsciiEffectProps>(function AsciiEffect(
  props,
  ref
) {
  const {
    style = "standard",
    cellSize = 9,
    invert = false,
    color = true,
    postfx = {},
    resolution = new Vector2(1920, 1080),
    mousePos = new Vector2(0, 0),
  } = props;

  const asciiStyle = styleMap[style] ?? 0;

  const effect = useMemo(
    () =>
      new AsciiEffectImpl({
        cellSize,
        invert,
        color,
        asciiStyle,
        resolution,
        mousePos,
        postfx,
      }),
    // Effect is constructed once; runtime updates flow through setRuntime below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Push the latest props into uniforms each render.
  effect.setRuntime({
    cellSize,
    invert,
    colorMode: color,
    asciiStyle,
    resolution,
    mousePos,
  });

  return <primitive ref={ref} object={effect} dispose={null} />;
});
