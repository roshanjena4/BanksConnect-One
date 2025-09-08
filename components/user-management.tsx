"use client"

import { useActionState, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Edit, Trash2, Eye, RotateCcw, Smartphone } from "lucide-react"
import axios from "axios"
import { FormSchemaCreateUser } from "@/Helper/validate"
import { toast } from "react-toastify"
import { HashLoader } from "react-spinners"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import RestoreConfirmationDialog from "@/components/restore-confirmation-dialog"
import useDebounce from "@/hooks/useDebounce"



export default function UserManagement() {

    interface User {
        id: number;
        name: string;
        email: string;
        status: string;
        role: string; // "user" | "admin" | "premium" etc.
        lastLogin: string;
        totalBalance: string; // Formatted currency string
        accountsCount: number;
        phone: string;
        joinDate: string;
    }

    const fetchUsersData = async () => {
        const result = await axios.get('/api/users');
        console.log("user:",result.data.data);
        
        const mappedUsers = result.data.data?.map((user: any) => ({
            id: user.Id,
            name: user.Name,
            email: user.Email,
            status: user.Status,
            role: user.role === "2" ? "user" : user.role === "1" ? "admin" : user.role, // adjust role mapping as needed
            lastLogin: user.LastLogin,
            totalBalance: `₹${Number(user.total_balance).toLocaleString()}`,
            accountsCount: user.total_accounts,
            phone: user.Phone || "",
            joinDate: user.JoinDate || "",
        }));
        setUsers(mappedUsers);
    }

    useEffect(() => {
        fetchUsersData();
    }, [])

    const [users, setUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [isAddUserOpen, setIsAddUserOpen] = useState(false)
    const [isEditUserOpen, setIsEditUserOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const debounceSearch = useDebounce(searchTerm, 500);
    // pagination
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
      setCurrentPage(1)
    }, [debounceSearch, statusFilter, roleFilter])

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user?.name.toLowerCase().includes(debounceSearch.toLowerCase()) ||
            user?.email.toLowerCase().includes(debounceSearch.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || user.status === statusFilter;
        const matchesRole =
            roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesStatus && matchesRole;
    })

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage))
    const pagedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const getStatusColor = (Status: string) => {
        switch (Status) {
            case "active":
                return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            case "blocked":
                return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "premium":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
            case "admin":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        }
    }

    const [first, setFirst] = useState("")
    const [last, setLast] = useState("")
    const [role, setRole] = useState("")
    const [status, setStatus] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [password, setPassword] = useState("")

    // new states for edit/delete/restore flows
    const [userId, setUserId] = useState<number | null>(null)
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ open: boolean; user: any }>({ open: false, user: null })
    const [restoreConfirmation, setRestoreConfirmation] = useState<{ open: boolean; user: any }>({ open: false, user: null })
    const [isDeleting, setIsDeleting] = useState(false)
    const [isRestoring, setIsRestoring] = useState(false)

    const handleSubmit = async () => {
        debugger;
        const validatedFields = FormSchemaCreateUser.safeParse({
            name: `${first} ${last}`,
            email,
            phone,
            role,
            status,
            password: password ? password : null,
        })
        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        try {
            debugger;
            let res;
            // use admin endpoints for edit/create to match bank-management pattern
            if (isEditUserOpen && userId) {
                res = await axios.put('/api/admin/user', {
                    userId,
                    name: `${first} ${last}`,
                    email,
                    phone,
                    role: role === "admin" ? "1" : role === "user" ? "2" : "3",
                    status,
                    password: password || undefined
                });
            } else {
                res = await axios.post('/api/admin/user', {
                    name: `${first} ${last}`,
                    email,
                    phone,
                    role: role === "admin" ? "1" : role === "user" ? "2" : "3",
                    status,
                    password
                });
            }

            if (res.status === 200 || res.status === 201) {
                toast.success(res.data.message || "User saved successfully")
                setIsAddUserOpen(false)
                setIsEditUserOpen(false)
                // reset form
                setFirst(""); setLast(""); setEmail(""); setPhone(""); setRole(""); setStatus(""); setPassword(""); setUserId(null)
                await fetchUsersData()
            } else {
                toast.error("Failed to save user")
                return { errors: { general: "Failed to save user" } }
            }
        } catch (err: any) {
            console.error("User save error:", err)
            toast.error(err?.response?.data?.message || "Internal server error")
        }
    }

    const handleEditUser = (user: any) => {
        setIsEditUserOpen(true);
        console.log(user);
        
        const parts = user.name ? user.name.split(" ") : []
        setFirst(parts.slice(0, -1).join(" ") || parts[0] || "")
        setLast(parts.length > 1 ? parts[parts.length - 1] : "")
        setEmail(user.email || "")
        setPhone(user.phone || "")
        setRole(user.role || "")
        setStatus(user.status || "")
        setUserId(user.id || null)
        setIsAddUserOpen(true) // open dialog re-used for add/edit
    }

    const handleDeleteUser = async () => {
        const user = deleteConfirmation.user || restoreConfirmation.user;
        if (!user) return;
        setIsDeleting(true)
        try {
            const response = await axios.delete('/api/admin/user', {
                data: { userId: user.id }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchUsersData();
            } else {
                toast.error(response.data.message || "Failed to delete user.");
            }
            setDeleteConfirmation({ open: false, user: null })
            setRestoreConfirmation({ open: false, user: null })
        } catch (error) {
            console.error("Error deleting/restoring user:", error)
            toast.error("Failed to perform operation")
        } finally {
            setIsDeleting(false)
            setIsRestoring(false)
        }
    }

    const [state, action, pending] = useActionState(handleSubmit, undefined)

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Manage user accounts and permissions</p>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={(open) => {
                    setIsAddUserOpen(open)
                    if (!open) {
                        // reset edit state when dialog closed
                        setIsEditUserOpen(false)
                        setUserId(null)
                        setFirst(""); setLast(""); setEmail(""); setPhone(""); setRole(""); setStatus(""); setPassword("")
                    }
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddUserOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{isEditUserOpen ? "Edit User" : "Add New User"}</DialogTitle>
                            <DialogDescription>Create or update a user account with basic information</DialogDescription>
                        </DialogHeader>
                        <form action={action}>
                            <Tabs defaultValue="basic" className="w-full">
                                <TabsList className="grid w-full grid-cols-1">
                                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                                </TabsList>
                                <TabsContent value="basic" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input value={first} onChange={(e) => setFirst(e.target.value)} id="firstName" placeholder="Enter first name" />
                                            {/* {state?.errors?.name  && <p className='text-red-500 text-sm'>{state.errors.name}</p>} */}
                                            {state?.errors && 'name' in state.errors && Array.isArray(state.errors.name) && (
                                                <p className='text-red-500 text-sm'>{state.errors.name[0]}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input value={last} onChange={(e) => setLast(e.target.value)} id="lastName" placeholder="Enter last name" />
                                            {state?.errors && 'name' in state.errors && Array.isArray(state.errors.name) && (
                                                <p className='text-red-500 text-sm'>{state.errors.name[0]}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 ">
                                            <Label htmlFor="role">User Role</Label>
                                            <Select value={role} onValueChange={(value) => setRole(value)} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    <SelectItem value="user">User</SelectItem>
                                                    <SelectItem value="premium">Premium</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {state?.errors && 'role' in state.errors && Array.isArray(state.errors.role) && (
                                                <p className='text-red-500 text-sm'>{state.errors.role[0]}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="status">Account Status</Label>
                                            <Select value={status} onValueChange={(value) => setStatus(value)} >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent className="w-full">
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="suspended">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {state?.errors && 'status' in state.errors && Array.isArray(state.errors.status) && (
                                                <p className='text-red-500 text-sm'>{state.errors.status[0]}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="Enter email address" />
                                        {state?.errors && 'email' in state.errors && Array.isArray(state.errors.email) && (
                                            <p className='text-red-500 text-sm'>{state.errors.email[0]}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} id="phone" placeholder="Enter phone number" />
                                        {state?.errors && 'phone' in state.errors && Array.isArray(state.errors.phone) && (
                                            <p className='text-red-500 text-sm'>{state.errors.phone[0]}</p>
                                        )}
                                    </div>
                                    {!isEditUserOpen &&
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password" type="password" placeholder="Enter password" />
                                        {state?.errors && 'password' in state.errors && Array.isArray(state.errors.password) && (
                                            <p className='text-red-500 text-sm'>{state.errors.password[0]}</p>
                                        )}
                                    </div>}
                                </TabsContent>
                            </Tabs>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    {isEditUserOpen ? "Save Changes" : "Create User"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Search and Filters */}
            <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Search & Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>Manage all user accounts and their details</CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredUsers.length < 1 ? <div className='flex justify-center  h-screen'>
                        <HashLoader color="#3b7cff" />
                    </div> :
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Balance</TableHead>
                                    <TableHead>Accounts</TableHead>
                                    <TableHead>Last Login</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pagedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                                                        {user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm text-gray-900 dark:text-white">{user.email}</p>
                                                {user.phone &&
                                                <p className="text-sm text-gray-500 dark:text-gray-400 inline-flex items-center "><Smartphone className="w-4 h-3" />{user.phone}</p>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900 dark:text-white">{user.totalBalance}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400">{user.accountsCount}</TableCell>
                                        <TableCell className="text-gray-600 dark:text-gray-400">{new Date(user.lastLogin).toLocaleString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: '2-digit',
                                        })}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm"
                                                    className={user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                                                    onClick={
                                                        user.status === "active"
                                                            ? () => setDeleteConfirmation({ open: true, user })
                                                            : () => setRestoreConfirmation({ open: true, user })
                                                    }
                                                >
                                                    {user.status === 'active' ? (
                                                        <Trash2 className="w-4 h-4" />
                                                    ) : (
                                                        <RotateCcw className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            </TableBody>
                        </Table>}
                </CardContent>
            </Card>
            {/* Pagination controls */}
            {filteredUsers.length > itemsPerPage && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">
                  Showing {(filteredUsers.length === 0) ? 0 : ((currentPage - 1) * itemsPerPage + 1)} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</Button>
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        size="sm"
                        variant={page === currentPage ? "default" : "ghost"}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button variant="ghost" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
                </div>
              </div>
            )}
            {/* User Details Modal */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>Complete information about the selected user</DialogDescription>
                    </DialogHeader>
                    {selectedUser && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16">
                                    <AvatarFallback className="bg-blue-600 text-white text-lg">
                                        {selectedUser.name
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge className={getStatusColor(selectedUser.status)}>{selectedUser.status}</Badge>
                                        <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</Label>
                                    <p className="text-gray-900 dark:text-white">{selectedUser.phone}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Join Date</Label>
                                    <p className="text-gray-900 dark:text-white">{selectedUser.joinDate}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Balance</Label>
                                    <p className="text-gray-900 dark:text-white font-semibold">{selectedUser.totalBalance}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Accounts</Label>
                                    <p className="text-gray-900 dark:text-white">{selectedUser.accountsCount} accounts</p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete / Restore confirmations for users */}
            <DeleteConfirmationDialog
                open={deleteConfirmation.open}
                onOpenChange={(open) => setDeleteConfirmation({ open, user: deleteConfirmation.user })}
                title="Delete User"
                description="Are you sure you want to delete this user? This will deactivate their account and may affect related data."
                itemName={deleteConfirmation.user?.name || ""}
                onConfirm={handleDeleteUser}
                isLoading={isDeleting}
            />

            <RestoreConfirmationDialog
                open={restoreConfirmation.open}
                onOpenChange={(open) => setRestoreConfirmation({ open, user: restoreConfirmation.user })}
                title="Restore User"
                description="Are you sure you want to restore this user? Restoring will reactivate the user's account and they will regain access to all their data."
                itemName={restoreConfirmation.user?.name || ""}
                onConfirm={handleDeleteUser}
                isLoading={isRestoring}
            />
        </div >
    )
}
