"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, MoreHorizontal, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from 'lucide-react'
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
                    <div className="text-gray-500 border rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800/40 dark:border-gray-700">
                      No transactions for this bank.
                    </div>
                  ) : (
                    filteredTransactions.slice(0, 5).map((tx, idx) => (
                      <div
                        key={`${tx.id}-${tx.transaction_time}-${idx}`}
                        className={`relative flex sm:grid sm:grid-cols-5 items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl border bg-white/60 dark:bg-gray-900/50 dark:border-gray-800 hover:shadow-sm transition`}
                      >
                        {/* Accent bar by transaction type (desktop only) */}
                        <span
                          aria-hidden
                          className={`hidden sm:block absolute left-0 top-0 h-full w-1 rounded-l-xl ${tx.transaction_type === 'credit' ? 'bg-green-500' : 'bg-red-500'}`}
                        />

                        {/* Mobile compact layout */}
                        <div className="sm:hidden w-full">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`${tx.transaction_type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                                {tx.transaction_type === 'credit' ? (
                                  <ArrowUpRight className="w-4 h-4" />
                                ) : (
                                  <ArrowDownLeft className="w-4 h-4" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <span className="font-medium text-gray-900 dark:text-white block truncate">{tx.description}</span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(tx.transaction_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                                </div>
                              </div>
                            </div>
                            <div className={`text-sm font-semibold ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.transaction_type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                                tx.status === 'Success'
                                  ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800/60'
                                  : tx.status === 'Processing'
                                  ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800/60'
                                  : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60'
                              }`}
                            >
                              ● {tx.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="rounded-full px-2 py-0.5 text-[10px] border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:bg-blue-950/40"
                            >
                              {tx.category || 'General'}
                            </Badge>
                          </div>
                        </div>

                        {/* Desktop grid layout */}
                        <div className="hidden sm:flex items-center gap-3 px-2">
                          <div className={`${tx.transaction_type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} w-9 h-9 rounded-full flex items-center justify-center shrink-0`}>
                            {tx.transaction_type === 'credit' ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-gray-900 dark:text-white block truncate">{tx.description}</span>
                          </div>
                        </div>
                        <div className={`hidden sm:block font-semibold ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {tx.transaction_type === 'credit' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString()}
                        </div>
                        <div className="hidden sm:block">
                          <Badge
                            className={`rounded-full px-2.5 py-1 text-xs font-medium border ${
                              tx.status === 'Success'
                                ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800/60'
                                : tx.status === 'Processing'
                                ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800/60'
                                : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60'
                            }`}
                          >
                            ● {tx.status}
                          </Badge>
                        </div>
                        <div className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(tx.transaction_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <Tag className="w-4 h-4 text-blue-500" />
                          <Badge
                            variant="outline"
                            className="rounded-full border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:bg-blue-950/40"
                          >
                            {tx.category || 'General'}
                          </Badge>
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
