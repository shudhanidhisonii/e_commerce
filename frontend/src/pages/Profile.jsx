import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import MyOrder from "./MyOrder";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { userId } = useParams();

  const [file, setFile] = useState(null);

  const [updatedUser, setUpdatedUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipcode: "",
    role: "",
    profilePic: "/profile.png",
  });

  useEffect(() => {
    if (user) {
      setUpdatedUser({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNo: user.phoneNo || "",
        address: user.address || "",
        city: user.city || "",
        zipcode: user.zipcode || "",
        role: user.role || "",
        profilePic: user.profilePic || "/profile.png",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUpdatedUser({
      ...updatedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFile(img);
      setUpdatedUser({
        ...updatedUser,
        profilePic: URL.createObjectURL(img),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accessToken = localStorage.getItem("accessToken");

    try {
      const formData = new FormData();
      formData.append("firstName", updatedUser.firstName);
      formData.append("lastName", updatedUser.lastName);
      formData.append("email", updatedUser.email);
      formData.append("phoneNo", updatedUser.phoneNo);
      formData.append("address", updatedUser.address);
      formData.append("city", updatedUser.city);
      formData.append("zipcode", updatedUser.zipcode);
      formData.append("role", updatedUser.role);

      if (file) {
        formData.append("file", file);
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
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-100">
      <Tabs
        defaultValue="profile"
        className="max-w-5xl mx-auto flex flex-col items-center"
      >
        {/* TABS */}
        <TabsList className="bg-white border border-green-200">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>

          <TabsTrigger
            value="orders"
            className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            Orders
          </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="w-full mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information and profile photo.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                <img
                  src={updatedUser.profilePic}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                />

                <Label
                  htmlFor="profileImage"
                  className="cursor-pointer text-sm text-green-600 font-medium"
                >
                  Change profile photo
                </Label>

                <Input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* FORM */}
              <form
                onSubmit={handleSubmit}
                className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      name="firstName"
                      value={updatedUser.firstName}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <Input
                      name="lastName"
                      value={updatedUser.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    value={updatedUser.email}
                    disabled
                    className="bg-gray-200 cursor-not-allowed"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    name="phoneNo"
                    value={updatedUser.phoneNo}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={updatedUser.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      name="city"
                      value={updatedUser.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <Label>Zip Code</Label>
                    <Input
                      name="zipcode"
                      value={updatedUser.zipcode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;