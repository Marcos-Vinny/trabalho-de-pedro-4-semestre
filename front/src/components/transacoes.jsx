import { useState, useEffect } from 'react'
import { api } from '../api'

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState([])
  const [saldo, setSaldo] = useState({ entradas: 0, saidas: 0, saldo: 0 })

  // Carregar as transações quando abrir a página
  const carregarTransacoes = async () => {
    try {
      const response = await api.get('/transacoes')
      const data = response.data
      setTransacoes(data)

      const entradas = data.filter(t => t.tipo === 'entrada').reduce((s, t) => s + t.valor, 0)
      const saidas = data.filter(t => t.tipo === 'saida').reduce((s, t) => s + t.valor, 0)

      setSaldo({
        entradas,
        saidas,
        saldo: entradas - saidas
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    carregarTransacoes()
  }, [])

  // 🔴 DELETAR TUDO
  const deletarTudo = async () => {
    if (!window.confirm("Tem certeza que quer deletar TODAS as transações?")) return

    try {
      await api.delete('/transacoes')
      setTransacoes([])
      setSaldo({ entradas: 0, saidas: 0, saldo: 0 })
      alert('Todas as transações foram deletadas!')
    } catch (err) {
      console.error(err)
      alert("Erro ao deletar")
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Transações</h1>

      {/* CARD DO SALDO */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        border: '2px solid #000', 
        borderRadius: '10px',
        background: '#f1f1f1'
      }}>
        <p><strong>Entradas:</strong> R$ {saldo.entradas}</p>
        <p><strong>Saídas:</strong> R$ {saldo.saidas}</p>
        <p><strong>💰 Saldo final:</strong> <b>R$ {saldo.saldo}</b></p>
      </div>

      {/* BOTÃO DE DELETAR */}
      <button 
        onClick={deletarTudo}
        style={{
          background: '#d9534f',
          color: '#fff',
          padding: '10px 15px',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🧹 Deletar Todas as Transações
      </button>

      {/* LISTAGEM */}
      {transacoes.length === 0 && <p>Nenhuma transação encontrada.</p>}

      <div style={{ display: 'grid', gap: '10px' }}>
        {transacoes.map((t) => (
          <div 
            key={t._id}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              borderRadius: '8px',
              background: t.tipo === 'entrada' ? '#e6ffe6' : '#ffe6e6',
            }}
          >
            <p><strong>Descrição:</strong> {t.descricao}</p>
            <p><strong>Tipo:</strong> {t.tipo}</p>
            <p><strong>Valor:</strong> R$ {t.valor}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
