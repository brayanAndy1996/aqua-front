import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

// Base Icon component with consistent props
const IconBase = ({ 
  children, 
  size = 24, 
  width, 
  height, 
  ...props 
}: React.PropsWithChildren<IconProps>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || size}
      height={height || size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
};

// Role Icons
export const ShieldIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </IconBase>
);

export const UserCogIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="9" cy="7" r="4" />
    <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
    <circle cx="19" cy="11" r="2" />
    <path d="M19 8v1" />
    <path d="M19 14v1" />
    <path d="M16 11h1" />
    <path d="M21 11h1" />
    <path d="m17.5 9.5 1 1" />
    <path d="m20.5 12.5-1-1" />
    <path d="m17.5 12.5 1-1" />
    <path d="m20.5 9.5-1 1" />
  </IconBase>
);

export const GraduationCapIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </IconBase>
);

export const ClipboardListIcon = (props: IconProps) => (
  <IconBase {...props}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4" />
    <path d="M12 16h4" />
    <path d="M8 11h.01" />
    <path d="M8 16h.01" />
  </IconBase>
);

export const UserIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </IconBase>
);

export const KeyIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </IconBase>
);

export const DatabaseIcon = (props: IconProps) => (
  <IconBase {...props}>
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </IconBase>
);

export const SettingsIcon = (props: IconProps) => (
  <IconBase {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </IconBase>
);

export const ParentIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path d="M14.423 12.17a5.23 5.23 0 0 1-3.102 1.03c-1.163 0-2.23-.39-3.103-1.03c-.75.625-1.498 1.52-2.11 2.623c-1.423 2.563-1.58 5.192-.35 5.874c.548.312 1.126.078 1.722-.496a10.5 10.5 0 0 0-.167 1.874c0 2.938 1.14 5.312 2.543 5.312c.846 0 1.265-.865 1.466-2.188c.2 1.314.62 2.188 1.46 2.188c1.397 0 2.546-2.375 2.546-5.312c0-.66-.062-1.29-.168-1.873c.6.575 1.176.813 1.726.497c1.227-.682 1.068-3.31-.354-5.874c-.61-1.104-1.36-1.998-2.11-2.623zm-3.103.03a4.279 4.279 0 1 0-.003-8.561a4.279 4.279 0 0 0 .003 8.563zm10.667 5.47c1.508 0 2.732-1.224 2.732-2.734S23.493 12.2 21.986 12.2a2.737 2.737 0 0 0-2.736 2.736a2.737 2.737 0 0 0 2.737 2.735zm3.33 1.657c-.39-.705-.868-1.277-1.348-1.677c-.56.41-1.24.66-1.983.66s-1.426-.25-1.983-.66c-.48.4-.958.972-1.35 1.677c-.91 1.638-1.01 3.318-.224 3.754c.35.2.72.05 1.1-.316a7 7 0 0 0-.104 1.197c0 1.88.728 3.397 1.625 3.397c.54 0 .81-.553.938-1.398c.128.84.396 1.397.934 1.397c.893 0 1.627-1.518 1.627-3.396c0-.42-.04-.824-.108-1.196c.383.367.752.52 1.104.317c.782-.434.68-2.115-.228-3.753z"/>
  </IconBase>
);

// Icon mapping object for dynamic icon rendering
export const roleIconMap: Record<string, React.FC<IconProps>> = {
  'shield': ShieldIcon,
  'user-cog': UserCogIcon,
  'graduation-cap': GraduationCapIcon,
  'clipboard-list': ClipboardListIcon,
  'user': UserIcon,
  'key': KeyIcon,
  'database': DatabaseIcon,
  'settings': SettingsIcon,
  'parent': ParentIcon,
};

// Function to get icon component by name
export const getRoleIconByName = (iconName: string | null): React.FC<IconProps> => {
  if (!iconName || !roleIconMap[iconName]) {
    return ShieldIcon; // Default icon
  }
  return roleIconMap[iconName];
};
