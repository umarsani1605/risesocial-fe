import { Node, mergeAttributes } from '@tiptap/core'
import type { CommandProps, NodeViewRenderer } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import ImageUploadNodeComponent from './EditorImageUploadNode.vue'

/**
 * Transient block node that renders a `UFileUpload` widget in the editor.
 * On successful upload its NodeView replaces it with a real `<img>` (via
 * `setImage`), so this node never persists in the saved HTML.
 */
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    imageUpload: {
      insertImageUpload: () => ReturnType
    }
  }
}

export const ImageUpload = Node.create({
  name: 'imageUpload',
  group: 'block',
  atom: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="image-upload"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'image-upload' })]
  },

  addNodeView(): NodeViewRenderer {
    return VueNodeViewRenderer(ImageUploadNodeComponent)
  },

  addCommands() {
    return {
      insertImageUpload:
        () =>
          ({ commands }: CommandProps) =>
            commands.insertContent({ type: this.name })
    }
  }
})
