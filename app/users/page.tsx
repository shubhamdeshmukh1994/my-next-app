"use client";
import React, { ChangeEvent, useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
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
    <section className="mx-auto w-full max-w-4xl space-y-8 py-8">
      {/* Create User */}
      <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-schibsted-grotesk text-2xl font-bold">
            {editingUserId ? "Update User" : "Create User"}
          </h2>

          {error && <span className="text-destructive text-sm">{error}</span>}
        </div>

        <form className="space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-dark-200 placeholder:text-light-200 rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            />

            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-dark-200 placeholder:text-light-200 rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-dark-200 placeholder:text-light-200 rounded-[6px] px-5 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary"
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
                className="bg-dark-200 placeholder:text-light-200 w-full rounded-[6px] px-5 py-2.5 pr-16 focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-primary absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium hover:opacity-80"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Profile Image */}
            <div className="bg-dark-200 flex items-center gap-3 rounded-[6px] px-3 py-2">
              {/* Image Preview */}
              <div className="border-dark-200 bg-dark-100 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border">
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
                <p className="text-light-200 truncate text-sm">
                  {userImage
                    ? userImage.name
                    : currentImage
                      ? "Current Image"
                      : "No image selected"}
                </p>
              </div>

              {/* Choose Button */}
              <label className="pill cursor-pointer">
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
                  className="bg-destructive text-foreground rounded-[6px] px-3 py-2 text-sm font-medium hover:opacity-90"
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
              className="bg-primary hover:bg-primary/90 min-w-[150px] rounded-[6px] px-6 py-2.5 font-semibold text-black disabled:opacity-50"
            >
              {editingUserId ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-dark-100 border-dark-200 card-shadow rounded-[10px] border px-5 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-schibsted-grotesk text-2xl font-bold">Users</h2>

          <span className="pill">{users.length} Users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-dark-200 text-light-200 border-b">
                <th></th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Phone</th>
                <th className="p-3 font-medium">DOB</th>
                <th className="p-3 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user: any) => (
                <tr
                  key={user.id}
                  className="border-dark-200/60 hover:bg-dark-200/40 border-b"
                >
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
                        className="bg-primary/20 text-primary hover:bg-primary/30 rounded-[6px] px-3 py-1 text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-destructive text-foreground rounded-[6px] px-3 py-1 text-sm hover:opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-light-200 p-6 text-center">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default UsersPage;
