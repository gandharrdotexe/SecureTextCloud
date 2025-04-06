/**
 * Crypto service for encrypting and decrypting messages
 * Uses Web Crypto API (SubtleCrypto) for secure encryption
 */

// Convert a string to an ArrayBuffer
const str2ab = (str) => {
    const buf = new Uint8Array(str.length)
    for (let i = 0; i < str.length; i++) {
      buf[i] = str.charCodeAt(i)
    }
    return buf
  }
  
  // Convert an ArrayBuffer to a string
  const ab2str = (buf) => {
    return String.fromCharCode.apply(null, Array.from(new Uint8Array(buf)))
  }
  
  // Convert an ArrayBuffer to a base64 string
  const arrayBufferToBase64 = (buffer) => {
    const bytes = new Uint8Array(buffer)
    let binary = ""
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }
  
  // Convert a base64 string to an ArrayBuffer
  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    return bytes.buffer
  }
  
  // Generate a random salt
  const generateSalt = () => {
    return crypto.getRandomValues(new Uint8Array(16))
  }
  
  // Derive a key from a password using PBKDF2
  const deriveKey = async (password, salt) => {
    // Convert password to key material
    const passwordBuffer = str2ab(password)
    const keyMaterial = await crypto.subtle.importKey("raw", passwordBuffer, { name: "PBKDF2" }, false, [
      "deriveBits",
      "deriveKey",
    ])
  
    // Derive the key using PBKDF2
    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }
  
  // Encrypt a message using AES-GCM
  export const encryptMessage = async (message, password) => {
    // Generate a random salt and IV
    const salt = generateSalt()
    const iv = crypto.getRandomValues(new Uint8Array(12))
  
    // Derive a key from the password
    const key = await deriveKey(password, salt)
  
    // Encrypt the message
    const messageBuffer = str2ab(message)
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      messageBuffer,
    )
  
    // Convert the encrypted data to base64 strings
    return {
      encryptedMessage: arrayBufferToBase64(encryptedBuffer),
      iv: arrayBufferToBase64(iv),
      salt: arrayBufferToBase64(salt),
    }
  }
  
  // Decrypt a message using AES-GCM
  export const decryptMessage = async (encryptedMessage, password, ivBase64, saltBase64) => {
    // Convert base64 strings back to ArrayBuffers
    const encryptedBuffer = base64ToArrayBuffer(encryptedMessage)
    const iv = base64ToArrayBuffer(ivBase64)
    const salt = base64ToArrayBuffer(saltBase64)
  
    // Derive the key from the password
    const key = await deriveKey(password, new Uint8Array(salt))
  
    // Decrypt the message
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: new Uint8Array(iv),
      },
      key,
      encryptedBuffer,
    )
  
    // Convert the decrypted data back to a string
    return ab2str(decryptedBuffer)
  }