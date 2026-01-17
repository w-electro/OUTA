import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { financeAPI } from '../api/client';
import useAuthStore from '../store/authStore';

export default function Invoices() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [invoices, setInvoices] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newInvoice, setNewInvoice] = useState({
    customer_name: '',
    customer_email: '',
    customer_vat_number: '',
    invoice_type: 'standard',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    line_items: [
      { description: '', quantity: 1, unit_price: 0, tax_rate: 0.15, discount: 0 }
    ],
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await financeAPI.getInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await financeAPI.createInvoice(newInvoice);
      alert('Invoice created successfully!');
      setShowCreateForm(false);
      fetchInvoices();
      // Reset form
      setNewInvoice({
        customer_name: '',
        customer_email: '',
        customer_vat_number: '',
        invoice_type: 'standard',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        line_items: [
          { description: '', quantity: 1, unit_price: 0, tax_rate: 0.15, discount: 0 }
        ],
        notes: ''
      });
    } catch (error) {
      alert('Failed to create invoice: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleApproveInvoice = async (id) => {
    try {
      await financeAPI.approveInvoice(id);
      alert('Invoice approved!');
      fetchInvoices();
    } catch (error) {
      alert('Failed to approve invoice');
    }
  };

  const handleSubmitToZATCA = async (id) => {
    try {
      const response = await financeAPI.submitToZATCA(id);
      alert(`Invoice submitted to ZATCA!\nUUID: ${response.data.zatca_uuid}\nQR Code: ${response.data.qr_code.substring(0, 30)}...`);
      fetchInvoices();
    } catch (error) {
      alert('Failed to submit to ZATCA');
    }
  };

  const addLineItem = () => {
    setNewInvoice({
      ...newInvoice,
      line_items: [
        ...newInvoice.line_items,
        { description: '', quantity: 1, unit_price: 0, tax_rate: 0.15, discount: 0 }
      ]
    });
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...newInvoice.line_items];
    updated[index] = { ...updated[index], [field]: field === 'description' ? value : parseFloat(value) || 0 };
    setNewInvoice({ ...newInvoice, line_items: updated });
  };

  const removeLineItem = (index) => {
    const updated = newInvoice.line_items.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, line_items: updated });
  };

  const calculateTotal = () => {
    return newInvoice.line_items.reduce((total, item) => {
      const subtotal = item.quantity * item.unit_price;
      const taxAmount = (subtotal - item.discount) * item.tax_rate;
      return total + subtotal - item.discount + taxAmount;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600">Manage your invoices and ZATCA submissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                {showCreateForm ? 'Cancel' : '+ Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create Invoice Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Invoice</h2>

            <form onSubmit={handleCreateInvoice} className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newInvoice.customer_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customer_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newInvoice.customer_email}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customer_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    value={newInvoice.customer_vat_number}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customer_vat_number: e.target.value })}
                    placeholder="300000000000003"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Type *
                  </label>
                  <select
                    value={newInvoice.invoice_type}
                    onChange={(e) => setNewInvoice({ ...newInvoice, invoice_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="standard">Standard (B2B)</option>
                    <option value="simplified">Simplified (B2C)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoice.invoice_date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, invoice_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
                  <button
                    type="button"
                    onClick={addLineItem}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    + Add Item
                  </button>
                </div>

                {newInvoice.line_items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-3 p-4 bg-gray-50 rounded-lg">
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.unit_price}
                        onChange={(e) => updateLineItem(index, 'unit_price', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={item.tax_rate}
                        onChange={(e) => updateLineItem(index, 'tax_rate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="0.15">VAT 15%</option>
                        <option value="0">No VAT</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Discount"
                        value={item.discount}
                        onChange={(e) => updateLineItem(index, 'discount', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        min="0"
                        step="0.01"
                      />
                      {newInvoice.line_items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineItem(index)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes and Total */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newInvoice.notes}
                    onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Payment terms, additional information..."
                  ></textarea>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-2">Estimated Total</p>
                    <p className="text-3xl font-bold text-primary-900">
                      SAR {calculateTotal().toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Including 15% VAT</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </form>
          </div>
        )}

        {/* Invoices List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Invoices</h2>
          </div>

          {invoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No invoices yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first invoice to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {invoice.customer_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.invoice_date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        SAR {parseFloat(invoice.total_amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'draft' ? 'bg-gray-200 text-gray-700' :
                          invoice.status === 'approved' ? 'bg-blue-200 text-blue-700' :
                          invoice.status === 'submitted_zatca' ? 'bg-green-200 text-green-700' :
                          invoice.status === 'paid' ? 'bg-purple-200 text-purple-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleApproveInvoice(invoice.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        {invoice.status === 'approved' && (
                          <button
                            onClick={() => handleSubmitToZATCA(invoice.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold"
                          >
                            Submit ZATCA
                          </button>
                        )}
                        {invoice.zatca_uuid && (
                          <span className="text-green-600 text-xs">✅ ZATCA</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
