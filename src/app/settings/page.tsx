
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pencil,
  ShieldAlert,
  LogIn,
  Share2,
  MapPin,
  Globe,
  KeyRound,
  LogOut,
  Mail,
  Phone,
  User,
  Ruler,
} from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const { user, logout, updateUser, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    phone: '',
  });

  const [isEditingFarmInfo, setIsEditingFarmInfo] = useState(false);
  const [farmInfo, setFarmInfo] = useState({
    name: '',
    size: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || '',
        phone: user.phone || '',
      });
      setFarmInfo(user.farmInfo || {
        name: 'Green Valley Farms',
        size: '120 Hectares',
        latitude: '36.7783',
        longitude: '-119.4179',
      });
    }
  }, [user]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSavePersonalInfo = async () => {
    try {
      await updateUser({ name: personalInfo.name, phone: personalInfo.phone });
      setIsEditingPersonalInfo(false);
      toast({
        title: "Personal Details Saved",
        description: "Your information has been updated.",
      });
    } catch (error) {
      console.error("Failed to save personal info:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your personal details.",
      });
    }
  };

  const handleFarmInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFarmInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveFarmInfo = async () => {
    try {
      await updateUser({ farmInfo });
      setIsEditingFarmInfo(false);
      toast({
        title: "Farm Information Saved",
        description: "Your farm details have been updated.",
      });
    } catch (error) {
      console.error("Failed to save farm info:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your farm information.",
      });
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/signin');
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Profile & Settings" description="Manage your personal information, preferences, and account settings."/>
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Profile & Settings"
        description="Manage your personal information, preferences, and account settings."
      />

      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="https://placehold.co/100x100.png" alt="User avatar" data-ai-hint="person portrait" />
            <AvatarFallback>
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">
              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
            </p>
          </div>
          <Button variant="outline" size="icon">
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit Profile Picture</span>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Details</CardTitle>
              <Button variant="outline" size="sm" onClick={() => isEditingPersonalInfo ? handleSavePersonalInfo() : setIsEditingPersonalInfo(true)}>
                {isEditingPersonalInfo ? 'Save' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingPersonalInfo ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="userName">Full Name</Label>
                    <Input id="userName" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input id="userEmail" name="email" type="email" value={user.email || ''} disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="userPhone">Phone</Label>
                    <Input id="userPhone" name="phone" type="tel" value={personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="+1 (555) 123-4567" />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{user.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{user.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{user.phone || 'N/A'}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Farm Information</CardTitle>
              <Button variant="outline" size="sm" onClick={() => isEditingFarmInfo ? handleSaveFarmInfo() : setIsEditingFarmInfo(true)}>
                {isEditingFarmInfo ? 'Save' : 'Edit'}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditingFarmInfo ? (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="farmName">Farm Name</Label>
                    <Input id="farmName" name="name" value={farmInfo.name} onChange={handleFarmInfoChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input id="farmSize" name="size" value={farmInfo.size} onChange={handleFarmInfoChange} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input id="latitude" name="latitude" value={farmInfo.latitude} onChange={handleFarmInfoChange} placeholder="e.g. 36.7783" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input id="longitude" name="longitude" value={farmInfo.longitude} onChange={handleFarmInfoChange} placeholder="e.g. -119.4179" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Farm Name</span>
                    <span className="font-medium">{user.farmInfo?.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Farm Size</span>
                    <span className="font-medium">{user.farmInfo?.size || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Location</span>
                    {user.farmInfo?.latitude && user.farmInfo?.longitude ? (
                      <Button asChild variant="link" className="p-0 h-auto">
                        <Link href={`https://www.google.com/maps/search/?api=1&query=${user.farmInfo.latitude},${user.farmInfo.longitude}`} target="_blank" rel="noopener noreferrer">
                          <MapPin className="mr-2 h-4 w-4" />
                          View on Map
                        </Link>
                      </Button>
                    ) : (
                      <span className="font-medium">Not Set</span>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button>
                <KeyRound className="mr-2" />
                Change Password
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2" />
                Log Out
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="language">
                  <Globe className="inline-block mr-2 h-4 w-4" />
                  Language
                </Label>
                <Select defaultValue="en-us">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-us">English (US)</SelectItem>
                    <SelectItem value="es-es">Español</SelectItem>
                    <SelectItem value="fr-fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>
                  <Ruler className="inline-block mr-2 h-4 w-4" />
                  Measurement Units
                </Label>
                <RadioGroup defaultValue="metric" className="flex gap-4">
                  <div>
                    <RadioGroupItem value="metric" id="metric" className="peer sr-only" />
                    <Label htmlFor="metric" className="flex items-center justify-center cursor-pointer rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Metric
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="imperial" id="imperial" className="peer sr-only" />
                    <Label htmlFor="imperial" className="flex items-center justify-center cursor-pointer rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Imperial
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="py-2 px-3">
                <ShieldAlert className="mr-2 h-4 w-4 text-primary" />
                142 Alerts Handled
              </Badge>
              <Badge variant="secondary" className="py-2 px-3">
                <LogIn className="mr-2 h-4 w-4 text-primary" />
                Last login: 2h ago
              </Badge>
              <Badge variant="secondary" className="py-2 px-3">
                <Share2 className="mr-2 h-4 w-4 text-primary" />
                6 Nodes Configured
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
