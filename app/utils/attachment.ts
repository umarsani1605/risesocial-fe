// Unified attachment style map — used in ModuleItem, TabModules, AdminCohortModuleModal
export const ATTACHMENT_MAP: Record<string, { color: string; icon: string; label: string }> = {
  external_link: {
    label: 'LINK',
    color: 'bg-blue-400',
    icon: 'i-ph-link-bold',
  },
  embed_video: {
    label: 'VIDEO',
    color: 'bg-red-400',
    icon: 'i-ph-video-bold',
  },
  pdf: {
    label: 'PDF',
    color: 'bg-red-400',
    icon: 'i-ph-file-text-bold',
  },
  msword: {
    label: 'DOCX',
    color: 'bg-blue-400',
    icon: 'i-ph-file-text-bold',
  },
  doc: {
    label: 'DOCX',
    color: 'bg-blue-400',
    icon: 'i-ph-file-text-bold',
  },
  docx: {
    label: 'DOCX',
    color: 'bg-blue-400',
    icon: 'i-ph-file-text-bold',
  },
  'vnd.openxmlformats-officedocument.wordprocessingml.document': {
    label: 'DOCX',
    color: 'bg-blue-400',
    icon: 'i-ph-file-text-bold',
  },
  ppt: {
    label: 'PPTX',
    color: 'bg-orange-400',
    icon: 'i-ph-file-bold',
  },
  pptx: {
    label: 'PPTX',
    color: 'bg-orange-400',
    icon: 'i-ph-file-bold',
  },
  'vnd.openxmlformats-officedocument.presentationml.presentation': {
    label: 'PPTX',
    color: 'bg-orange-400',
    icon: 'i-ph-file-bold',
  },
  xls: {
    label: 'XLSX',
    color: 'bg-emerald-400',
    icon: 'i-ph-table-bold',
  },
  xlsx: {
    label: 'XLSX',
    color: 'bg-emerald-400',
    icon: 'i-ph-table-bold',
  },
  'vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
    label: 'XLSX',
    color: 'bg-emerald-400',
    icon: 'i-ph-table-bold',
  },
  jpeg: {
    label: 'JPEG',
    color: 'bg-purple-400',
    icon: 'i-ph-image-bold',
  },
  jpg: {
    label: 'JPEG',
    color: 'bg-purple-400',
    icon: 'i-ph-image-bold',
  },
  png: {
    label: 'PNG',
    color: 'bg-purple-400',
    icon: 'i-ph-image-bold',
  },
  webp: {
    label: 'WEBP',
    color: 'bg-purple-400',
    icon: 'i-ph-image-bold',
  },
}

const DEFAULT_ATTACHMENT_STYLE = {
  label: 'FILE',
  color: 'bg-gray-400',
  icon: 'i-ph-file-bold',
}

function resolveAttachmentKey(att: { file_mime?: string | null; file_path?: string | null }): string {
  return (att.file_mime?.split('/').pop() ?? att.file_path?.split('.').pop() ?? '').toLowerCase()
}

export function getAttachmentStyle(att: {
  type?: string
  file_mime?: string | null
  file_path?: string | null
}): { color: string; icon: string; label: string } {
  if (att.type === 'external_link' || att.type === 'embed_video') {
    return ATTACHMENT_MAP[att.type]!
  }
  return ATTACHMENT_MAP[resolveAttachmentKey(att)] ?? DEFAULT_ATTACHMENT_STYLE
}
