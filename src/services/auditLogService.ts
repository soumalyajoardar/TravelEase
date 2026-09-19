export interface AuditLog {
  id: string;
  admin_user_id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  result: 'Success' | 'Failed';
  metadata: Record<string, any>;
  created_at: string;
}

export interface AuditLogQuery {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  entity_type?: string;
  result?: string;
  date_from?: string;
  date_to?: string;
  sort_order?: 'desc' | 'asc';
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}

// In-memory mock state starting strictly empty
let mockAuditLogs: AuditLog[] = [];

export async function getAuditLogs(query: AuditLogQuery = {}): Promise<PaginatedAuditLogs> {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network

  let filtered = [...mockAuditLogs];

  if (query.search) {
    const s = query.search.toLowerCase();
    filtered = filtered.filter(log => 
      log.admin_email.toLowerCase().includes(s) ||
      log.action.toLowerCase().includes(s) ||
      log.entity_id.toLowerCase().includes(s)
    );
  }

  if (query.action && query.action !== 'all') {
    filtered = filtered.filter(log => log.action === query.action);
  }

  if (query.entity_type && query.entity_type !== 'all') {
    filtered = filtered.filter(log => log.entity_type === query.entity_type);
  }

  if (query.result && query.result !== 'all') {
    filtered = filtered.filter(log => log.result === query.result);
  }

  if (query.date_from) {
    const from = new Date(query.date_from).getTime();
    filtered = filtered.filter(log => new Date(log.created_at).getTime() >= from);
  }

  if (query.date_to) {
    const to = new Date(query.date_to).getTime();
    filtered = filtered.filter(log => new Date(log.created_at).getTime() <= to);
  }

  // Sort
  const order = query.sort_order || 'desc';
  filtered.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime();
    const timeB = new Date(b.created_at).getTime();
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });

  const page = query.page || 1;
  const limit = query.limit || 25;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    total: filtered.length,
    page,
    limit
  };
}

export async function logAdminAction(
  admin_user_id: string,
  admin_email: string,
  action: string,
  entity_type: string,
  entity_id: string,
  result: 'Success' | 'Failed',
  metadata: Record<string, any> = {}
): Promise<void> {
  const newLog: AuditLog = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    admin_user_id,
    admin_email,
    action,
    entity_type,
    entity_id,
    result,
    metadata,
    created_at: new Date().toISOString()
  };
  mockAuditLogs.unshift(newLog); // Prepend to mock array
}
