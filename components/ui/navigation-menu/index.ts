import { cva } from 'class-variance-authority'

export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavigationMenuContent } from './NavigationMenuContent.vue'
export { default as NavigationMenuIndicator } from './NavigationMenuIndicator.vue'
export { default as NavigationMenuItem } from './NavigationMenuItem.vue'
export { default as NavigationMenuLink } from './NavigationMenuLink.vue'
export { default as NavigationMenuList } from './NavigationMenuList.vue'
export { default as NavigationMenuTrigger } from './NavigationMenuTrigger.vue'
export { default as NavigationMenuViewport } from './NavigationMenuViewport.vue'

export const navigationMenuTriggerStyle = cva(
  'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-mediumhover:bg-white/3 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:hover:bg-accent data-[state=open]:text-primary data-[state=open]:focus:bg-accent data-[state=open]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:w-1/2 after:h-[2px] after:bg-primary after:rounded-full after:scale-x-0 after:transition-transform after:duration-300 after:ease-in-out hover:after:scale-x-100',
  {
    variants: {
      active: {
        true: 'text-primary! font-medium bg-transparent after:scale-x-100',
        false: ''
      },
      dark: {
        true: 'text-white hover:text-white data-[state=open]:text-primary',
        false: 'text-gray-600 hover:text-gray-700 data-[state=open]:text-primary',
      },
    },
    defaultVariants: {
      active: false,
      dark: true,
    }
  }
)
