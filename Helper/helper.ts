import crypto from 'crypto';


export default function generateSecureToken(value : string) {
    const secret = 'test_key';
    const hash = crypto.createHmac('sha256', secret)
        .update(value)
        .digest('hex');
    console.log(hash);
    return hash;
}

export function generateSixDigitServer() {
  // Generates a random integer between 100000 and 999999
  return Math.floor(100000 + Math.random() * 900000).toString();
}