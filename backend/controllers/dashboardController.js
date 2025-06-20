const sequelize = require("../config/config");

exports.getDashboard = async (req, res) => {
   try {
      const [propostas] = await sequelize.query(`
         SELECT estado, COUNT(*) as total FROM Propostas GROUP BY estado
      `);

      const [projetos] = await sequelize.query(`
         SELECT COUNT(*) as quantidade, SUM(valor) as total FROM Projetos
      `);

      const [encomendas] = await sequelize.query(`
         SELECT COUNT(*) as quantidade, SUM(valor) as total FROM Encomendas
      `);

      const [obras] = await sequelize.query(`
         SELECT COUNT(*) as quantidade, SUM(valorFaturado) as total FROM Obras
      `);

      const [obrasPorMes] = await sequelize.query(`
      SELECT 
         strftime('%Y-%m', data) AS mes,
         SUM(valorFaturado) AS total
      FROM Obras
      WHERE data IS NOT NULL
      GROUP BY mes
      ORDER BY mes
      `);

      const [encomendasPorMes] = await sequelize.query(`
      SELECT 
         strftime('%Y-%m', data) AS mes,
         COUNT(*) AS quantidade,
         SUM(valor) AS total
      FROM Encomendas
      WHERE data IS NOT NULL
      GROUP BY mes
      ORDER BY mes
      `);

      const propostaStats = { aceite: 0, pendente: 0, recusada: 0 };

      propostas.forEach(row => {
         const estado = row.estado.toLowerCase();
         if (estado.includes("aceite")) propostaStats.aceite += row.total;
         else if (estado.includes("pendente")) propostaStats.pendente += row.total;
         else if (estado.includes("recusada")) propostaStats.recusada += row.total;
         else console.warn("Estado desconhecido:", row.estado);
      });

      res.json({
         propostas: propostaStats,
         projetos: projetos[0],
         encomendas: encomendas[0],
         obras: obras[0],
         obrasPorMes,
         encomendasPorMes
      });

   } catch (err) {
      console.error("Erro ao buscar dados da dashboard:", err);
      res.status(500).json({ error: "Erro ao buscar dados da dashboard." });
   }
};
