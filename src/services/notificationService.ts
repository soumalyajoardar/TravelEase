export interface AppNotification {
  id: string;
  user_id: string;
  type: 'booking' | 'payment' | 'refund' | 'support' | 'system';
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
  action_url?: string;
}

// In-memory mock starting strictly empty to adhere to the "no fake data" rule
let mockNotifications: AppNotification[] = [];

export async function getUserNotifications(userId: string): Promise<AppNotification[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockNotifications.filter(n => n.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  await new Promise(resolve => setTimeout(resolve, 150));
  return mockNotifications.filter(n => n.user_id === userId && !n.read_at).length;
}

export async function markNotificationAsRead(userId: string, notificationId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 200));
  const notification = mockNotifications.find(n => n.id === notificationId && n.user_id === userId);
  if (notification && !notification.read_at) {
    notification.read_at = new Date().toISOString();
    return true;
  }
  return false;
}

export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 400));
  let updated = false;
  mockNotifications.forEach(n => {
    if (n.user_id === userId && !n.read_at) {
      n.read_at = new Date().toISOString();
      updated = true;
    }
  });
  return updated;
}

// Admin mock
export async function getAdminNotificationTemplates(): Promise<any[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [];
}
