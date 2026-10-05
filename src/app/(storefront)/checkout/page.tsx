"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/modules/order/context/cart-context";
import { formatCurrency } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ShieldCheck, Plus, CheckCircle2, Lock, ArrowRight, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, grandTotal, subTotal, taxTotal, clearCart } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Address Form State
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");
  const [streetLine1, setStreetLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoadingAddresses(true);
      const res = await fetch("/api/v1/auth/addresses");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setAddresses(json.data);
          if (json.data.length > 0) {
            setSelectedAddressId(json.data[0].id);
          } else {
            setShowNewAddressForm(true);
          }
        }
      }
    } catch (e) {
      console.error("Could not fetch addresses", e);
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/auth/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientName,
          phone,
          streetLine1,
          city,
          state: stateName,
          postalCode,
          country: "India",
          isDefaultShipping: true,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAddresses([json.data, ...addresses]);
        setSelectedAddressId(json.data.id);
        setShowNewAddressForm(false);
      } else {
        setErrorMessage(json.error?.message || "Failed to save address");
      }
    } catch (err) {
      setErrorMessage("Network error saving delivery address");
    }
  };

  const handlePayNow = async () => {
    if (!selectedAddressId) {
      setErrorMessage("Please select or add a delivery address");
      return;
    }

    try {
      setIsProcessingPayment(true);
      setErrorMessage(null);

      // 1. Create Checkout Session & Order Token
      const res = await fetch("/api/v1/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shippingAddressId: selectedAddressId,
          items: items.map((i) => ({ variantId: i.id, quantity: i.quantity })),
        }),
      });

      const session = await res.json();
      if (!res.ok || !session.success) {
        setErrorMessage(session.error?.message || "Failed to initialize checkout order");
        setIsProcessingPayment(false);
        return;
      }

      const orderData = session.data;

      // 2. Launch Razorpay Modal (or simulate success in test environment)
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amountInPaise,
        currency: "INR",
        name: "LUXE",
        description: `Order ${orderData.orderNumber}`,
        order_id: orderData.razorpayOrderId?.startsWith("order_mock") ? undefined : orderData.razorpayOrderId,
        handler: async function (response: any) {
          // Verify payment with server
          const verifyRes = await fetch("/api/v1/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: orderData.orderId,
              razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
              razorpayPaymentId: response.razorpay_payment_id || `pay_mock_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || "signature_mock",
            }),
          });

          const verifyJson = await verifyRes.json();
          if (verifyJson.success) {
            clearCart();
            router.push(`/order-success/${orderData.orderNumber}`);
          } else {
            setErrorMessage("Payment verification failed. Please contact support.");
          }
        },
        theme: {
          color: "#121212",
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Direct simulation for local test environment
        options.handler({
          razorpay_order_id: orderData.razorpayOrderId,
          razorpay_payment_id: `pay_simulated_${Date.now()}`,
          razorpay_signature: "simulated_valid_signature",
        });
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred during payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-5">
        <h2 className="text-3xl font-serif font-bold text-[#121212]">Your Bag is Empty</h2>
        <p className="text-sm text-[#78716c] font-light">Add pieces to your bag before proceeding to checkout.</p>
        <Link href="/shop" className="inline-block px-8 py-3.5 bg-[#121212] hover:bg-black text-white rounded-full font-medium text-sm transition">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-[#8c857b] font-semibold">Checkout Process</span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#121212] mt-1">
            Secure Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Delivery Address (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#eae6df] shadow-sm space-y-5">
              <div className="flex justify-between items-center pb-3 border-b border-[#eae6df]">
                <h3 className="text-lg font-serif font-bold text-[#121212] flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#121212]" />
                  <span>1. Delivery Address</span>
                </h3>
                {!showNewAddressForm && (
                  <button
                    onClick={() => setShowNewAddressForm(true)}
                    className="text-xs font-semibold text-[#121212] underline underline-offset-4 hover:opacity-80"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {/* Saved Addresses List */}
              {!showNewAddressForm && (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between ${
                        selectedAddressId === addr.id
                          ? "border-[#121212] bg-[#f5f2eb]/60 shadow-sm"
                          : "border-[#eae6df] hover:border-[#121212]"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#121212]">
                            {addr.recipientName}
                          </span>
                          <span className="text-xs text-[#78716c]">({addr.phone})</span>
                        </div>
                        <p className="text-xs text-[#57534e] mt-1 font-light">
                          {addr.streetLine1}, {addr.city}, {addr.state} — {addr.postalCode}
                        </p>
                      </div>
                      {selectedAddressId === addr.id && (
                        <CheckCircle2 className="w-5 h-5 text-[#121212] flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* New Address Input Form */}
              {showNewAddressForm && (
                <form onSubmit={handleCreateAddress} className="space-y-3.5 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#57534e]">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-[#eae6df] bg-[#fafaf8] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#57534e]">10-Digit Phone</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-[#eae6df] bg-[#fafaf8] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#57534e]">Street Address</label>
                    <input
                      type="text"
                      required
                      value={streetLine1}
                      onChange={(e) => setStreetLine1(e.target.value)}
                      placeholder="Apartment, Street Name"
                      className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-[#eae6df] bg-[#fafaf8] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-[#57534e]">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-[#eae6df] bg-[#fafaf8] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#57534e]">State (for GST)</label>
                      <input
                        type="text"
                        required
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-[#eae6df] bg-[#fafaf8] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#57534e]">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="560001"
                        className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-[#eae6df] bg-[#fafaf8] text-[#121212] focus:outline-none focus:ring-2 focus:ring-[#121212]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#121212] hover:bg-black text-white rounded-full text-xs font-medium transition"
                    >
                      Save Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-5 py-2.5 bg-[#f5f2eb] text-[#57534e] hover:text-[#121212] rounded-full text-xs font-medium transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* Payment Method Badge */}
            <div className="p-6 rounded-3xl bg-white border border-[#eae6df] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#f5f2eb] border border-[#eae6df] flex items-center justify-center text-[#121212]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-[#121212]">
                    256-Bit Encrypted Payment Gateway
                  </h4>
                  <p className="text-xs text-[#78716c] font-light">Supports UPI, Google Pay, PhonePe, Cards, NetBanking</p>
                </div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            </div>
          </div>

          {/* Right Column: Order & Tax Summary (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#eae6df] shadow-sm space-y-5">
              <h3 className="text-lg font-serif font-bold text-[#121212] pb-3 border-b border-[#eae6df]">
                Order Summary
              </h3>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#121212]">{item.productTitle}</span>
                      <span className="text-[#8c857b]">({item.size} • {item.colorName} × {item.quantity})</span>
                    </div>
                    <span className="font-semibold text-[#121212]">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tax & Total Calculations */}
              <div className="pt-4 border-t border-[#eae6df] space-y-2.5 text-xs text-[#57534e]">
                <div className="flex justify-between">
                  <span>Taxable Base Amount</span>
                  <span className="font-medium text-[#121212]">{formatCurrency(subTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Statutory GST (Included)</span>
                  <span className="font-medium text-[#121212]">{formatCurrency(taxTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charges</span>
                  <span className="font-semibold text-emerald-700">FREE</span>
                </div>

                <div className="pt-3 border-t border-[#eae6df] flex justify-between text-base font-serif font-bold text-[#121212]">
                  <span>Total Payable</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePayNow}
                disabled={isProcessingPayment || !selectedAddressId}
                className="w-full py-3.5 bg-[#121212] hover:bg-black text-white rounded-full font-medium text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50 mt-2"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Pay {formatCurrency(grandTotal)} Securely</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
