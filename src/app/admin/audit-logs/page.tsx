"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { 
  Activity, Search, Filter, X, ChevronLeft, ChevronRight, 
  Calendar, User, FileText, CheckCircle2, XCircle, Info
} from 'lucide-react';
import { getAuditLogs, AuditLog, PaginatedAuditLogs, AuditLogQuery } from '@/services/auditLogService';
import ErrorState from '@/components/ui/ErrorState';

export default function AuditLogsPage() {
  const [logsData, setLogsData] = useState<PaginatedAuditLogs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const [query, setQuery] = useState<AuditLogQuery>({
    page: 1,
    limit: 25,
    search: '',
    action: 'all',
    entity_type: 'all',
    result: 'all',
    sort_order: 'desc'
  });

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const loadLogs = useCallback(async (currentQuery: AuditLogQuery) => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await getAuditLogs(currentQuery);
      setLogsData(data);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs(query);
  }, [query, loadLogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(prev => ({ ...prev, page: 1 }));
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setQuery(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const clearFilters = () => {
    setQuery({
      page: 1,
      limit: 25,
      search: '',
      action: 'all',
      entity_type: 'all',
      result: 'all',
      sort_order: 'desc'
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    }).format(date);
  };

  if (error) {
    return (
      <div className="p-4 md:p-8">
        <ErrorState 
          title="Unable to load audit logs" 
          description="There was a problem retrieving the activity history. Please try again."
          onRetry={() => loadLogs(query)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-8 pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <span>Audit Logs</span>
          </h1>
          <p className="text-secondary mt-1">Review administrative actions and system events.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg border border-border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
            <Search className="w-5 h-5 text-secondary absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search admin email, action, or reference..." 
              value={query.search || ''}
              onChange={(e) => setQuery(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            />
          </form>
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${showFilters ? 'bg-gray-100 border-gray-300 text-primary' : 'border-border text-secondary hover:bg-gray-50'}`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <select
              name="sort_order"
              value={query.sort_order}
              onChange={handleFilterChange}
              className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary bg-white text-secondary font-medium"
            >
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2">
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Entity Type</label>
              <select name="entity_type" value={query.entity_type} onChange={handleFilterChange} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none">
                <option value="all">All Resources</option>
                <option value="Route">Route</option>
                <option value="Train Service">Train Service</option>
                <option value="Bus Service">Bus Service</option>
                <option value="Schedule">Schedule</option>
                <option value="Fare">Fare</option>
                <option value="Booking">Booking</option>
                <option value="Payment">Payment</option>
                <option value="Refund">Refund</option>
                <option value="Customer">Customer</option>
                <option value="Settings">Settings</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Result</label>
              <select name="result" value={query.result} onChange={handleFilterChange} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none">
                <option value="all">All Results</option>
                <option value="Success">Success</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Date From</label>
              <input type="date" name="date_from" value={query.date_from || ''} onChange={handleFilterChange} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-secondary mb-1">Date To</label>
              <input type="date" name="date_to" value={query.date_to || ''} onChange={handleFilterChange} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white focus:outline-none" />
            </div>
            <div className="sm:col-span-2 md:col-span-4 flex justify-end">
              <button onClick={clearFilters} className="text-sm text-primary hover:underline font-medium">Clear all filters</button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table/List Area */}
      <div className="bg-white rounded-lg border border-border shadow-sm overflow-hidden">
        
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-4 md:p-6 flex items-center space-x-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-24 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : !logsData || logsData.data.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            {query.search || query.action !== 'all' || query.entity_type !== 'all' || query.result !== 'all' ? (
              <>
                <h3 className="text-lg font-semibold text-primary mb-2">No activity matches these filters.</h3>
                <button onClick={clearFilters} className="text-primary font-medium hover:underline">Clear filters</button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-primary mb-2">No administrative activity yet.</h3>
                <p className="text-secondary max-w-sm mx-auto">Important administrative changes will appear here as TravelEase is used.</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-secondary border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                  <th className="px-6 py-4 font-semibold hidden md:table-cell">Resource</th>
                  <th className="px-6 py-4 font-semibold hidden sm:table-cell">Administrator</th>
                  <th className="px-6 py-4 font-semibold">Result</th>
                  <th className="px-6 py-4 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logsData.data.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-secondary font-medium">
                      {formatDate(log.created_at)}
                    </td>
                    <td className="px-6 py-4 text-primary font-medium">
                      {log.action}
                      {/* Mobile Only: Resource & Admin combo */}
                      <div className="md:hidden text-xs text-secondary mt-1 font-normal">
                        {log.entity_type}: {log.entity_id} <br/> By: {log.admin_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-secondary">
                      <span className="font-medium text-primary">{log.entity_type}</span> <br/>
                      <span className="text-xs">{log.entity_id}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-secondary truncate max-w-[200px]" title={log.admin_email}>
                      {log.admin_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.result === 'Success' ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Success</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" />
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="text-primary hover:text-accent font-medium text-sm transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {logsData && logsData.total > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-border flex items-center justify-between text-sm">
            <span className="text-secondary">
              Showing <span className="font-medium text-primary">{Math.min(((query.page || 1) - 1) * (query.limit || 25) + 1, logsData.total)}</span> to <span className="font-medium text-primary">{Math.min((query.page || 1) * (query.limit || 25), logsData.total)}</span> of <span className="font-medium text-primary">{logsData.total}</span> entries
            </span>
            <div className="flex items-center space-x-2">
              <button 
                disabled={(query.page || 1) === 1}
                onClick={() => setQuery(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                className="p-1.5 rounded text-secondary hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                disabled={(query.page || 1) * (query.limit || 25) >= logsData.total}
                onClick={() => setQuery(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                className="p-1.5 rounded text-secondary hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold text-primary flex items-center space-x-2">
                <Info className="w-5 h-5 text-secondary" />
                <span>Audit Record Details</span>
              </h2>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-secondary hover:text-primary transition-colors p-1"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-xs font-medium text-secondary mb-1">Action</p>
                  <p className="text-sm font-semibold text-primary">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-secondary mb-1">Date & Time</p>
                  <p className="text-sm text-primary flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span>{formatDate(selectedLog.created_at)}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-secondary mb-1">Administrator</p>
                  <p className="text-sm text-primary flex items-center space-x-1.5 break-all">
                    <User className="w-4 h-4 text-secondary" />
                    <span>{selectedLog.admin_email}</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-secondary mb-1">Status</p>
                  {selectedLog.result === 'Success' ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Success</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                      <XCircle className="w-3 h-3" />
                      <span>Failed</span>
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-secondary mb-1">Resource Type</p>
                  <p className="text-sm text-primary">{selectedLog.entity_type}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-secondary mb-1">Resource ID</p>
                  <p className="text-sm text-primary font-mono break-all bg-gray-50 px-2 py-1 rounded inline-block">{selectedLog.entity_id}</p>
                </div>
              </div>

              {Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <FileText className="w-4 h-4 text-secondary" />
                    <h3 className="text-sm font-semibold text-primary">Metadata</h3>
                  </div>
                  <div className="bg-gray-50 border border-border rounded-lg p-4 text-xs font-mono text-secondary overflow-x-auto">
                    <pre>{JSON.stringify(selectedLog.metadata, null, 2)}</pre>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Sensitive fields are scrubbed server-side before storage.</p>
                </div>
              )}
              
              <div className="mt-8 pt-4 border-t border-border text-xs text-gray-400 text-right">
                Log ID: {selectedLog.id}
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-gray-50 text-right">
              <button 
                onClick={() => setSelectedLog(null)}
                className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-opacity-90 transition-opacity text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
