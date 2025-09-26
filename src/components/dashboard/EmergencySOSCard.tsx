import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmergencyButton } from '@/components/ui/emergency-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { AlertTriangle, Phone, MapPin, Clock, Heart, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface SOSRequest {
  id: string;
  patient_name: string;
  patient_age?: number;
  blood_type?: string;
  organ_type?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'acknowledged' | 'responding' | 'resolved' | 'cancelled';
  location_name: string;
  description?: string;
  contact_phone: string;
  created_at: string;
}

interface EmergencySOSCardProps {
  request: SOSRequest;
  userRole?: string;
  onRespond?: (requestId: string) => void;
  onAcknowledge?: (requestId: string) => void;
}

export function EmergencySOSCard({ request, userRole, onRespond, onAcknowledge }: EmergencySOSCardProps) {
  const [isResponding, setIsResponding] = useState(false);

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'critical';
      case 'high':
        return 'urgent';
      case 'medium':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'active';
      case 'acknowledged':
        return 'pending';
      case 'responding':
        return 'success';
      case 'resolved':
        return 'success';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  const canRespond = userRole === 'hospital' || userRole === 'blood_bank';

  return (
    <Card className={`slide-in-medical ${request.priority === 'critical' ? 'ring-2 ring-critical shadow-emergency' : 'shadow-card'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${request.priority === 'critical' ? 'text-critical' : 'text-warning'}`} />
              Emergency SOS - {request.patient_name}
              {request.patient_age && <span className="text-sm text-muted-foreground">({request.patient_age}y)</span>}
            </CardTitle>
            <CardDescription className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTimeAgo(request.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {request.location_name}
              </span>
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <StatusBadge variant={getPriorityVariant(request.priority)}>
              {request.priority.toUpperCase()} PRIORITY
            </StatusBadge>
            <StatusBadge variant={getStatusVariant(request.status)}>
              {request.status.toUpperCase()}
            </StatusBadge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Need Information */}
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          {request.blood_type && (
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <span className="font-medium">Blood Type: {request.blood_type}</span>
            </div>
          )}
          {request.organ_type && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">Organ: {request.organ_type}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {request.description && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Description:</p>
            <p className="text-sm">{request.description}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center gap-2 text-sm">
          <Phone className="h-4 w-4 text-primary" />
          <span className="font-medium">Contact: {request.contact_phone}</span>
        </div>

        {/* Action Buttons */}
        {canRespond && request.status === 'active' && (
          <div className="flex gap-2 pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <EmergencyButton 
                  variant="emergency" 
                  size="sm"
                  className="flex-1"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Respond to Emergency
                </EmergencyButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Respond to Emergency Request</DialogTitle>
                  <DialogDescription>
                    Confirm your response to this emergency request for {request.patient_name}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p><strong>Patient:</strong> {request.patient_name} ({request.patient_age}y)</p>
                    <p><strong>Need:</strong> {request.blood_type || request.organ_type}</p>
                    <p><strong>Location:</strong> {request.location_name}</p>
                    <p><strong>Contact:</strong> {request.contact_phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <EmergencyButton 
                      variant="success" 
                      className="flex-1"
                      onClick={() => {
                        setIsResponding(true);
                        onRespond?.(request.id);
                      }}
                      disabled={isResponding}
                    >
                      Confirm Response
                    </EmergencyButton>
                    <EmergencyButton 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => onAcknowledge?.(request.id)}
                    >
                      Acknowledge Only
                    </EmergencyButton>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {request.status === 'acknowledged' && (
          <div className="p-2 bg-warning/10 border border-warning rounded text-sm">
            <span className="font-medium">Status:</span> Emergency acknowledged, awaiting response from medical facilities
          </div>
        )}

        {request.status === 'responding' && (
          <div className="p-2 bg-success/10 border border-success rounded text-sm">
            <span className="font-medium">Status:</span> Medical facility is responding to this emergency
          </div>
        )}
      </CardContent>
    </Card>
  );
}