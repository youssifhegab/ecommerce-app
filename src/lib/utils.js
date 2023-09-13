import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getSizeName(value) {
  switch (value) {
    case 'xs':
      return 'X-Small';
    case 's':
      return 'Small';
    case 'm':
      return 'Medium';
    case 'l':
      return 'Large';
    case 'xl':
      return 'X-Large';
    case 'one-size':
      return 'One Size';
  }
}
