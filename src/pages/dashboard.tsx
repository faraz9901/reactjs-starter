import { UsersTable } from "@/features/users";
import { useAuth } from "@/features/auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Private route — signed in as <span className="font-medium">{user?.email}</span>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
          <CardDescription>
            Example feature module: ENDPOINTS → api.get → React Query → AsyncState → Table.
          </CardDescription>
        </CardHeader>
      </Card>

      <UsersTable />
    </div>
  );
}
