import { useState, useEffect } from "react";
import { 
  ShoppingBag, Plus, Trash2, MessageCircle, Check, 
  ExternalLink, Sparkles, Tag, DollarSign, Image, Eye
} from "lucide-react";
import { cn } from "../lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  imageUrl: string;
  inStock: boolean;
}

export function WhatsAppStoreView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [storeName, setStoreName] = useState("AETHER Cyber Gear");
  const [description, setDescription] = useState("Official enterprise merchandise, HSM cold key fobs, and AI compute vouchers.");
  const [whatsappNumber, setWhatsappNumber] = useState("+15550192834");
  const [currency, setCurrency] = useState("USD");
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New product form
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("Hardware");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80");
  const [cart, setCart] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const fetchStoreData = async () => {
    try {
      const [sRes, pRes] = await Promise.all([
        fetch("/api/whatsapp/store"),
        fetch("/api/whatsapp/products")
      ]);
      const store = await sRes.json();
      const prods = await pRes.json();
      if (store.storeName) setStoreName(store.storeName);
      if (store.description) setDescription(store.description);
      if (store.whatsappNumber) setWhatsappNumber(store.whatsappNumber);
      setProducts(Array.isArray(prods) ? prods : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStoreData();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice) return;
    try {
      const res = await fetch("/api/whatsapp/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          price: parseFloat(newPrice),
          category: newCategory,
          description: newDescription,
          imageUrl: newImage,
          inStock: true
        })
      });
      if (res.ok) {
        const prod = await res.json();
        setProducts([prod, ...products]);
        setShowAddModal(false);
        setNewName("");
        setNewPrice("");
        setNewDescription("");
        showToast("Product added to WhatsApp catalog");
      }
    } catch (e) {
      showToast("Error creating product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/whatsapp/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        showToast("Product removed from catalog");
      }
    } catch (e) {
      showToast("Delete failed");
    }
  };

  const toggleCart = (id: string) => {
    if (cart.includes(id)) {
      setCart(cart.filter(i => i !== id));
    } else {
      setCart([...cart, id]);
    }
  };

  const generateWhatsAppOrderLink = () => {
    const selectedItems = products.filter(p => cart.includes(p.id));
    const total = selectedItems.reduce((acc, p) => acc + p.price, 0);
    const itemList = selectedItems.map(p => `• ${p.name} ($${p.price.toFixed(2)})`).join("\n");
    
    const message = `Hello ${storeName}! I would like to place an order:\n\n${itemList || "• Inquiry on available catalog inventory"}\n\nTotal: $${total.toFixed(2)} ${currency}\n\nPlease confirm availability and payment options.`;
    
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanNumber || "15550192834"}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-6 sm:p-8 border-emerald-500/20 shadow-[0_0_30px_rgba(0,255,157,0.1)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono tracking-wider uppercase mb-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Direct WhatsApp Commerce & Catalog Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
              WhatsApp <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">Commerce Store</span>
            </h1>
            <p className="text-gray-400 text-sm max-w-2xl">
              Build high-converting social commerce storefronts, synchronize product inventories, and enable 1-click WhatsApp order checkouts.
            </p>
          </div>

          <a
            href={generateWhatsAppOrderLink()}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,255,157,0.4)] transition-all flex items-center space-x-2 flash-effect shrink-0"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Test WhatsApp Checkout ({cart.length})</span>
          </a>
        </div>
      </div>

      {toastMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          {toastMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Catalog Products ({products.length})
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Product</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((p) => {
              const inCart = cart.includes(p.id);
              return (
                <div key={p.id} className="glass-panel rounded-3xl p-4 space-y-3 border border-white/5 relative group flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-36 rounded-2xl overflow-hidden bg-black/60 relative border border-white/10">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded-full bg-black/70 text-emerald-300 border border-white/10">
                        {p.category}
                      </span>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-xs text-white line-clamp-1">{p.name}</h4>
                        <span className="font-mono text-xs font-bold text-emerald-400">${p.price.toFixed(2)}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 font-mono">{p.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCart(p.id)}
                    className={cn(
                      "w-full py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center space-x-1.5",
                      inCart
                        ? "bg-emerald-500 text-black"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    )}
                  >
                    {inCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                    <span>{inCart ? "In Order Cart" : "Add to Order"}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Settings & Live Order Mockup */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Storefront Directives
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">WhatsApp Business Line</label>
                <input
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-400"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>USDC (Stable)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md glass-panel-glow p-6 sm:p-7 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Catalog Item</h3>
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">Item Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Key Custody Fob"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="49.99"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-400"
                  >
                    <option>Hardware</option>
                    <option>Subscriptions</option>
                    <option>Identity</option>
                    <option>Merchandise</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl p-2.5 text-white outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-extrabold"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
