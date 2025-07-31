import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Générer un token aléatoire sécurisé
export const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Générer un token JWT personnalisé (sans utiliser la librairie jwt)
export const generateCustomToken = (payload, secret, expiresIn = '24h') => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const expTime = now + parseTimeToSeconds(expiresIn);

  const tokenPayload = {
    ...payload,
    iat: now,
    exp: expTime
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

// Encoder en Base64 URL-safe
const base64UrlEncode = (str) => {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

// Parser une durée en secondes
const parseTimeToSeconds = (time) => {
  const units = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
    y: 31536000
  };

  const match = time.match(/^(\d+)([smhdwy]?)$/);
  if (!match) return 3600; // 1 heure par défaut

  const value = parseInt(match[1]);
  const unit = match[2] || 's';
  
  return value * (units[unit] || 1);
};

// Hasher un mot de passe
export const hashPassword = async (password) => {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
};

// Vérifier un mot de passe
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Générer un salt pour le hashing
export const generateSalt = (rounds = 12) => {
  return bcrypt.genSaltSync(rounds);
};

// Chiffrer des données sensibles
export const encryptData = (data, secretKey = null) => {
  const key = secretKey || process.env.ENCRYPTION_KEY || 'mireb-default-encryption-key-32-chars';
  const algorithm = 'aes-256-cbc';
  const iv = crypto.randomBytes(16);
  
  // S'assurer que la clé fait 32 caractères
  const keyHash = crypto.createHash('sha256').update(key).digest();
  
  const cipher = crypto.createCipher(algorithm, keyHash);
  cipher.setAutoPadding(true);
  
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    algorithm
  };
};

// Déchiffrer des données
export const decryptData = (encryptedData, secretKey = null) => {
  try {
    const key = secretKey || process.env.ENCRYPTION_KEY || 'mireb-default-encryption-key-32-chars';
    const { encrypted, iv, algorithm } = encryptedData;
    
    // S'assurer que la clé fait 32 caractères
    const keyHash = crypto.createHash('sha256').update(key).digest();
    
    const decipher = crypto.createDecipher(algorithm, keyHash);
    decipher.setAutoPadding(true);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Erreur déchiffrement:', error);
    return null;
  }
};

// Générer une signature HMAC
export const generateHMAC = (data, secret = null) => {
  const key = secret || process.env.HMAC_SECRET || 'mireb-hmac-secret';
  return crypto
    .createHmac('sha256', key)
    .update(typeof data === 'string' ? data : JSON.stringify(data))
    .digest('hex');
};

// Vérifier une signature HMAC
export const verifyHMAC = (data, signature, secret = null) => {
  const expectedSignature = generateHMAC(data, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
};

// Générer un hash SHA-256
export const generateSHA256 = (data) => {
  return crypto
    .createHash('sha256')
    .update(typeof data === 'string' ? data : JSON.stringify(data))
    .digest('hex');
};

// Générer un UUID v4
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Générer un code OTP à 6 chiffres
export const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[crypto.randomInt(0, digits.length)];
  }
  
  return otp;
};

// Générer un mot de passe aléatoire sécurisé
export const generateSecurePassword = (length = 12) => {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // S'assurer qu'on a au moins un caractère de chaque type
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += symbols[crypto.randomInt(0, symbols.length)];
  
  // Compléter avec des caractères aléatoires
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => crypto.randomInt(0, 2) - 0.5).join('');
};

// Masquer des données sensibles (pour les logs)
export const maskSensitiveData = (data, fieldsToMask = ['password', 'token', 'secret']) => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const masked = { ...data };
  
  for (const field of fieldsToMask) {
    if (masked[field]) {
      const value = masked[field].toString();
      if (value.length <= 4) {
        masked[field] = '*'.repeat(value.length);
      } else {
        masked[field] = value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
      }
    }
  }
  
  return masked;
};

// Validation de la force d'un mot de passe
export const validatePasswordStrength = (password) => {
  const minLength = 8;
  const maxLength = 128;
  
  const checks = {
    length: password.length >= minLength && password.length <= maxLength,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password),
    noSpaces: !/\s/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  let strength = 'weak';
  if (score >= 6) strength = 'strong';
  else if (score >= 4) strength = 'medium';
  
  return {
    score,
    strength,
    checks,
    isValid: score >= 4 // Au moins 4 critères sur 6
  };
};

// Rate limiting avec token bucket
export class TokenBucket {
  constructor(capacity = 10, refillRate = 1, refillPeriod = 1000) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.refillPeriod = refillPeriod;
    this.lastRefill = Date.now();
  }
  
  consume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
  
  refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillPeriod) * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  getAvailableTokens() {
    this.refill();
    return this.tokens;
  }
}

// Générer une clé API
export const generateAPIKey = (prefix = 'mk') => {
  const timestamp = Date.now().toString(36);
  const randomPart = generateSecureToken(16);
  const checksum = generateSHA256(timestamp + randomPart).substring(0, 8);
  
  return `${prefix}_${timestamp}_${randomPart}_${checksum}`;
};

// Valider une clé API
export const validateAPIKey = (apiKey, prefix = 'mk') => {
  try {
    const parts = apiKey.split('_');
    
    if (parts.length !== 4 || parts[0] !== prefix) {
      return false;
    }
    
    const [, timestamp, randomPart, providedChecksum] = parts;
    const expectedChecksum = generateSHA256(timestamp + randomPart).substring(0, 8);
    
    return providedChecksum === expectedChecksum;
  } catch (error) {
    return false;
  }
};

// Chiffrement simple pour les URL (non sécurisé, juste pour l'obfuscation)
export const obfuscateUrl = (data) => {
  const encoded = Buffer.from(JSON.stringify(data)).toString('base64');
  return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

// Déchiffrement des URL obfusquées
export const deobfuscateUrl = (encoded) => {
  try {
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    const padding = 4 - (base64.length % 4);
    const padded = base64 + '='.repeat(padding % 4);
    
    const decoded = Buffer.from(padded, 'base64').toString('utf8');
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Erreur déobfuscation URL:', error);
    return null;
  }
};
