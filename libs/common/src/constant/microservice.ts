export const AUTH_SERVICE = 'AUTH'
export const SHOP_SERVICE = 'SHOP'
export const MAIL_SERVICE = 'MAIL'

const authMessagePattern = {
  verifyAccessToken: 'verifyAccessToken',
  generateEmailToken: 'generateEmailToken',
  verifyEmailToken: 'verifyEmailToken',
}
const shopMessagePattern = {
  getUserById: 'getUserById',
  getUserByEmail: 'getUserByEmail',
}
const mailMessagePattern = {
  sendConfirmation: 'sendConfirmation',
}

export const messagePattern = {
  auth: authMessagePattern,
  shop: shopMessagePattern,
  mail: mailMessagePattern,
}
