"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { UserColumns } from "./columns";

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users
  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load users");
        }

        setUsers(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button onClick={() => router.push("/admin/user/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={UserColumns}
        data={users}
        loading={loading}
        onRowClick={(row) => router.push(`/admin/user/${row.id}`)}
      />
    </div>
  );
}
