'use client';

import React from 'react';
import PageInspector from '@/components/admin/PageInspector';
import LivePreviewFrame from '@/components/admin/LivePreviewFrame';

export default function UiManagePage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Left Column: Side Inspector & Controls (380px) */}
      <div className="w-80 sm:w-96 flex-shrink-0 h-full">
        <PageInspector />
      </div>

      {/* Right Column: Real-Time Live Page Preview Canvas */}
      <div className="flex-1 h-full">
        <LivePreviewFrame />
      </div>
    </div>
  );
}
