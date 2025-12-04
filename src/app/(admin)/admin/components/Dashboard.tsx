import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', color: 'blue' },
    { label: 'Total Posts', value: '567', change: '+8%', color: 'green' },
    { label: 'Revenue', value: '₦12,456', change: '+23%', color: 'purple' },
    { label: 'Active Sessions', value: '89', change: '-2%', color: 'orange' }
  ];

  const recentActivities = [
    { action: 'New user registration', user: 'john_doe', time: '2 minutes ago' },
    { action: 'Post published', user: 'jane_smith', time: '5 minutes ago' },
    { action: 'Payment processed', user: 'mike_johnson', time: '10 minutes ago' },
    { action: 'User profile updated', user: 'sarah_wilson', time: '15 minutes ago' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Badge variant={stat.change.startsWith('+') ? 'default' : 'secondary'}>
                {stat.change}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                From last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">by {activity.user}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Add User', icon: '👤', color: 'blue' },
                { label: 'Create Post', icon: '📝', color: 'green' },
                { label: 'View Reports', icon: '📊', color: 'purple' },
                { label: 'Settings', icon: '⚙️', color: 'gray' }
              ].map((action, index) => (
                <Card key={index} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <p className="text-sm font-medium">{action.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}