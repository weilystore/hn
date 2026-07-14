import React from 'react';

interface PandaLogoProps {
  className?: string;
}

export default function PandaLogo({ className = "h-11 w-11" }: PandaLogoProps) {
  // Classic deep black and pure white for typical panda colors
  const blackColor = "#000000"; 
  const whiteColor = "#FFFFFF"; 

  return (
    <svg 
      viewBox="0 0 200 220" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`${className} transition-transform hover:scale-105 duration-300 drop-shadow-md overflow-visible`}
    >
      {/* 
        SILHOUETTE BACKING (WHITE OUTLINE)
        This group renders a thick white outline around the entire outer silhouette
        so the panda stands out clearly on any dark/light background.
      */}
      <g stroke={whiteColor} strokeWidth="14" strokeLinejoin="round" strokeLinecap="round" fill={whiteColor}>
        {/* Ears */}
        <circle cx="52" cy="34" r="24" />
        <circle cx="148" cy="34" r="24" />
        
        {/* Plump Seated Body Backing */}
        <path d="M 42 110 C 18 125, 8 155, 8 190 C 8 214, 28 214, 100 214 C 172 214, 192 214, 192 190 C 192 155, 182 125, 158 110 Z" />
        
        {/* Head */}
        <ellipse cx="100" cy="85" rx="64" ry="53" />
      </g>

      {/* 
        ACTUAL PANDA DRAWING (Black and White typical colors)
      */}
      {/* Ears */}
      <circle cx="52" cy="34" r="24" fill={blackColor} />
      <circle cx="148" cy="34" r="24" fill={blackColor} />
      
      {/* Plump Seated Body (Extremely fat and round matching the reference upload) */}
      <path 
        d="M 42 110 C 18 125, 8 155, 8 190 C 8 214, 28 214, 100 214 C 172 214, 192 214, 192 190 C 192 155, 182 125, 158 110 Z" 
        fill={blackColor} 
      />


      {/* Belly Cutout (Symmetric dome matching reference exactly) */}
      <path 
        d="M 64 214 C 64 154, 136 154, 136 214 Z" 
        fill={whiteColor} 
      />

      {/* Head */}
      <ellipse cx="100" cy="85" rx="64" ry="53" fill={whiteColor} stroke={blackColor} strokeWidth="8" strokeLinejoin="round" />

      {/* Eye Patches - Custom organic kidney bezier paths matching the uploaded reference shape exactly */}
      <path 
        d="M 80 60 C 65 60, 56 70, 56 86 C 56 98, 68 104, 78 104 C 86 104, 90 92, 86 80 C 84 74, 84 66, 80 60 Z" 
        fill={blackColor} 
      />
      <path 
        d="M 120 60 C 135 60, 144 70, 144 86 C 144 98, 132 104, 122 104 C 114 104, 110 92, 114 80 C 116 74, 116 66, 120 60 Z" 
        fill={blackColor} 
      />

      {/* Clear Eyes (White pupils matching the reference upload exactly - simple crisp white circles high and inner) */}
      <circle cx="76" cy="78" r="5" fill={whiteColor} />
      <circle cx="124" cy="78" r="5" fill={whiteColor} />

      {/* Rounded Nose */}
      <path 
        d="M 90 94 C 90 91, 110 91, 110 94 C 110 99, 105 103, 100 103 C 95 103, 90 99, 90 94 Z" 
        fill={blackColor} 
      />

      {/* Cute smile connecting line and W curve */}
      <path 
        d="M 100 103 L 100 110" 
        stroke={blackColor} 
        strokeWidth="5.5" 
        strokeLinecap="round" 
      />
      <path 
        d="M 86 109 C 86 117, 100 117, 100 110 C 100 117, 114 117, 114 109" 
        stroke={blackColor} 
        strokeWidth="5.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none"
      />
    </svg>
  );
}
