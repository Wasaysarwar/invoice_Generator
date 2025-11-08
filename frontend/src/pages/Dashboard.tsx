import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, TrendingUp, DollarSign, Clock, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreateInvoiceDialog } from "@/components/CreateInvoiceDialog";

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

  const stats = [
    { title: "Total Invoices", value: "24", change: "+12%", icon: FileText, color: "text-primary" },
    { title: "Paid Invoices", value: "18", change: "+8%", icon: TrendingUp, color: "text-success" },
    { title: "Total Revenue", value: "$45,231", change: "+23%", icon: DollarSign, color: "text-accent" },
    { title: "Pending", value: "6", change: "+4", icon: Clock, color: "text-warning" }
  ];

  const recentInvoices = [
    { id: "INV-001", client: "Tech Corp", amount: "$2,500", status: "paid", category: "development", date: "2025-10-28" },
    { id: "INV-002", client: "Design Studio", amount: "$1,800", status: "pending", category: "design", date: "2025-10-27" },
    { id: "INV-003", client: "Marketing Agency", amount: "$3,200", status: "paid", category: "consulting", date: "2025-10-25" },
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      development: "bg-category-development",
      design: "bg-category-design",
      consulting: "bg-category-consulting",
      marketing: "bg-category-marketing",
      other: "bg-category-other"
    };
    return colors[category] || "bg-muted";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              InvoiceHub
            </h1>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-border/50 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-sm">{stat.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-success mt-1">{stat.change} from last month</div>
                    </div>
                    <div className={`${stat.color} opacity-80`}>
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/invoices">
              <Button variant="hero" size="lg">
                View All Invoices
              </Button>
            </Link>
            <CreateInvoiceDialog />

            <Link to="/profile">
              <Button variant="outline" size="lg">
                Edit Company Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Invoices */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Your latest invoice activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-card border border-border/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-12 rounded-full ${getCategoryColor(invoice.category)}`} />
                    <div>
                      <div className="font-semibold">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground">{invoice.client}</div>
                      <div className="text-xs text-muted-foreground mt-1">{invoice.date}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{invoice.amount}</div>
                    <div
                      className={`text-sm capitalize ${
                        invoice.status === "paid" ? "text-success" : "text-warning"
                      }`}
                    >
                      {invoice.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/invoices">
              <Button variant="ghost" className="w-full mt-4">
                View All Invoices
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
