import { cn } from "@/lib/utilities/utils"

function Skeleton({ className, placeholder, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(`bg-accent animate-pulse rounded-md ${placeholder ? 'flex items-center pl-3 text-gray-300 font-light' : ''}`, className)}
      {...props}
    >
    {placeholder || ''}
    </div>
  )
}

export { Skeleton }
