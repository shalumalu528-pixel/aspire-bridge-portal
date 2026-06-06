/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Official AspireBridge Logo Component.
 * Embeds the official logo image file with customizable layout props.
 */

import React from 'react';
import logoUrl from './aspirebridge_logo_1780681104665.png';

interface LogoProps {
  className?: string; // Overall size and styling classes
  showText?: boolean;  // Whether to render the brand text alongside the emblem
  textClass?: string;  // Class for custom brand title styling
}

export default function Logo({ className = "w-8 h-8", showText = false, textClass = "" }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5 select-none hover:opacity-90 transition-opacity">
      {/* Official branding image asset */}
      <img
        src={logoUrl}
        alt="AspireBridge Logo"
        className={`${className} object-contain rounded-full`}
        referrerPolicy="no-referrer"
      />

      {/* Optional Brand Typographic Text */}
      {showText && (
        <div className="flex flex-col text-left">
          <span className={`block font-display font-bold tracking-tight text-slate-900 leading-none ${textClass || "text-lg"}`}>
            Aspire<span className="text-purple-600">Bridge</span>
          </span>
          <span className="block text-[9px] font-sans font-semibold text-slate-400 tracking-wider uppercase mt-1">
            Bridging aspirations & opportunities
          </span>
        </div>
      )}
    </div>
  );
}
