import React from 'react';
import { twMerge } from 'tailwind-merge';

interface HeadingProps {
  as?: keyof JSX.IntrinsicElements;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'primary' | 'secondary' | 'dark' | 'light' | 'neutral';
  weight?: 'normal' | 'bold' | 'semibold';
  children: React.ReactNode;
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-md',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const colorMap = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  dark: 'text-dark',
  light: 'text-light',
  neutral: 'text-slate-600',
};

const weightMap = {
  normal: 'font-normal',
  bold: 'font-bold',
  semibold: 'font-semibold',
};

const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h1',
  size = 'md',
  color = 'primary',
  weight = 'bold',
  children,
  ...props
}) => {
  return (
    <Component
      className={twMerge(sizeMap[size], colorMap[color], weightMap[weight])}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Heading;
