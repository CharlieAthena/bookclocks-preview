"use client";

import React from "react";
import {
  ClockHandStyle,
  MarkerStyle,
  ROMAN_NUMERALS,
  ARABIC_NUMBERS,
} from "@/lib/clock-hands";

interface ClockOverlayProps {
  centerX: number; // 0-1 fraction of container width
  centerY: number; // 0-1 fraction of container height
  handStyle: ClockHandStyle;
  handColor: string; // hex colour
  handSize: number; // scale factor (0.7, 1.0, 1.3)
  markerStyle: MarkerStyle;
  containerWidth: number;
  containerHeight: number;
}

/**
 * Renders clock hands and optional markers as an SVG overlay.
 * Hands are pre-rotated to the classic 10:10 display position.
 *
 * 10:10 means:
 *   - Hour hand: ~10h 10m = 10.167 hours = 305 degrees from 12
 *   - Minute hand: 10 minutes = 60 degrees from 12
 */
const HOUR_ANGLE = 305; // 10 hours + ~10 min offset
const MINUTE_ANGLE = 60; // 10 minutes

const MARKER_RADIUS_FACTOR = 1.55; // markers sit outside the hand tips

export default function ClockOverlay({
  centerX,
  centerY,
  handStyle,
  handColor,
  handSize,
  markerStyle,
  containerWidth,
  containerHeight,
}: ClockOverlayProps) {
  const cx = centerX * containerWidth;
  const cy = centerY * containerHeight;

  // Base scale — hands are designed in a ~46px radius coordinate system.
  // We want them to look proportional to the container.
  const baseScale = Math.min(containerWidth, containerHeight) / 280;
  const scale = baseScale * handSize;

  const markerRadius = 46 * scale * MARKER_RADIUS_FACTOR;

  return (
    <svg
      width={containerWidth}
      height={containerHeight}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      {/* Markers */}
      {markerStyle !== "none" && (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const mx = cx + Math.cos(angle) * markerRadius;
            const my = cy + Math.sin(angle) * markerRadius;

            if (markerStyle === "dots") {
              return (
                <circle
                  key={i}
                  cx={mx}
                  cy={my}
                  r={i % 3 === 0 ? 3 * scale : 2 * scale}
                  fill={handColor}
                  opacity={0.8}
                />
              );
            }

            const label =
              markerStyle === "roman"
                ? ROMAN_NUMERALS[i]
                : ARABIC_NUMBERS[i];
            const fontSize =
              markerStyle === "roman"
                ? 9 * scale
                : 10 * scale;

            return (
              <text
                key={i}
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="central"
                fill={handColor}
                fontSize={fontSize}
                fontFamily={
                  markerStyle === "roman"
                    ? "'Playfair Display', Georgia, serif"
                    : "'Inter', system-ui, sans-serif"
                }
                fontWeight={markerStyle === "roman" ? "600" : "500"}
                opacity={0.85}
              >
                {label}
              </text>
            );
          })}
        </g>
      )}

      {/* Hour hand */}
      <g transform={`translate(${cx}, ${cy}) rotate(${HOUR_ANGLE}) scale(${scale})`}>
        <path
          d={handStyle.hourHandPath}
          fill={handColor}
          stroke={handColor === "#F5F5F5" ? "#999" : "none"}
          strokeWidth={handColor === "#F5F5F5" ? 0.5 : 0}
          filter="url(#handShadow)"
        />
      </g>

      {/* Minute hand */}
      <g transform={`translate(${cx}, ${cy}) rotate(${MINUTE_ANGLE}) scale(${scale})`}>
        <path
          d={handStyle.minuteHandPath}
          fill={handColor}
          stroke={handColor === "#F5F5F5" ? "#999" : "none"}
          strokeWidth={handColor === "#F5F5F5" ? 0.5 : 0}
          filter="url(#handShadow)"
        />
      </g>

      {/* Center pin */}
      <circle
        cx={cx}
        cy={cy}
        r={4.5 * scale}
        fill={handColor}
        stroke={handColor === "#F5F5F5" ? "#999" : handColor}
        strokeWidth={1}
      />
      <circle cx={cx} cy={cy} r={2 * scale} fill={handColor === "#1a1a1a" ? "#333" : "#fff"} opacity={0.5} />

      {/* Shadow filter */}
      <defs>
        <filter id="handShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0.5" dy="1" stdDeviation="1.2" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
}
