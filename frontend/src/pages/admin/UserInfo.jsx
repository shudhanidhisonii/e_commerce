import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import axios from "axios";
import userLogo from "../../assets/user.jpg";
import { toast } from "sonner";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id: userId } = useParams();
  const { user } = useSelector((store) => store.user);

  // ================= STATE =================

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    role: "",
    profilePic: null,
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH USER =================

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/get-user/${userId}`
      );

      if (res.data.success) {
        const data = res.data.user;

        setUpdateUser({
          firstName: data?.firstName || "",
          lastName: data?.lastName || "",
          email: data?.email || "",
          phone: data?.phone || "",
          address: data?.address || "",
          city: data?.city || "",
          zip: data?.zip || "",
          role: data?.role || "",
          profilePic: data?.profilePic || null,
        });
      }

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (userId) getUserDetails();
  }, [userId]);

  // ================= INPUT HANDLER =================

  const handleChange = (e) => {
    setUpdateUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= IMAGE HANDLER =================

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);

    // Preview
    setUpdateUser((prev) => ({
      ...prev,
      profilePic: URL.createObjectURL(selected),
    }));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phone", updateUser.phone);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zip", updateUser.zip);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file); // ⚠️ Must match backend multer key
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
      toast.success("Profile Updated Successfully")

        // Reload updated data
        getUserDetails();
        setFile(null);
      }

    } catch (error) {
      console.error(error);
      alert("Update Failed ❌");

    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">

      <div className="bg-white shadow-lg rounded-xl w-full max-w-5xl p-8">

        {/* HEADER */}
        <div className="flex items-center gap-5 mb-8">

          <Button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>

          <h1 className="text-2xl font-bold">
            Update Profile
          </h1>

        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex gap-8">

          {/* LEFT IMAGE */}
          <div className="flex flex-col items-center w-44 shrink-0">

            <img
              src={
                updateUser.profilePic ||
                user?.profilePic ||
                userLogo
              }
              alt="profile"
              className="w-32 h-32 rounded-full object-cover border"
            />

            <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm text-center">

              Change Picture

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

            </Label>

          </div>

          {/* RIGHT FORM */}
          <div className="grid grid-cols-2 gap-4 flex-1">

            {/* First Name */}
            <div>
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={updateUser.firstName}
                onChange={handleChange}
              />
            </div>

            {/* Last Name */}
            <div>
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={updateUser.lastName}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="col-span-2">
              <Label>Email</Label>
              <Input
                name="email"
                value={updateUser.email}
                disabled
              />
            </div>

            {/* Phone */}
            <div className="col-span-2">
              <Label>Phone Number</Label>
              <Input
                name="phone"
                value={updateUser.phone}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <Label>Address</Label>
              <Input
                name="address"
                value={updateUser.address}
                onChange={handleChange}
              />
            </div>

            {/* City */}
            <div>
              <Label>City</Label>
              <Input
                name="city"
                value={updateUser.city}
                onChange={handleChange}
              />
            </div>

            {/* Zip */}
            <div>
              <Label>Zip Code</Label>
              <Input
                name="zip"
                value={updateUser.zip}
                onChange={handleChange}
              />
            </div>

            {/* Role */}
            <div className="flex gap-3 items-center col-span-2">

              <Label className="text-sm font-medium">
                Role:
              </Label>

              <RadioGroup
                value={updateUser.role}
                onValueChange={(value) =>
                  setUpdateUser((prev) => ({
                    ...prev,
                    role: value,
                  }))
                }
                className="flex items-center"
              >

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>

              </RadioGroup>

            </div>

            {/* SUBMIT */}
            <div className="col-span-2 mt-2">

              <Button
                type="submit"
                className="w-full bg-pink-600 hover:bg-pink-700"
                disabled={loading}
              >

                {loading ? "Updating..." : "Update Profile"}

              </Button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default UserInfo;
