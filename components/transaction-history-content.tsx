"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronDown, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
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
          {/* Table Headers */}
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-500 mb-4 pb-2 border-b">
            <div>Transaction</div>
            <div>Status</div>
            <div>Date</div>
            <div>Category</div>
            <div className="text-right">Amount</div>
          </div>

          {/* Transactions */}
          <div className="space-y-4">
            {paginatedTransactions?.map((transaction: TransactionApi, index: number) => (
              <div key={`${transaction.id}-${index}`} className={`grid grid-cols-5 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg px-2 ${transaction.transaction_type === 'credit' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-3">
                  {/* {transaction.avatar ? (
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={transaction.avatar} alt={transaction.merchant || 'Avatar'} />
                    <AvatarFallback>
                    {transaction.merchant?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  ) : ( */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${ 'bg-gray-200'}`}>
                    <span className="text-lg">
                    {transaction.description?.charAt(0) || 'T'}
                    </span>
                  </div>
                  {/* )} */}
                  <div>
                  <span className="font-medium text-gray-900">{ transaction.description}</span>
                  {/* {transaction.description && (
                    <div className="text-xs text-gray-500">{transaction.description}</div>
                  )} */}
                  </div>
                </div>
                <div>
                  <Badge
                    variant={transaction.status === 'Success' ? 'default' : transaction.status === 'Processing' ? 'secondary' : 'destructive'}
                    className={
                      transaction.status === 'Success' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                    }
                  >
                    ● {transaction.status}
                  </Badge>
                </div>
                <div className="text-gray-600">{new Date(transaction.transaction_time).toLocaleString()}</div>
                <div>
                  <Badge variant="outline" className="text-blue-600 border-blue-600">
                    {transaction.category}
                  </Badge>
                </div>
                <div className={`text-right font-semibold ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.transaction_type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
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