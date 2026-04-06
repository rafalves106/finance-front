import { useEffect, useState } from "react";

import { API_MOTO_URL } from "../services/api";

import {
  Plus,
  Trash2,
  Clock,
  Bike,
  Calendar,
  Gauge,
  CheckCircle2,
  XCircle,
  Edit3,
  RefreshCw,
} from "lucide-react";

const BikeView = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [motoLoading, setMotoLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const formInicial = {
    id: null,
    titulo: "",
    dataManutencao: "",
    quilometragem: "",
    status: "AGENDADA",
  };
  const [formData, setFormData] = useState(formInicial);

  useEffect(() => {
    buscarManutencoes();
  }, []);

  const buscarManutencoes = async () => {
    setMotoLoading(true);
    try {
      const response = await fetch(API_MOTO_URL);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setManutencoes(data);
    } catch (error) {
      console.log("Erro ao carregar manutenções.", error);
    } finally {
      setMotoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      titulo: formData.titulo,
      dataManutencao: formData.dataManutencao || null,
      quilometragem: formData.quilometragem
        ? parseInt(formData.quilometragem)
        : null,
      status: formData.status,
    };

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${API_MOTO_URL}/${formData.id}` : API_MOTO_URL;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setFormData(formInicial);
        setIsEditing(false);
        buscarManutencoes();
      }
    } catch (error) {
      alert("Erro ao salvar manutenção.", error);
    }
  };

  const deletarManutencao = async (id) => {
    if (!window.confirm("Excluir este registro?")) return;
    try {
      await fetch(`${API_MOTO_URL}/${id}`, { method: "DELETE" });
      buscarManutencoes();
    } catch (error) {
      alert("Erro ao deletar", error);
    }
  };

  const stats = {
    total: manutencoes.length,
    realizadas: manutencoes.filter((m) => m.status === "REALIZADA").length,
    agendadas: manutencoes.filter((m) => m.status === "AGENDADA").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
            <Bike size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Serviços</p>
            <h3 className="text-2xl font-bold">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Realizadas</p>
            <h3 className="text-2xl font-bold">{stats.realizadas}</h3>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Agendadas</p>
            <h3 className="text-2xl font-bold">{stats.agendadas}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-orange-600">
                {isEditing ? <Edit3 size={18} /> : <Plus size={18} />}
                {isEditing ? "Editar Serviço" : "Nova Manutenção"}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-lg"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  placeholder="Ex: Troca de Óleo"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Status
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="AGENDADA">Agendada</option>
                    <option value="REALIZADA">Realizada</option>
                    <option value="CANCELADA">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg text-sm"
                    value={formData.dataManutencao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataManutencao: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  Quilometragem
                </label>
                <div className="relative">
                  <Gauge
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={16}
                  />
                  <input
                    type="number"
                    className="w-full p-2 pl-10 border rounded-lg"
                    value={formData.quilometragem}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quilometragem: e.target.value,
                      })
                    }
                    placeholder="Km atual"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 transition-colors"
                >
                  {isEditing ? "Atualizar" : "Registrar"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(formInicial);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Calendar size={18} className="text-slate-400" /> Histórico
              </h3>
              <button
                onClick={buscarManutencoes}
                className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1"
              >
                <RefreshCw size={14} /> Atualizar
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="p-4 font-bold">Serviço</th>
                    <th className="p-4 font-bold">Data/Km</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {manutencoes.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{m.titulo}</p>
                        <p className="text-[10px] text-slate-400">ID: {m.id}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {m.dataManutencao
                            ? new Date(
                                m.dataManutencao + "T00:00:00",
                              ).toLocaleDateString("pt-BR")
                            : "---"}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {m.quilometragem
                            ? `${m.quilometragem.toLocaleString()} km`
                            : "---"}
                        </p>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold
                          ${
                            m.status === "REALIZADA"
                              ? "bg-emerald-100 text-emerald-700"
                              : m.status === "AGENDADA"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {m.status === "REALIZADA" ? (
                            <CheckCircle2 size={12} />
                          ) : m.status === "AGENDADA" ? (
                            <Clock size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setFormData({
                                id: m.id,
                                titulo: m.titulo || "",
                                dataManutencao: m.dataManutencao || "",
                                quilometragem: m.quilometragem || "",
                                status: m.status || "AGENDADA",
                              });
                              setIsEditing(true);
                              window.scrollTo(0, 0);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => deletarManutencao(m.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {manutencoes.length === 0 && !motoLoading && (
                <div className="p-12 text-center text-slate-400">
                  <Bike size={40} className="mx-auto mb-2 opacity-20" />
                  <p>Nenhum registro encontrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeView;
