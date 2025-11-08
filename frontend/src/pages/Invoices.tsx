import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, Filter, FileText, Eye, Download } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Invoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const userId = localStorage.getItem("token"); // store userId on login

  // Fetch invoices from backend
  useEffect(() => {
    if (!userId) return navigate("/auth");

    const fetchInvoices = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/invoices/all/${userId}`);
        setInvoices(res.data.invoices);
      } catch (error) {
        console.error(error);
        alert("Error fetching invoices");
      }
    };
    fetchInvoices();
  }, []);

  // Save invoice to DB
  const handleCreateInvoice = async () => {
    if (!clientName || !amount) return alert("Client name and amount are required");

    try {
      const invoiceData = {
        user: userId,
        clientName,
        amount,
        description,
        category: "development",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(new Date().getTime() + 7*24*60*60*1000).toISOString().split("T")[0] // +7 days
      };
      const res = await axios.post("http://localhost:5000/api/invoices/create", invoiceData);
      setInvoices([res.data.invoice, ...invoices]); // update state
      setClientName("");
      setAmount("");
      setDescription("");
      alert("Invoice saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Error saving invoice");
    }
  };

  // Filters
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice._id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || invoice.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      development: "bg-blue-400",
      design: "bg-pink-400",
      consulting: "bg-purple-400",
      marketing: "bg-yellow-400",
      other: "bg-gray-400"
    };
    return colors[category] || "bg-gray-300";
  };

  const getStatusVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      paid: "default",
      pending: "secondary",
      overdue: "destructive"
    };
    return variants[status] || "outline";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2"/> Back</Button>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Create Invoice */}
        <Card className="border-border/50 mb-6 p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Invoice</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
            <Input type="number" placeholder="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button onClick={handleCreateInvoice} className="mt-4">Save Invoice</Button>
        </Card>

        {/* Filters */}
        <Card className="border-border/50 mb-6">
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by client or ID" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]"><Filter className="w-4 h-4 mr-2"/><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Invoice List */}
        <div className="grid gap-4">
          {filteredInvoices.map(invoice => (
            <Card key={invoice._id} className="border-border/50 hover:shadow-md transition-all">
              <CardContent className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-16 rounded-full ${getCategoryColor(invoice.category)}`}/>
                  <div>
                    <h3 className="font-semibold">{invoice._id}</h3>
                    <p className="text-muted-foreground">{invoice.clientName}</p>
                    <div className="text-sm text-muted-foreground mt-1">Due: {invoice.dueDate}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">{invoice.amount}</div>
                    <div className="text-xs text-muted-foreground">{invoice.category}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon"><Eye className="w-4 h-4"/></Button>
                    <Button variant="outline" size="icon"><Download className="w-4 h-4"/></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredInvoices.length === 0 && <p className="text-center text-muted-foreground mt-6">No invoices found</p>}
        </div>
      </main>
    </div>
  );
};

export default Invoices;
