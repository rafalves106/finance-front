import { useState } from "react";

import { API_URL } from "../services/api";

import { formatCurrency } from "../util/formatCurrency";

import {
  Plus,
  Trash2,
  Wallet,
  DollarSign,
  PiggyBank,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBankIcon,
} from "lucide-react";

const DashboardView = ({
  totalIncome,
  totalExpenses,
  investmentAmount,
  investmentGoalPercent,
  setInvestmentGoalPercent,
  finalBalance,
  incomes,
  expenses,
  setIncomes,
  setExpenses,
  fetchData,
  loading,
}) => {
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemValue, setNewItemValue] = useState("");
  const [inputType, setInputType] = useState("Saida");

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemValue) return;

    const newItem = {
      titulo: newItemName,
      descricao: newItemDescription,
      valor: parseFloat(newItemValue),
      tipo: inputType,
      data: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) fetchData();
    } catch (err) {
      alert("Erro ao salvar (API Offline?)", err);
    }

    const localItem = {
      ...newItem,
      id: Date.now(),
      name: newItem.titulo,
      description: newItem.descricao,
      value: newItem.valor,
      date: newItem.data,
      type: newItem.tipo,
    };
    if (inputType === "Entrada") setIncomes([...incomes, localItem]);
    else setExpenses([...expenses, localItem]);

    setNewItemName("");
    setNewItemDescription("");
    setNewItemValue("");
  };

  const handleRemove = async (id, type) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    } catch (err) {
      alert("Erro ao deletar (API Offline?)", err);
    }
    if (type === "Entrada") setIncomes(incomes.filter((i) => i.id !== id));
    else setExpenses(expenses.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-pulse">
        <Wallet className="w-12 h-12 mb-4 opacity-50" />
        <p>Carregando informações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
          <PiggyBankIcon className="text-blue-600" /> Acompanhamento de Finanças
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Tenha uma visão clara de suas finanças e acompanhe seu progresso.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-emerald-600 mb-2 font-medium">
            <ArrowUpCircle size={20} /> Entrada
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-rose-600 mb-2 font-medium">
            <ArrowDownCircle size={20} /> Saídas
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(totalExpenses)}
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100 relative">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-blue-700 font-medium">
              <PiggyBank size={20} /> Meta
            </div>
            <span className="text-xs font-bold text-blue-700 bg-blue-200 px-2 py-0.5 rounded-full">
              {investmentGoalPercent}%
            </span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-3">
            {formatCurrency(investmentAmount)}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={investmentGoalPercent}
            onChange={(e) => setInvestmentGoalPercent(Number(e.target.value))}
            className="w-full h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
          />
        </div>
        <div
          className={`p-4 rounded-xl shadow-sm border ${
            finalBalance >= 0
              ? "bg-emerald-50 border-emerald-100"
              : "bg-red-50 border-red-100"
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-medium">
            <DollarSign size={20} /> Saldo Livre
          </div>
          <div className="text-2xl font-bold">
            {formatCurrency(finalBalance)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-bold text-emerald-700 mb-3">Entradas</h3>
          {incomes.map((i) => (
            <div
              key={i.id}
              className="flex justify-between py-2 border-b last:border-0 border-slate-100"
            >
              <div>
                <span>{i.name}</span>
                <p className="font-light text-slate-500 font-size-sm">
                  {i.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-600">
                  {formatCurrency(i.value)}
                </span>
                <button onClick={() => handleRemove(i.id, "Entrada")}>
                  <Trash2
                    size={14}
                    className="text-slate-300 hover:text-red-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h3 className="font-bold text-rose-700 mb-3">Saídas</h3>
          {expenses.map((e) => (
            <div
              key={e.id}
              className="flex justify-between py-2 border-b last:border-0 border-slate-100"
            >
              <div>
                <span>{e.name}</span>
                <p className="font-light text-slate-500 font-size-sm">
                  {e.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-rose-600">
                  {formatCurrency(e.value)}
                </span>
                <button onClick={() => handleRemove(e.id, "Saida")}>
                  <Trash2
                    size={14}
                    className="text-slate-300 hover:text-red-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold mb-4 flex gap-2 items-center">
          <Plus size={18} /> Adicionar Rápido
        </h3>
        <form
          onSubmit={handleAddItem}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            placeholder="Título (Ex: Salário, Aluguel)"
            className="flex-1 p-2 border rounded-lg"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição"
            className="flex-1 p-2 border rounded-lg"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor"
            className="w-32 p-2 border rounded-lg"
            value={newItemValue}
            onChange={(e) => setNewItemValue(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg"
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="Saida">Saida</option>
            <option value="Entrada">Entrada</option>
          </select>
          <button
            type="submit"
            className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800"
          >
            Salvar
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardView;
