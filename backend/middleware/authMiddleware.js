const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
   const authHeader = req.headers['authorization']; // 'authorization' é o padrão

   if (!authHeader) {
      return res.status(401).json({ error: 'Acesso negado! Token não fornecido.' });
   }

   // Extrai o token do formato "Bearer <token>"
   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

   try {
      // Usar mesma chave que no login (recomendo variável de ambiente)
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      req.user = verified; // id do usuário no payload

      next();
   } catch (error) {
      return res.status(401).json({ error: 'Token inválido!' });
   }
};
