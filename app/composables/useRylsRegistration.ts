type ScholarshipType = 'FULLY_FUNDED' | 'SELF_FUNDED' | ''
type YesNoEmpty = 'YES' | 'NO' | ''
type PaymentType = 'PAYPAL' | 'MIDTRANS' | null
type PaymentStatus = 'PENDING' | 'EXPIRED' | 'PAID' | 'FAILED' | null

interface Step1Data {
  fullName: string
  email: string
  residence: string
  nationality: string
  secondNationality: string
  whatsapp: string
  institution: string
  dateOfBirth: string
  gender: string
  discoverSource: string
  discoverOtherText: string
  scholarshipType: ScholarshipType
}

interface PaymentData {
  id: string | null
  type: PaymentType
  status: PaymentStatus
  paymentProof: File | null
  midtransData: Record<string, unknown> | null
}

const defaultStep1 = (): Step1Data => ({
  fullName: '',
  email: '',
  residence: '',
  nationality: '',
  secondNationality: '',
  whatsapp: '',
  institution: '',
  dateOfBirth: '',
  gender: '',
  discoverSource: '',
  discoverOtherText: '',
  scholarshipType: '',
})

const defaultPayment = (): PaymentData => ({
  id: null,
  type: null,
  status: 'PENDING',
  paymentProof: null,
  midtransData: null,
})

export const useRylsRegistration = createSharedComposable(() => {
  const step1 = useState<Step1Data>('ryls:step1', defaultStep1)
  const essayTopic = useState<string>('ryls:essayTopic', () => '')
  const essayFile = useState<string | null>('ryls:essayFile', () => null)
  const essayDescription = useState<string>('ryls:essayDescription', () => '')
  const passportNumber = useState<string>('ryls:passportNumber', () => '')
  const needVisa = useState<YesNoEmpty>('ryls:needVisa', () => '')
  const headshotFile = useState<File | string | null>('ryls:headshotFile', () => null)
  const readPolicies = useState<YesNoEmpty>('ryls:readPolicies', () => '')
  const payment = useState<PaymentData>('ryls:payment', defaultPayment)

  // Getters
  const getAllRegistrationData = computed(() => ({
    step1: step1.value,
    essayTopic: essayTopic.value,
    essayFile: essayFile.value,
    essayDescription: essayDescription.value,
    passportNumber: passportNumber.value,
    needVisa: needVisa.value,
    headshotFile: headshotFile.value,
    readPolicies: readPolicies.value,
    payment: payment.value,
  }))

  const getStep1Data = computed(() => ({ ...step1.value }))

  const getStep2Data = computed(() => ({
    essayTopic: essayTopic.value,
    essayFile: essayFile.value,
    essayDescription: essayDescription.value,
    passportNumber: passportNumber.value,
    needVisa: needVisa.value,
    headshotFile: headshotFile.value,
    readPolicies: readPolicies.value,
  }))

  const getPaymentData = computed(() => ({ payment: payment.value }))

  // Actions
  const setStep1 = (payload: Partial<Step1Data>) => {
    step1.value = { ...step1.value, ...payload }
  }

  const setFullyFundedData = (payload: { essayTopic: string; essayFile: string; essayDescription: string }) => {
    essayTopic.value = payload.essayTopic
    essayFile.value = payload.essayFile
    essayDescription.value = payload.essayDescription
  }

  const setSelfFundedData = (payload: {
    passportNumber: string
    needVisa: YesNoEmpty
    headshotFile: File | string
    readPolicies: YesNoEmpty
  }) => {
    passportNumber.value = payload.passportNumber
    needVisa.value = payload.needVisa
    headshotFile.value = payload.headshotFile
    readPolicies.value = payload.readPolicies
  }

  const setPaymentStatus = (status: PaymentStatus) => {
    payment.value = { ...payment.value, status }
  }

  const setPaymentType = (type: PaymentType) => {
    payment.value = { ...payment.value, type }
  }

  const setPaymentProof = (file: File) => {
    payment.value = { ...payment.value, paymentProof: file }
  }

  const setPaymentId = (id: string) => {
    payment.value = { ...payment.value, id }
  }

  const setMidtransData = (data: Record<string, unknown>) => {
    payment.value = { ...payment.value, midtransData: data }
  }

  const resetPayment = () => {
    payment.value = { id: null, type: null, status: null, paymentProof: null, midtransData: null }
  }

  const resetAll = () => {
    step1.value = defaultStep1()
    essayTopic.value = ''
    essayFile.value = null
    essayDescription.value = ''
    passportNumber.value = ''
    needVisa.value = ''
    headshotFile.value = null
    readPolicies.value = ''
    // preserve payment.id — matches original store behaviour
    payment.value = { ...payment.value, status: null, type: null, paymentProof: null, midtransData: null }
  }

  return reactive({
    // State
    step1,
    essayTopic,
    essayFile,
    essayDescription,
    passportNumber,
    needVisa,
    headshotFile,
    readPolicies,
    payment,
    // Getters
    getAllRegistrationData,
    getStep1Data,
    getStep2Data,
    getPaymentData,
    // Actions
    setStep1,
    setFullyFundedData,
    setSelfFundedData,
    setPaymentStatus,
    setPaymentType,
    setPaymentProof,
    setPaymentId,
    setMidtransData,
    resetPayment,
    resetAll,
  })
})
