"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MoreHorizontal, ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { useActionState, useState } from 'react'
import { FormSchemaTransfer } from '@/Helper/validate'
import axios from 'axios'
import { redirect, RedirectType } from 'next/navigation'
import { toast } from 'react-toastify'; // or your preferred toast library
import SlideButton from './ui/slide-button'


const PaymentTransferContent = () => {
  const account = useSelector((state: RootState) => state.account.accountData);
  const bank = useSelector((state: RootState) => state.bank.bankData);
  //  console.log("PaymentTransferContent", account, bank);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const handleSubmit = async () => {
    debugger;
    // alert("Submitting form...");
    // debugger;
    const validatedFields = FormSchemaTransfer.safeParse({
      toAccount,
      amount,
      category,
      description,
      email: email ? email : null
    })
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
    const res = await axios.post('/api/transactions', {
      fromAccount: fromAccount,
      toAccount: toAccount,
      amount: amount,
      category: category,
      description: description
    });
    if (res.data.success) {
      toast.success(res.data.message);
      redirect("/", RedirectType.push);
    } else if (!res.data.success && res.data.message) {

      toast.error(res.data.message);
    }
    else{
       toast.error(res.data.error || "Unknown error");
    }

  }
  const [state, action, pending] = useActionState(handleSubmit, undefined)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <form action={action}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Payment Transfer</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Please provide any specific details or notes related to the payment transfer</p>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Transfer Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-white">Transfer details</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">Enter the details of the recipient</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="source-bank" className="text-sm font-medium dark:text-white">Select Source Bank</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select the bank account you want to transfer funds from</p>
                <Select value={fromAccount} onValueChange={setFromAccount}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(account) && Array.isArray(bank) && account.map(acc => {
                      const bankObj = bank.find(b => b.id === acc.bankid);
                      return (
                        <SelectItem key={acc.accountnumber} value={acc.accountnumber}>
                          {bankObj ? bankObj.name : "Unknown Bank"} - ₹{(acc.balance ?? 0).toLocaleString()}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-medium dark:text-white">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Groceries">Groceries</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Transfer">Transfer</SelectItem>
                    <SelectItem value="Loan Payment">Loan Payment</SelectItem>
                    <SelectItem value="Salary">Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description" className="text-sm font-medium dark:text-white">Transfer Note (Optional)</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Please provide any additional information or instructions related to the transfer</p>
                <Textarea
                  id="description"
                  placeholder="Payment description"
                  className="min-h-[120px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {state?.errors?.description && <p className='text-red-500 text-sm'>{state.errors.description}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Bank Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank account details</CardTitle>
              <p className="text-sm text-gray-600">Enter the bank account details of the recipient</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* <div>
                <Label htmlFor="email" className="text-sm font-medium">Recipient's Email Address</Label>
                <Input
                  id="email"
                  type="text"
                  className="mt-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email}</p>}
              </div> */}

              <div>
                <Label htmlFor="account-number" className="text-sm font-medium">Recipient&apos;s Bank Account Number(Optional)</Label>
                <Input
                  id="account-number"
                  placeholder="Enter the account number"
                  className="mt-1"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                />
                {/* {state?.errors?.toAccount && <p className='text-red-500 text-sm'>{state.errors.toAccount}</p>} */}
              </div>

              <div>
                <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter the amount to transfer"
                  className="mt-1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {state?.errors?.amount && <p className='text-red-500 text-sm'>{state.errors.amount}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Transfer Button */}
          {/* <SlideButton ></SlideButton> */}
          <Button disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium">
            {pending
              ? (category === 'Salary' ? 'Adding Salary...' : 'Transferring...')
              : (category === 'Salary' ? 'Add Salary' : 'Transfer Funds')}
          </Button>
        </div>
      </form>
    </div>
  )
}
export default PaymentTransferContent