const sequelize = require('../config/config');
const { Encomendas, Obras, Fornecedores, Projeto } = require('../models');


// GET: Todas as encomendas com associação
exports.getEncomendas = async (req, res) => {
   try {
      const encomendas = await Encomendas.findAll({
         include: [
            { model: Obras, as: 'obra',
               attributes: ['id', 'projetoId', 'descricao', 'data', 'valorProposta', 'valorFaturado', 'dataUltimaFatura']
            },
            { model: Fornecedores, as: 'fornecedor',
               attributes: ['id', 'username', 'contacto']
            }
         ]
      });
      res.status(200).json(encomendas);
   } catch (error) {
      console.error("Erro ao obter encomendas:", error);
      res.status(500).json({ error: 'Erro ao obter lista de encomendas' });
   }
};

// GET: Encomenda por ID
exports.getEncomendaId = async (req, res) => {
   try {
      const { id } = req.params;
      const encomenda = await Encomendas.findByPk(id, {
         include: [
            {
               model: Obras,
               as: 'obra',
               attributes: ['id', 'descricao'],
               include: [
                  {
                  model: Projeto,
                  as: 'projeto',
                  attributes: ['id', 'clienteId']
                  }
               ]
            },
            {
               model: Fornecedores,
               as: 'fornecedor',
               attributes: ['username', 'contacto']
            }
         ]
      });

      if (!encomenda) {
         return res.status(404).json({ error: "Encomenda não encontrada" });
      }

      res.status(200).json(encomenda);
   } catch (error) {
      console.error("Erro ao obter encomenda por ID:", error);
      res.status(500).json({ error: "Erro ao pesquisar encomenda" });
   }
};

// POST: Inserir nova encomenda
exports.inserirNovaEncomenda = async (req, res) => {
   const { fornecedorId, obraId, descricaoMaterial, data, previsaoEntrega, valor, observacoes } = req.body;

   try {
      await sequelize.transaction(async (t) => {
         const encomenda = await Encomendas.create(
            {
               fornecedorId,
               obraId,
               descricaoMaterial,
               data,
               previsaoEntrega,
               valor,
               observacoes
            },
            { transaction: t }
         );

         res.status(201).json({ message: "Encomenda inserida com sucesso!", encomenda });
      });
   } catch (error) {
      console.error("Erro ao inserir nova encomenda:", error);
      res.status(500).json({ error: "Erro ao inserir nova encomenda" });
   }
};

// PUT: Atualizar encomenda existente
exports.atualizarEncomenda = async (req, res) => {
   const { id } = req.params;
   const { fornecedorId, obraId, descricaoMaterial, data, previsaoEntrega, valor, observacoes } = req.body;

   try {
      const encomenda = await Encomendas.findByPk(id);

      if (!encomenda) {
         return res.status(404).json({ error: "Encomenda não encontrada" });
      }

      await encomenda.update({
         descricaoMaterial,
         data,
         previsaoEntrega,
         valor,
         observacoes,
      });

      res.status(200).json({ message: "Encomenda atualizada com sucesso!", encomenda });
   } catch (error) {
      console.error("Erro ao atualizar encomenda:", error);
      res.status(500).json({ error: "Erro ao atualizar encomenda" });
   }
};

exports.eliminarEncomendas = async (req, res) => {
   try {
      let { ids, id } = req.body;

      if (!ids && id) ids = [id];
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma encomenda selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Criação da tabela de histórico se não existir
         await sequelize.query(`
            CREATE TABLE IF NOT EXISTS EncomendasEliminadas (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               fornecedorId INTEGER NOT NULL,
               obraId INTEGER NOT NULL,
               descricaoMaterial TEXT NOT NULL,
               data DATE NOT NULL,
               previsaoEntrega DATE NOT NULL,
               valor TEXT NOT NULL,
               observacoes TEXT,
               dataExclusao DATETIME DEFAULT CURRENT_TIMESTAMP
            );
         `, { transaction: t });

         // Copiar os dados eliminados para o histórico
         await sequelize.query(`
            INSERT INTO EncomendasEliminadas (fornecedorId, obraId, descricaoMaterial, data, previsaoEntrega, valor, observacoes)
            SELECT fornecedorId, obraId, descricaoMaterial, data, previsaoEntrega, valor, observacoes
            FROM Encomendas
            WHERE id IN (${ids.join(',')});
         `, { transaction: t });

         // Eliminar as encomendas originais
         await sequelize.query(`
            DELETE FROM Encomendas WHERE id IN (${ids.join(',')});
         `, { transaction: t });

         // Criar tabela temporária com a mesma estrutura
         await sequelize.query(`
            CREATE TABLE Encomendas_temp (
               id INTEGER PRIMARY KEY,
               fornecedorId INTEGER NOT NULL,
               obraId INTEGER NOT NULL,
               descricaoMaterial TEXT NOT NULL,
               data DATE NOT NULL,
               previsaoEntrega DATE NOT NULL,
               valor TEXT NOT NULL,
               observacoes TEXT
            );
         `, { transaction: t });

         // Reordenar os dados com novos IDs sequenciais
         await sequelize.query(`
            INSERT INTO Encomendas_temp (id, fornecedorId, obraId, descricaoMaterial, data, previsaoEntrega, valor, observacoes)
            SELECT ROW_NUMBER() OVER () AS id, fornecedorId, obraId, descricaoMaterial, data, previsaoEntrega, valor, observacoes
            FROM Encomendas;
         `, { transaction: t });

         // Substituir a tabela antiga pela nova
         await sequelize.query(`DROP TABLE Encomendas;`, { transaction: t });
         await sequelize.query(`ALTER TABLE Encomendas_temp RENAME TO Encomendas;`, { transaction: t });

         // Resetar o AUTOINCREMENT
         await sequelize.query(`DELETE FROM sqlite_sequence WHERE name='Encomendas';`, { transaction: t });
      });

      res.status(200).json({ message: "Encomendas eliminadas com sucesso! IDs resetados." });

   } catch (error) {
      console.error("Erro ao eliminar encomendas:", error);
      res.status(500).json({ error: "Erro ao eliminar encomendas" });
   }
};

