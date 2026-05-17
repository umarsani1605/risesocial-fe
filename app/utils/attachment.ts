// Unified attachment style map — used in ModuleItem, TabModules, AdminCohortModuleModal
export interface AttachmentStyle {
  label: string
  icon: string
  background: string
  foreground: string
  border: string
}

export const ATTACHMENT_MAP: Record<string, AttachmentStyle> = {
  external_link: {
    label: 'LINK',
    icon: 'i-ph-link-bold',
    background: 'bg-blue-50',
    foreground: 'text-blue-400',
    border: 'ring-blue-300',
  },
  embed_video: {
    label: 'VIDEO',
    icon: 'i-ph-video-bold',
    background: 'bg-red-50',
    foreground: 'text-red-400',
    border: 'ring-red-300',
  },
  pdf: {
    label: 'PDF',
    icon: 'i-ph-file-text-bold',
    background: 'bg-red-50',
    foreground: 'text-red-400',
    border: 'ring-red-300',
  },
  msword: {
    label: 'DOCX',
    icon: 'i-ph-file-text-bold',
    background: 'bg-blue-50',
    foreground: 'text-blue-400',
    border: 'ring-blue-300',
  },
  doc: {
    label: 'DOCX',
    icon: 'i-ph-file-text-bold',
    background: 'bg-blue-50',
    foreground: 'text-blue-400',
    border: 'ring-blue-300',
  },
  docx: {
    label: 'DOCX',
    icon: 'i-ph-file-text-bold',
    background: 'bg-blue-50',
    foreground: 'text-blue-400',
    border: 'ring-blue-300',
  },
  'vnd.openxmlformats-officedocument.wordprocessingml.document': {
    label: 'DOCX',
    icon: 'i-ph-file-text-bold',
    background: 'bg-blue-50',
    foreground: 'text-blue-400',
    border: 'ring-blue-300',
  },
  ppt: {
    label: 'PPTX',
    icon: 'i-ph-file-bold',
    background: 'bg-orange-50',
    foreground: 'text-orange-400',
    border: 'ring-orange-300',
  },
  pptx: {
    label: 'PPTX',
    icon: 'i-ph-file-bold',
    background: 'bg-orange-50',
    foreground: 'text-orange-400',
    border: 'ring-orange-300',
  },
  'vnd.openxmlformats-officedocument.presentationml.presentation': {
    label: 'PPTX',
    icon: 'i-ph-file-bold',
    background: 'bg-orange-50',
    foreground: 'text-orange-400',
    border: 'ring-orange-300',
  },
  xls: {
    label: 'XLSX',
    icon: 'i-ph-table-bold',
    background: 'bg-emerald-50',
    foreground: 'text-emerald-400',
    border: 'ring-emerald-300',
  },
  xlsx: {
    label: 'XLSX',
    icon: 'i-ph-table-bold',
    background: 'bg-emerald-50',
    foreground: 'text-emerald-400',
    border: 'ring-emerald-300',
  },
  'vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    label: 'XLSX',
    icon: 'i-ph-table-bold',
    background: 'bg-emerald-50',
    foreground: 'text-emerald-400',
    border: 'ring-emerald-300',
  },
  jpeg: {
    label: 'JPEG',
    icon: 'i-ph-image-bold',
    background: 'bg-purple-50',
    foreground: 'text-purple-400',
    border: 'ring-purple-300',
  },
  jpg: {
    label: 'JPEG',
    icon: 'i-ph-image-bold',
    background: 'bg-purple-50',
    foreground: 'text-purple-400',
    border: 'ring-purple-300',
  },
  png: {
    label: 'PNG',
    icon: 'i-ph-image-bold',
    background: 'bg-purple-50',
    foreground: 'text-purple-400',
    border: 'ring-purple-300',
  },
  webp: {
    label: 'WEBP',
    icon: 'i-ph-image-bold',
    background: 'bg-purple-50',
    foreground: 'text-purple-400',
    border: 'ring-purple-300',
  },
}

const DEFAULT_ATTACHMENT_STYLE: AttachmentStyle = {
  label: 'FILE',
  icon: 'i-ph-file-bold',
  background: 'bg-gray-50',
  foreground: 'text-gray-400',
  border: 'ring-gray-300',
}

function resolveAttachmentKey(att: { file_mime?: string | null; file_path?: string | null }): string {
  return (att.file_mime?.split('/').pop() ?? att.file_path?.split('.').pop() ?? '').toLowerCase()
}

export function getAttachmentStyle(att: {
  type?: string
  file_mime?: string | null
  file_path?: string | null
}): AttachmentStyle {
  if (att.type === 'external_link' || att.type === 'embed_video') {
    return ATTACHMENT_MAP[att.type]!
  }
  return ATTACHMENT_MAP[resolveAttachmentKey(att)] ?? DEFAULT_ATTACHMENT_STYLE
}

export function getAttachmentLinkError(url: string): string | null {
  if (!url) return null

  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol) ? null : 'Please enter a valid link'
  } catch {
    return 'Please enter a valid link'
  }
}
