/**
 * File Upload Composable
 * Handles file uploads with loading states, progress, and validation.
 */

interface FileUploadData {
  id?: string
  fileUrl?: string
}

export const useRylsFileUpload = () => {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref<string | null>(null)

  const { uploadEssayFile, uploadHeadshotFile, uploadPaymentProofFile } = useRylsSubmission()

  const validateFile = (file: File, options: { maxSize?: number; allowedTypes?: string[] } = {}): boolean => {
    const { maxSize = 10 * 1024 * 1024, allowedTypes = [] } = options

    if (file.size > maxSize) {
      uploadError.value = `File too large. Maximum ${Math.round(maxSize / (1024 * 1024))}MB`
      return false
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      uploadError.value = `Unsupported file type. Use: ${allowedTypes.join(', ')}`
      return false
    }

    uploadError.value = null
    return true
  }

  const simulateProgress = () => {
    return setInterval(() => {
      if (uploadProgress.value < 90) {
        uploadProgress.value += 10
      }
    }, 200)
  }

  const uploadEssay = async (file: File): Promise<string | null> => {
    if (!validateFile(file, { maxSize: 10 * 1024 * 1024, allowedTypes: ['application/pdf'] })) {
      return null
    }

    isUploading.value = true
    uploadProgress.value = 0

    try {
      const progressInterval = simulateProgress()
      const response = await uploadEssayFile(file)
      clearInterval(progressInterval)
      uploadProgress.value = 100

      if (response.success) {
        return response.data?.id || null
      }
      else {
        uploadError.value = response.message || 'Upload failed'
        return null
      }
    }
    catch (error: unknown) {
      uploadError.value = getApiErrorMessage(error, 'Upload failed')
      return null
    }
    finally {
      isUploading.value = false
      setTimeout(() => { uploadProgress.value = 0 }, 1000)
    }
  }

  const uploadHeadshot = async (file: File): Promise<string | null> => {
    if (!validateFile(file, { maxSize: 10 * 1024 * 1024, allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'] })) {
      return null
    }

    isUploading.value = true
    uploadProgress.value = 0

    try {
      const progressInterval = simulateProgress()
      const response = await uploadHeadshotFile(file)
      clearInterval(progressInterval)
      uploadProgress.value = 100

      if (response.success) {
        return response.data?.id || null
      }
      else {
        uploadError.value = response.message || 'Upload failed'
        return null
      }
    }
    catch (error: unknown) {
      uploadError.value = getApiErrorMessage(error, 'Upload failed')
      return null
    }
    finally {
      isUploading.value = false
      setTimeout(() => { uploadProgress.value = 0 }, 1000)
    }
  }

  const uploadPaymentProof = async (file: File): Promise<FileUploadData | null> => {
    if (!validateFile(file, {
      maxSize: 10 * 1024 * 1024,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    })) {
      return null
    }

    isUploading.value = true
    uploadError.value = null
    uploadProgress.value = 10

    try {
      const progressInterval = simulateProgress()
      const response = await uploadPaymentProofFile(file)
      clearInterval(progressInterval)
      uploadProgress.value = 100

      if (response.success) {
        return response.data || null
      }
      else {
        uploadError.value = response.message || 'Payment proof upload failed'
        return null
      }
    }
    catch (error: unknown) {
      uploadError.value = getApiErrorMessage(error, 'Payment proof upload failed')
      return null
    }
    finally {
      isUploading.value = false
      setTimeout(() => { uploadProgress.value = 0 }, 1000)
    }
  }

  const resetUploadState = () => {
    isUploading.value = false
    uploadProgress.value = 0
    uploadError.value = null
  }

  return {
    isUploading,
    uploadProgress,
    uploadError,
    uploadEssay,
    uploadHeadshot,
    uploadPaymentProof,
    resetUploadState,
  }
}
