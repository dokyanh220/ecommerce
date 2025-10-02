<<<<<<< HEAD
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "~/lib/utils"
=======
'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '~/lib/utils'
>>>>>>> ca304a38ec96ae1d5706bad25d33b2fa8dc7dee3

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
<<<<<<< HEAD
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
=======
      data-slot='progress'
      className={cn(
        'bg-primary/20 relative h-3 w-full overflow-hidden rounded-full',
        'border bg-transparent',
>>>>>>> ca304a38ec96ae1d5706bad25d33b2fa8dc7dee3
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
<<<<<<< HEAD
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
=======
        data-slot='progress-indicator'
        className='bg-pink-400 h-full w-full flex-1 transition-all'
>>>>>>> ca304a38ec96ae1d5706bad25d33b2fa8dc7dee3
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
