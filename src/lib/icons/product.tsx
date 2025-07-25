import React from "react";

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

export const StockIcon = (props: IconProps) => (
  <IconBase {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m11 12l8.073-4.625M11 12L6.963 9.688M11 12v2.281m8.073-6.906a3.17 3.17 0 0 0-1.165-1.156L15.25 4.696m3.823 2.679c.275.472.427 1.015.427 1.58v1.608M2.926 7.374a3.14 3.14 0 0 0-.426 1.58v6.09c0 1.13.607 2.172 1.592 2.736l5.316 3.046A3.2 3.2 0 0 0 11 21.25M2.926 7.375a3.17 3.17 0 0 1 1.166-1.156l5.316-3.046a3.2 3.2 0 0 1 3.184 0l2.658 1.523M2.926 7.375l4.037 2.313m0 0l8.287-4.992"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M17.5 23a5.5 5.5 0 1 0 0-11a5.5 5.5 0 0 0 0 11m0-8.993a.5.5 0 0 1 .5.5V17h2.493a.5.5 0 1 1 0 1H18v2.493a.5.5 0 1 1-1 0V18h-2.493a.5.5 0 1 1 0-1H17v-2.493a.5.5 0 0 1 .5-.5"
      clipRule="evenodd"
    />
  </IconBase>
);

export const iconMap: Record<string, React.FC<IconProps>> = {
  stock: StockIcon,
};

// Function to get icon component by name
export const getIconProductByName = (
  iconName: string | null
): React.FC<IconProps> => {
  if (!iconName || !iconMap[iconName]) {
    return StockIcon; // Default icon
  }
  return iconMap[iconName];
};
