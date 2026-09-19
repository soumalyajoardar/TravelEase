"use client";

import React, { useEffect, useState } from 'react';
import AdminEmptyState from '@/components/admin/AdminEmptyState';
import { Users, Plus, Search } from 'lucide-react';
import { getOperators } from '@/services/supabaseAdminService';

export default function AdminOperatorsPage() {
  const [operators, setOperators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOperator, setNewOperator] = useState({ name: '', type: 'train', status: 'active' });

  useEffect(() => {
    async function load() {
      try {
        const data = await getOperators();
        setOperators(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOperator(newOperator);
      setIsModalOpen(false);
      setNewOperator({ name: '', type: 'train', status: 'active' });
      // Reload data
      const data = await getOperators();
      setOperators(data);
    } catch (err: any) {
      alert("Error adding operator: " + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6 relative">
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Add New Operator</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Operator Name</label>
                <input required type="text" value={newOperator.name} onChange={(e) => setNewOperator({...newOperator, name: e.target.value})} className="w-full border border-border rounded px-3 py-2" placeholder="e.g. Indian Railways" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Transport Type</label>
                <select value={newOperator.type} onChange={(e) => setNewOperator({...newOperator, type: e.target.value})} className="w-full border border-border rounded px-3 py-2">
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="both">Both</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-secondary hover:text-primary">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90">Save Operator</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Operators</h1>
          <p className="text-secondary mt-1">Manage transportation providers.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          <span>Add Operator</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Search by operator name..." 
              className="w-full border border-border rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary"
              disabled={isLoading || operators.length === 0}
            />
          </div>
          <select disabled={isLoading || operators.length === 0} className="border border-border rounded px-3 py-2 text-sm bg-white text-secondary hidden sm:block">
            <option>All Types</option>
            <option>Train</option>
            <option>Bus</option>
          </select>
        </div>
        
        <div className="overflow-x-auto min-h-[400px] flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
            </div>
          ) : operators.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <AdminEmptyState 
                icon={Users}
                title="No operators have been added yet."
                description="Add your first transportation provider to begin building the inventory."
                actionLabel="Add operator"
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
                      <span className="bg-success/10 text-success px-2 py-1 rounded text-xs font-medium capitalize">
                        {op.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary">{new Date(op.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right text-accent font-medium cursor-pointer hover:underline">
                      Edit
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
