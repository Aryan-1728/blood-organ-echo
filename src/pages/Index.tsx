import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { EmergencySOSCard } from '@/components/dashboard/EmergencySOSCard';
import { InventoryTable } from '@/components/dashboard/InventoryTable';
import { EmergencyButton } from '@/components/ui/emergency-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, AlertTriangle, Database, Users, Activity, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<string>('');
  const [sosRequests, setSOSRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalDonors: 0,
    activeSOSRequests: 0,
    availableUnits: 0,
    responsesLastMonth: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchSOSRequests();
      fetchInventory();
      fetchStats();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (profile) {
      setUserRole(profile.role);
    }
  };

  const fetchSOSRequests = async () => {
    const { data } = await supabase
      .from('sos_requests')
      .select(`
        *,
        profiles!sos_requests_requester_id_fkey(full_name, phone, organization_name)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) {
      setSOSRequests(data);
    }
  };

  const fetchInventory = async () => {
    const { data } = await supabase
      .from('inventory')
      .select(`
        *,
        profiles!inventory_provider_id_fkey(full_name, phone, organization_name, address)
      `)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) {
      setInventory(data);
    }
  };

  const fetchStats = async () => {
    // Fetch various statistics for the dashboard
    const [donorCount, sosCount, inventoryCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'donor'),
      supabase.from('sos_requests').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('inventory').select('quantity', { count: 'exact' }).eq('status', 'available'),
    ]);

    setStats({
      totalDonors: donorCount.count || 0,
      activeSOSRequests: sosCount.count || 0,
      availableUnits: inventoryCount.count || 0,
      responsesLastMonth: 24, // This would be calculated from actual data
    });
  };

  const renderRoleDashboard = () => {
    switch (userRole) {
      case 'donor':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4 p-6 bg-gradient-subtle rounded-lg border">
              <Heart className="h-12 w-12 text-primary mx-auto" />
              <div>
                <h2 className="text-2xl font-bold">Welcome, Life Saver!</h2>
                <p className="text-muted-foreground">Your donation can save up to 3 lives</p>
              </div>
              <EmergencyButton variant="medical" size="lg">
                <Plus className="h-4 w-4" />
                Create SOS Request
              </EmergencyButton>
            </div>
          </div>
        );

      case 'hospital':
      case 'blood_bank':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Active SOS Requests"
                value={stats.activeSOSRequests}
                icon={AlertTriangle}
                variant={stats.activeSOSRequests > 0 ? 'critical' : 'default'}
              />
              <StatsCard
                title="Available Units"
                value={stats.availableUnits}
                icon={Database}
                variant="success"
              />
              <StatsCard
                title="Total Donors"
                value={stats.totalDonors}
                icon={Users}
              />
              <StatsCard
                title="Monthly Responses"
                value={stats.responsesLastMonth}
                icon={Activity}
                trend={{ value: '+12%', isPositive: true }}
              />
            </div>

            {sosRequests.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-critical" />
                  Emergency SOS Requests
                </h3>
                <div className="grid gap-4">
                  {sosRequests.map((request: any) => (
                    <EmergencySOSCard
                      key={request.id}
                      request={{
                        ...request,
                        patient_name: request.patient_name,
                        contact_phone: request.contact_phone,
                      }}
                      userRole={userRole}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center space-y-4 p-8">
            <Heart className="h-16 w-16 text-primary mx-auto" />
            <div>
              <h2 className="text-3xl font-bold">Welcome to BloodLink</h2>
              <p className="text-muted-foreground text-lg">Community Blood & Organ Donation Tracker</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with emergency medical needs.
          </p>
        </div>
      </div>

      {renderRoleDashboard()}

      {inventory.length > 0 && (
        <InventoryTable
          items={inventory.map((item: any) => ({
            ...item,
            provider: item.profiles,
          }))}
          title="Recent Inventory Updates"
          description="Latest blood and organ availability"
        />
      )}
    </div>
  );
};

export default Index;
