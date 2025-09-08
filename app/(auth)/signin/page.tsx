"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpdateFormSchemalogin } from "@/Helper/validate";
import axios from "axios";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { redirect, RedirectType } from "next/navigation";
import { useActionState, useState } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { login } from "@/app/Slice/userSlice";
import { useDispatch } from "react-redux";

const SignIn = () => {
  const dispatch = useDispatch()
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async () => {
    debugger;
    // alert("Submitting form...");
    const validatedFields = UpdateFormSchemalogin.safeParse({
      email: email,
      password: password,
    })
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
    // debugger;
    const res = await axios.post('/api/auth/signin', {
      email: email,
      password: password
    });
    if (res.data.success) {
      dispatch(login({ user: res.data.user, token: res.data.user.token }))
      if(res.data.user.role === "1") {
        redirect("/admin", RedirectType.push);
      } else {
        redirect("/", RedirectType.push);
      }
    }
    else {
      alert(res.data.message);
    }

  }
  const [state, action, pending] = useActionState(handleSubmit, undefined)
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <div className="m-auto w-full max-w-md p-6 bg-white dark:bg-gray-900 shadow rounded-lg">
        <h1 className="text-xl font-semibold text-gray-700 dark:text-white">
          Login
        </h1>
        <form action={action}>
          <div className="mt-4">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            {state?.errors?.email && <p className='text-red-500 text-sm'>{state.errors.email}</p>}
          </div>

          <div className="mt-4">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-1 w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              {state?.errors?.password && <p className='text-red-500 text-sm'>{state.errors.password}</p>}
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <Button className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800">
              Login
            </Button>
          </div>
        </form>

        <div className="mt-6 text-end"> <span>
          Don&apos;t have an account?
        </span>
          <a onClick={() => redirect("/signup", RedirectType.push)} className="cursor-pointer py-2 px-2 hover:text-blue-800 dark:hover:text-blue-800">
            Signup
          </a>
        </div>
      </div>
    </div>
  )
}

export default SignIn