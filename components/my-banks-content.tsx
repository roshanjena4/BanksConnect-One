"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RootState } from '@/app/store'
import { useSelector } from 'react-redux'



const MyBanksContent = () => {

  interface CardApi {
  id: number;
  card_number: string;
  account_no: string;
  card_type: string;
  expiry_date: string;
  cvv: string;
  cardholder_name: string;
  pin: string;
  status: string;
  issued_at: string;
}
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

  const cards = useSelector((state: RootState) => state.cards.cardsData)
  const bank = useSelector((state: RootState) => state.bank.bankData)
  const account = useSelector((state: RootState) => state.account.accountData)
  const transaction = useSelector((state: RootState) => state.transaction.transactionData)
  console.log('my banks:', cards);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">My Bank Accounts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Effortlessly Manage Your Banking Activities</p>
        </div>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {/* Cards Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards?.map((card: CardApi) => {
            const accountobj = account?.find((a: AccountApi) => a.accountnumber === card.account_no);
            const bankName = bank?.find((b: BankApi) => b.id === accountobj?.bankid)?.name || 'Unknown Bank';
            const spending = (transaction ?? [])
              .filter(
                (t: TransactionApi) =>
                  t.from_account_id === card.account_no &&
                  t.transaction_type === 'debit' &&
                  new Date(t.transaction_time).getMonth() === new Date().getMonth() &&
                  new Date(t.transaction_time).getFullYear() === new Date().getFullYear()
              )
              .reduce((sum: number, t: TransactionApi) => sum + (t.amount || 0), 0);

            return (
              <Card key={card.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Black MasterCard with wavy texture */}
                  <div className="relative text-white p-6 rounded-lg h-55 flex flex-col justify-between overflow-hidden "
                    style={{
                      background: "radial-gradient(circle at 50% 50%, #111 0%, #000 100%)"
                    }}>

                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 100 Q50 50 100 100 T200 100' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
                        backgroundSize: "cover",
                        backgroundRepeat: "repeat"
                      }}>
                    </div>

                    {/* Top Row: MasterCard Logo + Chip */}
                    <div className="flex justify-between items-center relative z-10">
                      {/* MasterCard logo */}
                      <div className="flex items-center space-x-1">
                        <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                        <div className="w-8 h-8 bg-yellow-400 rounded-full -ml-4"></div> <span>{bankName}</span>
                      </div>
                      {/* Chip */}
                      <div className="w-12 h-8 z-20 flex items-center justify-center">
                        <img src="/chip.png" alt="Chip" className="w-full h-full object-contain" />
                      </div>
                    </div>

                    {/* Card Number */}
                    <div className="text-xl font-mono tracking-widest relative z-10">
                      <p className='font-sans text-sm tracking-tighter!'>Card Number</p>
                      {card.card_number.replace(/(\d{4})/g, "$1 ")}
                    </div>

                    {/* Name & Expiry */}
                    <div className="flex justify-between items-center text-sm relative z-10">
                      <div className="uppercase tracking-widest">{card.cardholder_name}</div>
                      <div>
                        <p className='font-sans text-sm '>Valid Thru</p>
                        {String(new Date(card.expiry_date).getMonth() + 1).padStart(2, "0")}/
                        {new Date(card.expiry_date).getFullYear().toString().slice(-2)}
                      </div>
                    </div>
                  </div>

                  {/* Spending Info */}
                  <div className="p-4 bg-white dark:bg-gray-800">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Spending this month</span>
                      <span className="text-sm font-semibold dark:text-white">₹{spending}</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

    </div>
  )
}


export default MyBanksContent