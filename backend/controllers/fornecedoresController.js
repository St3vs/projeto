const { Sequelize } = require('sequelize');
const sequelize = require('../config/config');
const Fornecedor = require('../models/fornecedores');

exports.criarFichaFornecedor = async (req, res) => {
   try {
      const { username, email, contacto, nif } = req.body;

      const fornecedorExists = await Fornecedor.findOne({ where: { email } });
      if (fornecedorExists) {
         return res.status(400).json({ error: 'Um fornecedor com esse email já existe!' });
      }

      const fornecedor = await Fornecedor.create({ username, email, contacto, nif });

      res.status(201).json({ message: 'Ficha criada com sucesso!', fornecedor });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ficha de fornecedor' });
   }
};

exports.getFornecedores = async (req, res) => {
   try {
      const fornecedores = await Fornecedor.findAll();
      res.status(200).json(fornecedores);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de fornecedores' });
   }
};

exports.eliminarFornecedores = async (req, res) => {
   try {
      let { ids, id } = req.body;

      if (!ids && id) {
         ids = [id];
      }

      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhum fornecedor selecionado para eliminar" });
      }

      await Fornecedor.destroy({
         where: {
            id: ids
         }
      });

      res.status(200).json({ message: "Fornecedores eliminados com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar fornecedores:", error);
      res.status(500).json({ error: "Erro ao eliminar fornecedores" });
   }
};


