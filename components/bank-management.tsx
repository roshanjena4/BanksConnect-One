"use client"

import { useActionState, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Search, Edit, Trash2, Eye, Building2, MapPin, Mail, RotateCcw } from "lucide-react"
import axios from "axios"
import { HashLoader } from "react-spinners"
import { FormSchemaCreateBank } from "@/Helper/validate"
import { toast } from "react-toastify"
import useDebounce from "@/hooks/useDebounce"
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog"
import RestoreConfirmationDialog from "./restore-confirmation-dialog"



export default function BankManagement() {
  interface Bank {
    id: number;
    name: string;
    code: string;
    type: string;
    status: string;
    country: string;
    headquarters: string;
    Email: string;
    swiftCode: string;
    routingNumber: string;
    totalCustomers: number;
    totalAssets: string;
    establishedYear: number;
  }
  interface BankApi {
    id: number;
    name: string;
    code: string;
    type: string;
    status: string;
    country: string;
    headquarters: string;
    contactemail: string;
    address: string;
    createdat: string;
    total_accounts: number;
    total_balance: string;
    swiftCode: string;
    routingNumber: string;
    totalCustomers: number;
    totalAssets: string;
    establishedYear: number;
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null)
  const [isAddBankOpen, setIsAddBankOpen] = useState(false)
  const [isEditBankOpen, setIsEditBankOpen] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])
  const [bankId, setBankId] = useState<number | null>(null)
  const [bankName, setBankName] = useState("")
  const [bankCode, setBankCode] = useState("")
  const [bankEmail, setBankEmail] = useState("")
  const [location, setLocation] = useState("")
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean
    bank: Bank | null
  }>({ open: false, bank: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const debounceSearch = useDebounce(searchTerm, 500);

  const [restoreConfirmation, setRestoreConfirmation] = useState<{
    open: boolean
    bank: Bank | null
  }>({ open: false, bank: null })
  const [isRestoring, setIsRestoring] = useState(false)

  // pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const fetchBanks = async () => {
    const response = await axios.get('/api/admin/bank');
    if (response.status !== 200) {
      throw new Error('Failed to fetch banks');
    }

    console.log(response.data);
    const mapBanks = response.data.data.map((bank: BankApi) => ({
      id: bank.id,
      name: bank.name,
      code: bank.code,
      type: bank.type || "Commercial",
      status: bank.status || "active",
      country: bank.country,
      headquarters: bank.address,
      Email: bank.contactemail,
      swiftCode: bank.code,
      totalCustomers: bank.total_accounts || 0,
      totalAssets: bank.total_balance || "$0",
      establishedYear: bank.createdat ? bank.createdat.split("T")[0] : new Date().getFullYear(),
    }))
    setBanks(mapBanks);
  }

  useEffect(() => {
    fetchBanks()
  }, [])

  // reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debounceSearch, statusFilter])

  const filteredBanks = banks.filter(
    (bank) =>{
      const matchesSearch =
      bank.name.toLowerCase().includes(debounceSearch.toLowerCase()) ||
      bank.code.toLowerCase().includes(debounceSearch.toLowerCase());

      const matchesStatus =
      statusFilter === "all" || bank.status === statusFilter;
      return matchesSearch && matchesStatus;
    }
  )

  const totalPages = Math.max(1, Math.ceil(filteredBanks.length / itemsPerPage))
  const pagedBanks = filteredBanks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Commercial":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Investment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "Credit Union":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }
  const handleSubmit = async () => {
    const validatedFields = FormSchemaCreateBank.safeParse({
      bankName,
      bankCode,
      bankEmail,
      bankAddress: location
    })
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
    debugger;
    let result;
    if (isEditBankOpen) {
      result = await axios.put("/api/admin/bank", {
        bankId,
        bankName,
        bankCode,
        bankEmail,
        location,
      });
    } else {
      result = await axios.post("/api/admin/bank", {
        bankName,
        bankCode,
        bankEmail,
        location,
      });
    }
    console.log(result);

    if (result.status === 200) {
      toast.success(result.data.message)
      setIsAddBankOpen(false)
      setIsEditBankOpen(false)
      fetchBanks()
    } else {
      toast.error("Failed to add bank")
      return {
        errors: { general: "Failed to add bank" },
      }
    }
    console.log("Form submitted")
  }

  const handleEditBank = (bank: Bank) => {
    setIsEditBankOpen(true);
    setBankName(bank.name ? bank.name : "");
    setBankEmail(bank.Email ? bank.Email : "");
    setLocation(bank.headquarters ? bank.headquarters : "");
    setBankCode(bank.code ? bank.code : "");
    setBankId(bank.id ? bank.id : null);
  }

  const handleDeleteBank = async () => {
    const bank = deleteConfirmation.bank || restoreConfirmation.bank;
    if (!bank) return;
    debugger;
    setIsDeleting(true)
    try {
      const response = await axios.delete('/api/admin/bank', {
          data: { bankId: bank.id }
        });
        if (response.data.success) {
          toast.success(response.data.message);
          fetchBanks();
        } else {
          toast.error(response.data.message || "Failed to delete bank.");
        }
      setDeleteConfirmation({ open: false, bank: null })
      setRestoreConfirmation({ open: false, bank: null })
    } catch (error) {
      console.error("[v0] Error deleting bank:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  const [state, action, pending] = useActionState(handleSubmit, undefined)
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bank Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage banking institutions and their configurations</p>
        </div>
        <Dialog open={isAddBankOpen || isEditBankOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddBankOpen(false);
            setIsEditBankOpen(false);
            setBankName("");
            setBankCode("");
            setBankEmail("");
            setLocation("");
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddBankOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <form action={action} >
              <DialogHeader>
                <DialogTitle>
                  {isEditBankOpen ? <span>Edit Bank Details</span> : <span>Add New Bank</span>}
                </DialogTitle>
                <DialogDescription>Register a new banking institution in the system</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input value={bankName} onChange={(e) => setBankName(e.target.value)} id="bankName" placeholder="Enter bank name" />
                      {state?.errors && "bankName" in state.errors && state.errors.bankName && (
                        <p className="text-red-500">{state.errors.bankName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bankCode">Bank Code</Label>
                      <Input value={bankCode} onChange={(e) => setBankCode(e.target.value)} id="bankCode" placeholder="Enter bank code" />
                      {state?.errors && "bankCode" in state.errors && state.errors.bankCode && (
                        <p className="text-red-500">{state.errors.bankCode}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input value={location} onChange={(e) => setLocation(e.target.value)} id="location" placeholder="Enter location" />
                    {state?.errors && "bankAddress" in state.errors && state.errors.bankAddress && (
                      <p className="text-red-500">{state.errors.bankAddress}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input value={bankEmail} onChange={(e) => setBankEmail(e.target.value)} id="email" placeholder="Enter email address" />
                      {state?.errors && "bankEmail" in state.errors && state.errors.bankEmail && (
                        <p className="text-red-500">{state.errors.bankEmail}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  {isEditBankOpen ? "Save changes" : "Add bank"}
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
                placeholder="Search banks by name or code..."
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
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="credit-union">Credit Union</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Banks Table */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Banks ({filteredBanks.length})</CardTitle>
          <CardDescription>Manage all banking institutions and their configurations</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBanks.length < 1 ? <div className='flex justify-center  h-screen'>
            <HashLoader color="#3b7cff" />
          </div> :
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Customers</TableHead>
                  <TableHead>Assets</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedBanks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{bank.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{bank.code}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(bank.type)}>{bank.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(bank.status)}>{bank.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{bank.headquarters}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400">
                      {bank.totalCustomers.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium text-gray-900 dark:text-white">{bank.totalAssets}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 font-mono text-sm">{bank.swiftCode}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBank(bank)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditBank(bank)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm"
                          className={bank.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          onClick={
                            bank.status === "active"
                              ? () => setDeleteConfirmation({ open: true, bank })
                              : () => setRestoreConfirmation({ open: true, bank })
                          }
                        >
                          {bank.status === 'active' ? (
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
          {filteredBanks.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {(filteredBanks.length === 0) ? 0 : ((currentPage - 1) * itemsPerPage + 1)} - {Math.min(currentPage * itemsPerPage, filteredBanks.length)} of {filteredBanks.length}
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
        </CardContent>
      </Card>

      {/* Bank Details Modal */}
      <Dialog open={!!selectedBank} onOpenChange={() => setSelectedBank(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bank Details</DialogTitle>
            <DialogDescription>Complete information about the bank</DialogDescription>
          </DialogHeader>
          {selectedBank && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedBank.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedBank.code}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedBank.status)}>{selectedBank.status}</Badge>
                    <Badge className={getTypeColor(selectedBank.type)}>{selectedBank.type}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">{selectedBank.headquarters}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 dark:text-white">{selectedBank.Email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400"> Code</Label>
                    <p className="text-gray-900 dark:text-white font-mono">{selectedBank.swiftCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Established</Label>
                    <p className="text-gray-900 dark:text-white">{selectedBank.establishedYear}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</Label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedBank.totalCustomers.toLocaleString()}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assets</Label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedBank.totalAssets}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) => setDeleteConfirmation({ open, bank: deleteConfirmation.bank })}
        title="Delete Bank Institution"
        description="Are you sure you want to delete this bank? This will permanently remove the bank and may affect all associated user accounts and transactions."
        itemName={deleteConfirmation.bank?.name || ""}
        onConfirm={handleDeleteBank}
        isLoading={isDeleting}
      />

      <RestoreConfirmationDialog
              open={restoreConfirmation.open}
              onOpenChange={(open) =>
                setRestoreConfirmation({ open, bank: restoreConfirmation.bank })
              }
              title="Restore Payment Card"
              description="Are you sure you want to restore this bank? Restoring will reactivate the related accounts and cards."
              itemName={restoreConfirmation.bank?.name || ""}
              onConfirm={handleDeleteBank}
              isLoading={isRestoring}
            />
    </div>
  )
}
