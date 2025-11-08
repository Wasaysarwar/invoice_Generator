import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Send, Download, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface CustomColumn {
  id: string;
  name: string;
  type: 'text' | 'number';
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  customFields: Record<string, string | number>;
}

export const CreateInvoiceDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [customColumns, setCustomColumns] = useState<CustomColumn[]>([]);
  const [newColumnName, setNewColumnName] = useState("");
  const [newColumnType, setNewColumnType] = useState<'text' | 'number'>('text');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, amount: 0, customFields: {} }
  ]);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    invoiceNumber: "",
    date: new Date().toISOString().split('T')[0],
    dueDate: "",
    category: "",
    notes: ""
  });

  const addCustomColumn = () => {
    if (!newColumnName.trim()) {
      toast({
        title: "Column name required",
        description: "Please enter a column name",
        variant: "destructive"
      });
      return;
    }
    const newCol: CustomColumn = {
      id: Date.now().toString(),
      name: newColumnName.trim(),
      type: newColumnType
    };
    setCustomColumns([...customColumns, newCol]);
    setNewColumnName("");
    setNewColumnType('text');
  };

  const removeCustomColumn = (id: string) => {
    setCustomColumns(customColumns.filter(col => col.id !== id));
    setItems(items.map(item => {
      const { [id]: removed, ...rest } = item.customFields;
      return { ...item, customFields: rest };
    }));
  };

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      customFields: {}
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const updateCustomField = (itemId: string, columnId: string, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          customFields: { ...item.customFields, [columnId]: value }
        };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const total = calculateTotal();

    // Header
    doc.setFontSize(24);
    doc.text("INVOICE", 20, 20);
    
    // Invoice details
    doc.setFontSize(12);
    doc.text(`Invoice #: ${formData.invoiceNumber}`, 20, 35);
    doc.text(`Date: ${formData.date}`, 20, 42);
    doc.text(`Due Date: ${formData.dueDate}`, 20, 49);
    if (formData.category) {
      doc.text(`Category: ${formData.category}`, 20, 56);
    }
    
    // Client details
    doc.text(`Bill To:`, 20, 70);
    doc.text(formData.clientName, 20, 77);
    if (formData.clientEmail) {
      doc.text(formData.clientEmail, 20, 84);
    }
    
    // Items table header
    let xPos = 20;
    const colWidth = customColumns.length > 0 ? 35 : 50;
    doc.setFontSize(10);
    doc.text("Description", xPos, 100);
    xPos += colWidth;
    
    // Custom columns headers
    customColumns.forEach(col => {
      doc.text(col.name, xPos, 100);
      xPos += colWidth;
    });
    
    doc.text("Qty", xPos, 100);
    xPos += 20;
    doc.text("Rate", xPos, 100);
    xPos += 25;
    doc.text("Amount", xPos, 100);
    
    // Items
    let yPos = 110;
    items.forEach(item => {
      xPos = 20;
      doc.text(item.description || "-", xPos, yPos);
      xPos += colWidth;
      
      // Custom fields
      customColumns.forEach(col => {
        const value = item.customFields[col.id] || "-";
        doc.text(String(value), xPos, yPos);
        xPos += colWidth;
      });
      
      doc.text(item.quantity.toString(), xPos, yPos);
      xPos += 20;
      doc.text(`$${item.rate.toFixed(2)}`, xPos, yPos);
      xPos += 25;
      doc.text(`$${item.amount.toFixed(2)}`, xPos, yPos);
      yPos += 10;
    });
    
    // Total
    doc.setFontSize(14);
    doc.text(`Total: $${total.toFixed(2)}`, 150, yPos + 10);
    
    // Notes
    if (formData.notes) {
      doc.setFontSize(10);
      doc.text("Notes:", 20, yPos + 25);
      const splitNotes = doc.splitTextToSize(formData.notes, 170);
      doc.text(splitNotes, 20, yPos + 32);
    }
    
    doc.save(`invoice-${formData.invoiceNumber}.pdf`);
    
    toast({
      title: "PDF Generated",
      description: `Invoice ${formData.invoiceNumber} has been saved successfully`,
    });
  };

  const sendEmail = () => {
    // This would require Lovable Cloud backend
    toast({
      title: "Email Feature",
      description: "Connect Lovable Cloud to enable email sending",
      variant: "destructive"
    });
  };

  const handleSubmit = (action: 'save' | 'email') => {
    if (!formData.clientName || !formData.invoiceNumber || !formData.dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (action === 'email') {
      sendEmail();
    } else {
      generatePDF();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" size="lg">Create New Invoice</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Fill in the details and add line items. You can download as PDF or send via email.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                placeholder="INV-001"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="date">Invoice Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          {/* Custom Columns */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <Label className="text-sm font-semibold mb-3 block">Custom Columns</Label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Column name (e.g., Hours, Tax, Discount)"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                className="flex-1"
              />
              <Select value={newColumnType} onValueChange={(value: 'text' | 'number') => setNewColumnType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={addCustomColumn}>
                <Plus className="w-4 h-4 mr-2" />
                Add Column
              </Button>
            </div>
            {customColumns.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customColumns.map(col => (
                  <div key={col.id} className="flex items-center gap-2 bg-background px-3 py-1 rounded-md border">
                    <span className="text-sm">{col.name} ({col.type})</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => removeCustomColumn(col.id)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Line Items</Label>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
            
            <div className="space-y-3 overflow-x-auto">
              <div className="min-w-[800px]">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-end mb-3">
                    <div className="flex-1 min-w-[150px]">
                      <Input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </div>
                    {customColumns.map(col => (
                      <div key={col.id} className="w-32">
                        <Input
                          type={col.type}
                          placeholder={col.name}
                          value={item.customFields[col.id] || ''}
                          onChange={(e) => updateCustomField(
                            item.id, 
                            col.id, 
                            col.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
                          )}
                        />
                      </div>
                    ))}
                    <div className="w-24">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        type="number"
                        placeholder="Rate"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="w-28">
                      <Input
                        value={`$${item.amount.toFixed(2)}`}
                        readOnly
                        className="bg-muted"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-2xl font-bold">${calculateTotal().toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or payment terms..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={() => handleSubmit('email')}>
              <Send className="w-4 h-4 mr-2" />
              Send Email
            </Button>
            <Button onClick={() => handleSubmit('save')}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
