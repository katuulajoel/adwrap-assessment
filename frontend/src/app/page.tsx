'use client';

import { useState, useEffect } from 'react';
import { mediaItemApi, workspaceApi } from '@/services/api';
import Link from 'next/link';

export default function Dashboard() {
  const [statistics, setStatistics] = useState({
    totalWorkspaces: 0,
    totalMediaItems: 0,
    billboards: 0,
    streetPoles: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        
        // Load workspaces
        const workspaces = await workspaceApi.getAll();
        
        // Load media items
        const mediaItems = await mediaItemApi.getAll();
        
        // Calculate statistics
        const billboards = mediaItems.filter(item => item.type === 'billboard');
        const streetPoles = mediaItems.filter(item => item.type === 'street_pole');
        
        setStatistics({
          totalWorkspaces: workspaces.length,
          totalMediaItems: mediaItems.length,
          billboards: billboards.length,
          streetPoles: streetPoles.length,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your media advertising spaces
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Workspaces" 
              value={statistics.totalWorkspaces} 
              description="Total workspaces" 
              href="/workspaces"
              color="bg-blue-500" 
            />
            <StatCard 
              title="Media Items" 
              value={statistics.totalMediaItems} 
              description="Total media items" 
              href="/media-items"
              color="bg-purple-500" 
            />
            <StatCard 
              title="Billboards" 
              value={statistics.billboards} 
              description="Total billboards" 
              href="/media-items?type=billboard"
              color="bg-green-500" 
            />
            <StatCard 
              title="Street Poles" 
              value={statistics.streetPoles} 
              description="Total street poles" 
              href="/media-items?type=street_pole"
              color="bg-orange-500" 
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/media-items" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-md transition-colors">
                <h3 className="font-medium">View Media Items</h3>
                <p className="text-sm text-gray-600">Browse and manage your billboards and street poles</p>
              </Link>
              <Link href="/workspaces" className="bg-gray-100 hover:bg-gray-200 p-4 rounded-md transition-colors">
                <h3 className="font-medium">Manage Workspaces</h3>
                <p className="text-sm text-gray-600">View and edit your workspaces</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  href: string;
  color: string;
}

function StatCard({ title, value, description, href, color }: StatCardProps) {
  return (
    <Link href={href} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
        <div className={`h-2 ${color}`}></div>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-3xl font-bold my-2">{value}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
