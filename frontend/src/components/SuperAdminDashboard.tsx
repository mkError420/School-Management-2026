import React, { useState, useEffect } from 'react';
import { Tenant, SystemStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/api.php';

export const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'users'>('overview');

  useEffect(() => {
    fetchSystemStats();
    fetchTenants();
  }, []);

  const fetchSystemStats = async () => {
    try {
      const response = await fetch(`${API_BASE}?action=superadmin/stats`);
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}?action=superadmin/tenants`);
      const data = await response.json();
      if (data.success) {
        setTenants(data.tenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'suspended': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'inactive': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'premium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'basic': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      case 'free': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const StatCard: React.FC<{ title: string; value: number | string; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Super Admin Dashboard</h1>
          <p className="text-slate-400">Multitenant School Management System Control Center</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSystemStats}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            Refresh Stats
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'overview' as const, label: 'Overview' },
          { id: 'tenants' as const, label: 'Tenants' },
          { id: 'users' as const, label: 'Users' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Tenants"
                value={stats.totalTenants}
                icon="🏫"
                color="text-emerald-400"
              />
              <StatCard
                title="Active Tenants"
                value={stats.activeTenants}
                icon="✅"
                color="text-blue-400"
              />
              <StatCard
                title="Total Students"
                value={stats.totalStudents}
                icon="👨‍🎓"
                color="text-purple-400"
              />
              <StatCard
                title="Total Teachers"
                value={stats.totalTeachers}
                icon="👨‍🏫"
                color="text-cyan-400"
              />
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="text-amber-400"
              />
              <StatCard
                title="Recent Logins (24h)"
                value={stats.recentLogins}
                icon="🔐"
                color="text-pink-400"
              />
              <StatCard
                title="Database Size"
                value={`${stats.dbSizeMb} MB`}
                icon="💾"
                color="text-indigo-400"
              />
              <StatCard
                title="System Status"
                value="Online"
                icon="🟢"
                color="text-green-400"
              />
            </div>
          )}

          {/* Recent Tenants */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Recent Tenants</h2>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No tenants found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">School Name</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Tenant Code</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Plan</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Students</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Users</th>
                      <th className="text-left py-3 px-4 text-slate-400 font-medium">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.slice(0, 5).map((tenant) => (
                      <tr key={tenant.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{tenant.schoolNameEn}</p>
                            <p className="text-slate-400 text-sm">{tenant.schoolNameBn}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 font-mono text-sm">{tenant.tenantCode}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tenant.status)}`}>
                            {tenant.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlanColor(tenant.subscriptionPlan)}`}>
                            {tenant.subscriptionPlan}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{tenant.studentCount || 0}</td>
                        <td className="py-3 px-4 text-slate-300">{tenant.userCount || 0}</td>
                        <td className="py-3 px-4 text-slate-400 text-sm">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tenants Tab */}
      {activeTab === 'tenants' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">All Tenants</h2>
            <button
              onClick={() => {/* TODO: Open create tenant modal */}}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              + Add New Tenant
            </button>
          </div>
          {loading ? (
            <div className="text-center py-8 text-slate-400">Loading...</div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No tenants found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">School Name</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Tenant Code</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Domain</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Plan</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Max Students</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Current Students</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Users</th>
                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((tenant) => (
                    <tr key={tenant.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-white font-medium">{tenant.schoolNameEn}</p>
                          <p className="text-slate-400 text-sm">{tenant.schoolNameBn}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-sm">{tenant.tenantCode}</td>
                      <td className="py-3 px-4 text-slate-300">{tenant.domain}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(tenant.status)}`}>
                          {tenant.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPlanColor(tenant.subscriptionPlan)}`}>
                          {tenant.subscriptionPlan}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{tenant.maxStudents}</td>
                      <td className="py-3 px-4 text-slate-300">{tenant.studentCount || 0}</td>
                      <td className="py-3 px-4 text-slate-300">{tenant.userCount || 0}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors">
                            Edit
                          </button>
                          <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Users</h2>
          <div className="text-center py-8 text-slate-400">
            User management feature coming soon. This will allow super admin to view and manage users across all tenants.
          </div>
        </div>
      )}
    </div>
  );
};
