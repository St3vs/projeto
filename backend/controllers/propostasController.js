/* controllers/clientesController.js
const Proposta = require('../models/propostas');

exports.inserirNovaProposta = async (req, res) => {
    try {
        const { cliente, contacto, assunto, descricao, data, valor, estado } = req.body;

        // Criar nova proposta
        const proposta = new Proposta({ cliente, contacto, assunto, descricao, data, valor, estado });
        await proposta.save();

        res.status(201).json({ message: 'Proposta inserida com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao inserir nova proposta' });
    }
};

exports.getPropostas = async (req, res) => {
    try {
        const propostas = await Proposta.find();
        res.status(200).json(propostas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao obter lista de propostas' });
    }
};

exports.eliminarPropostas = async (req, res) => {
    try {
        const { ids } = req.body;

        // Verifica se IDs foram fornecidos
        if (!ids || ids.length === 0) {
            return res.status(400).json({ error: "Nenhuma proposta selecionada para exclusão" });
        }

        await Proposta.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: "Propostas eliminadas com sucesso!" });
    } catch (error) {
        res.status(500).json({ error: "Erro ao eliminar propostas" });
    }
};
*/

const Proposta = require('../models/propostas');

exports.inserirNovaProposta = async (req, res) => {
   try {
      const { cliente, contacto, assunto, descricao, data, valor, estado } = req.body;

      const proposta = await Proposta.create({ cliente, contacto, assunto, descricao, data, valor, estado });

      res.status(201).json({ message: 'Proposta inserida com sucesso!', proposta });
   } catch (error) {
      res.status(500).json({ error: 'Erro ao inserir nova proposta' });
   }
};

exports.getPropostas = async (req, res) => {
   try {
      const propostas = await Proposta.findAll();
      res.status(200).json(propostas);
   } catch (error) {
      res.status(500).json({ error: 'Erro ao obter lista de propostas' });
   }
};

exports.eliminarPropostas = async (req, res) => {
   try {
      const { ids } = req.body;

      if (!ids || ids.length === 0) {
         return res.status(400).json({ error: "Nenhuma proposta selecionada para eliminar" });
      }

      await Proposta.destroy({ where: { id: ids } });

      res.status(200).json({ message: "Propostas eliminadas com sucesso!" });
   } catch (error) {
      res.status(500).json({ error: "Erro ao eliminar propostas" });
   }
};
