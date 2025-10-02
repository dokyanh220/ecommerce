<<<<<<< HEAD
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
=======
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
>>>>>>> ca304a38ec96ae1d5706bad25d33b2fa8dc7dee3

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
