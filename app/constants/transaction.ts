export const TRANSACTION_STATUS_ITEMS = [
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Expired', value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
]

export const TRANSACTION_STATUS_LABEL: Record<string, string> = Object.fromEntries(
  TRANSACTION_STATUS_ITEMS.map((i) => [i.value, i.label])
)

export const PRODUCT_TYPE_ITEMS = [
  { label: 'Rise Academy', value: 'academy_enrollment' },
  { label: 'RYLS Registration', value: 'ryls_registration' },
]

export const PRODUCT_TYPE_LABEL: Record<string, string> = {
  ...Object.fromEntries(PRODUCT_TYPE_ITEMS.map((i) => [i.value, i.label])),
  // legacy value from older backend versions
  'Rise Young Leaders Scholarship': 'RYLS Registration',
}

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  bca_va: 'BCA Virtual Account',
  bni_va: 'BNI Virtual Account',
  bri_va: 'BRI Virtual Account',
  permata_va: 'Permata Virtual Account',
  cimb_va: 'CIMB Virtual Account',
  mandiri_bill: 'Mandiri Bill',
  gopay: 'GoPay',
  shopeepay: 'ShopeePay',
  qris: 'QRIS',
  indomaret: 'Indomaret',
  alfamart: 'Alfamart',
  credit_card: 'Credit Card',
  akulaku: 'Akulaku',
  kredivo: 'Kredivo',
  paypal: 'PayPal',
  midtrans: 'Midtrans',
}

export const PROVIDER_LABEL: Record<string, string> = {
  midtrans: 'Midtrans',
  paypal_manual: 'PayPal Manual',
}
