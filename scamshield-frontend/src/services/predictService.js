import { apiClient } from './apiClient'

// POST /predict/text — body: { text: string, input_type?: string }
export async function predictText(text, inputType = 'text') {
  const { data } = await apiClient.post('/predict/text', { text, input_type: inputType })
  return data
}

// POST /predict/pdf — multipart form, field name "file"
export async function predictPdf(file, onUploadProgress) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post('/predict/pdf', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onUploadProgress && evt.total) {
        onUploadProgress(Math.round((evt.loaded / evt.total) * 100))
      }
    },
  })
  return data
}

// POST /predict/image — multipart form, field name "file"
export async function predictImage(file, onUploadProgress) {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.post('/predict/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (evt) => {
      if (onUploadProgress && evt.total) {
        onUploadProgress(Math.round((evt.loaded / evt.total) * 100))
      }
    },
  })
  return data
}
