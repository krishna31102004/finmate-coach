"use client";

import React, { useState } from 'react';
import useAppStore from '@/store/useAppStore';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { profile, setProfile, resetAll } = useAppStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all demo data? This cannot be undone.')) {
      resetAll();
      router.push('/');
    }
  };

  return (
    <main className="p-4 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-textHeading dark:text-slate-100">
            Settings
          </h1>
          <p className="text-sm text-textBody dark:text-slate-300 mt-1">
            Manage your profile and preferences
          </p>
        </div>
      </div>

      {/* Profile Section */}
      <section className="rounded-xl border border-surface dark:border-slate-700 bg-white/90 dark:bg-slate-800/80 shadow-sm p-6 space-y-6">
        <h2 className="text-xl font-semibold text-textHeading dark:text-slate-100 mb-4">
          Profile Information
        </h2>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-textBody dark:text-slate-300 mb-2">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-surface dark:border-slate-600 bg-white dark:bg-slate-900 text-textBody dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
          />
        </div>

        {/* Campus */}
        <div>
          <label htmlFor="campus" className="block text-sm font-medium text-textBody dark:text-slate-300 mb-2">
            Campus
          </label>
          <select
            id="campus"
            value={formData.campus}
            onChange={(e) => setFormData({ ...formData, campus: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-surface dark:border-slate-600 bg-white dark:bg-slate-900 text-textBody dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
          >
            <option value="Tempe">Tempe</option>
            <option value="Phoenix">Phoenix</option>
            <option value="Polytechnic">Polytechnic</option>
            <option value="Online">Online</option>
          </select>
        </div>

        {/* Income Cycle */}
        <div>
          <label htmlFor="incomeCycle" className="block text-sm font-medium text-textBody dark:text-slate-300 mb-2">
            Income Cycle
          </label>
          <select
            id="incomeCycle"
            value={formData.incomeCycle}
            onChange={(e) => setFormData({ ...formData, incomeCycle: e.target.value as 'weekly' | 'biweekly' | 'monthly' })}
            className="w-full px-4 py-2 rounded-lg border border-surface dark:border-slate-600 bg-white dark:bg-slate-900 text-textBody dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
          >
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Weekly Plan Amount */}
        <div>
          <label htmlFor="weeklyPlan" className="block text-sm font-medium text-textBody dark:text-slate-300 mb-2">
            Weekly Plan Amount ($)
          </label>
          <input
            id="weeklyPlan"
            type="number"
            value={formData.weeklyPlan || ''}
            onChange={(e) => setFormData({ ...formData, weeklyPlan: e.target.value ? parseFloat(e.target.value) : null })}
            placeholder="e.g., 500"
            className="w-full px-4 py-2 rounded-lg border border-surface dark:border-slate-600 bg-white dark:bg-slate-900 text-textBody dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
          />
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            This will be used in your Wallet Snapshot calculations
          </p>
        </div>

        {/* Currency */}
        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-textBody dark:text-slate-300 mb-2">
            Currency
          </label>
          <select
            id="currency"
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-surface dark:border-slate-600 bg-white dark:bg-slate-900 text-textBody dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="INR">INR (₹)</option>
          </select>
        </div>


        {/* Save Button */}
        <div className="flex items-center space-x-3 pt-4">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary dark:bg-blue-600 text-white rounded-lg font-semibold hover:bg-primary/90 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-400 transition-colors shadow-md"
          >
            Save Changes
          </button>
          {saved && (
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Saved successfully!
            </span>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-xl border-2 border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-900/10 shadow-sm p-6 space-y-4">
        <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-red-600 dark:text-red-300 mb-4">
          Resetting demo data will clear all transactions, goals, and chat history. This action cannot be undone.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-red-600 dark:bg-red-700 text-white rounded-lg font-semibold hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors shadow-md"
        >
          Reset Demo Data
        </button>
      </section>
    </main>
  );
}

