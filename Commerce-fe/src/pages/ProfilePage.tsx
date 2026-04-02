import { useAuthStore } from '@store/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
              <p className="mt-1 text-lg">{user.fullName}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Email</label>
              <p className="mt-1 text-lg">{user.email}</p>
            </div>

            {user.phone && (
              <div>
                <label className="text-sm font-semibold text-muted-foreground">Phone</label>
                <p className="mt-1 text-lg">{user.phone}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-muted-foreground">Role</label>
              <p className="mt-1 text-lg capitalize">{user.role}</p>
            </div>

            <div className="mt-6 flex gap-2">
              <Button>Edit Profile</Button>
              <Button variant="outline">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
