import { defineStore } from 'pinia';

/**
 * @typedef {Object} Step1Data
 * @property {string} fullName
 * @property {string} email
 * @property {string} residence
 * @property {string} nationality
 * @property {string} secondNationality
 * @property {string} whatsapp
 * @property {string} institution
 * @property {string} dateOfBirth
 * @property {string} gender
 * @property {string} discoverSource
 * @property {string} discoverOtherText
 * @property {('fully_funded'|'self_funded'|'') } scholarshipType
 */

export const useRylsRegistrationStore = defineStore('rylsRegistration', {
  state: () => ({
    /** @type {Step1Data} */
    step1: {
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
    },

    // Fully funded branch
    essayTopic: '',
    essayFile: /** @type {string|null} */ (null), // Store file ID instead of File object
    essayDescription: '',

    // Self funded branch
    passportNumber: '',
    needVisa: /** @type {('YES'|'NO'|'')} */ (''),
    headshotFile: /** @type {File|null} */ (null),
    readPolicies: /** @type {('YES'|'NO'|'')} */ (''),

    payment: {
      id: null,
      type: null, // 'PAYPAL' | 'MIDTRANS'
      status: 'PENDING', // 'PENDING' | 'EXPIRED' | 'PAID' | 'FAILED'
      paymentProof: null, // for PayPal
      midtransData: null, // for Midtrans
    },
  }),

  getters: {
    getAllRegistrationData: (state) => ({
      step1: state.step1,
      essayTopic: state.essayTopic,
      essayFile: state.essayFile,
      essayDescription: state.essayDescription,
      passportNumber: state.passportNumber,
      needVisa: state.needVisa,
      headshotFile: state.headshotFile,
      readPolicies: state.readPolicies,
      payment: state.payment,
    }),
    getStep1Data: (state) => ({
      ...state.step1,
    }),
    getStep2Data: (state) => ({
      essayTopic: state.essayTopic,
      essayFile: state.essayFile,
      essayDescription: state.essayDescription,
      passportNumber: state.passportNumber,
      needVisa: state.needVisa,
      headshotFile: state.headshotFile,
      readPolicies: state.readPolicies,
    }),
    getPaymentData: (state) => ({
      payment: state.payment,
    }),
  },

  actions: {
    /**
     * @param {Partial<Step1Data>} payload
     */
    setStep1(payload) {
      this.step1 = { ...this.step1, ...payload };
    },

    /**
     * Set fully funded specific data
     * @param {Object} payload
     * @param {string} payload.essayTopic
     * @param {string} payload.essayFile - File ID from upload
     * @param {string} payload.essayDescription
     */
    setFullyFundedData(payload) {
      this.essayTopic = payload.essayTopic;
      this.essayFile = payload.essayFile;
      this.essayDescription = payload.essayDescription;
    },

    /**
     * Set self funded specific data
     * @param {Object} payload
     * @param {string} payload.passportNumber
     * @param {('yes'|'no')} payload.needVisa
     * @param {File|string} payload.headshotFile
     * @param {('yes'|'no')} payload.readPolicies
     */
    setSelfFundedData(payload) {
      this.passportNumber = payload.passportNumber;
      this.needVisa = payload.needVisa;
      this.headshotFile = payload.headshotFile;
      this.readPolicies = payload.readPolicies;
    },
    setPaymentStatus(status) {
      this.payment.status = status;
    },

    /**
     * Set the payment type
     * @param {'midtrans'|'paypal'} type - The payment type
     */
    setPaymentType(type) {
      this.payment.type = type;
    },

    /**
     * Set the payment proof file (for PayPal)
     * @param {File} file - The payment proof file
     */
    setPaymentProof(file) {
      this.payment.paymentProof = file;
    },

    setPaymentId(id) {
      this.payment.id = id;
    },

    setMidtransData(data) {
      this.payment.midtransData = data;
    },

    resetPayment() {
      this.payment.id = null;
      this.payment.status = null;
      this.payment.type = null;
      this.payment.paymentProof = null;
      this.payment.midtransData = null;
    },

    resetAll() {
      this.step1 = {
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
      };
      this.essayTopic = '';
      this.essayFile = null;
      this.essayDescription = '';
      this.passportNumber = '';
      this.needVisa = '';
      this.headshotFile = null;
      this.readPolicies = '';
      this.payment.status = null;
      this.payment.type = null;
      this.payment.paymentProof = null;
      this.payment.midtransData = null;
    },
  },
});
