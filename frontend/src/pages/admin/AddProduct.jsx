import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";

import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/productSlice";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import axios from "axios";
import { toast } from "sonner";

const AddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  const [loading, setLoading] = useState(false);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
  });

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ================= SUBMIT ================= */

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);

    if (productData.productImg.length === 0) {
      toast.error("Please select atleast one image");
      return;
    }

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/product/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        dispatch(setProducts([...products, res.data.product]));
        toast.success(res.data.message);

        // ✅ RESET FORM AFTER SUCCESS
        setProductData({
          productName: "",
          productPrice: "",
          productDesc: "",
          productImg: [],
          brand: "",
          category: "",
        });
      }
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="pl-[350px] py-20 pr-20 mx-auto px-4 bg-gray-100 min-h-screen">
      
      <Card className="w-full my-20 shadow-lg rounded-2xl">
        
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Add Product
          </CardTitle>

          <CardDescription>
            Enter Product Details below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-4">

            {/* PRODUCT NAME */}
            <div className="grid gap-2">
              <Label>Product Name</Label>

              <Input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                placeholder="Ex - iPhone"
                required
              />
            </div>

            {/* PRICE */}
            <div className="grid gap-2">
              <Label>Price</Label>

              <Input
                type="number"
                name="productPrice"
                value={productData.productPrice}
                onChange={handleChange}
                required
              />
            </div>

            {/* BRAND + CATEGORY */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="grid gap-2">
                <Label>Brand</Label>

                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Ex - Apple"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>

                <Input
                  type="text"
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  placeholder="Ex - Mobile"
                  required
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="grid gap-2">
              <Label>Description</Label>

              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                placeholder="Enter brief description of product"
              />
            </div>

            {/* IMAGE UPLOAD */}
            <ImageUpload
              productData={productData}
              setProductData={setProductData}
            />

            {/* BUTTON */}
            <CardFooter className="flex-col gap-2 px-0">

              <Button
                disabled={loading}
                type="submit"
                className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white shadow-md hover:scale-105 transition"
              >
                {loading ? (
                  <span className="flex gap-2 items-center justify-center">
                    <Loader2 className="animate-spin w-4 h-4" />
                    Please Wait...
                  </span>
                ) : (
                  "Add Product"
                )}
              </Button>

            </CardFooter>

          </form>
        </CardContent>

      </Card>
    </div>
  );
};

export default AddProduct;