export default defineAppConfig({
  ui: {
    colors: {
      primary: 'rise-orange',
      secondary: 'deep-teal',
      neutral: 'slate'
    },
    avatar: {
      slots: {
        root: 'rounded-md',
        fallback: 'text-inherit font-bold'
      }
    },
    editor: {
      slots: {
        base: [
          // Tables
          '[&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-0 [&_table]:rounded-md',
          '[&_th]:py-3 [&_th]:px-4 [&_th]:font-semibold [&_th]:text-sm [&_th]:text-left [&_th]:bg-muted/50 [&_th]:border-t [&_th]:border-b [&_th]:border-e [&_th]:first:border-s [&_th]:border-muted',
          '[&_th_p]:my-0 [&_th_p]:leading-5',
          '[&_td]:py-3 [&_td]:px-4 [&_td]:text-sm [&_td]:text-left [&_td]:border-b [&_td]:border-e [&_td]:first:border-s [&_td]:border-muted',
          '[&_td_p]:my-0 [&_td_p]:leading-5 [&_td_code]:text-xs/5 [&_td_ul]:my-0 [&_td_ol]:my-0 [&_td_ul]:ps-4.5 [&_td_ol]:ps-4.5 [&_td_li]:leading-6 [&_td_li]:my-0.5',
          '[&_tr:first-child_th:first-child]:rounded-tl-md [&_tr:first-child_th:last-child]:rounded-tr-md [&_tr:last-child_td:first-child]:rounded-bl-md [&_tr:last-child_td:last-child]:rounded-br-md',
          '[&_.selectedCell]:bg-primary/10 [&_.selectedCell]:ring-2 [&_.selectedCell]:ring-primary [&_.selectedCell]:ring-inset',
          // Task lists
          '[&_ul[data-type=taskList]]:list-none [&_ul[data-type=taskList]]:ps-1',
          '[&_ul[data-type=taskList]_li]:flex [&_ul[data-type=taskList]_li]:items-center [&_ul[data-type=taskList]_li]:ps-0',
          '[&_ul[data-type=taskList]_li_label]:inline-flex [&_ul[data-type=taskList]_li_label]:pr-2.5',
          '[&_ul[data-type=taskList]_li_label_input]:appearance-none [&_ul[data-type=taskList]_li_label_input]:size-4 [&_ul[data-type=taskList]_li_label_input]:rounded-sm [&_ul[data-type=taskList]_li_label_input]:ring [&_ul[data-type=taskList]_li_label_input]:ring-inset [&_ul[data-type=taskList]_li_label_input]:ring-accented [&_ul[data-type=taskList]_li_label_input]:bg-center',
          '[&_ul[data-type=taskList]_li_label_input:checked]:bg-primary [&_ul[data-type=taskList]_li_label_input:checked]:ring-primary [&_ul[data-type=taskList]_li_label_input:checked]:bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDZMOSAxN2wtNS01Ii8+PC9zdmc+)] dark:[&_ul[data-type=taskList]_li_label_input:checked]:bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTIwIDZMOSAxN2wtNS01Ii8+PC9zdmc+)]',
          '[&_ul[data-type=taskList]_li[data-checked=true]>div>p]:line-through [&_ul[data-type=taskList]_li[data-checked=true]>div>p]:opacity-50'
        ]
      }
    },
    alert: {
      slots: {
        root: ['gap-4 rounded-xl'],
        icon: ['size-8']
      }
    },
    badge: {
      compoundVariants: [
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring-gray-50/30'
        }
      ]
    },
    card: {
      slots: {
        root: ['rounded-xl shadow-subtle border-default'],
        header: ['border-none'],
        footer: ['border-none']
      }
    },
    carousel: {
      variants: {
        active: {
          true: {
            dot: 'data-[state=active]:bg-primary'
          }
        }
      }
    },
    tabs: {
      slots: {
        trigger: ['cursor-pointer']
      }
    },
    item: {
      slots: {
        base: ['transition-colors']
      }
    },
    button: {
      slots: {
        base: ['cursor-pointer']
      },
      variants: {
        variant: {
          solid: 'shadow inset-shadow-white/15 inset-shadow-2xs',
          light: 'bg-white border border-default'
        },
        size: {
          sm: {
            base: 'px-4 py-1.5 rounded-lg',
          },
          md: {
            base: 'px-4 py-1.5 rounded-lg',
          }
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'ring ring-primary hover:bg-primary/85'
        },
        {
          color: 'secondary',
          variant: 'solid',
          class: 'ring ring-secondary hover:bg-deep-teal-900'
        },
        {
          color: 'success',
          variant: 'solid',
          class: 'ring ring-success hover:bg-success/85'
        },
        {
          color: 'error',
          variant: 'solid',
          class: 'ring ring-error hover:bg-error/85'
        },
        {
          color: 'info',
          variant: 'solid',
          class: 'ring ring-info hover:bg-info/85'
        },
        {
          color: 'warning',
          variant: 'solid',
          class: 'hover:bg-warning/85'
        },
        {
          color: 'primary',
          variant: 'ghost',
          class: 'text-gray-500 hover:text-primary hover:bg-primary-50'
        },
        {
          color: 'neutral',
          variant: 'ghost',
          class: 'text-gray-500 hover:text-neutral hover:bg-neutral-50'
        },
        {
          color: 'success',
          variant: 'ghost',
          class: 'text-gray-500 hover:text-success hover:bg-success-50'
        },
        {
          color: 'warning',
          variant: 'ghost',
          class: 'text-gray-500 hover:text-warning hover:bg-warning-50'
        },
        {
          color: 'error',
          variant: 'ghost',
          class: 'text-gray-500 hover:text-error hover:bg-error-50'
        },
        {
          color: 'info',
          variant: 'ghost',
          class: 'text-gray-500 hover:text-info hover:bg-info-50'
        },
        {
          color: 'primary',
          variant: 'light',
          class: 'text-gray-500 hover:text-primary hover:bg-primary-50 hover:border-primary-100'
        },
        {
          color: 'neutral',
          variant: 'light',
          class: 'text-gray-500 hover:text-neutral hover:bg-neutral-50 hover:border-neutral-100'
        },
        {
          color: 'success',
          variant: 'light',
          class: 'text-gray-500 hover:text-success hover:bg-success-50 hover:border-success-100'
        },
        {
          color: 'warning',
          variant: 'light',
          class: 'text-gray-500 hover:text-warning hover:bg-warning-50 hover:border-warning-100'
        },
        {
          color: 'error',
          variant: 'light',
          class: 'text-gray-500 hover:text-error hover:bg-error-50 hover:border-error-100'
        },
        {
          color: 'info',
          variant: 'light',
          class: 'text-gray-500 hover:text-info hover:bg-info-50 hover:border-info-100'
        }
      ]
    },
    formField: {
      slots: {
        labelWrapper: ['block']
      },
      variants: {
        orientation: {
          vertical: {
            container: 'mt-3'
          }
        }
      }
    },
    switch: {
      slots: {
        base: ['cursor-pointer']
      }
    },
    input: {
      slots: {
        base: ['transition duration-300 ease-in-out rounded-lg disabled:bg-muted disabled:text-gray-700 read-only:bg-muted read-only:text-gray-600']
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: ['outline', 'subtle'],
          class: 'focus-visible:ring-1 ring-slate-200'
        },
        {
          color: 'neutral',
          variant: ['outline', 'subtle'],
          class: 'focus-visible:ring-1 ring-slate-200'
        }
      ],
      defaultVariants: {
        size: 'lg'
      }
    },
    textarea: {
      slots: {
        base: ['transition duration-300 ease-in-out rounded-lg disabled:bg-muted disabled:text-gray-600 read-only:bg-muted read-only:text-gray-600']
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: ['outline', 'subtle'],
          class: 'focus-visible:ring-1 ring-slate-200'
        },
        {
          color: 'neutral',
          variant: ['outline', 'subtle'],
          class: 'focus-visible:ring-1'
        }
      ],
      defaultVariants: {
        size: 'lg'
      }
    },
    select: {
      slots: {
        base: ['cursor-pointer rounded-lg'],
        item: ['cursor-pointer']
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: ['outline', 'subtle'],
          class: 'text-slate-600 focus:ring-1 ring-slate-200'
        },
        {
          color: 'neutral',
          variant: ['outline', 'subtle'],
          class: 'text-slate-600 focus:ring-1 ring-slate-200'
        }
      ],
      defaultVariants: {
        size: 'lg'
      }
    },
    selectMenu: {
      slots: {
        base: ['cursor-pointer rounded-lg'],
        item: ['cursor-pointer']
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: ['outline', 'subtle'],
          class: 'text-slate-600 focus:ring-1 ring-slate-200'
        },
        {
          color: 'neutral',
          variant: ['outline', 'subtle'],
          class: 'text-slate-600 focus:ring-1 ring-slate-200'
        }
      ],
      defaultVariants: {
        size: 'lg'
      }
    },
    popover: {
      slots: {
        content: ['shadow-xs'],
        arrow: ['fill-primary']
      }
    },
    empty: {
      slots: {
        root: ['p-8 sm:p-10 lg:p-16'],
        header: ['gap-4'],
        description: ['text-dimmed!']
      }
    },
    pageSection: {
      slots: {
        container: "py-12 sm:py-12 md:py-16 lg:py-16"
      }
    },
    navigationMenu: {
      variants: {
        orientation: {
          vertical: {
            list: 'flex flex-col gap-1.5!',
            link: 'px-3 py-2'
          }
        }
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'pill',
          active: true,
          highlight: false,
          class: {
            link: 'before:bg-primary-50'
          }
        }
      ]
    },
    table: {
      slots: {
        root: ['px-4 py-2'],
        base: ['outline outline-border rounded-md overflow-auto']
      }
    },
    modal: {
      variants: {
        overlay: {
          true: {
            overlay: 'bg-black/50'
          }
        }
      }
    },
  }
})
