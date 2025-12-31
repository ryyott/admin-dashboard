"use client";

import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardLogo,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/ui/shadcn-io/credit-card";

// Apple Logo SVG Component
const AppleLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 270 333" {...props}>
    <title>Apple Logo</title>
    <path
      stroke="#B4B4B4"
      strokeWidth="8"
      d="M190.57 86.7c9.06 0 42.6.79 64.66 32.36l2.18 3.12-3 2.33c-2.28 1.76-31.95 18.39-31.95 55.7 0 21.62 9.45 36.15 19.09 45.41A71.12 71.12 0 0 0 255 235.76c3.79 2.2 6.28 3.16 6.25 3.15l3.32 1.1-.65 3.43c-.1.58-.63 2.37-1.45 4.78a173.59 173.59 0 0 1-20.44 40.6l-.02.01v.01c-6.59 9.47-13.6 19.34-21.72 26.82-8.2 7.54-17.84 12.94-29.7 12.94-11.44 0-18.74-3.39-25.76-6.44-6.85-2.97-13.68-5.77-25-5.77-11.03 0-18.45 2.9-25.79 6-7.36 3.1-15 6.61-25.57 6.61-10.99 0-20.09-5.07-28.2-12.57-8.05-7.44-15.5-17.59-23.19-28.35v-.01l-.01-.01C18.75 262.04 4 221.78 4 183.43 4 121.37 44.7 87.5 85.63 87.5c11.06 0 21.06 3.62 29.52 6.99 4.33 1.72 8.12 3.32 11.71 4.53 3.58 1.21 6.57 1.89 9.14 1.89 2.36 0 5.33-.7 9.1-2 3.79-1.3 7.85-3 12.6-4.84 9.28-3.58 20.45-7.38 32.87-7.38Zm8.7-78.58c.49 2.17.69 4.71.69 7.1 0 16.9-7.25 33.61-17.39 45.62-5.48 6.76-12.87 12.58-20.72 16.71-7.85 4.14-16.42 6.74-24.28 6.74-1.92 0-3.78-.25-4.94-.47l-2.55-.47-.6-2.52a31.7 31.7 0 0 1-.7-6.53c0-17.27 8.78-33.98 18.03-44.49 11.84-13.71 31.47-24.17 48.4-24.8l3.33-.13.73 3.24Z"
    />
  </svg>
);

// Apple Chip SVG Component
const AppleChip = ({ ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg enableBackground="new 0 0 132 92" viewBox="0 0 132 92" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Chip</title>
    <rect
      x="0.5"
      y="0.5"
      width="131"
      height="91"
      rx="20.5"
      fill="url(#kibo-credit-card-chip-gradient-apple)"
      stroke="#CECCC8"
    />
    <rect x="9.5" y="9.5" width="48" height="21" rx="10.5" fill="#EAEAEA" stroke="#95958E" />
    <rect x="9.5" y="61.5" width="48" height="21" rx="10.5" fill="#EAEAEA" stroke="#95958E" />
    <rect x="9.5" y="35.5" width="48" height="21" rx="10.5" fill="#EAEAEA" stroke="#95958E" />
    <rect x="74.5" y="9.5" width="48" height="21" rx="10.5" fill="#EAEAEA" stroke="#95958E" />
    <rect x="74.5" y="61.5" width="48" height="21" rx="10.5" fill="#EAEAEA" stroke="#95958E" />
    <rect x="74.5" y="35.5" width="48" height="21" rx="10.5" fill="#EAEAEA" stroke="#95958E" />
    <defs>
      <linearGradient
        id="kibo-credit-card-chip-gradient-apple"
        x1="1"
        y1="46"
        x2="131"
        y2="91"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F2F2F2" />
        <stop offset="1" stopColor="#BFBFBF" />
      </linearGradient>
    </defs>
  </svg>
);

// Mastercard Logo SVG Component
const MastercardLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 431 319" {...props}>
    <title>Mastercard Logo</title>
    <path
      fill="#B4B4B4"
      d="M86.74 318.33v-20.3c0-7.76-4.82-12.85-13.1-12.85-4.13 0-8.63 1.34-11.73 5.75-2.4-3.7-5.86-5.75-11.04-5.75-3.46 0-6.9 1.02-9.64 4.73v-4.06H34v32.48h7.23v-17.94c0-5.75 3.1-8.47 7.91-8.47 4.82 0 7.23 3.03 7.23 8.47v17.94h7.23v-17.94c0-5.75 3.46-8.47 7.91-8.47 4.82 0 7.23 3.03 7.23 8.47v17.94h8Zm107.23-32.48h-11.72v-9.81h-7.23v9.81h-6.55v6.42h6.55v14.9c0 7.45 3.09 11.83 11.36 11.83 3.1 0 6.55-1.02 8.96-2.37l-2.09-6.1a11.73 11.73 0 0 1-6.22 1.69c-3.46 0-4.82-2.05-4.82-5.4v-14.55h11.72v-6.42h.04Zm61.38-.7a9.83 9.83 0 0 0-8.64 4.72v-4.06h-7.23v32.48h7.23V300c0-5.4 2.4-8.47 6.9-8.47 1.37 0 3.1.35 4.5.67l2.1-6.78c-1.45-.28-3.5-.28-4.86-.28Zm-92.74 3.38c-3.46-2.36-8.28-3.39-13.46-3.39-8.27 0-13.78 4.06-13.78 10.49 0 5.4 4.14 8.47 11.37 9.46l3.45.35c3.78.67 5.87 1.7 5.87 3.39 0 2.37-2.77 4.06-7.6 4.06a19.3 19.3 0 0 1-11.04-3.39l-3.45 5.4c3.77 2.72 8.96 4.06 14.14 4.06 9.64 0 15.18-4.41 15.18-10.48 0-5.76-4.5-8.8-11.37-9.82l-3.45-.35c-3.1-.36-5.5-1.03-5.5-3.04 0-2.36 2.4-3.7 6.22-3.7 4.14 0 8.28 1.69 10.36 2.72l3.06-5.76Zm192.34-3.39a9.83 9.83 0 0 0-8.63 4.73v-4.06h-7.23v32.48h7.23V300c0-5.4 2.4-8.47 6.9-8.47 1.37 0 3.1.35 4.5.67l2.1-6.7c-1.41-.36-3.46-.36-4.87-.36Zm-92.38 16.95c0 9.81 6.91 16.91 17.6 16.91 4.82 0 8.27-1.02 11.72-3.7l-3.45-5.76c-2.77 2.05-5.5 3.03-8.63 3.03-5.87 0-10-4.06-10-10.48 0-6.11 4.13-10.17 10-10.48 3.09 0 5.86 1.02 8.63 3.03l3.45-5.75c-3.45-2.72-6.9-3.71-11.72-3.71-10.69-.04-17.6 7.1-17.6 16.91Zm66.88 0v-16.24h-7.23v4.06c-2.41-3.04-5.87-4.73-10.36-4.73-9.32 0-16.55 7.1-16.55 16.91S302.54 319 311.86 319c4.82 0 8.27-1.7 10.36-4.73v4.06h7.23v-16.24Zm-26.55 0c0-5.75 3.78-10.48 10-10.48 5.86 0 10 4.41 10 10.48 0 5.76-4.14 10.49-10 10.49-6.19-.36-10-4.77-10-10.49Zm-86.51-16.95c-9.64 0-16.55 6.78-16.55 16.91 0 10.17 6.9 16.91 16.9 16.91 4.83 0 9.65-1.34 13.46-4.41l-3.45-5.09a16.61 16.61 0 0 1-9.64 3.4c-4.5 0-8.96-2.06-10-7.77h24.46v-2.72c.32-10.45-5.9-17.23-15.18-17.23Zm0 6.11c4.5 0 7.59 2.72 8.27 7.76h-17.23c.68-4.37 3.77-7.76 8.96-7.76ZM396 302.09V273h-7.23v16.91c-2.4-3.04-5.86-4.73-10.36-4.73-9.32 0-16.55 7.1-16.55 16.91S369.09 319 378.41 319c4.82 0 8.27-1.7 10.36-4.73v4.06H396v-16.24Zm-26.55 0c0-5.75 3.78-10.48 10-10.48 5.87 0 10 4.41 10 10.48 0 5.76-4.13 10.49-10 10.49-6.22-.36-10-4.77-10-10.49Zm-242.03 0v-16.24h-7.23v4.06c-2.4-3.04-5.86-4.73-10.36-4.73-9.32 0-16.55 7.1-16.55 16.91S100.51 319 109.83 319c4.82 0 8.27-1.7 10.36-4.73v4.06h7.23v-16.24Zm-26.87 0c0-5.75 3.78-10.48 10-10.48 5.87 0 10 4.41 10 10.48 0 5.76-4.13 10.49-10 10.49-6.22-.36-10-4.77-10-10.49Z"
    />
    <path
      stroke="#B4B4B4"
      strokeWidth="8"
      d="M132 4c29.88 0 57.27 10.32 78.97 27.38l3.98 3.13-3.96 3.15c-27.67 22-45.69 56.02-45.69 94.35 0 38.34 18 72.67 45.66 94.33l4.02 3.14-4 3.15A127.35 127.35 0 0 1 132 260.02C61.25 260.02 4 202.76 4 132 4 61.25 61.25 4 132 4Zm166.45 0c70.8 0 128.05 57.62 128.05 128 0 70.76-57.25 128.02-128 128.02a127.35 127.35 0 0 1-78.97-27.39l-4-3.14 4-3.15a119.32 119.32 0 0 0 45.66-94.33c0-38.33-18-72.35-45.68-94.35l-3.96-3.15 3.97-3.13A127.15 127.15 0 0 1 298.45 4Z"
    />
  </svg>
);

// Scotiabank Logo SVG Component
const ScotiabankLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 72.13 10.5" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Scotiabank Logo</title>
    <g fill="#eb0f19">
      <path d="M6.73 8.37c.16-.4.24-.82.23-1.25.02-.63-.2-1.24-.6-1.72a5 5 0 0 0-2.31-1.23c-.2-.06-.41-.13-.6-.22-.18-.08-.33-.2-.46-.33a.78.78 0 0 1-.2-.55c.01-.3.18-.57.44-.7a2.09 2.09 0 0 1 1.68 0c.24.08.47.19.69.32l.9-1.8A5.17 5.17 0 0 0 3.77.13C3.3.13 2.85.2 2.4.36a3.01 3.01 0 0 0-1.7 1.7c-.16.4-.24.82-.23 1.25.02.68.31 1.32.8 1.8.46.4 1 .71 1.6.9l.8.27c.2.08.4.18.57.3a1 1 0 0 1 .31.36c.07.13.09.28.07.43a.87.87 0 0 1-.3.58c-.28.21-.63.3-.98.27-.4 0-.81-.1-1.18-.28a8.91 8.91 0 0 1-.95-.53L.13 9.27a4.82 4.82 0 0 0 4.62.84 3.15 3.15 0 0 0 1.98-1.74Zm5.82-.58a1.57 1.57 0 1 1 0-1.96l1.4-1.41a3.54 3.54 0 0 0-2.62-1.17c-1.96 0-3.65 1.4-3.65 3.55 0 2.16 1.7 3.56 3.66 3.56 1 0 1.96-.42 2.63-1.16zm0 0" />
      <path d="M17.6 3.25a3.56 3.56 0 1 0-.01 7.11 3.56 3.56 0 0 0 0-7.11zm0 5.12a1.57 1.57 0 1 1 .02-3.14 1.57 1.57 0 0 1-.02 3.14zm8.08-4.95h-.97v-2.1h-2.13v2.1h-.97v1.92h.97v4.85h2.13V5.34h.97zM27.72.13a1.19 1.19 0 1 0 0 2.38 1.19 1.19 0 0 0 0-2.38zm-1.06 3.29h2.12v6.77h-2.12zM37.1 10.2V3.42h-2.08v.71l-.2-.16a2.58 2.58 0 0 0-1.79-.72c-1.83 0-3.37 1.63-3.37 3.55 0 1.93 1.55 3.56 3.37 3.56.67 0 1.31-.25 1.8-.72l.2-.17v.72Zm-3.72-1.8a1.6 1.6 0 1 1 .02-3.2 1.6 1.6 0 0 1-.02 3.2zm6.88 1.8v-.72l.2.17a2.6 2.6 0 0 0 1.8.72c1.82 0 3.37-1.63 3.37-3.56 0-1.93-1.55-3.56-3.38-3.56-.67 0-1.31.26-1.8.72l-.19.17V.3H38.2v9.9Zm.05-3.39a1.6 1.6 0 1 1 1.6 1.6 1.6 1.6 0 0 1-1.6-1.6zm13.47 3.39V3.42h-2.07v.71l-.2-.16a2.59 2.59 0 0 0-1.79-.72c-1.83 0-3.37 1.63-3.37 3.55 0 1.93 1.55 3.56 3.37 3.56.67 0 1.32-.25 1.8-.72l.2-.17v.72Zm-3.7-1.8a1.6 1.6 0 1 1 0-3.2 1.6 1.6 0 0 1 0 3.2zm8.12-3.16c.69 0 1.26.57 1.26 1.27v3.7h2.12V6.24c0-1.8-1.04-2.97-2.68-2.97-.68 0-1.39.3-1.97 1.24V3.44H54.8v6.76h2.11V6.5a1.27 1.27 0 0 1 1.28-1.26zm11.12 4.96-2.6-3.4 2.42-3.38h-2.48L64.7 6.16V.3h-2.13v9.9h2.13V7.4l2.14 2.8zm1.5-2.37a1.19 1.19 0 1 0-.01 2.37 1.19 1.19 0 0 0 .01-2.37zm0 2.13a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9zm0 0" />
      <path d="M70.82 9.2h-.19v.46h-.23v-1.3h.5c.23 0 .42.2.42.43 0 .17-.1.31-.24.38l.27.49h-.28Zm-.19-.2h.27a.2.2 0 0 0 .2-.2.2.2 0 0 0-.2-.2h-.27zm0 0" />
    </g>
  </svg>
);

// Scene Plus Mark SVG Component
const ScenePlusMark = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 110 35" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Scene Plus Mark</title>
    <g>
      <path
        fill="#fff"
        d="M75.28 23.38v11.11h-4.55V23.95c0-2.46-1.45-3.73-3.5-3.73-2.22 0-3.88 1.34-3.88 4.5v9.77h-4.56V16.4h4.02l.53 2.02c1.06-1.63 2.9-2.53 5.27-2.53 3.74 0 6.67 2.68 6.67 7.5Zm11.79 7.38a5.2 5.2 0 0 0 3-.9 2.12 2.12 0 0 1 2.3-.12 2.13 2.13 0 0 1 1.04 1.78 2.2 2.2 0 0 1-.9 1.86 9.4 9.4 0 0 1-5.5 1.63c-5.94 0-9.69-4.17-9.69-9.57s3.78-9.56 9.33-9.56c5.23 0 8.94 4.23 8.94 9.56 0 .65-.07 1.3-.18 1.93H82.09c.64 2.38 2.58 3.4 4.98 3.4Zm3.96-7.02a4.31 4.31 0 0 0-4.38-3.66 4.42 4.42 0 0 0-4.63 3.66h9Z"
      />
      <path
        fill="#9B43FF"
        d="M100.04 6.29c1.43 0 2.6-1.2 2.6-2.66a2.63 2.63 0 0 0-2.6-2.66 2.63 2.63 0 0 0-2.59 2.66 2.63 2.63 0 0 0 2.6 2.66Z"
      />
      <path
        fill="#23B574"
        d="M100.04 13.84c1.43 0 2.6-1.2 2.6-2.66a2.63 2.63 0 0 0-2.6-2.66 2.63 2.63 0 0 0-2.59 2.66 2.63 2.63 0 0 0 2.6 2.66Z"
      />
      <path
        fill="#FF93AA"
        d="M100.04 21.39c1.43 0 2.6-1.2 2.6-2.66a2.63 2.63 0 0 0-2.6-2.66 2.63 2.63 0 0 0-2.59 2.66 2.63 2.63 0 0 0 2.6 2.66Z"
      />
      <path
        fill="#2C76EC"
        d="M107.4 13.84c1.44 0 2.6-1.2 2.6-2.66a2.63 2.63 0 0 0-2.6-2.66 2.63 2.63 0 0 0-2.59 2.66 2.63 2.63 0 0 0 2.6 2.66Z"
      />
      <path
        fill="#FF3B48"
        d="M92.68 13.84c1.43 0 2.6-1.2 2.6-2.66a2.63 2.63 0 0 0-2.6-2.66 2.63 2.63 0 0 0-2.6 2.66 2.63 2.63 0 0 0 2.6 2.66Z"
      />
      <path
        fill="#fff"
        d="M52 29.17a4.97 4.97 0 0 1-3.77 1.6c-2.4 0-4.34-1.02-4.98-3.41h13.33c.12-.63.17-1.28.18-1.92 0-5.33-3.71-9.56-8.94-9.56-5.55 0-9.32 4.16-9.32 9.56S42.24 35 48.17 35c3.3 0 5.89-1.33 7.55-3.66l-3.71-2.17Zm-4.2-9.1c1.91 0 3.82 1.06 4.39 3.67h-9a4.43 4.43 0 0 1 4.62-3.66Zm-37.56-.5c-3.74-1.16-4.7-2-4.7-3.55 0-1.45 1.2-2.53 3.25-2.53 2.5 0 3.84 1.33 4.73 3.23l4.1-2.4A9.38 9.38 0 0 0 8.8 8.63C4.55 8.63.67 11.4.67 16.17s3.67 6.44 7.45 7.57c3.68 1.08 5.34 1.8 5.34 3.69 0 1.41-1.27 2.98-4 2.86a5.75 5.75 0 0 1-4.56-2.73c-.76-1.11-1.47-2.2-3.05-1.85-1.58.36-2.3 1.95-1.57 3.58a9.52 9.52 0 0 0 9.08 5.72c5.26 0 8.97-2.9 8.97-7.64 0-5.19-4.16-6.53-8.09-7.8Zm19.27 10.78c-2.72 0-4.74-2.06-4.74-4.92 0-2.87 2.02-4.97 4.74-4.97a4.29 4.29 0 0 1 4 2.4l3.95-2.3a8.85 8.85 0 0 0-7.91-4.68c-5.38 0-9.33 4.17-9.33 9.56 0 5.4 3.95 9.57 9.33 9.57 1.62.02 3.22-.4 4.62-1.24a9.17 9.17 0 0 0 3.37-3.48l-3.96-2.32a4.36 4.36 0 0 1-4.07 2.38Zm69.22 2.69h-.51v-.26h1.32v.26h-.51v1.45h-.3v-1.45Zm1-.26h.47l.44 1.22.42-1.22h.47v1.71h-.3v-1.37l-.5 1.37h-.2l-.5-1.37v1.37h-.29v-1.71Z"
      />
    </g>
  </svg>
);

// Apple Card Component
export function AppleCard() {
  return (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront safeArea={24} className="bg-[#F2F2F2] text-[#909090]">
          <CreditCardLogo className="absolute top-0 right-auto left-0 size-1/8">
            <AppleLogo />
          </CreditCardLogo>
          <CreditCardChip className="right-1 left-auto w-1/5">
            <AppleChip />
          </CreditCardChip>
          <CreditCardName className="absolute top-1/2 mt-4 -translate-y-1/2">RYYOTT</CreditCardName>
        </CreditCardFront>
        <CreditCardBack safeArea={0} className="bg-[#F2F2F2] text-[#909090]">
          <CreditCardServiceProvider type="Mastercard" className="top-6 right-6 max-h-1/4 max-w-1/4">
            <MastercardLogo className="w-full" />
          </CreditCardServiceProvider>
          <CreditCardMagStripe className="top-auto bottom-0 bg-[#BEBEC0]" />
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
}

// Visa/Mastercard Card Component
export function VisaCard() {
  return (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <CreditCardChip />
          <CreditCardServiceProvider type="Visa" className="fill-white" />
          <CreditCardNumber className="absolute bottom-0 left-0">•••• •••• •••• 5416</CreditCardNumber>
          <div className="absolute bottom-12 flex w-full justify-between">
            <CreditCardName>RYYOTT</CreditCardName>
            <CreditCardExpiry>06/09</CreditCardExpiry>
          </div>
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <CreditCardMagStripe className="bg-black/40" />
          <div className="absolute bottom-12 flex w-full justify-between">
            <CreditCardCvv>•••</CreditCardCvv>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
}

// Amex Card Component
export function AmexCard() {
  return (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-[#321419]">
          <ScotiabankLogo className="absolute top-0 left-0 h-1/10" />
          <CreditCardLogo className="size-1/4">
            <ScenePlusMark className="text-[#0e72d1]" />
          </CreditCardLogo>
          <CreditCardChip />
          <CreditCardServiceProvider type="Amex" className="fill-white" />
          <CreditCardName className="absolute bottom-0 left-0">RYYOTT</CreditCardName>
        </CreditCardFront>
        <CreditCardBack className="bg-[#321419]">
          <CreditCardMagStripe className="bg-white/20" />
          <CreditCardNumber className="absolute bottom-0 left-0">•••• •••••• •5416</CreditCardNumber>
          <div className="absolute top-1/2 flex -translate-y-1/2 gap-4">
            <CreditCardExpiry>06/09</CreditCardExpiry>
            <CreditCardCvv>•••</CreditCardCvv>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  );
}
