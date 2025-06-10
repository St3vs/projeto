const sequelize = require('../config/config');
const { Encomendas, Obras, Fornecedores, Clientes } = require('../models');


// GET: Todas as encomendas com associação
exports.getEncomendas = async (req, res) => {
   try {
      const encomendas = await Encomendas.findAll({
         include: [
            { model: Obras, as: 'obra' },
            { model: Fornecedores, as: 'fornecedor' }
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
               attributes: ['descricao'],
               include: [
                  {
                     model: Clientes,
                     as: 'cliente',
                     attributes: ['username']
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
         fornecedorId,
         obraId,
         descricaoMaterial,
         data,
         previsaoEntrega,
         valor,
         observacoes
      });

      res.status(200).json({ message: "Encomenda atualizada com sucesso!", encomenda });
   } catch (error) {
      console.error("Erro ao atualizar encomenda:", error);
      res.status(500).json({ error: "Erro ao atualizar encomenda" });
   }
};

// DELETE: Eliminar uma ou mais encomendas
exports.eliminarEncomendas = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Normalizar para array
      if (!ids && id) {
         ids = [id];
      }

      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma encomenda selecionada para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         await Encomendas.destroy({
            where: { id: ids },
            transaction: t
         });
      });

      res.status(200).json({ message: "Encomenda(s) eliminada(s) com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar encomendas:", error);
      res.status(500).json({ error: "Erro ao eliminar encomendas" });
   }
};
