'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, Phone, Server, RefreshCw } from 'lucide-react';

export default function AdminSmsPage() {
  const [testNumber, setTestNumber] = useState('0772268608');
  const [testMessage, setTestMessage] = useState('Test notification from GLX Industries Showcase Portal.');
  const [sending, setSending] = useState(false);
  const [responseLog, setResponseLog] = useState<{
    status: string;
    message: string;
    campaignId?: string;
    timestamp: string;
  } | null>(null);

  const handleSendTestSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResponseLog(null);

    try {
      const res = await fetch('/api/sms/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testNumber,
          message: testMessage,
        }),
      });

      const data = await res.json();
      setResponseLog({
        status: data.success ? 'Success' : 'Error',
        message: data.message,
        campaignId: data.campaignId,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err: any) {
      setResponseLog({
        status: 'Error',
        message: err.message || 'Failed to connect to SMS dispatch endpoint',
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    setSending(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          GLX Communication Gateway
        </span>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          SMS Gateway Integration & Logs
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
          Notify factory managers and sales representatives instantly whenever a customer requests a quotation or sends an inquiry.
        </p>
      </div>

      {/* Gateway Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Gateway Provider</span>
            <Server className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white">Notify.lk HTTP API</p>
          <p className="text-[11px] text-slate-500">Sender ID: GLX Alert</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Admin Recipient</span>
            <Phone className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-base font-bold text-slate-900 dark:text-white font-mono">077 226 8608</p>
          <p className="text-[11px] text-slate-500">Primary Dispatch Mobile</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Service Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active & Ready</span>
          </div>
          <p className="text-[11px] text-slate-500">Auto-triggers on lead capture</p>
        </div>
      </div>

      {/* Test Dispatch Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-md">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-amber-500" /> Test SMS Dispatch
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Send an instant test message through your configured SMS Gateway to verify end-to-end delivery.
          </p>
        </div>

        <form onSubmit={handleSendTestSms} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Recipient Mobile Number</label>
              <input
                type="text"
                required
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono focus:border-amber-400 focus:outline-none"
                placeholder="077xxxxxxx"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Sender Alias</label>
              <input
                type="text"
                disabled
                value="NotifyDEMO / GLX"
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">SMS Message Body</label>
            <textarea
              rows={3}
              required
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{sending ? 'Dispatching SMS...' : 'Send Live Test SMS'}</span>
          </button>
        </form>

        {/* Response Log */}
        {responseLog && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-1 animate-in fade-in ${
              responseLog.status === 'Success'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {responseLog.status === 'Success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
              )}
              <span>Status: {responseLog.status}</span>
              <span className="text-[10px] text-slate-400 font-normal">({responseLog.timestamp})</span>
            </div>
            <p className="font-mono text-[11px] pl-6">{responseLog.message}</p>
            {responseLog.campaignId && (
              <p className="text-[10px] pl-6 text-slate-500">Campaign ID: {responseLog.campaignId}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
