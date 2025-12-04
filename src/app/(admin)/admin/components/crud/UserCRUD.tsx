"use client";

import { useCallback, useState } from "react";
import { User } from "@/types/api";
import { userService } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Eye, Edit, Trash2, Users, UserCheck, UserX, Crown, Calendar, TrendingUp, Phone, Mail, MapPin, CreditCard, Shield, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface UserCRUDProps {
  searchQuery: string;
}

export default function UserCRUD({ searchQuery }: UserCRUDProps) {
  const [users, setUsers] = useState<User[]>(() => userService.getAll());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  const filteredUsers = users.filter(
    (user) =>
      user.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = useCallback((field: keyof User, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // For select fields
  const handleSelectChange = useCallback((field: keyof User, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  
// Calculate user statistics based on actual fields
const userStats = {
  totalUsers: users.length,
  activeUsers: users.filter(user => user.deleted_at === null).length,
  inactiveUsers: users.filter(user => user.deleted_at !== null).length,
  adminUsers: users.filter(user => user.type === 'admin').length,
  regularUsers: users.filter(user => user.type === 'user').length,
  
  //  month calculation with error handling
  newThisMonth: users.filter(user => {
    try {
      if (!user.created_at) return false;
      const userDate = new Date(user.created_at);
      const currentDate = new Date();
      
      // Compare year and month only 
      return userDate.getFullYear() === currentDate.getFullYear() && 
             userDate.getMonth() === currentDate.getMonth();
    } catch {
      return false;
    }
  }).length,
  
  // New this week
  newThisWeek: users.filter(user => {
    try {
      if (!user.created_at) return false;
      const userDate = new Date(user.created_at);
      const currentDate = new Date();
      const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      return userDate >= oneWeekAgo;
    } catch {
      return false;
    }
  }).length,
  
  // Verification stats
  verifiedPhones: users.filter(user => user.phone_verified === '1').length,
  verifiedEmails: users.filter(user => user.email_verified === '1').length,
  bvnVerified: users.filter(user => user.bvn_verification_status === '1').length,
  ninVerified: users.filter(user => user.nin_verification_status === '1').length,
  
  //  useful metrics
  fullyVerified: users.filter(user => 
    user.phone_verified === '1' && 
    user.email_verified === '1' && 
    user.bvn_verification_status === '1'
  ).length,
  
  pndRestricted: users.filter(user => user.pnd === true).length,
  
  // Level distribution
  level0: users.filter(user => user.level === '0').length,
  level1: users.filter(user => user.level === '1').length,
  level2: users.filter(user => user.level === '2').length,
  level3: users.filter(user => user.level === '3').length,
  level4: users.filter(user => user.level === '4').length,
  level5: users.filter(user => user.level === '5').length,
  
  // Growth rate (percentage)
  growthRate: users.length > 0 ? 
    Math.round(((users.filter(user => {
      try {
        if (!user.created_at) return false;
        const userDate = new Date(user.created_at);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return userDate >= oneMonthAgo;
      } catch {
        return false;
      }
    }).length) / users.length) * 100) : 0
};

const handleCreate = () => {
  const newUser = userService.create({
    // Personal Information
    firstname: editFormData.firstname || "",
    lastname: editFormData.lastname || "",
    middlename: editFormData.middlename || "",
    gender: editFormData.gender || "male",
    type: editFormData.type || "user",
    dob: editFormData.dob || "",

    // Account Information
    username: editFormData.username || "",
    email: editFormData.email || "",
    phone: editFormData.phone || "",
    password: editFormData.password || "",
    pin: editFormData.pin || "",
    level: editFormData.level || "1",

    // Address Information
    house_number: editFormData.house_number || "",
    street: editFormData.street || "",
    city: editFormData.city || "",
    state: editFormData.state || "",
    country: editFormData.country || "",
    zipcode: editFormData.zipcode || "",
    address: editFormData.address || "",

    // Verification Information
    bvn: editFormData.bvn || "",
    nin: editFormData.nin || "",
    bank_provider_id: editFormData.bank_provider_id || "",
    device_code: editFormData.device_code || "",
    referral_code: editFormData.referral_code || `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    referrer_id: editFormData.referrer_id || null,

    // System-generated fields
    uid: `USR-${Date.now()}`,
    
    // Default verification statuses
    phone_verified: editFormData.phone_verified || "0",
    email_verified: editFormData.email_verified || "0",
    bvn_verification_status: editFormData.bvn_verification_status || "0",
    nin_verification_status: editFormData.nin_verification_status || "0",
    
    // Account settings
    pnd: editFormData.pnd || false,

    // Default values for other fields
    photo: null,
    phone_verification_otp: null,
    email_verification_otp: null,
    bvn_data: null,
    nin_data: null,
  });
  
  setUsers([...users, newUser]);
  setEditFormData({});
  setIsCreateDialogOpen(false);
};

  const handleUpdate = () => {
    if (selectedUser && selectedUser.id) {
      userService.update(selectedUser.id, editFormData);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === selectedUser.id ? { ...u, ...editFormData } : u
        )
      );
      setSelectedUser(null);
      setEditFormData({});
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedUser && selectedUser.id) {
      userService.delete(selectedUser.id);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
      setSelectedUser(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewDialogOpen(true);
  };

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setEditFormData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      middlename: user.middlename || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      type: user.type || "user",
      gender: user.gender || "male",
      dob: user.dob || "",
      phone_verified: user.phone_verified || "0",
      email_verified: user.email_verified || "0",
      bvn: user.bvn || "",
      bvn_verification_status: user.bvn_verification_status || "0",
      nin: user.nin || "",
      nin_verification_status: user.nin_verification_status || "0",
      level: user.level || "1",
      pnd: user.pnd || false,
      house_number: user.house_number || "",
      street: user.street || "",
      city: user.city || "",
      state: user.state || "",
      country: user.country || "",
      zipcode: user.zipcode || "",
      address: user.address || "",
      referral_code: user.referral_code || "",
      device_code: user.device_code || "",
      bank_provider_id: user.bank_provider_id || "",
    });
    setIsEditDialogOpen(true);
}, []);

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

const CreateUserForm = () => (
  <div className="space-y-6 max-h-[70vh] overflow-y-auto">
    {/* Personal Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Personal Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name *</label>
          <Input
            placeholder="First Name"
            value={editFormData.firstname || ""}
            onChange={(e) => handleInputChange('firstname', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name *</label>
          <Input
            placeholder="Last Name"
            value={editFormData.lastname || ""}
            onChange={(e) => handleInputChange('lastname', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Middle Name</label>
          <Input
            placeholder="Middle Name"
            value={editFormData.middlename || ""}
            onChange={(e) => handleInputChange('middlename', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <Input
            type="date"
            placeholder="Date of Birth"
            value={editFormData.dob || ""}
            onChange={(e) => handleInputChange('dob', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <Select
            value={editFormData.gender || "male"}
            onValueChange={(value: "male" | "female") => handleSelectChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">User Type *</label>
          <Select
            value={editFormData.type || "user"}
            onValueChange={(value: "user" | "admin") => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    {/* Account Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Account Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username *</label>
          <Input
            placeholder="Username"
            value={editFormData.username || ""}
            onChange={(e) => handleInputChange('username', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email *</label>
          <Input
            type="email"
            placeholder="Email"
            value={editFormData.email || ""}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone *</label>
          <Input
            type="tel"
            placeholder="Phone"
            value={editFormData.phone || ""}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Password *</label>
          <Input
            type="password"
            placeholder="Password"
            value={editFormData.password || ""}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">PIN</label>
          <Input
            type="password"
            placeholder="PIN"
            value={editFormData.pin || ""}
            onChange={(e) => handleInputChange('pin', e.target.value)}
            maxLength={4}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">User Level</label>
          <Select
            value={editFormData.level || "1"}
            onValueChange={(value: "0" | "1" | "2" | "3" | "4" | "5") => handleSelectChange('level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Level 0</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    {/* Address Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Address Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">House Number</label>
          <Input
            placeholder="House Number"
            value={editFormData.house_number || ""}
            onChange={(e) => handleInputChange('house_number', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Street</label>
          <Input
            placeholder="Street"
            value={editFormData.street || ""}
            onChange={(e) => handleInputChange('street', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input
            placeholder="City"
            value={editFormData.city || ""}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Input
            placeholder="State"
            value={editFormData.state || ""}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input
            placeholder="Country"
            value={editFormData.country || ""}
            onChange={(e) => handleInputChange('country', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Zipcode</label>
          <Input
            placeholder="Zipcode"
            value={editFormData.zipcode || ""}
            onChange={(e) => handleInputChange('zipcode', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <label className="text-sm font-medium">Full Address</label>
        <Textarea
          placeholder="Full Address"
          value={editFormData.address || ""}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
    </div>

    {/* Verification Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Verification Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">BVN Number</label>
          <Input
            placeholder="BVN Number"
            value={editFormData.bvn || ""}
            onChange={(e) => handleInputChange('bvn', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NIN Number</label>
          <Input
            placeholder="NIN Number"
            value={editFormData.nin || ""}
            onChange={(e) => handleInputChange('nin', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bank Provider ID</label>
          <Input
            placeholder="Bank Provider ID"
            value={editFormData.bank_provider_id || ""}
            onChange={(e) => handleInputChange('bank_provider_id', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Device Code</label>
          <Input
            placeholder="Device Code"
            value={editFormData.device_code || ""}
            onChange={(e) => handleInputChange('device_code', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Referral Code</label>
          <Input
            placeholder="Referral Code"
            value={editFormData.referral_code || ""}
            onChange={(e) => handleInputChange('referral_code', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Referrer ID</label>
          <Input
            type="number"
            placeholder="Referrer ID"
            value={editFormData.referrer_id || ""}
            onChange={(e) => handleInputChange('referrer_id', e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Account Settings */}
    <div>
      <h4 className="text-sm font-medium mb-3">Account Settings</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">PND Status</label>
          <Select
            value={editFormData.pnd ? "true" : "false"}
            onValueChange={(value: string) => handleSelectChange('pnd', value === "true" ? "true" : "false")}
          >
            <SelectTrigger>
              <SelectValue placeholder="PND Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Restricted (PND)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Verified</label>
          <Select
            value={editFormData.phone_verified || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('phone_verified', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Phone Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Verified</label>
          <Select
            value={editFormData.email_verified || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('email_verified', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Email Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">BVN Verification Status</label>
          <Select
            value={editFormData.bvn_verification_status || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('bvn_verification_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="BVN Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NIN Verification Status</label>
          <Select
            value={editFormData.nin_verification_status || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('nin_verification_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="NIN Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
);

 const EditUserForm = () => (
  <div className="space-y-6 max-h-[70vh] overflow-y-auto">
    {/* Personal Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Personal Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input
            placeholder="First Name"
            value={editFormData.firstname || ""}
            onChange={(e) => handleInputChange('firstname', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input
            placeholder="Last Name"
            value={editFormData.lastname || ""}
            onChange={(e) => handleInputChange('lastname', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Middle Name</label>
          <Input
            placeholder="Middle Name"
            value={editFormData.middlename || ""}
            onChange={(e) => handleInputChange('middlename', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Date of Birth</label>
          <Input
            type="date"
            placeholder="Date of Birth"
            value={editFormData.dob || ""}
            onChange={(e) => handleInputChange('dob', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Gender</label>
          <Select
            value={editFormData.gender || "male"}
            onValueChange={(value: "male" | "female") => handleSelectChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">User Type</label>
          <Select
            value={editFormData.type || "user"}
            onValueChange={(value: "user" | "admin") => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    {/* Contact Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Contact Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Username</label>
          <Input
            placeholder="Username"
            value={editFormData.username || ""}
            onChange={(e) => handleInputChange('username', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="Email"
            value={editFormData.email || ""}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input
            type="tel"
            placeholder="Phone"
            value={editFormData.phone || ""}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Device Code</label>
          <Input
            placeholder="Device Code"
            value={editFormData.device_code || ""}
            onChange={(e) => handleInputChange('device_code', e.target.value)}
          />
        </div>
      </div>
    </div>

    {/* Address Information */}
    <div>
      <h4 className="text-sm font-medium mb-3">Address Information</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">House Number</label>
          <Input
            placeholder="House Number"
            value={editFormData.house_number || ""}
            onChange={(e) => handleInputChange('house_number', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Street</label>
          <Input
            placeholder="Street"
            value={editFormData.street || ""}
            onChange={(e) => handleInputChange('street', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">City</label>
          <Input
            placeholder="City"
            value={editFormData.city || ""}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State</label>
          <Input
            placeholder="State"
            value={editFormData.state || ""}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <Input
            placeholder="Country"
            value={editFormData.country || ""}
            onChange={(e) => handleInputChange('country', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Zipcode</label>
          <Input
            placeholder="Zipcode"
            value={editFormData.zipcode || ""}
            onChange={(e) => handleInputChange('zipcode', e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <label className="text-sm font-medium">Full Address</label>
        <Textarea
          placeholder="Full Address"
          value={editFormData.address || ""}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
    </div>

    {/* Verification & Security */}
    <div>
      <h4 className="text-sm font-medium mb-3">Verification & Security</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">BVN Number</label>
          <Input
            placeholder="BVN Number"
            value={editFormData.bvn || ""}
            onChange={(e) => handleInputChange('bvn', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">BVN Verification Status</label>
          <Select
            value={editFormData.bvn_verification_status || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('bvn_verification_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="BVN Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NIN Number</label>
          <Input
            placeholder="NIN Number"
            value={editFormData.nin || ""}
            onChange={(e) => handleInputChange('nin', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">NIN Verification Status</label>
          <Select
            value={editFormData.nin_verification_status || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('nin_verification_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="NIN Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Verification</label>
          <Select
            value={editFormData.phone_verified || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('phone_verified', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Phone Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email Verification</label>
          <Select
            value={editFormData.email_verified || "0"}
            onValueChange={(value: "0" | "1") => handleSelectChange('email_verified', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Email Verified" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Not Verified</SelectItem>
              <SelectItem value="1">Verified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    {/* Account Settings */}
    <div>
      <h4 className="text-sm font-medium mb-3">Account Settings</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Referral Code</label>
          <Input
            placeholder="Referral Code"
            value={editFormData.referral_code || ""}
            onChange={(e) => handleInputChange('referral_code', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bank Provider ID</label>
          <Input
            placeholder="Bank Provider ID"
            value={editFormData.bank_provider_id || ""}
            onChange={(e) => handleInputChange('bank_provider_id', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">User Level</label>
          <Select
            value={editFormData.level || "1"}
            onValueChange={(value: "0" | "1" | "2" | "3" | "4" | "5") => handleSelectChange('level', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="User Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Level 0</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">PND Status</label>
          <Select
            value={editFormData.pnd ? "true" : "false"}
            onValueChange={(value: string) => handleSelectChange('pnd', value === "true" ? "true" : "false")}
          >
            <SelectTrigger>
              <SelectValue placeholder="PND Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="false">Active</SelectItem>
              <SelectItem value="true">Restricted (PND)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getVerificationBadge = (status?: string) => {
    return status === '1' ? 
      <Badge variant="default" className="text-xs">Verified</Badge> : 
      <Badge variant="secondary" className="text-xs">Not Verified</Badge>;
  };

  const getTypeBadge = (type?: string) => {
    return type === 'admin' ? 
      <Badge variant="default">Admin</Badge> : 
      <Badge variant="secondary">User</Badge>;
  };

  const getStatusBadge = (user: User) => {
    return user.deleted_at ? 
      <Badge variant="destructive">Deleted</Badge> : 
      <Badge variant="default">Active</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.totalUsers > 0 ? Math.round((userStats.activeUsers / userStats.totalUsers) * 100) : 0}% active rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Crown className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{userStats.adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              {userStats.totalUsers > 0 ? Math.round((userStats.adminUsers / userStats.totalUsers) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Phones</CardTitle>
            <Phone className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{userStats.verifiedPhones}</div>
            <p className="text-xs text-muted-foreground">Phone verified users</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BVN Verified</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{userStats.bvnVerified}</div>
            <p className="text-xs text-muted-foreground">BVN verified users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NIN Verified</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{userStats.ninVerified}</div>
            <p className="text-xs text-muted-foreground">NIN verified users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{userStats.newThisMonth}</div>
            <p className="text-xs text-muted-foreground">Recent registrations</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users Management</CardTitle>
            <CardDescription>
              View and manage all system users ({filteredUsers.length})
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleView(user)}
                >
                  <TableCell className="font-medium">
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    {getTypeBadge(user.type)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user)}
                  </TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(user);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(user);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(user);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm />
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>
              Create User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog  open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="min-w-2xl w-full">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete user information and verification status
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6 w-full ">
              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    <p className="text-sm">{selectedUser.firstname || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    <p className="text-sm">{selectedUser.lastname || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Middle Name</label>
                    <p className="text-sm">{selectedUser.middlename || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-sm capitalize">{selectedUser.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <p className="text-sm">{selectedUser.dob || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Type</label>
                    {getTypeBadge(selectedUser.type)}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-sm">{selectedUser.username || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedUser.email || 'N/A'}</p>
                      {getVerificationBadge(selectedUser.email_verified)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedUser.phone || 'N/A'}</p>
                      {getVerificationBadge(selectedUser.phone_verified)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">UID</label>
                    <p className="text-sm font-mono">{selectedUser.uid || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">Address Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm">{selectedUser.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-sm">{selectedUser.city || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-sm">{selectedUser.state || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-sm">{selectedUser.country || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <h4 className="text-sm font-medium mb-3">Verification Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">BVN Verification</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedUser.bvn ? '***' + selectedUser.bvn.slice(-4) : 'Not Provided'}</p>
                      {getVerificationBadge(selectedUser.bvn_verification_status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">NIN Verification</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm">{selectedUser.nin ? '***' + selectedUser.nin.slice(-4) : 'Not Provided'}</p>
                      {getVerificationBadge(selectedUser.nin_verification_status)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Level</label>
                    <Badge variant="outline">Level {selectedUser.level}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">PND Status</label>
                    <Badge variant={selectedUser.pnd ? "destructive" : "default"}>
                      {selectedUser.pnd ? 'Restricted' : 'Active'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div>
                <h4 className="text-sm font-medium mb-3">System Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm">{formatDate(selectedUser.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{formatDate(selectedUser.updated_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Referral Code</label>
                    <p className="text-sm font-mono">{selectedUser.referral_code || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Device Code</label>
                    <p className="text-sm font-mono">{selectedUser.device_code || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit User - {selectedUser?.firstname} {selectedUser?.lastname}</DialogTitle>
            <DialogDescription>
              Update all user information and settings
            </DialogDescription>
          </DialogHeader>
          <EditUserForm />
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="gap-2">
              <Save className="h-4 w-4" />
              Update User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedUser.firstname} {selectedUser.lastname}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}