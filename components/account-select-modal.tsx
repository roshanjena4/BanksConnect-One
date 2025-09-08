"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { date } from 'zod'

// interface Account {
//   id: string
//   name: string
//   balance: number
//   avatar: string
//   color: string
// }

// interface BalanceCard {
//   id: string
//   bankName: string
//   accountType: string
//   balance: number
//   accountNumber: string
//   gradient: string
// }

// const accounts: Account[] = [
//   {
//     id: '1',
//     name: 'Bank of America',
//     balance: 2588.12,
//     avatar: 'BA',
//     color: 'bg-blue-600'
//   },
//   {
//     id: '2',
//     name: 'Chase Growth Savings Account',
//     balance: 2588.12,
//     avatar: 'CG',
//     color: 'bg-green-600'
//   },
//   {
//     id: '3',
//     name: 'First Platypus Bank',
//     balance: 2588.12,
//     avatar: 'FP',
//     color: 'bg-purple-600'
//   }
// ]

// const balanceCards: BalanceCard[] = [
//   {
//     id: '1',
//     bankName: 'Bank of Australia',
//     accountType: 'Chase Growth Savings Account',
//     balance: 41382.80,
//     accountNumber: '9999',
//     gradient: 'from-teal-500 to-green-500'
//   },
//   {
//     id: '2',
//     bankName: 'Bank of America',
//     accountType: 'Chase Growth Savings Account',
//     balance: 41382.80,
//     accountNumber: '9999',
//     gradient: 'from-purple-500 to-purple-600'
//   },
//   {
//     id: '3',
//     bankName: 'Bank of Canada',
//     accountType: 'Chase Growth Savings Account',
//     balance: 41382.80,
//     accountNumber: '9999',
//     gradient: 'from-pink-500 to-pink-600'
//   }
// ]

interface AccountSelectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAccount?: string
  onSelectAccount: (accountId: string) => void
}

const AccountSelectModal = ({
  open,
  onOpenChange,
  selectedAccount,
  onSelectAccount
}: AccountSelectModalProps) => {

  const accounts = useSelector((state: RootState) => state.account.accountData)
  const banks = useSelector((state: RootState) => state.bank.bankData)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle className="sr-only">Select Account</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1  gap-6 p-4 md:p-6 ">
          {/* Account Selection Menu */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Select-Account
            </h3>

            <div className="space-y-2">
              {Array.isArray(accounts) && Array.isArray(banks) && accounts.map((account: any,index: number) => {
                const bankObj = banks.find(b => b.id === account.bankid);
                return (
                  <button
                    key={`${account.Id}-{index}`}
                    onClick={() => onSelectAccount(account.accountnumber)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                    )}
                  >
        
                    <div className="flex-1">
                      <p className="font-medium">
                        {bankObj ? bankObj.name : "Unknown Bank"}
                        {bankObj ? (
                          <span className="ml-2 text-xs text-gray-400">({bankObj.name})</span>
                        ) : null}
                      </p>
                      <p className="text-sm opacity-70">₹{account.balance.toLocaleString()}</p>
                    </div>
                    {selectedAccount === account.accountnumber && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Balance Cards */}
          {/* <div className="space-y-4">
            {balanceCards.map((card, index) => (
              <div key={card.id} className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Balance-Card-{String(index + 1).padStart(2, '0')}
                </h4>
                
                <div className={`bg-gradient-to-r ${card.gradient} rounded-xl p-6 text-white relative overflow-hidden`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{card.bankName}</h3>
                      <p className="text-sm opacity-90 mb-4">{card.accountType}</p>
                      <p className="text-sm font-mono tracking-wider">
                        ●●●● ●●●● ●●●● {card.accountNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75 mb-1">Current Balance</p>
                      <div className="bg-white/20 rounded-lg px-3 py-2">
                        <p className="text-lg font-bold">
                          ${card.balance.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AccountSelectModal