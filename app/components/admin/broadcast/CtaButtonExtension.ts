import { Node, mergeAttributes } from '@tiptap/core'

/**
 * Custom TipTap node for a call-to-action button.
 *
 * Serializes to `<a data-cta href="…">Label</a>` so the backend
 * (`broadcastEmail.js`) can re-render it with the project-owned email button
 * markup. In the editor it shows as an orange pill matching the email template.
 */
export interface CtaButtonAttrs {
  label: string
  href: string
}

const BUTTON_STYLE
  = 'display:block;width:fit-content;margin-left:auto;margin-right:auto;'
  + 'padding:8px 20px;background:#FF8E4F;color:#ffffff;'
  + 'border-radius:10px;font-weight:700;text-decoration:none;'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    ctaButton: {
      // eslint-disable-next-line no-unused-vars -- param name is required syntax in a type signature
      setCtaButton: (attrs: CtaButtonAttrs) => ReturnType
    }
  }
}

export const CtaButton = Node.create({
  name: 'ctaButton',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: false,

  addAttributes() {
    return {
      href: {
        default: '#',
        parseHTML: (el: HTMLElement) => el.getAttribute('href') ?? '#'
      },
      label: {
        default: 'Button',
        parseHTML: (el: HTMLElement) => el.textContent || 'Button',
        // Rendered as the anchor's text content, not as an attribute.
        renderHTML: () => ({})
      }
    }
  },

  parseHTML() {
    return [{ tag: 'a[data-cta]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'a',
      mergeAttributes(HTMLAttributes, { 'data-cta': '', style: BUTTON_STYLE }),
      node.attrs.label
    ]
  },

  // In-editor view renders the button as a non-navigable <span> so an accidental
  // click selects the node instead of opening the URL and losing the draft. The
  // serialized output still uses renderHTML (`a[data-cta]`) for the email/preview.
  addNodeView() {
    return ({ node }) => {
      const button = document.createElement('span')
      button.setAttribute('data-cta', '')
      button.style.cssText = `${BUTTON_STYLE}cursor:default;user-select:none;`
      button.textContent = (node.attrs.label as string) || 'Button'
      return { dom: button }
    }
  },

  addCommands() {
    return {
      setCtaButton:
        (attrs: CtaButtonAttrs) =>
          ({ commands }) =>
            commands.insertContent({ type: this.name, attrs })
    }
  }
})
