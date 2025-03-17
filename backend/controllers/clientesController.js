/* controllers/clientesController.js
const Cliente = require('../models/clientes');

exports.criarFichaCliente = async (req, res) => {
   try {
      const { username, email, contacto, nif, morada, cp, localidade } = req.body;

      // Verifica se o cliente já tem ficha
      const clienteExists = await Cliente.findOne({ email });
      if (clienteExists) {
         return res.status(400).json({ error: 'Um cliente com esse mail já se encontra registado!' });
      }

      // Criar novo utilizador
      const cliente = new Cliente({ username, email, contacto, nif, morada, cp, localidade });
      await cliente.save();

      res.status(201).json({ message: 'Ficha criada com sucesso!' });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ficha de cliente' });
   }
};

exports.getClientes = async (req, res) => {
   try {
      const clientes = await Cliente.find();
      res.status(200).json(clientes);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de clientes' });
   }
};

exports.eliminarClientes = async (req, res) => {
   try {
      const { ids } = req.body;

      // Verifica se IDs foram fornecidos
      if (!ids || ids.length === 0) {
         return res.status(400).json({ error: "Nenhum cliente selecionado para exclusão" });
      }

      // Elimina o/os clientes selecionado/os na base de dados
      await Cliente.deleteMany({ _id: { $in: ids } });

      res.status(200).json({ message: "Cliente/es eliminado/os com sucesso!" });
   } catch (error) {
      res.status(500).json({ error: "Erro ao eliminar clientes" });
   }
};
*/

const Cliente = require('../models/Clientes');

exports.criarFichaCliente = async (req, res) => {
   try {
      const { username, email, contacto, nif, morada, cp, localidade } = req.body;

      const clienteExists = await Cliente.findOne({ where: { email } });
      if (clienteExists) {
         return res.status(400).json({ error: 'Um cliente com esse email já existe!' });
      }

      const cliente = await Cliente.create({ username, email, contacto, nif, morada, cp, localidade });

      res.status(201).json({ message: 'Ficha criada com sucesso!', cliente });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ficha de cliente' });
   }
};

exports.getClientes = async (req, res) => {
   try {
      const clientes = await Cliente.findAll();
      res.status(200).json(clientes);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de clientes' });
   }
};

exports.eliminarClientes = async (req, res) => {
   try {
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
         return res.status(400).json({ error: "Nenhum cliente selecionado para exclusão" });
      }

      await Cliente.destroy({ where: { id: ids } });

      res.status(200).json({ message: "Clientes eliminados com sucesso!" });
   } catch (error) {
      res.status(500).json({ error: "Erro ao eliminar clientes" });
   }
};
