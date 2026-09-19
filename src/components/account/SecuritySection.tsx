import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { changePassword, deleteAccount } from '@/services/accountService';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SecuritySection() {
  const { logout } = useAuth();
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Delete account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPassError('Your new password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsSubmittingPass(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPassSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassSuccess(''), 4000);
    } catch (err: any) {
      setPassError(err.message || 'Unable to update password. Please try again.');
    } finally {
      setIsSubmittingPass(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    if (!deletePassword) {
      setDeleteError('Please enter your password to confirm deletion.');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount(deletePassword);
      // Success, log them out
      logout();
    } catch (err: any) {
      setDeleteError(err.message || 'Unable to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Change Password Block */}
      <div className="bg-white border border-border rounded-lg shadow-sm p-6 md:p-8">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-xl font-bold text-primary">Change password</h2>
          <p className="text-secondary text-sm mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        {passSuccess && (
          <div className="mb-6 bg-success/10 border border-success/20 text-success p-4 rounded text-sm flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 shrink-0" />
            <span className="font-medium">{passSuccess}</span>
          </div>
        )}

        {passError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded text-sm flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 shrink-0 mt-0.5" />
            <span>{passError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-semibold text-primary mb-2">Current Password</label>
            <div className="relative">
              <input 
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-secondary hover:text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-primary mb-2">New Password</label>
            <input 
              id="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-xs text-secondary">Use at least 8 characters.</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-primary mb-2">Confirm New Password</label>
            <input 
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmittingPass}
              className="bg-primary text-white font-medium px-6 py-2.5 rounded hover:bg-opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmittingPass ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </form>
      </div>

      {/* Delete Account Block */}
      <div className="bg-white border border-red-200 rounded-lg shadow-sm p-6 md:p-8">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-red-700">Delete account</h2>
          <p className="text-secondary text-sm mt-2">
            Once you delete your account, there is no going back. Please be certain.
            This action will permanently delete your personal information, saved passengers, and preferences. 
            Active bookings must be cancelled or completed prior to account deletion if required by operational policy.
          </p>
        </div>

        <button 
          onClick={() => setShowDeleteDialog(true)}
          className="border border-red-600 text-red-600 font-medium px-6 py-2.5 rounded hover:bg-red-50 transition-colors mt-4"
        >
          Delete my account
        </button>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-primary mb-2">Delete your TravelEase account</h3>
            <div className="text-secondary text-sm mb-6 pb-4 border-b border-border space-y-2">
              <p>Are you sure you want to do this? All of your saved data will be permanently removed.</p>
              <p>To confirm, please enter your password.</p>
            </div>
            
            {deleteError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded text-sm flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="deletePassword" className="block text-sm font-semibold text-primary mb-2">Password</label>
              <input 
                id="deletePassword"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border border-border rounded px-4 py-2 text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password to confirm"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => { setShowDeleteDialog(false); setDeletePassword(''); setDeleteError(''); }}
                className="px-4 py-2 border border-border text-primary font-medium rounded hover:bg-gray-50 transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Permanently delete account'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
