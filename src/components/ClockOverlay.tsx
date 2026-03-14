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
const HOUR_ANGLE = 305;
const MINUTE_ANGLE = 60;

const MARKER_RADIUS_FACTOR = 1.55;

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
  const baseScale = Math.min(containerWidth, containerHeight) / 280;
  const scale = baseScale * handSize;

  const markerRadius = 46 * scale * MARKER_RADIUS_FACTOR;

  // Use a unique filter ID to avoid collisions if multiple overlays render
  const filterId = `handShadow-${handStyle.id}`;
  const brassFilterId = `brassGlow-${handStyle.id}`;

  // Determine if we should auto-show markers for large size
  const effectiveMarkerStyle: MarkerStyle =
    handSize >= 1.3 && markerStyle === "none" ? "dots" : markerStyle;

  // Brass center pin colour
  const brassFill = "#B5893B";
  const brassHighlight = "#D4AF61";

  return (
    <svg
      width={containerWidth}
      height={containerHeight}
      className="absolute inset-0 pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Drop shadow for hands */}
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0.6" dy="1.2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.35" />
        </filter>
        {/* Subtle glow for the brass center nut */}
        <filter id={brassFilterId} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0.5" stdDeviation="0.8" floodColor="#000" floodOpacity="0.25" />
        </filter>
        {/* Radial gradient for the brass nut */}
        <radialGradient id={`brassGrad-${handStyle.id}`} cx="40%" cy="35%">
          <stop offset="0%" stopColor={brassHighlight} />
          <stop offset="70%" stopColor={brassFill} />
          <stop offset="100%" stopColor="#8B6914" />
        </radialGradient>
      </defs>

      {/* Markers */}
      {effectiveMarkerStyle !== "none" && (
        <g>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const mx = cx + Math.cos(angle) * markerRadius;
            const my = cy + Math.sin(angle) * markerRadius;

            if (effectiveMarkerStyle === "dots") {
              const isCardinal = i % 3 === 0;
              return (
                <g key={i}>
                  <circle
                    cx={mx}
                    cy={my}
                    r={isCardinal ? 3.2 * scale : 1.8 * scale}
                    fill={handColor}
                    opacity={isCardinal ? 0.9 : 0.6}
                  />
                </g>
              );
            }

            const label =
              effectiveMarkerStyle === "roman"
                ? ROMAN_NUMERALS[i]
                : ARABIC_NUMBERS[i];
            const fontSize =
              effectiveMarkerStyle === "roman" ? 9 * scale : 10 * scale;

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
                  effectiveMarkerStyle === "roman"
                    ? "'Playfair Display', Georgia, serif"
                    : "'Inter', system-ui, sans-serif"
                }
                fontWeight={effectiveMarkerStyle === "roman" ? "600" : "500"}
                opacity={0.85}
                style={{
                  textShadow: "0 0.5px 1px rgba(0,0,0,0.15)",
                }}
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
          filter={`url(#${filterId})`}
        />
      </g>

      {/* Minute hand */}
      <g transform={`translate(${cx}, ${cy}) rotate(${MINUTE_ANGLE}) scale(${scale})`}>
        <path
          d={handStyle.minuteHandPath}
          fill={handColor}
          stroke={handColor === "#F5F5F5" ? "#999" : "none"}
          strokeWidth={handColor === "#F5F5F5" ? 0.5 : 0}
          filter={`url(#${filterId})`}
        />
      </g>

      {/* Center brass nut — outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={5 * scale}
        fill={`url(#brassGrad-${handStyle.id})`}
        stroke="#8B6914"
        strokeWidth={0.6 * scale}
        filter={`url(#${brassFilterId})`}
      />
      {/* Center brass nut — inner highlight */}
      <circle
        cx={cx - 0.8 * scale}
        cy={cy - 0.8 * scale}
        r={2 * scale}
        fill={brassHighlight}
        opacity={0.4}
      />
      {/* Center brass nut — center dot */}
      <circle
        cx={cx}
        cy={cy}
        r={1.2 * scale}
        fill="#6B4F1A"
        opacity={0.5}
      />
    </svg>
  );
}
