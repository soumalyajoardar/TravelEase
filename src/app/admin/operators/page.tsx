"use client";

import React, { useEffect, useState } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { getOperators, createOperator, updateOperator, deleteOperator } from '@/services/supabaseAdminService';

const DEFAULT_FORM = { name: '', type: 'train', status: 'active' };

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(DEFAULT_FORM);

  async function loadOperators() {
    try {
      const data = await getOperators();
      setOperators(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOperators();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (editingId) {
        await updateOperator(editingId, form);
      } else {
        await createOperator(form);
      }
      await loadOperators();
      setIsModalOpen(false);
      setEditingId(null);
      setForm(DEFAULT_FORM);
    } catch (err: any) {
      alert('Error saving operator: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteOperator(id);
      await loadOperators();
    } catch (err: any) {
      alert('Error deleting operator: ' + err.message);
    }
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(DEFAULT_FORM);
    setIsModalOpen(true);
  };

  const openEdit = (op: any) => {
    setEditingId(op.id);
    setForm({ name: op.name, type: op.type, status: op.status });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 relative">

      {/* Operator Modal (Create or Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              {editingId ? 'Edit Operator' : 'Add New Operator'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Operator Name
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. Indian Railways"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Transport Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border border-border rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingId(null); setForm(DEFAULT_FORM); }}
                  className="px-4 py-2 text-secondary hover:text-primary text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : editingId ? 'Update Operator' : 'Save Operator'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Operators</h1>
          <p className="text-secondary mt-1">Manage transportation providers.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Operator</span>
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by operator name..."
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || operators.length === 0}
            />
          </div>
          <select
            disabled={isLoading || operators.length === 0}
            className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary hidden sm:block cursor-pointer"
          >
            <option>All Types</option>
            <option>Train</option>
            <option>Bus</option>
            <option>Both</option>
          </select>
        </div>

        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex flex-col gap-3 p-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/5" />
                  <div className="h-4 bg-gray-200 rounded w-12 ml-auto" />
                </div>
              ))}
            </div>
          ) : operators.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState
                icon={Users}
                title="No operators have been added yet."
                description="Add your first transportation provider to begin building the inventory."
                actionLabel="Add Operator"
                onAction={openAdd}
              />
            </div>
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b border-border text-secondary">
                <tr>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Name</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs">Created</th>
                  <th className="px-6 py-3 font-medium uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {operators.map((op: any) => (
                  <tr key={op.id} className="border-b border-border hover:bg-gray-50">
                    <td className="px-6 py-4 text-primary font-medium">{op.name}</td>
                    <td className="px-6 py-4 text-secondary capitalize">{op.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                        op.status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-secondary'
                      }`}>
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {op.created_at ? new Date(op.created_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 text-sm font-medium">
                      <button
                        onClick={() => openEdit(op)}
                        className="text-primary hover:text-accent cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(op.id, op.name)}
                        className="text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
