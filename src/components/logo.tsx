import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    width="1em"
    height="1em"
    {...props}
  >
    <g fill="currentColor">
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z" />
      <path d="M136,80v96a8,8,0,0,1-16,0V80a8,8,0,0,1,16,0Z" />
      <path d="M176,104v48a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
      <path d="M96,104v48a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z" />
    </g>
  </svg>
);
