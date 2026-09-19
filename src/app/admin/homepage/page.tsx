"use client";

import React, { useEffect, useState } from 'react';
import { Save, Upload, Layout, AlertCircle } from 'lucide-react';
import { getAdminHomepageContent, saveAdminHomepageContent, HomepageContent } from '@/services/cmsAdminService';

export default function AdminHomepageCMS() {
  const [content, setContent] = useState<Partial<HomepageContent>>({
    hero_title: '',
    hero_subtitle: '',
    hero_cta_text: '',
    hero_cta_link: '',
    announcement_active: false,
    announcement_text: '',
    announcement_link: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminHomepageContent();
        if (data) {
          setContent(data);
          setLastSaved(data.updated_at);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setContent(prev => ({ ...prev, [name]: checked }));
    } else {
      setContent(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (publish: boolean) => {
    setIsSaving(true);
    try {
      const updated = await saveAdminHomepageContent(content, publish);
      setContent(updated);
      setLastSaved(updated.updated_at);
      alert(publish ? 'Homepage content published successfully.' : 'Draft saved successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to save homepage content.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="bg-white border border-border rounded-lg p-6 h-64"></div>
        <div className="bg-white border border-border rounded-lg p-6 h-64"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6 pb-24">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center space-x-2">
            <Layout className="w-6 h-6" />
            <span>Homepage Content</span>
          </h1>
          <p className="text-secondary mt-1">Manage dynamic content for the customer homepage.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-4 py-2 bg-white border border-border text-primary rounded text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : 'Publish Content'}</span>
          </button>
        </div>
      </div>

      {content.status === 'draft' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg flex items-start space-x-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">You have unpublished draft changes.</p>
            <p className="text-yellow-700 mt-0.5">Customers will continue to see the previously published content until you click Publish.</p>
          </div>
        </div>
      )}

      {lastSaved && (
        <p className="text-xs text-secondary text-right">
          Last updated: {new Date(lastSaved).toLocaleString()}
        </p>
      )}

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50">
          <h2 className="font-semibold text-primary">Hero Section</h2>
          <p className="text-xs text-secondary mt-1">Use clear, factual wording that accurately describes TravelEase.</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Headline</label>
            <input 
              type="text" 
              name="hero_title"
              value={content.hero_title || ''}
              onChange={handleChange}
              placeholder="e.g. Your journey. Your choice."
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Sub-headline</label>
            <textarea 
              name="hero_subtitle"
              rows={2}
              value={content.hero_subtitle || ''}
              onChange={handleChange}
              placeholder="e.g. Compare and book train and bus tickets easily."
              className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Call to Action (CTA) Text</label>
              <input 
                type="text" 
                name="hero_cta_text"
                value={content.hero_cta_text || ''}
                onChange={handleChange}
                placeholder="e.g. Search Tickets"
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">CTA Link Destination</label>
              <input 
                type="text" 
                name="hero_cta_link"
                value={content.hero_cta_link || ''}
                onChange={handleChange}
                placeholder="e.g. /search"
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Hero Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gray-50 flex flex-col items-center justify-center">
              <Upload className="w-8 h-8 text-secondary mb-3" />
              <p className="text-sm text-primary font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-secondary">WebP, PNG, or JPG (max. 2MB)</p>
              <button disabled className="mt-4 px-4 py-2 border border-border bg-white rounded text-sm font-medium text-secondary opacity-50 cursor-not-allowed">
                Upload Image
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-primary">Announcement Banner</h2>
            <p className="text-xs text-secondary mt-1">Display a prominent notice at the top of the site.</p>
          </div>
          <div className="shrink-0 flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input 
                  type="checkbox" 
                  name="announcement_active"
                  checked={content.announcement_active}
                  onChange={handleChange}
                  className="sr-only" 
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${content.announcement_active ? 'bg-primary' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${content.announcement_active ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-primary">Active</span>
            </label>
          </div>
        </div>
        
        {content.announcement_active && (
          <div className="p-6 space-y-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Announcement Text</label>
              <input 
                type="text" 
                name="announcement_text"
                value={content.announcement_text || ''}
                onChange={handleChange}
                placeholder="e.g. Scheduled maintenance on 25 September"
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Optional Link Destination</label>
              <input 
                type="text" 
                name="announcement_link"
                value={content.announcement_link || ''}
                onChange={handleChange}
                placeholder="e.g. /help"
                className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-primary" 
              />
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
