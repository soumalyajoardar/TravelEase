"use client";

import React, { useEffect, useState } from 'react';
import { getPublishedPolicy, LegalDocument } from '@/services/legalService';
import { FileText } from 'lucide-react';
import Link from 'next/link';

interface PolicyViewerProps {
  slug: string;
  defaultTitle: string;
}

export default function PolicyViewer({ slug, defaultTitle }: PolicyViewerProps) {
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getPublishedPolicy(slug);
        setDoc(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-secondary" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-3">{defaultTitle}</h1>
        <p className="text-secondary max-w-md mx-auto mb-8">
          This policy is currently being updated and will be published shortly. 
          Please contact support if you need immediate assistance regarding these terms.
        </p>
        <Link 
          href="/contact"
          className="inline-block bg-primary text-white font-medium px-6 py-2.5 rounded hover:bg-opacity-90 transition-opacity"
        >
          Contact Support
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">{doc.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-secondary space-y-2 sm:space-y-0 sm:space-x-6">
          {doc.published_at && (
            <span>Last updated: {new Date(doc.published_at).toLocaleDateString()}</span>
          )}
          <span>Version: {doc.version}</span>
        </div>
      </div>
      
      <div className="prose prose-slate max-w-none prose-headings:text-primary prose-a:text-primary hover:prose-a:text-primary/80 prose-p:text-gray-600 prose-li:text-gray-600">
        <div dangerouslySetInnerHTML={{ __html: doc.content }} />
      </div>
    </div>
  );
}
