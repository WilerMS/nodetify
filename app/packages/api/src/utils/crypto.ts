import crypto from 'crypto'

const algorithm = 'aes-256-ctr'

export type EncryptedText = `${string}:${string}`

export const encrypt = (secretKey: string, text: string): EncryptedText => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

export const decrypt = (secretKey: string, text: EncryptedText) => {
  const [iv, content] = text.split(':')
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(iv, 'hex'))
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, 'hex')), decipher.final()])

  return decrypted.toString()
}
