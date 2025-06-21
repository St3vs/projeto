const sequelize = require("../config/config");
const Cliente = require('../models/clientes');

exports.getClienteById = async (req, res) => {
   try {
      const { id } = req.params;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
         return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      res.status(200).json(cliente);
   } catch (error) {
      console.error('Erro ao buscar cliente por ID:', error);
      res.status(500).json({ error: 'Erro ao buscar cliente por ID' });
   }
};

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

exports.atualizarCliente = async (req, res) => {
   try {
      const { id } = req.params;
      const { username, email, contacto, nif, morada, cp, localidade } = req.body;

      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
         return res.status(404).json({ error: 'Cliente não encontrado' });
      }

      await cliente.update({ username, email, contacto, nif, morada, cp, localidade });

      res.status(200).json({ message: 'Ficha atualizada com sucesso!', cliente });
   } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({ error: 'Erro ao atualizar cliente' });
   }
};

exports.eliminarClientes = async (req, res) => {
   try {
      let { ids, id } = req.body;

      // Se apenas um ID for enviado, transformá-lo em array
      if (!ids && id) {
         ids = [id];
      }

      // Converter `ids` para um array de números válidos
      ids = Array.isArray(ids) ? ids.map(Number).filter(Boolean) : [];

      if (ids.length === 0) {
         return res.status(400).json({ error: "Nenhum cliente selecionado para eliminar" });
      }

      await sequelize.transaction(async (t) => {
         // Deletar os clientes com os IDs fornecidos
         await sequelize.query(`DELETE FROM Clientes WHERE id IN (${ids.join(",")});`, { transaction: t });

         // Criar uma nova tabela temporária sem AUTOINCREMENT
         await sequelize.query(`
            CREATE TABLE Clientes_temp (
               id INTEGER PRIMARY KEY, 
               username VARCHAR(255) NOT NULL UNIQUE,
               email VARCHAR(255) NOT NULL UNIQUE,
               contacto VARCHAR(255) NOT NULL UNIQUE,
               nif VARCHAR(255) NOT NULL UNIQUE,
               morada VARCHAR(255) NOT NULL,
               cp VARCHAR(255) NOT NULL,
               localidade VARCHAR(255) NOT NULL
            );
         `, { transaction: t });

         // Copiar os dados para a nova tabela e reordenar os IDs
         await sequelize.query(`
            INSERT INTO Clientes_temp (id, username, email, contacto, nif, morada, cp, localidade)
            SELECT ROW_NUMBER() OVER (ORDER BY id) AS id, username, email, contacto, nif, morada, cp, localidade FROM Clientes;
         `, { transaction: t });

         // Excluir a tabela original
         await sequelize.query("DROP TABLE Clientes;", { transaction: t });

         // Renomear a tabela temporária para Cliente
         await sequelize.query("ALTER TABLE Clientes_temp RENAME TO Clientes;", { transaction: t });

         // Resetar o AUTOINCREMENT
         await sequelize.query("DELETE FROM sqlite_sequence WHERE name='Clientes';", { transaction: t });
      });

      res.status(200).json({ message: "Clientes eliminados e IDs resetados com sucesso!" });
   } catch (error) {
      console.error("Erro ao eliminar clientes:", error);
      res.status(500).json({ error: "Erro ao eliminar clientes" });
   }
};