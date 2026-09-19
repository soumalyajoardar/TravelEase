export interface SavedPassenger {
  id: string;
  fullName: string;
  age: string;
  gender: string;
}

export interface NotificationSettings {
  bookingUpdates: boolean;
  travelReminders: boolean;
  promotions: boolean;
}

// In-memory mock database for account data
let mockSavedPassengers: SavedPassenger[] = [];
let mockNotificationSettings: NotificationSettings = {
  bookingUpdates: true,
  travelReminders: true,
  promotions: false,
};

export async function updateProfile(name: string, email: string, mobile: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, this updates the DB
}

export async function getSavedPassengers(): Promise<SavedPassenger[]> {
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockSavedPassengers];
}

export async function addSavedPassenger(passenger: Omit<SavedPassenger, 'id'>): Promise<SavedPassenger> {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newPassenger = { ...passenger, id: 'PASS' + Math.random().toString(36).substring(2, 8).toUpperCase() };
  mockSavedPassengers.push(newPassenger);
  return newPassenger;
}

export async function removeSavedPassenger(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800));
  mockSavedPassengers = mockSavedPassengers.filter(p => p.id !== id);
}

export async function getNotificationSettings(): Promise<NotificationSettings> {
  await new Promise(resolve => setTimeout(resolve, 600));
  return { ...mockNotificationSettings };
}

export async function updateNotificationSettings(settings: NotificationSettings): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800));
  mockNotificationSettings = { ...settings };
}

export async function changePassword(current: string, newPass: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (current.length < 8) {
    throw new Error("Current password is incorrect.");
  }
}

export async function deleteAccount(password: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  if (password.length < 8) {
    throw new Error("Incorrect password.");
  }
  // Clear mock data
  mockSavedPassengers = [];
}
