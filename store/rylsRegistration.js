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
    needVisa: /** @type {('yes'|'no'|'')} */ (''),
    headshotFile: /** @type {File|null} */ (null),
    readPolicies: /** @type {('yes'|'no'|'')} */ (''),
  }),

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
      if (payload.essayTopic !== undefined) this.essayTopic = payload.essayTopic;
      if (payload.essayFile !== undefined) this.essayFile = payload.essayFile;
      if (payload.essayDescription !== undefined) this.essayDescription = payload.essayDescription;
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
      if (payload.passportNumber !== undefined) this.passportNumber = payload.passportNumber;
      if (payload.needVisa !== undefined) this.needVisa = payload.needVisa;
      if (payload.headshotFile !== undefined) this.headshotFile = payload.headshotFile;
      if (payload.readPolicies !== undefined) this.readPolicies = payload.readPolicies;
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
    },
  },
});
