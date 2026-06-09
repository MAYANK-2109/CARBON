#!/usr/bin/env node

/**
 * @script generate-secrets.js
 * @description Generate secure random secrets for production deployment
 * 
 * Usage: node generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n📋 Generating Secure Production Secrets\n');
console.log('Copy these values to your environment variables:\n');

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');
const encryptionKey = crypto.randomBytes(32).toString('hex');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('\n🔐 JWT_SECRET:');
console.log(jwtSecret);

console.log('\n🔐 JWT_REFRESH_SECRET:');
console.log(jwtRefreshSecret);

console.log('\n🔐 ENCRYPTION_KEY:');
console.log(encryptionKey);

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('📝 Next steps:');
console.log('1. Set NODE_ENV=production');
console.log('2. Configure MONGODB_URI (use MongoDB Atlas)');
console.log('3. Set CORS_ORIGIN to your Vercel frontend URL');
console.log('4. Add GEMINI_API_KEY from https://ai.google.dev/');
console.log('5. Deploy!\n');
