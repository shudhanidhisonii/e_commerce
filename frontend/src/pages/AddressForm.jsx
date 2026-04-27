import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  addAddress,
  deleteAddress,
  setCart,
  setSelectedAddress,
} from "@/redux/productSlice";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, addresses, selectedAddress } = useSelector(
    (store) => store.product
  );

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SAVE ADDRESS ================= */

  const handleSave = () => {
    if (!formData.fullName || !formData.phone || !formData.address) {
      toast.error("Please fill all required fields");
      return;
    }

    dispatch(addAddress(formData));
    dispatch(setSelectedAddress(addresses.length));
    resetForm();
  };

  /* ================= EDIT ADDRESS ================= */

  const handleEdit = (addr, index) => {
    setFormData(addr);
    setEditIndex(index);
    setShowForm(true);
  };

  /* ================= RESET FORM ================= */

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    });

    setEditIndex(null);
    setShowForm(false);
  };

  /* ================= ORDER SUMMARY ================= */

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  /* ================= PAYMENT ================= */

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/orders/create-order`,
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          tax,
          shipping,
          amount: total,
          currency: "INR",
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!data.success) return toast.error("Something went wrong");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Ekart",
        description: "Order Payment",

        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              response,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment Successful");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("Payment Verification failed");
            }
          } catch (e) {
            toast.error("Error in verifying payment");
          }
        },

        modal: {
          ondismiss: async function () {
            await axios.post(
              `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
              {
                razorpay_order_id: data.order.id,
                paymentFailed: true,
              },
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
            toast.error("Payment canceled or failed");
          },
        },

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        theme: {
          color: "#22c55e", // ✅ GREEN THEME
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {
        await axios.post(
          `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
          {
            razorpay_order_id: data.order.id,
            paymentFailed: true,
          },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        toast.error("Payment Failed, please try again");
      });

      rzp.open();
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong while processing payment");
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid place-items-center p-10 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-10">

        {/* ================= LEFT ================= */}

        <div className="space-y-4 p-6 bg-white rounded-xl shadow-md">

          {showForm ? (
            <>
              <h2 className="text-lg font-semibold text-gray-800">
                {editIndex !== null ? "Edit Address" : "Add New Address"}
              </h2>

              <div>
                <Label>Full Name</Label>
                <Input name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>

              <div>
                <Label>Phone</Label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>

              <div>
                <Label>Email</Label>
                <Input name="email" value={formData.email} onChange={handleChange} />
              </div>

              <div>
                <Label>Address</Label>
                <Input name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input name="city" value={formData.city} onChange={handleChange} />
                </div>

                <div>
                  <Label>State</Label>
                  <Input name="state" value={formData.state} onChange={handleChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Zip</Label>
                  <Input name="zip" value={formData.zip} onChange={handleChange} />
                </div>

                <div>
                  <Label>Country</Label>
                  <Input name="country" value={formData.country} onChange={handleChange} />
                </div>
              </div>

              <div className="flex gap-3 mt-3">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white" onClick={handleSave}>
                  Save
                </Button>

                <Button variant="outline" className="w-full" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Saved Addresses
                </h2>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowForm(true)}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  + Add New
                </Button>
              </div>

              {addresses.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No address added yet.
                </p>
              )}

              {addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => dispatch(setSelectedAddress(index))}
                  className={`border p-4 rounded-md cursor-pointer relative transition
                  ${
                    selectedAddress === index
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>

                  <p className="text-sm text-gray-600">
                    {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                  </p>

                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(addr, index);
                      }}
                      className="text-green-600 text-sm font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteAddress(index));
                      }}
                      className="text-red-500 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}

              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-green-500 hover:bg-green-600 text-white shadow-md"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>

        {/* ================= RIGHT ================= */}

        <div>
          <Card className="w-[400px] shadow-md rounded-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">

              <div className="flex justify-between">
                <span>Subtotal ({cart.items.length || 0}) items</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free shipping on orders over 299</p>
                <p>* 30-days return policy</p>
                <p>* Secure checkout with SSL encryption</p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AddressForm;