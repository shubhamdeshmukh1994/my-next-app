"use client";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import Header from "../componants/Header";
import { supabase } from "@/lib/supabase/client";
import { redirect } from "next/navigation";
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
}

const UsersPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userImage, setUserImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = async () => {
    const { data: users, error } = await supabase.from("users").select("*");
    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }
    if (users) {
      const usersWithImages = await Promise.all(
        users.map(async (user) => {
          if (!user.image_url) {
            return { ...user, signedImageUrl: null };
          }

          const { data } = await supabase.storage
            .from("user_images")
            .createSignedUrl(user.image_url, 3600);

          return {
            ...user,
            signedImageUrl: data?.signedUrl,
          };
        }),
      );

      setUsers(usersWithImages ?? []);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUser = async () => {
    setError("");

    const payload = {
      name,
      email,
      phone,
      dob,
      password,
    };
    let result;

    if (editingUserId) {
      // UPDATE
      result = await supabase
        .from("users")
        .update(payload)
        .eq("id", editingUserId)
        .select()
        .single();
    } else {
      // CREATE
      result = await supabase.from("users").insert(payload).select().single();
    }

    const { data, error } = result;

    console.log(data);

    if (error) {
      setError(error.message);
      return;
    }
    if (data.id && userImage) {
      try {
        const imagePath = await uploadUserImage(data.id, userImage);
        await supabase
          .from("users")
          .update({
            image_url: imagePath,
          })
          .eq("id", data.id);
      } catch (error: any) {
        console.error("error while updating user image", error?.message);
      }
    }
    await fetchUsers();

    // Clear form
    setName("");
    setEmail("");
    setPhone("");
    setDob("");
    setPassword("");
    setUserImage(null);
    setEditingUserId(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleEdit = async (userId: number) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log(error);
      setError(error.message);
      return;
    }
    setName(data.name);
    setEmail(data.email);
    setPhone(data.phone);
    setDob(data.dob);
    setPassword(data.password);
    if (data.image_url) {
      const { data: image_data } = await supabase.storage
        .from("user_images")
        .createSignedUrl(data.image_url, 3600);
      setCurrentImage(image_data?.signedUrl ?? "");
    }
    setEditingUserId(data.id);
  };
  const handleDelete = async (userId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    const { error } = await supabase.from("users").delete().eq("id", userId);

    if (error) {
      console.error(error);
      setError(error.message);
      return;
    }
    await fetchUsers();
  };

  const handleUserImage = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files[0]", e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setUserImage(e.target.files[0]);
    }
  };

  const uploadUserImage = async (userId: number, file: File) => {
    const extension = file.name.split(".").pop();
    const filePath = `private/${userId}.${extension}`;
    const { error } = await supabase.storage
      .from("user_images")
      .upload(filePath, file, {
        upsert: true,
      });

    if (error) {
      console.error("error while uploading user image", error?.message);
      return null;
    }
    return filePath;
  };

  const handleRemoveImage = () => {
    setUserImage(null);
    setCurrentImage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <>
      <Header />
      <div>UsersPage</div>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="mx-auto max-w-4xl space-y-8 px-4">
          {/* Create User */}
          <div className="rounded-xl bg-white p-5 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xm font-semibold text-gray-800">
                {editingUserId ? "Update User" : "Create User"}
              </h2>

              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>

            <form className="space-y-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />

                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-16 focus:border-blue-500 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {/* Profile Image */}
                <div className="flex items-center gap-3 rounded-lg border border-gray-300 px-3 py-2">
                  {/* Image Preview */}
                  <div className="h-10 w-10 overflow-hidden rounded-full border bg-gray-100 flex-shrink-0">
                    {userImage || currentImage ? (
                      <img
                        src={
                          userImage
                            ? URL.createObjectURL(userImage)
                            : currentImage
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg">
                        👤
                      </div>
                    )}
                  </div>

                  {/* File Name */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-600">
                      {userImage
                        ? userImage.name
                        : currentImage
                          ? "Current Image"
                          : "No image selected"}
                    </p>
                  </div>

                  {/* Choose Button */}
                  <label className="cursor-pointer rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Choose
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleUserImage}
                      className="hidden"
                    />
                  </label>

                  {/* Remove Button */}
                  {(userImage || currentImage) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="rounded-md bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleUser}
                  disabled={isPending}
                  className="min-w-[150px] rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {editingUserId ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div className="rounded-xl bg-white p-6 shadow">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-800">Users</h2>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                {users.length} Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th></th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">DOB</th>
                    <th className="p-3 text-cente *:first-letter:r">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td>
                        {user.signedImageUrl && (
                          <img
                            src={user.signedImageUrl}
                            alt="Profile"
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                      </td>
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.phone}</td>
                      <td className="p-3">{user.dob}</td>

                      <td className="p-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersPage;
