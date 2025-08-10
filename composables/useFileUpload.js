/**
 * File Upload Composable
 * Handles file uploads with loading states and validation
 */

export const useFileUpload = () => {
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  const uploadError = ref(null);

  const { uploadEssayFile, uploadHeadshotFile } = useRylsApi();

  /**
   * Validate file before upload
   * @param {File} file
   * @param {Object} options
   * @returns {boolean}
   */
  const validateFile = (file, options = {}) => {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = [],
    } = options;

    // Check file size
    if (file.size > maxSize) {
      uploadError.value = `File terlalu besar. Maksimal ${Math.round(maxSize / (1024 * 1024))}MB`;
      return false;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      uploadError.value = `Tipe file tidak didukung. Gunakan: ${allowedTypes.join(', ')}`;
      return false;
    }

    uploadError.value = null;
    return true;
  };

  /**
   * Upload essay file (PDF only)
   * @param {File} file
   * @returns {Promise<string|null>} fileId or null if failed
   */
  const uploadEssay = async (file) => {
    if (
      !validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['application/pdf'],
      })
    ) {
      return null;
    }

    isUploading.value = true;
    uploadProgress.value = 0;

    try {
      // Simulate progress (since $fetch doesn't provide real progress)
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10;
        }
      }, 200);

      const response = await uploadEssayFile(file);

      clearInterval(progressInterval);
      uploadProgress.value = 100;

      console.log('Upload response:', response);

      if (response.success) {
        return response.data?.id;
      } else {
        uploadError.value = response.message || 'Upload gagal';
        return null;
      }
    } catch (error) {
      uploadError.value = error.data?.message || 'Upload gagal';
      return null;
    } finally {
      isUploading.value = false;
      setTimeout(() => {
        uploadProgress.value = 0;
      }, 1000);
    }
  };

  /**
   * Upload headshot file (Image only)
   * @param {File} file
   * @returns {Promise<string|null>} fileId or null if failed
   */
  const uploadHeadshot = async (file) => {
    if (
      !validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      })
    ) {
      return null;
    }

    isUploading.value = true;
    uploadProgress.value = 0;

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10;
        }
      }, 200);

      const response = await uploadHeadshotFile(file);

      clearInterval(progressInterval);
      uploadProgress.value = 100;

      if (response.success) {
        return response.data?.id;
      } else {
        uploadError.value = response.message || 'Upload gagal';
        return null;
      }
    } catch (error) {
      uploadError.value = error.data?.message || 'Upload gagal';
      return null;
    } finally {
      isUploading.value = false;
      setTimeout(() => {
        uploadProgress.value = 0;
      }, 1000);
    }
  };

  /**
   * Reset upload state
   */
  const resetUploadState = () => {
    isUploading.value = false;
    uploadProgress.value = 0;
    uploadError.value = null;
  };

  return {
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    uploadError: readonly(uploadError),
    uploadEssay,
    uploadHeadshot,
    resetUploadState,
  };
};
