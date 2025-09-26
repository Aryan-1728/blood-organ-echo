import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, Search, Filter, Calendar, MapPin, Phone } from 'lucide-react';

interface InventoryItem {
  id: string;
  blood_type?: string;
  organ_type?: string;
  quantity: number;
  status: 'available' | 'reserved' | 'expired' | 'used';
  expiry_date?: string;
  collection_date: string;
  provider: {
    organization_name?: string;
    full_name: string;
    phone?: string;
    address?: string;
  };
}

interface InventoryTableProps {
  items: InventoryItem[];
  title?: string;
  description?: string;
  showProvider?: boolean;
  onItemClick?: (item: InventoryItem) => void;
}

export function InventoryTable({ 
  items, 
  title = "Inventory", 
  description = "Current blood and organ inventory",
  showProvider = true,
  onItemClick 
}: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = 
      (item.blood_type?.toLowerCase().includes(search.toLowerCase())) ||
      (item.organ_type?.toLowerCase().includes(search.toLowerCase())) ||
      (item.provider.organization_name?.toLowerCase().includes(search.toLowerCase())) ||
      (item.provider.full_name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    const matchesType = 
      typeFilter === 'all' || 
      (typeFilter === 'blood' && item.blood_type) ||
      (typeFilter === 'organ' && item.organ_type);

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'reserved':
        return 'warning';
      case 'expired':
        return 'destructive';
      case 'used':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <Card className="shadow-card slide-in-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blood">Blood</SelectItem>
              <SelectItem value="organ">Organs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Expiry</TableHead>
                {showProvider && <TableHead>Provider</TableHead>}
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell 
                    colSpan={showProvider ? 7 : 6} 
                    className="text-center text-muted-foreground py-8"
                  >
                    No inventory items found
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow 
                    key={item.id}
                    className={`cursor-pointer hover:bg-muted/50 ${
                      isExpired(item.expiry_date) ? 'bg-destructive/10' :
                      isExpiringSoon(item.expiry_date) ? 'bg-warning/10' : ''
                    }`}
                    onClick={() => onItemClick?.(item)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-primary" />
                        {item.blood_type || item.organ_type}
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <StatusBadge variant={getStatusVariant(item.status)}>
                        {item.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {formatDate(item.collection_date)}
                    </TableCell>
                    <TableCell>
                      {item.expiry_date ? (
                        <span className={
                          isExpired(item.expiry_date) ? 'text-destructive font-medium' :
                          isExpiringSoon(item.expiry_date) ? 'text-warning font-medium' :
                          'text-muted-foreground'
                        }>
                          {formatDate(item.expiry_date)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    {showProvider && (
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {item.provider.organization_name || item.provider.full_name}
                          </div>
                          {item.provider.phone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {item.provider.phone}
                            </div>
                          )}
                          {item.provider.address && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {item.provider.address}
                            </div>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick?.(item);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}