// generateJWTSecret.js
const crypto = require('crypto');
const fs = require('fs');
const dotenv = require('dotenv');

// Gera uma chave aleatória de 128 bits (16 bytes)
const secretKey = crypto.randomBytes(16).toString('hex');

// Salva a chave gerada no arquivo .env
dotenv.config();
const envContent = `JWT_SECRET=${secretKey}\n${fs.readFileSync('.env', 'utf8')}`;
fs.writeFileSync('.env', envContent);
