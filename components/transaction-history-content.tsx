"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDown, Filter, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownLeft, Calendar, Tag } from 'lucide-react'
import AccountSelectModal from '@/components/account-select-modal'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'



const PAGE_SIZE = 5
const TransactionHistoryContent = () => {
  const accounts = useSelector((state: RootState) => state.account.accountData)
  const banks = useSelector((state: RootState) => state.bank.bankData)
  const transactionsData = useSelector((state: RootState) => state.transaction.transactionData)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<string>(() => accounts?.[0]?.accountnumber ?? '')
  const [currentPage, setCurrentPage] = useState(1)
  console.log('selectedAccount:', selectedAccount)

  interface AccountApi{
  Id: number;
  userid: number;
  bankid: number;
  accountnumber: string;
  accounttype: string;
  balance: number;
  createdat: string;
  status: string;
}

interface BankApi {
  id: number;
  name: string;
  code: string;
  address: string;
  contactemail: string;
  createdat: string;
  status: string;
}

interface TransactionApi {
  id: number;
  from_account_id: string;
  to_account_id: string;
  transaction_type: string;
  amount: number;
  category: string;
  description: string;
  status: string;
  transaction_time: string;
}


  // Find selected account and corresponding bank
  const account = accounts?.find((acc: AccountApi) => acc.accountnumber === selectedAccount)
  const bank = banks?.find((b: BankApi) => account && b.id === account.bankid)
  const filteredTransactions = transactionsData?.filter((tx: TransactionApi) => tx.from_account_id === selectedAccount)

  // Calculate total pages
  const totalPages = Math.ceil((filteredTransactions?.length ?? 0) / PAGE_SIZE)

  // Memoize paginated transactions
  const paginatedTransactions = useMemo(
    () => {
      const start = (currentPage - 1) * PAGE_SIZE
      return filteredTransactions?.slice(start, start + PAGE_SIZE)
    },
    [filteredTransactions, currentPage]
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Transaction History</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gain Insights and Track Your Transactions Over Time</p>
        </div>
        <Button
          variant="outline"
          className="text-blue-600 border-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          <ChevronDown className="w-4 h-4 mr-2" />
          Select Account
        </Button>
      </div>

      {/* Account Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{bank ? bank.name : 'Bank'}</h2>
              {/* <p className="text-blue-100 mb-4">{account ? account.accounttype : 'Account'}</p> */}
              <p className="text-sm opacity-90"> {account ? account.accountnumber : '----'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Current Balance</p>
              <p className="text-3xl font-bold">₹{account ? account.balance.toLocaleString() : '0.00'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Transaction history</h3>
            <div className="flex -space-x-2 mt-2">
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="bg-red-500 text-white text-xs">S</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="bg-green-500 text-white text-xs">G</AvatarFallback>
              </Avatar>
              <Avatar className="w-8 h-8 border-2 border-white">
                <AvatarFallback className="bg-blue-500 text-white text-xs">T</AvatarFallback>
              </Avatar>
              <div className="w-8 h-8 border-2 border-white bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">+3</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Apply filter
          </Button>
        </CardHeader>
        <CardContent>
          {/* Table Headers (desktop only) */}
          <div className="hidden sm:grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 mb-4 pb-2 border-b">
            <div>Transaction</div>
            <div>Status</div>
            <div>Date</div>
            <div>Category</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Transactions */}
          <div className="space-y-4">
            {paginatedTransactions?.map((transaction: TransactionApi, index: number) => (
              <div
                key={`${transaction.id}-${index}`}
                className="relative flex sm:grid sm:grid-cols-5 items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg sm:rounded-xl border bg-white/60 dark:bg-gray-900/50 dark:border-gray-800 hover:shadow-sm transition"
              >
                {/* Accent bar (desktop only) */}
                <span
                  aria-hidden
                  className={`hidden sm:block absolute left-0 top-0 h-full w-1 rounded-l-xl ${transaction.transaction_type === 'credit' ? 'bg-green-500' : 'bg-red-500'}`}
                />

                {/* Mobile compact */}
                <div className="sm:hidden w-full">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`${transaction.transaction_type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                        {transaction.transaction_type === 'credit' ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-medium text-gray-900 dark:text-white block truncate">{transaction.description}</span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(transaction.transaction_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.transaction_type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                        transaction.status === 'Success'
                          ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800/60'
                          : transaction.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800/60'
                          : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60'
                      }`}
                    >
                      ● {transaction.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="rounded-full px-2 py-0.5 text-[10px] border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:bg-blue-950/40"
                    >
                      {transaction.category || 'General'}
                    </Badge>
                  </div>
                </div>

                {/* Desktop grid */}
                <div className="hidden sm:flex items-center gap-3 px-2">
                  <div className={`${transaction.transaction_type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} w-9 h-9 rounded-full flex items-center justify-center shrink-0`}>
                    {transaction.transaction_type === 'credit' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-medium text-gray-900 dark:text-white block truncate">{transaction.description}</span>
                  </div>
                </div>
                <div className="hidden sm:block">
                  <Badge
                    className={`rounded-full px-2.5 py-1 text-xs font-medium border ${
                      transaction.status === 'Success'
                        ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800/60'
                        : transaction.status === 'Processing'
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800/60'
                        : 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800/60'
                    }`}
                  >
                    ● {transaction.status}
                  </Badge>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {new Date(transaction.transaction_time).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' })}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  <Badge variant="outline" className="rounded-full border-blue-200 text-blue-700 bg-blue-50 dark:border-blue-800 dark:text-blue-200 dark:bg-blue-950/40">
                    {transaction.category || 'General'}
                  </Badge>
                </div>
                <div className={`hidden sm:block text-right font-semibold ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transaction_type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {[...Array(totalPages || 0)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <AccountSelectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedAccount={selectedAccount}
        onSelectAccount={(accountId) => {
          setSelectedAccount(accountId)
          setIsModalOpen(false)
        }}
      />
    </div>
  )
}

export default TransactionHistoryContent