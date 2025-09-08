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
import { Plus, Search, Edit, Trash2, Eye, CreditCard, Wallet, Building2, CircleCheck, RotateCcw } from "lucide-react"
import axios from "axios"
import { HashLoader } from "react-spinners"
import { toast } from "react-toastify"
import { randomInt } from "crypto"
import { generateSixDigitServer } from "@/Helper/helper"
import { FormSchemaCreateAccount, FormSchemaCreateCard } from "@/Helper/validate"
import DeleteConfirmationDialog from "./delete-confirmation-dialog"
import useDebounce from "@/hooks/useDebounce"
import RestoreConfirmationDialog from "./restore-confirmation-dialog"


interface Account {
  id: number;
  accountNumber: string;
  fullAccountNumber: string;
  accountType: string;
  balance: number;
  createdAt: string;
  bankId: number;
  ownerName: string;
  bankName: string;
  status: string;
  openDate: string;
}


export default function AccountManagement() {
  const [activeTab, setActiveTab] = useState("accounts")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [selectedCard, setSelectedCard] = useState<any>(null)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isAddCardOpen, setIsAddCardOpen] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [cards, setCards] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [banks, setBanks] = useState<any[]>([])
  const [userid, setUserId] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [accounttype, setAccountType] = useState("")
  const [balance, setBalance] = useState("")
  const [bankid, setBankId] = useState("")
  const [accountstatus, setAccountStatus] = useState("active")
  const [cardType, setCardType] = useState("")
  const [cardHolderName, setCardHolderName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cardStatus, setCardStatus] = useState("active")
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isEditAccountOpen, setIsEditAccountOpen] = useState(false)
  const [isEditCardOpen, setIsEditCardOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)
  const [editingCard, setEditingCard] = useState<any>(null)
  const [editUserId, setEditUserId] = useState("")
  const [editAccountNumber, setEditAccountNumber] = useState("")
  const [editAccountType, setEditAccountType] = useState("")
  const [editBalance, setEditBalance] = useState("")
  const [editBankId, setEditBankId] = useState("")
  const [editAccountStatus, setEditAccountStatus] = useState("active")
  const [editCardAccountNumber, setEditCardAccountNumber] = useState("")
  const [editCardType, setEditCardType] = useState("")
  const [editCardHolderName, setEditCardHolderName] = useState("")
  const [editCardExpiryMonth, setEditCardExpiryMonth] = useState("")
  const [editCardExpiryYear, setEditCardExpiryYear] = useState("")
  const [editCardStatus, setEditCardStatus] = useState("active")
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean
    item: any
    type: "account" | "card"
  }>({ open: false, item: null, type: "account" })
  const [isDeleting, setIsDeleting] = useState(false)
  const debounceSearch = useDebounce(searchTerm, 500);

  const [restoreConfirmation, setRestoreConfirmation] = useState<{
    open: boolean
    item: any
    type: "account" | "card"
  }>({ open: false, item: null, type: "account" })
  const [isRestoring, setIsRestoring] = useState(false)

  const [openModal, setOpenModal] = useState(false);
  const [accountData, setAccountData] = useState(null);
  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    if (expiryMonth && expiryYear) {
      setExpiry(`${expiryYear}-${expiryMonth}-01`);
    }
  }, [expiryMonth, expiryYear]);

  const fetchCards = async () => {
    const response = await axios.get('/api/admin/cards');
    if (response.status === 200) {
      console.log('Fetched cards:', response.data.data);
      const mapCards = response.data.data.map((card: any) => ({
        id: card.id,
        accountNo: card.account_no,
        cardNumber: card.card_number,
        fullCardNumber: card.card_number,
        cardType: card.card_type,
        ownerName: card.cardholder_name,
        expiryDate: card.expiry_date,//format to "MM/YY"
        cvv: card.cvv,
        status: card.status,
        issuedAt: card.issued_at
      }));
      setCards(mapCards);
    }
  }

  const fetchAccounts = async () => {
    const response = await axios.get('/api/admin/accounts');
    if (response.status === 200) {
      console.log('Fetched accounts:', response.data.data);

      const mapAccounts = response.data.data.map((account: any) => ({
        id: account.Id,
        accountNumber: account.accountnumber,
        userId: account.userid,
        fullAccountNumber: account.accountnumber,
        accountType: account.accounttype,
        balance: account.balance,
        createdAt: account.createdat,
        bankId: account.bankid,
        ownerName: account.owner_name,
        bankName: account.bank_name,
        status: account.status || "active",
        openDate: account.createdat.split("T")[0], // Format date to YYYY-MM-DD
      }));
      setAccounts(mapAccounts);
    } else {
      console.error('Failed to fetch accounts');
    }
  }

  useEffect(() => {
    fetchAccounts();
    fetchCards();
    getUsersAndBanks();
  }, [])

  const getUsersAndBanks = async () => {
    const result = await axios.get('/api/admin/user');
    if (result.status === 200) {
      console.log('Fetched users and banks:', result.data.data);
      setUsers(result.data.data.users);
      setBanks(result.data.data.banks);
    }
    else {
      toast.error('Failed to fetch users and banks');
    }
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.ownerName.toLowerCase().includes(debounceSearch.toLowerCase()) ||
      account.accountNumber.toLowerCase().includes(debounceSearch.toLowerCase()) ||
      account.bankName.toLowerCase().includes(debounceSearch.toLowerCase()),
  )

  const filteredCards = cards.filter(
    (card) => {
      const textSearch =
        card.ownerName.toLowerCase().includes(debounceSearch.toLowerCase()) ||
        card.cardNumber.toLowerCase().includes(debounceSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || card.status === statusFilter;
      return textSearch && matchesStatus;
    }
  )

  // pagination: separate pages for accounts and cards (5 per page)
  const itemsPerPage = 5
  const [accountsPage, setAccountsPage] = useState(1)
  const [cardsPage, setCardsPage] = useState(1)

  // reset pages when search/filters change
  useEffect(() => {
    setAccountsPage(1)
    setCardsPage(1)
  }, [debounceSearch, statusFilter])

  const accountsTotalPages = Math.max(1, Math.ceil(filteredAccounts.length / itemsPerPage))
  const pagedAccounts = filteredAccounts.slice((accountsPage - 1) * itemsPerPage, accountsPage * itemsPerPage)

  const cardsTotalPages = Math.max(1, Math.ceil(filteredCards.length / itemsPerPage))
  const pagedCards = filteredCards.slice((cardsPage - 1) * itemsPerPage, cardsPage * itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "frozen":
      case "blocked":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "Checking":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "savings":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "current":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getCardTypeColor = (type: string) => {
    switch (type) {
      case "debit":
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "prepaid":
        return "bg-red-100/2 text-red-400 dark:bg-red-800/20 dark:text-red-200"
      case "virtual":
      case "travel":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "credit":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "business":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const handleSubmit = async () => {
    debugger;
    const validateAccount = FormSchemaCreateAccount.safeParse({
      userid,
      bankid,
      accounttype,
      balance,
    })
    if (!validateAccount.success) {
      return {
        errors: validateAccount.error.flatten().fieldErrors,
      }
    }

    const bank1 = banks.find((bank: any) => bank.id === Number(bankid));
    const bankCode = bank1 ? bank1.code : "";
    const newCode = bankCode + generateSixDigitServer();
    setAccountNumber(newCode.toString());
    console.log(newCode);

    console.log(accountNumber);

    console.log(userid,
      accountNumber,
      accounttype,
      balance,
      bankid
    );
    const result = await axios.post('/api/admin/accounts', {
      userid,
      accountnumber: newCode,
      accounttype,
      balance,
      bankid
    })


    if (result.status === 200) {
      console.log("Full Response:", result.data.message);
      toast.success('Account created successfully')
      setIsAddAccountOpen(false)
      fetchAccounts()
    }
    else {
      toast.error('Failed to create account')
    }
  }

  const handleSubmitCard = async () => {
    debugger
    const validateCard = FormSchemaCreateCard.safeParse({
      cardType,
      expiry,
      cardStatus,
      accountNumber
    });

    if (!validateCard.success) {
      return {
        errors: validateCard.error.flatten().fieldErrors,
      }
    }
    const result = await axios.post('/api/admin/cards', {
      cardType,
      expiry,
      cardStatus,
      accountNumber,
      cardHolderName
    });

    if (result.status === 200) {
      console.log("Full Response:", result.data.data);
      toast.success('Card created successfully.');
      setIsAddCardOpen(false);
      fetchCards();
    }
  }
  const handleDeleteItem = async () => {
    if (!deleteConfirmation.item) return;

    setIsDeleting(true);
    try {
      debugger;
      if (deleteConfirmation.type === "account") {
        // console.log("Deleting account:", deleteConfirmation.item);

        const response = await axios.delete('/api/admin/accounts', {
          data: { accountnumber: deleteConfirmation.item.accountNumber }
        });
        if (response.data.success) {
          toast.success(response.data.message);
          fetchAccounts();
        } else {
          toast.error(response.data.message || "Failed to delete account");
        }
      } else {
        const response = await axios.delete('/api/admin/cards', {
          data: { card_number: deleteConfirmation.item.cardNumber }
        });
        if (response.data.success) {
          toast.success("Card deleted successfully.");
          fetchCards();
        } else {
          toast.error(response.data.message || "Failed to delete card");
        }
      }

      // Close the confirmation dialog
      setDeleteConfirmation({ open: false, item: null, type: "account" });
    } catch (error) {
      console.error("[v0] Error deleting item:", error);
      toast.error("Error deleting item");
    } finally {
      setIsDeleting(false);
    }
  }

  const handleRestoreItem = async () => {
    if (!restoreConfirmation.item) return;

    setIsRestoring(true);
    try {
      console.log("Restoring account:", restoreConfirmation.item);
      if (restoreConfirmation.type === "account") {
        const response = await axios.delete("/api/admin/accounts", {
           data: { accountnumber: restoreConfirmation.item.accountNumber }
        });
        if (response.data?.success) {
          toast.success(response.data.message || "Account restored successfully.");
          fetchAccounts();
        } else {
          toast.error(response.data?.message || "Failed to restore account.");
        }
      } else {
        debugger;
        const response = await axios.delete('/api/admin/cards', {
         data: { card_number: restoreConfirmation.item.cardNumber }
        });
        if (response.data?.success) {
          toast.success(response.data.message || "Card restored successfully.");
          fetchCards();
        } else {
          toast.error(response.data?.message || "Failed to restore card.");
        }
      }

      setRestoreConfirmation({ open: false, item: null, type: "account" });
    } catch (error) {
      console.error("Error restoring item:", error);
      toast.error("Error restoring item");
    } finally {
      setIsRestoring(false);
    }
  }

  const handleEditAccount = (account: any) => {
  // Populate controlled edit form state and open edit dialog
  setEditingAccount(account);
  setEditUserId(account.userId ? String(account.userId) : "")
  setEditBankId(account.bankId ? String(account.bankId) : "")
  setEditAccountType(account.accountType || "")
  setEditBalance(account.balance ? String(account.balance) : "")
  setEditAccountStatus(account.status || "active")
  setEditAccountNumber(account.accountNumber || "")
  setIsEditAccountOpen(true)
};

  const handleEditCard = (card: any) => {
    setEditingCard(card)
    setEditCardAccountNumber(card.accountNo ? String(card.accountNo) : "")
    setEditCardType(card.cardType || "")
    setEditCardHolderName(card.ownerName || "")
    // parse expiry to month/year if possible
    try {
      const d = new Date(card.expiryDate)
      if (!isNaN(d.getTime())) {
        setEditCardExpiryMonth(String(d.getMonth() + 1).padStart(2, '0'))
        setEditCardExpiryYear(String(d.getFullYear()))
      }
    } catch (e) {
      console.log("Error parsing card expiry date:", e);
    }
    setEditCardStatus(card.status || "active")
    setIsEditCardOpen(true)
  }


  const [state, action, pending] = useActionState(handleSubmit, undefined)
  const [stateCard, actionCard, pendingCard] = useActionState(handleSubmitCard, undefined)
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account & Card Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Manage user accounts and payment cards</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddAccountOpen} onOpenChange={setIsAddAccountOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form action={action}>

                <DialogHeader>
                  <DialogTitle>Add New Account</DialogTitle>
                  <DialogDescription>Create a new bank account for a user</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountOwner">Account Owner</Label>
                        <Select value={userid} onValueChange={(value) => setUserId(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select user" />
                          </SelectTrigger>
                          <SelectContent  >
                            {users.map((user: any) => (
                              <SelectItem key={user.Id} value={user.Id}>
                                {user.Name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {state?.errors?.userid && <p className='text-red-500 text-sm'>{state.errors.userid}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankSelect">Bank</Label>
                        <Select value={bankid} onValueChange={(value) => setBankId(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select bank" />
                          </SelectTrigger>
                          <SelectContent>
                            {banks.map((bank: any) => (
                              <SelectItem key={bank.id} value={bank.id}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {state?.errors?.bankid && <p className='text-red-500 text-sm'>{state.errors.bankid}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="accountType">Account Type</Label>
                        <Select value={accounttype} onValueChange={(value) => setAccountType(value)}>
                          <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent >
                            <SelectItem value="savings">Savings</SelectItem>
                            <SelectItem value="current">Current</SelectItem>
                          </SelectContent>
                        </Select>
                        {state?.errors?.accounttype && <p className='text-red-500 text-sm'>{state.errors.accounttype}</p>}
                      </div>
                      {/* <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD</SelectItem>
                          <SelectItem value="eur">EUR</SelectItem>
                          <SelectItem value="gbp">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div> */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialBalance">Initial Balance</Label>
                      <Input value={balance} onChange={(e) => setBalance(e.target.value)} id="initialBalance" type="number" placeholder="0.00" />
                      {state?.errors?.balance && <p className='text-red-500 text-sm'>{state.errors.balance}</p>}
                    </div>
                  </TabsContent>
                  <TabsContent value="settings" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest Rate (%)</Label>
                      <Input id="interestRate" type="number" step="0.01" placeholder="0.00" />
                    </div> */}
                      {/* <div className="space-y-2">
                      <Label htmlFor="minimumBalance">Minimum Balance</Label>
                      <Input id="minimumBalance" type="number" placeholder="0.00" />
                    </div> */}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountStatus">Account Status</Label>
                      <Select value={accountstatus} onValueChange={(value) => setAccountStatus(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="frozen">Frozen</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-2 pt-4">
                  {/* <Button variant="outline" onClick={() => setIsAddAccountOpen(false)}>
                  Cancel
                </Button> */}
                  <Button className="bg-blue-600 hover:bg-blue-700">Create Account</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form action={actionCard}>
                <DialogHeader>
                  <DialogTitle>Add New Card</DialogTitle>
                  <DialogDescription>Issue a new payment card for an account</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="limits">Limits & Security</TabsTrigger>
                  </TabsList>
                  <TabsContent value="basic" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedAccount">Linked Account</Label>
                      <Select value={accountNumber} onValueChange={(value) => {
                        setAccountNumber(value);
                        const selectedAccount = accounts?.find(
                          (account) => account.accountNumber.toString() === value
                        );
                        if (selectedAccount) {
                          setCardHolderName(selectedAccount.ownerName);
                        }
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {accounts?.map(account => (
                            <SelectItem key={account.id} value={account.accountNumber.toString()} >
                              {`${account.accountNumber} - (${account.bankName})`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {stateCard?.errors?.accountNumber && <p className='text-red-500 text-sm'>{stateCard.errors.accountNumber}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardType">Card Type</Label>
                        <Select value={cardType} onValueChange={(value) => setCardType(value)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debit">Debit Card</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="prepaid">Prepaid Card</SelectItem>
                            <SelectItem value="virtual">Virtual Card</SelectItem>
                            <SelectItem value="business">Business Card</SelectItem>
                            <SelectItem value="travel">Travel Card</SelectItem>
                            <SelectItem value="student">Student Card</SelectItem>
                          </SelectContent>
                        </Select>
                        {stateCard?.errors?.cardType && <p className='text-red-500 text-sm'>{stateCard.errors.cardType}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardBrand">Card Brand</Label>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="visa">Visa</SelectItem>
                            <SelectItem value="mastercard">Mastercard</SelectItem>
                            <SelectItem value="amex">American Express</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryMonth">Expiry Month</Label>
                        <Select onValueChange={setExpiryMonth}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={String(i + 1).padStart(2, "0")}
                              >
                                {String(i + 1).padStart(2, "0")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {stateCard?.errors?.expiry && <p className='text-red-500 text-sm'>{stateCard.errors.expiry}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expiryYear">Expiry Year</Label>
                        <Select onValueChange={setExpiryYear}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem key={2025 + i} value={String(2025 + i)}>
                                {2025 + i}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {stateCard?.errors?.expiry && <p className='text-red-500 text-sm'>{stateCard.errors.expiry}</p>}
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="limits" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="dailyLimit">Daily Limit</Label>
                        <Input id="dailyLimit" type="number" placeholder="5000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                        <Input id="monthlyLimit" type="number" placeholder="50000" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardStatus">Card Status</Label>
                      <Select value={cardStatus} onValueChange={(value) => setCardStatus(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                      {stateCard?.errors?.cardStatus && <p className='text-red-500 text-sm'>{stateCard.errors.cardStatus}</p>}
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex justify-end gap-2 pt-4">
                  {/* <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
                    Cancel
                  </Button> */}
                  <Button className="bg-blue-600 hover:bg-blue-700">Issue Card</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
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
                placeholder="Search accounts, cards, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Accounts and Cards */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="accounts">Accounts ({filteredAccounts.length})</TabsTrigger>
          <TabsTrigger value="cards">Cards ({filteredCards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Bank Accounts</CardTitle>
              <CardDescription>Manage all user bank accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredAccounts.length < 1 ? <div className='flex justify-center  h-screen'>
                <HashLoader color="#3b7cff" />
              </div> :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedAccounts.map((account) => (
                      <TableRow key={account.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <Wallet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{account.accountNumber}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Opened {account.openDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              {/* <AvatarImage src={`/placeholder.svg?height=32&width=32`} /> */}
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {account.ownerName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900 dark:text-white">{account.ownerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{account.bankName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getAccountTypeColor(account.accountType)}>{account.accountType}</Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 dark:text-white">{account.balance}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(account.status)}>{account.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedAccount(account)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditAccount(account)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={account.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                              onClick={
                                account.status === "active"
                                  ? () => setDeleteConfirmation({ open: true, item: account, type: "account" })
                                  : () => setRestoreConfirmation({ open: true, item: account, type: "account" })
                              }


                            >
                              {account.status === 'active' ? (
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
          {/* pagination for accounts */}
          {filteredAccounts.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Showing {(filteredAccounts.length===0)?0:((accountsPage-1)*itemsPerPage+1)} - {Math.min(accountsPage*itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length}</div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setAccountsPage(p => Math.max(1, p - 1))} disabled={accountsPage===1}>Prev</Button>
                {Array.from({length: accountsTotalPages}).map((_, i) => {
                  const page = i + 1
                  return <Button key={page} size="sm" variant={page===accountsPage ? 'default' : 'ghost'} onClick={() => setAccountsPage(page)}>{page}</Button>
                })}
                <Button variant="ghost" size="sm" onClick={() => setAccountsPage(p => Math.min(accountsTotalPages, p + 1))} disabled={accountsPage===accountsTotalPages}>Next</Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Payment Cards</CardTitle>
              <CardDescription>Manage all user payment cards</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCards.length < 1 ? <div className='flex justify-center  h-screen'>
                <HashLoader color="#3b7cff" />
              </div> :
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Card</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Type</TableHead>
                      {/* <TableHead>Brand</TableHead> */}
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedCards.map((card) => (
                      <TableRow key={card.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{card.cardNumber}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Issued {card.issueDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              {/* <AvatarImage src={`/placeholder.svg?height=32&width=32`} /> */}
                              <AvatarFallback className="bg-blue-600 text-white text-xs">
                                {card.ownerName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-900 dark:text-white">{card.ownerName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCardTypeColor(card.cardType)}>{card.cardType}</Badge>
                        </TableCell>
                        {/* <TableCell>
                        <Badge className={getCardTypeColor(card.cardBrand)}>{card.cardBrand}</Badge>
                      </TableCell> */}
                        <TableCell className="text-gray-600 dark:text-gray-400"> {(() => {
                          const date = new Date(card?.expiryDate)
                          const month = (date.getMonth() + 1).toString().padStart(2, "0")
                          const year = date.getFullYear().toString().slice(-2)
                          return `${month}/${year}`
                        })()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(card.status)}>{card.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedCard(card)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEditCard(card)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className={card.status === "active" ? "text-red-500" : "text-green-500"}
                            onClick={
                              card.status === "active"
                                ? () => setDeleteConfirmation({ open: true, item: card, type: "card" })
                                : () => setRestoreConfirmation({ open: true, item: card, type: "card" })
                            }
                              // onClick={() => setDeleteConfirmation({ open: true, item: card, type: "card" })}
                              >
                             {card.status === 'active' ? (
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
          {/* pagination for cards */}
          {filteredCards.length > itemsPerPage && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">Showing {(filteredCards.length===0)?0:((cardsPage-1)*itemsPerPage+1)} - {Math.min(cardsPage*itemsPerPage, filteredCards.length)} of {filteredCards.length}</div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setCardsPage(p => Math.max(1, p - 1))} disabled={cardsPage===1}>Prev</Button>
                {Array.from({length: cardsTotalPages}).map((_, i) => {
                  const page = i + 1
                  return <Button key={page} size="sm" variant={page===cardsPage ? 'default' : 'ghost'} onClick={() => setCardsPage(page)}>{page}</Button>
                })}
                <Button variant="ghost" size="sm" onClick={() => setCardsPage(p => Math.min(cardsTotalPages, p + 1))} disabled={cardsPage===cardsTotalPages}>Next</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Account Details Modal */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Account Details</DialogTitle>
            <DialogDescription>Complete information about the selected account</DialogDescription>
          </DialogHeader>
          {selectedAccount && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedAccount.fullAccountNumber}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedAccount.bankName}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedAccount.status)}>{selectedAccount.status}</Badge>
                    <Badge className={getAccountTypeColor(selectedAccount.accountType)}>
                      {selectedAccount.accountType}
                    </Badge>
                    {/* {selectedAccount.status !== "active" && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          setRestoreConfirmation({ open: true, item: selectedAccount, type: "account" })
                        }
                      >
                        Restore Account
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Owner</Label>
                  <p className="text-gray-900 dark:text-white">{selectedAccount.ownerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Balance</Label>
                  <p className="text-gray-900 dark:text-white font-semibold">{selectedAccount.balance}</p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Date</Label>
                  <p className="text-gray-900 dark:text-white">{selectedAccount.openDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Card Details Modal */}
      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Card Details</DialogTitle>
            <DialogDescription>Complete information about the selected card</DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedCard.fullCardNumber}</h3>
                  {/* <p className="text-gray-600 dark:text-gray-400">{selectedCard.cardBrand}</p> */}
                  <div className="flex gap-2 mt-2">
                    <Badge className={getStatusColor(selectedCard.status)}>{selectedCard.status}</Badge>
                    {/* <Badge className={getCardBrandColor(selectedCard.cardBrand)}>{selectedCard.cardBrand}</Badge> */}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Card Owner</Label>
                  <p className="text-gray-900 dark:text-white">{selectedCard.ownerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Card Type</Label>
                  <p className="text-gray-900 dark:text-white">{selectedCard.cardType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiry Date</Label>
                  <p className="text-gray-900 dark:text-white">{(() => {
                    const date = new Date(selectedCard.expiryDate)
                    const month = (date.getMonth() + 1).toString().padStart(2, "0")
                    const year = date.getFullYear().toString().slice(-2)
                    return `${month}/${year}`
                  })()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">CVV</Label>
                  <p className="text-gray-900 dark:text-white font-mono">***</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Limit</Label>
                  <p className="text-gray-900 dark:text-white">{selectedCard.dailyLimit}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Limit</Label>
                  <p className="text-gray-900 dark:text-white">{selectedCard.monthlyLimit}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) =>
          setDeleteConfirmation({ open, item: deleteConfirmation.item, type: deleteConfirmation.type })
        }
        title={deleteConfirmation.type === "account" ? "Delete Bank Account" : "Delete Payment Card"}
        description={
          deleteConfirmation.type === "account"
            ? "Are you sure you want to delete this bank account? This will permanently remove the account and all associated transaction history."
            : "Are you sure you want to delete this payment card? This will permanently deactivate the card and remove all associated data."
        }
        itemName={
          deleteConfirmation.type === "account"
            ? `${deleteConfirmation.item?.accountNumber} - ${deleteConfirmation.item?.ownerName}`
            : `${deleteConfirmation.item?.cardNumber} - ${deleteConfirmation.item?.ownerName}`
        }
        onConfirm={handleDeleteItem}
        isLoading={isDeleting}
      />

      <RestoreConfirmationDialog
        open={restoreConfirmation.open}
        onOpenChange={(open) =>
          setRestoreConfirmation({ open, item: restoreConfirmation.item, type: restoreConfirmation.type })
        }
        title={restoreConfirmation.type === "account" ? "Restore Bank Account" : "Restore Payment Card"}
        description={
          restoreConfirmation.type === "account"
            ? "Are you sure you want to restore this bank account? Restoring will reactivate the account."
            : "Are you sure you want to restore this payment card? Restoring will reactivate the card."
        }
        itemName={
          restoreConfirmation.type === "account"
            ? `${restoreConfirmation.item?.accountNumber} - ${restoreConfirmation.item?.ownerName}`
            : `${restoreConfirmation.item?.cardNumber} - ${restoreConfirmation.item?.ownerName}`
        }
        onConfirm={handleRestoreItem}
        isLoading={isRestoring}
      />

      {/* Edit Account Dialog correct here*/}
      <Dialog
        open={isEditAccountOpen}
        onOpenChange={(open) => {
          setIsEditAccountOpen(open)
          if (!open) setEditingAccount(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Account</DialogTitle>
            <DialogDescription>Update bank account information and settings</DialogDescription>
          </DialogHeader>
          {editingAccount && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              // send PUT to update account
              try {
                const res = await axios.put('/api/admin/accounts', {
                  accountnumber: editAccountNumber,
                  userid: editUserId,
                  bankid: editBankId,
                  accounttype: editAccountType,
                  balance: editBalance,
                  status: editAccountStatus
                })
                if (res.status === 200) {
                  toast.success('Account updated')
                  setIsEditAccountOpen(false)
                  fetchAccounts()
                } else {
                  toast.error('Failed to update account')
                }
              } catch (err) {
                console.error('Error updating account', err)
                toast.error('Error updating account')
              }
            }}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editAccountOwner">Account Owner</Label>
                    <Select value={editUserId} onValueChange={setEditUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user: any) => (
                          <SelectItem key={user.Id} value={String(user.Id)}>
                            {user.Name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editBankSelect">Bank</Label>
                    <Select value={editBankId} onValueChange={setEditBankId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank: any) => (
                          <SelectItem key={bank.id} value={String(bank.id)}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editAccountType">Account Type</Label>
                    <Select value={editAccountType} onValueChange={setEditAccountType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="current">Current</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCurrency">Currency</Label>
                    <Select value={"usd"} onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD</SelectItem>
                        <SelectItem value="eur">EUR</SelectItem>
                        <SelectItem value="gbp">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCurrentBalance">Current Balance</Label>
                  <Input id="editCurrentBalance" type="number" value={editBalance} onChange={(e) => setEditBalance(e.target.value)} placeholder="0.00" />
                </div>
              </TabsContent>
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editInterestRate">Interest Rate (%)</Label>
                    <Input id="editInterestRate" type="number" step="0.01" defaultValue={"0.00"} placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editMinimumBalance">Minimum Balance</Label>
                    <Input id="editMinimumBalance" type="number" defaultValue={"0.00"} placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editAccountStatus">Account Status</Label>
                  <Select value={editAccountStatus} onValueChange={setEditAccountStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="frozen">Frozen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            </form>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditAccountOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
              // trigger submit by calling same handler used in form
              try {
                const res = await axios.put('/api/admin/accounts', {
                  accountnumber: editAccountNumber,
                  userid: editUserId,
                  bankid: editBankId,
                  accounttype: editAccountType,
                  balance: editBalance,
                  status: editAccountStatus
                })
                if (res.status === 200) {
                  toast.success('Account updated')
                  setIsEditAccountOpen(false)
                  fetchAccounts()
                } else {
                  toast.error('Failed to update account')
                }
              } catch (err) {
                console.error('Error updating account', err)
                toast.error('Error updating account')
              }
            }}>Update Account</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog correct here*/}
      <Dialog
        open={isEditCardOpen}
        onOpenChange={(open) => {
          setIsEditCardOpen(open)
          if (!open) setEditingCard(null)
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>Update payment card information and settings</DialogDescription>
          </DialogHeader>
          {editingCard && (
            <form onSubmit={async (e) => {
              e.preventDefault()
              try {
                // build expiry
                const expiry = editCardExpiryYear && editCardExpiryMonth ? `${editCardExpiryYear}-${editCardExpiryMonth}-01` : undefined
                const res = await axios.put('/api/admin/cards', {
                  card_number: editingCard.cardNumber,
                  account_no: editCardAccountNumber,
                  card_type: editCardType,
                  cardholder_name: editCardHolderName,
                  expiry_date: expiry,
                  status: editCardStatus
                })
                if (res.status === 200) {
                  toast.success('Card updated')
                  setIsEditCardOpen(false)
                  fetchCards()
                } else {
                  toast.error('Failed to update card')
                }
              } catch (err) {
                console.error('Error updating card', err)
                toast.error('Error updating card')
              }
            }}>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="limits">Limits & Security</TabsTrigger>
              </TabsList>
              <TabsContent value="basic" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editLinkedAccount">Linked Account</Label>
                  <Select value={editCardAccountNumber} onValueChange={(v) => setEditCardAccountNumber(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(a => (
                        <SelectItem key={a.id} value={String(a.accountNumber)}>{`${a.accountNumber} - ${a.ownerName} (${a.bankName})`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editCardType">Card Type</Label>
                    <Select value={editCardType} onValueChange={setEditCardType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="prepaid">Prepaid Card</SelectItem>
                        <SelectItem value="virtual">Virtual Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editCardBrand">Card Brand</Label>
                    <Select value={"visa"} onValueChange={() => {}}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="americanexpress">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editExpiryMonth">Expiry Month</Label>
                    <Select value={editCardExpiryMonth} onValueChange={setEditCardExpiryMonth}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
                            {String(i + 1).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editExpiryYear">Expiry Year</Label>
                    <Select value={editCardExpiryYear} onValueChange={setEditCardExpiryYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={2024 + i} value={String(2024 + i)}>
                            {2024 + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="limits" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="editDailyLimit">Daily Limit</Label>
                    <Input id="editDailyLimit" type="number" defaultValue={editingCard.dailyLimit || ""} placeholder="5000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editMonthlyLimit">Monthly Limit</Label>
                    <Input id="editMonthlyLimit" type="number" defaultValue={editingCard.monthlyLimit || ""} placeholder="50000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editCardStatus">Card Status</Label>
                  <Select value={editCardStatus} onValueChange={setEditCardStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                      <SelectItem value="pending">Pending Activation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
            </form>
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsEditCardOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
              try {
                const expiry = editCardExpiryYear && editCardExpiryMonth ? `${editCardExpiryYear}-${editCardExpiryMonth}-01` : undefined
                const res = await axios.put('/api/admin/cards', {
                  card_number: editingCard.cardNumber,
                  account_no: editCardAccountNumber,
                  card_type: editCardType,
                  cardholder_name: editCardHolderName,
                  expiry_date: expiry,
                  status: editCardStatus
                })
                if (res.status === 200) {
                  toast.success('Card updated')
                  setIsEditCardOpen(false)
                  fetchCards()
                } else {
                  toast.error('Failed to update card')
                }
              } catch (err) {
                console.error('Error updating card', err)
                toast.error('Error updating card')
              }
            }}>Update Card</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
