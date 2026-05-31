import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ title, variant = 'primary', style, ...rest }: Props) {
  const base = 'rounded-2xl py-4 px-6 items-center justify-center';
  const variants = {
    primary: 'bg-primary active:bg-primary-dark',
    secondary: 'bg-accent active:bg-accent-light',
    ghost: 'bg-transparent border-2 border-primary',
  };
  const textVariants = {
    primary: 'text-white font-bold text-lg',
    secondary: 'text-textMain font-bold text-lg',
    ghost: 'text-primary font-bold text-lg',
  };

  return (
    <TouchableOpacity className={`${base} ${variants[variant]}`} activeOpacity={0.8} {...rest}>
      <Text className={textVariants[variant]}>{title}</Text>
    </TouchableOpacity>
  );
}
