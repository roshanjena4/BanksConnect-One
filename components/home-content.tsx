"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, MoreHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { setAccountData } from '@/app/Slice/accountSlice'
import { setBankData } from '@/app/Slice/bankSlice'
import { setCardsData } from '@/app/Slice/cardsSlice'
import { setTransactionData } from '@/app/Slice/transactionSlice' 
import { CardSwipe } from "@/components/ui/card-swipe"
import { useRouter } from 'next/navigation'
import fetchUserData from '@/Helper/fetchUserData'
import { AppDispatch } from '@/app/store';

interface User {
  id: number;
  username: string;
  Name: string;
  Email: string;
  email: string;
  token: string;
  role: string;
}



const budgets = [
  { name: 'Subscriptions', amount: 25, total: 100, color: 'bg-blue-500' },
  { name: 'Food and booze', amount: 120, total: 400, color: 'bg-pink-500' },
  { name: 'Savings', amount: 50, total: 500, color: 'bg-green-500' }
]
const HomeContent = () => {
    const router = useRouter()
  const dispatch = useDispatch<AppDispatch>();

  // const fetchUserData = async () => {
  //   try {
  //     const response = await axios.get('/api/bank');
  //     if (response.data.success) {
  //       const userDetails = response.data.data[0]?.get_user_details_by_token_v2;
  //       if (userDetails) {
  //         dispatch(setBankData(userDetails.banks));
  //         dispatch(setCardsData(userDetails.cards));
  //         dispatch(setAccountData(userDetails.accounts));
  //         dispatch(setTransactionData(userDetails.transactions));
  //       }
  //     } else {
  //       console.error('Failed to fetch user data:', response.data.message);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };

  useEffect(() => {
    fetchUserData(dispatch);
    
  }, [dispatch])

  // Use only selectors, no local state
  const user = useSelector((state: RootState) => state.user.userData);
  const account = useSelector((state: RootState) => state.account.accountData);
  const bank = useSelector((state: RootState) => state.bank.bankData);
  const cards = useSelector((state: RootState) => state.cards.cardsData);
  const transaction = useSelector((state: RootState) => state.transaction.transactionData);
  
  console.log("account1", account);
  console.log("bank1", bank);
  console.log("cards1", cards);
  console.log("transaction1", transaction);
  // Sum balances and handle null/empty account
  const totalBalance = Array.isArray(account)
    ? account.reduce((sum, acc) => sum + (acc.balance ?? 0), 0)
    : 0;

  // Track selected bank tab
  const [selectedBankId, setSelectedBankId] = useState(
    Array.isArray(bank) && bank.length > 0 ? bank[0].id : null
  );

  // Filter accounts for selected bank
  const selectedAccounts = Array.isArray(account)
    ? account.filter(acc => acc.bankid === selectedBankId)
    : [];

  // Get selected bank details
  const selectedBank = Array.isArray(bank)
    ? bank.find(b => b.id === selectedBankId)
    : null;

  // Calculate total balance for selected bank
  const selectedBankBalance = selectedAccounts.reduce(
    (sum, acc) => sum + (acc.balance ?? 0),
    0
  );

  // Get all account numbers for the selected bank
  const selectedAccountNumbers = selectedAccounts.map(acc => acc.accountnumber);

  // Filter transactions for selected bank
  const filteredTransactions = Array.isArray(transaction)
    ? transaction.filter(
        tx => selectedAccountNumbers.includes(tx.from_account_id)
      )
    : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Welcome, <span className="text-blue-600">{(user as User)?.Name}</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Access & manage your account and transactions efficiently.
            </p>
          </div>

          {/* Account Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{bank?.length} Bank Accounts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Current Balance</p>
                </div>
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add bank
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin-slow"></div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalBalance.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent transactions</CardTitle>
              <Button onClick={() => router.push('/transaction-history')} variant="ghost" size="sm" className="text-blue-600">
                View all
              </Button>
            </CardHeader>
            <CardContent>
              {/* Bank Tabs */}
              <div className="flex gap-4 mb-6 border-b">
                {Array.isArray(bank) &&
                  bank.map(b => (
                    <button
                      key={b.id}
                      className={`pb-2 px-1 font-medium ${
                        selectedBankId === b.id
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-500 dark:text-white"
                      }`}
                      onClick={() => setSelectedBankId(b.id)}
                    >
                      {b.name}
                    </button>
                  ))}
              </div>

              {/* Account Info for selected bank */}
              {selectedBank && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedBank.name?.split(" ").map((word: string) => word[0]).join("").toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{selectedBank.name}</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      ₹{selectedBankBalance.toLocaleString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                    {selectedAccounts[0]?.accounttype || "N/A"}
                  </Badge>
                </div>
              )}

              {/* Transaction Headers */}
              {/* Responsive Transaction Table */}
              <div className="mb-4">
                {/* Table Headers (hidden on small screens) */}
                <div className="hidden sm:grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 mb-4">
                  <div>Transaction</div>
                  <div>Amount</div>
                  <div>Status</div>
                  <div>Date</div>
                  <div>Category</div>
                </div>

                {/* Transactions */}
                <div className="space-y-4">
                  {filteredTransactions.length === 0 ? (
                    <div className="text-gray-500">No transactions for this bank.</div>
                  ) : (
                    filteredTransactions.slice(0, 5).map((tx, idx) => (
                      <div
                        key={`${tx.id}-${tx.transaction_time}-${idx}`}
                        className={`grid grid-cols-1 sm:grid-cols-5 gap-4 items-center py-2 rounded-lg text-wrap ${
                          tx.transaction_type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        {/* Transaction Description */}
                        <div className="flex flex-col px-2">
                          <span className="font-medium text-gray-900">{tx.description}</span>
                          {/* Mobile: Show labels */}
                          <span className="sm:hidden text-xs text-gray-500 mt-1">Transaction</span>
                        </div>
                        {/* Amount */}
                        <div className={`font-semibold ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.transaction_type === 'credit' ? '+' : ''}₹{Math.abs(tx.amount).toLocaleString()}
                          <span className="sm:hidden text-xs text-gray-500 block mt-1">Amount</span>
                        </div>
                        {/* Status */}
                        <div>
                          <Badge
                            variant={
                              tx.status === 'Success'
                                ? 'default'
                                : tx.status === 'Processing'
                                ? 'secondary'
                                : 'destructive'
                            }
                            className={
                              tx.status === 'Success'
                                ? 'bg-green-100 text-green-800'
                                : tx.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800 rounded-full'
                            }
                          >
                            ● {tx.status}
                          </Badge>
                          <span className="sm:hidden text-xs text-gray-500 block mt-1">Status</span>
                        </div>
                        {/* Date */}
                        <div className="text-gray-600">
                          {new Date(tx.transaction_time).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          })}
                          <span className="sm:hidden text-xs text-gray-500 block mt-1">Date</span>
                        </div>
                        {/* Category */}
                        <div>
                          <Badge variant="outline" className="text-blue-600 border-blue-600 rounded-full">
                            ● {tx.category}
                          </Badge>
                          <span className="sm:hidden text-xs text-gray-500 block mt-1">Category</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">{(user as User)?.Name?.split(' ').map((word: string) => word[0]).join('').toUpperCase()}</span>
                </div>
                
              </div>
              <h3 className="text-xl font-semibold mb-1">{(user as User)?.Name}</h3>
              <p className="text-sm opacity-90 mb-4">{(user as User)?.email}</p>

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">My Cards</span>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-1">
                  <Plus className="w-4 h-4" />
                  Add cards
                </Button>
              </div>

              {/* Mini Card */}
              <div className="rounded-lg px-4 mt-4 overflow-hidden">
                 <CardSwipe cards={Array.isArray(cards) ? cards : []} autoplayDelay={2000} slideShadows={false} />
                
              </div>
            </CardContent>
          </Card>

          {/* My Budgets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>My budgets</CardTitle>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgets.map((budget, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${budget.color}`}></div>
                      <span className="text-sm font-medium">{budget.name}</span>
                    </div>
                    <span className="text-sm font-semibold">₹{budget.amount} left</span>
                  </div>
                  <Progress
                    value={(budget.amount / budget.total) * 100}
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default HomeContent
