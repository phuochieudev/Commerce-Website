import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { authService } from '@services/auth.service';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '@hooks/useAddresses';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Checkbox } from '@components/ui/checkbox';
import { Badge } from '@components/ui/badge';
import { Loader2, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { getInitials } from '@utils/format';
import { toast } from 'sonner';
import type { User } from '../types/auth';
import type { UserAddress } from '../types/address';

function getErrorMessage(err: any, fallback: string) {
  return err?.response?.data?.message || fallback;
}

const editProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
});
type EditProfileFormData = z.infer<typeof editProfileSchema>;

const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const addressSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  recipientName: z.string().min(1, 'Recipient name is required'),
  phone: z.string().min(8, 'A valid phone number is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  isDefault: z.boolean().optional(),
});
type AddressFormData = z.infer<typeof addressSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [addressDialog, setAddressDialog] = useState<{ mode: 'add' | 'edit'; address?: UserAddress } | null>(null);

  const { data: addresses, isLoading: isAddressesLoading } = useAddresses(!!user);
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();

  const editForm = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const currentUser = user;

  useEffect(() => {
    if (editOpen && currentUser) {
      editForm.reset({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        phone: currentUser.phone ?? '',
        address: currentUser.address ?? '',
        gender: currentUser.gender,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOpen]);

  useEffect(() => {
    if (passwordOpen) {
      passwordForm.reset({ oldPassword: '', newPassword: '', confirmPassword: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passwordOpen]);

  if (!user || !currentUser) {
    navigate('/login');
    return null;
  }

  const fullName = `${currentUser.firstName} ${currentUser.lastName}`.trim();

  const onSubmitEdit = async (data: EditProfileFormData) => {
    setIsSavingProfile(true);
    try {
      const payload: Partial<User> = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || undefined,
        address: data.address || undefined,
        gender: data.gender,
      };
      await authService.updateProfile(payload);
      const refreshed = await authService.getProfile();
      setUser(refreshed);
      toast.success('Profile updated successfully');
      setEditOpen(false);
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Failed to update profile'));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const onSubmitPassword = async (data: ChangePasswordFormData) => {
    setIsSavingPassword(true);
    try {
      await authService.changePassword(data.oldPassword, data.newPassword);
      toast.success('Password changed successfully');
      passwordForm.reset();
      setPasswordOpen(false);
    } catch (err: any) {
      toast.error(getErrorMessage(err, 'Failed to change password'));
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser.avatar} alt={fullName} />
                  <AvatarFallback className="text-lg">{getInitials(fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{fullName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Phone</p>
                  <p className="mt-1 text-base">{currentUser.phone || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Address</p>
                  <p className="mt-1 text-base">{currentUser.address || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Gender</p>
                  <p className="mt-1 text-base capitalize">{currentUser.gender || '—'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Role</p>
                  <p className="mt-1 text-base capitalize">{currentUser.role}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setEditOpen(true)}>Edit Profile</Button>
                  <Button variant="outline" onClick={() => setPasswordOpen(true)}>
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setAddressDialog({ mode: 'add' })}>
                <Plus className="mr-2 h-4 w-4" />
                Add Address
              </Button>
            </div>

            {isAddressesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : addresses && addresses.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                  <Card key={addr.id}>
                    <CardContent className="space-y-2 pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {addr.title}
                        </div>
                        {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addr.recipientName} · {addr.phone}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {addr.address}, {addr.city}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {!addr.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={setDefaultAddress.isPending}
                            onClick={() => setDefaultAddress.mutate(addr.id)}
                          >
                            <Star className="mr-1 h-3 w-3" />
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAddressDialog({ mode: 'edit', address: addr })}
                        >
                          <Pencil className="mr-1 h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          disabled={deleteAddress.isPending}
                          onClick={() => {
                            if (window.confirm('Delete this address?')) deleteAddress.mutate(addr.id);
                          }}
                        >
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">No saved addresses yet</CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName">First Name</Label>
                <Input id="editFirstName" {...editForm.register('firstName')} />
                {editForm.formState.errors.firstName && (
                  <p className="text-xs text-destructive">{editForm.formState.errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName">Last Name</Label>
                <Input id="editLastName" {...editForm.register('lastName')} />
                {editForm.formState.errors.lastName && (
                  <p className="text-xs text-destructive">{editForm.formState.errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="editPhone">Phone</Label>
              <Input id="editPhone" {...editForm.register('phone')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="editAddress">Address</Label>
              <Input id="editAddress" {...editForm.register('address')} />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Controller
                control={editForm.control}
                name="gender"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingProfile}>
                {isSavingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input id="oldPassword" type="password" {...passwordForm.register('oldPassword')} />
              {passwordForm.formState.errors.oldPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.oldPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" {...passwordForm.register('newPassword')} />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input id="confirmPassword" type="password" {...passwordForm.register('confirmPassword')} />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPasswordOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingPassword}>
                {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Address Dialog */}
      {addressDialog && (
        <AddressFormDialog
          key={addressDialog.address?.id ?? 'new'}
          mode={addressDialog.mode}
          initial={addressDialog.address}
          onClose={() => setAddressDialog(null)}
          onSubmit={async (data) => {
            try {
              if (addressDialog.mode === 'edit' && addressDialog.address) {
                await updateAddress.mutateAsync({ id: addressDialog.address.id, data });
              } else {
                await createAddress.mutateAsync(data);
              }
              setAddressDialog(null);
            } catch {
              // the mutation hooks already surface an error toast
            }
          }}
        />
      )}
    </div>
  );
}

function AddressFormDialog({
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  mode: 'add' | 'edit';
  initial?: UserAddress;
  onClose: () => void;
  onSubmit: (data: AddressFormData) => Promise<void>;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      title: initial?.title ?? '',
      recipientName: initial?.recipientName ?? '',
      phone: initial?.phone ?? '',
      address: initial?.address ?? '',
      city: initial?.city ?? '',
      isDefault: initial?.isDefault ?? false,
    },
  });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === 'add' ? 'Add Address' : 'Edit Address'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="addrTitle">Title</Label>
            <Input id="addrTitle" placeholder="Home, Office..." {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addrRecipient">Recipient Name</Label>
            <Input id="addrRecipient" {...register('recipientName')} />
            {errors.recipientName && <p className="text-xs text-destructive">{errors.recipientName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addrPhone">Phone</Label>
            <Input id="addrPhone" {...register('phone')} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addrAddress">Address</Label>
            <Input id="addrAddress" {...register('address')} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="addrCity">City</Label>
            <Input id="addrCity" {...register('city')} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name="isDefault"
              render={({ field }) => (
                <Checkbox id="addrIsDefault" checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <Label htmlFor="addrIsDefault">Set as default address</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
