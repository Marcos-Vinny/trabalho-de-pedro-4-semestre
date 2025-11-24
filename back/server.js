const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb+srv://unex:unex123@cluster0.aqcrw7v.mongodb.net/financas?retryWrites=true&w=majority")
  .then(() => console.log("Conectado ao MongoDB"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// MODEL CERTINHO
const Transacao = mongoose.model(
  "Transacao",
  new mongoose.Schema({
    descricao: String,
    valor: Number,
    tipo: String,
    data: { type: Date, default: Date.now }
  })
);

app.use(cors());
app.use(express.json());

app.get("/transacoes", async (req, res) => {
  const lista = await Transacao.find();
  res.json(lista);
});

app.post("/transacoes", async (req, res) => {
  const { descricao, valor, tipo } = req.body;

  if (!descricao || !valor || !tipo) {
    return res.status(400).json({ erro: "Preencha: descricao, valor e tipo." });
  }

  const nova = await Transacao.create({
    descricao,
    valor: Number(valor),
    tipo
  });

  res.status(201).json(nova);
});

app.get("/saldo", async (req, res) => {
  const transacoes = await Transacao.find();

  const entradas = transacoes
    .filter(t => t.tipo === "entrada")
    .reduce((s, t) => s + t.valor, 0);

  const saidas = transacoes
    .filter(t => t.tipo === "saida")
    .reduce((s, t) => s + t.valor, 0);

  res.json({
    entradas,
    saidas,
    saldo: entradas - saidas
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("API rodando na porta " + port));


app.delete("/transacoes", async (req, res) => {
  try {
    await Transacao.deleteMany();  
    res.json({ mensagem: "Todas as transações foram deletadas!" });
  } catch (err) {
    res.status(500).json({ erro: "Erro ao deletar transações" });
  }
});
