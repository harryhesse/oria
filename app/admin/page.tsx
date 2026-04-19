import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DashboardCard
        title="Events"
        subtitle="Total Events"
        body="24 events created"
      />

      <DashboardCard
        title="Bookings"
        subtitle="Total Bookings"
        body="132 bookings made"
      />

      <DashboardCard
        title="Users"
        subtitle="Registered Users"
        body="58 users joined"
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
