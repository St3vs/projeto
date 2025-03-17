/* controllers/fornecedoresController.js
const Fornecedor = require('../models/fornecedores');

exports.criarFichaFornecedor = async (req, res) => {
   try {
      const { username, email, contacto, nif } = req.body;

      // Verifica se o fornecedor já tem ficha
      const fornecedorExists = await Fornecedor.findOne({ email });
      if (fornecedorExists) {
         return res.status(400).json({ error: 'Um fornecedor com esse mail já se encontra registado!' });
      }

      // Criar novo fornecedor
      const fornecedor = new Fornecedor({ username, email, contacto, nif });
      await fornecedor.save();

      res.status(201).json({ message: 'Ficha criada com sucesso!' });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ficha de fornecedor' });
   }
};

exports.getFornecedores = async (req, res) => {
   try {
      const fornecedores = await Fornecedor.find();
      res.status(200).json(fornecedores);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de fornecedores' });
   }
};

exports.eliminarFornecedores = async (req, res) => {
   try {
      const { ids } = req.body;

      // Verifica se IDs foram fornecidos
      if (!ids || ids.length === 0) {
         return res.status(400).json({ error: "Nenhum fornecedor selecionado para exclusão" });
      }

      // Elimina o/os fornecedores selecionado/os na base de dados
      await Fornecedor.deleteMany({ _id: { $in: ids } });

      res.status(200).json({ message: "Fornecedor/es eliminado/os com sucesso!" });
   } catch (error) {
      res.status(500).json({ error: "Erro ao eliminar fornecedores" });
   }
};
*/

const Fornecedor = require('../models/Fornecedores');

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
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
         return res.status(400).json({ error: "Nenhum fornecedor selecionado para exclusão" });
      }

      await Fornecedor.destroy({ where: { id: ids } });

      res.status(200).json({ message: "Fornecedores eliminados com sucesso!" });
   } catch (error) {
      res.status(500).json({ error: "Erro ao eliminar fornecedores" });
   }
};
