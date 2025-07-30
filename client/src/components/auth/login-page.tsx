'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        toast.success('Welcome to PulseStack!')
      } else {
        toast.error('Invalid credentials. Please try again.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="h-screen bg-black border border-gray-800 rounded-lg overflow-hidden">
      <div className="relative flex h-full w-full items-center justify-center gap-20 overflow-hidden p-4 lg:gap-[220px]">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 size-full">
          {/* Space background image */}
          <img 
            src="/liquid.jpg" 
            alt="Space background" 
            className="size-full object-cover opacity-80"
          />
          {/* Dark overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-black opacity-50" /> */}
        </div>
        
        {/* Radial gradient overlay */}
        {/* <div className="absolute top-0 left-0 size-full bg-gradient-radial from-black from-70% to-transparent" /> */}
        
        {/* Left Side - Tagline only (SVG commented out) */}
        <div className="z-10 hidden flex-col items-center gap-6 md:flex">
          {/* City illustration using custom SVG */}
          {/**
          <div className="w-[250px] lg:w-[380px] h-[300px] lg:h-[357px] flex items-center justify-center">
            <img 
              src="/pdity-no-bg.svg" 
              alt="PulseStack Illustration" 
              className="w-full h-full object-contain opacity-90"
              style={{
                filter: 'brightness(1.1) contrast(1.05)',
                mixBlendMode: 'normal'
              }}
            />
          </div>
          */}
          {/* Main tagline */}
          <h1 className="text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent font-[system-ui]">
            PulseStack
          </h1>
        </div>

        {/* Right Side - Login Form */}
        <div className="h-full w-full bg-white-500 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-500
 z-10 flex w-full max-w-sm min-w-fit flex-col gap-4 rounded-3xl px-6 pt-10 pb-8">
          {/* Whop Logo equivalent - PulseStack logo */}
          <div className="self-center mb-5">
            <div className="flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500">
                <span className="text-sm font-bold text-white">PS</span>
              </div>
              <span className="ml-2 text-lg font-bold text-white">PulseStack</span>
            </div>
          </div>
          
          {/* Description */}
          <span className="text-white-400 mb-5 max-w-[340px] self-center text-center text-sm">
            Create an account or log in to discover productivity and find ways to boost your workflow.
          </span>

          {/* Login Form */}
          <div className="flex w-full flex-col items-center justify-center">
            <form onSubmit={handleSubmit} className="flex w-full flex-col items-center justify-center gap-3">
              {/* Email/Username Field */}
              <label className="text-white-400 w-full text-sm">
                Username
                <div className="mt-1.5 h-12 w-full">
                  <input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    spellCheck="false"
                    className="h-12 w-full rounded-xl bg-gray-800 border border-gray-600 text-white placeholder:text-orange-500 px-3 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </label>

              {/* Password Field */}
              <label className="text-white-400 w-full text-sm">
                Password
                <div className="mt-1.5 h-12 w-full relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="admin123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    spellCheck="false"
                    className="h-12 w-full rounded-xl bg-gray-800 border border-gray-600 text-white placeholder:text-orange-500 px-3 pr-10 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-white-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Continue'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex w-full items-center gap-3">
              <div className="bg-gray-600 h-px flex-1"></div>
              <span className="text-white-400 flex-shrink-0 uppercase text-xs">OR</span>
              <div className="bg-gray-600 h-px flex-1"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex w-full gap-3">
              <button
                disabled
                className="flex-1 h-12 bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
                  <path d="M16.3635 4.18569C15.159 3.63132 13.8874 3.23803 12.5811 3.01587C12.4024 3.33708 12.2407 3.66756 12.0966 4.00594C10.7053 3.79517 9.29038 3.79517 7.89905 4.00594C7.75493 3.6676 7.59321 3.33712 7.41454 3.01587C6.10752 3.2399 4.83508 3.63413 3.62936 4.18859C1.23568 7.74878 0.586784 11.2205 0.911226 14.643C2.31303 15.6842 3.88204 16.476 5.55007 16.9841C5.92566 16.4763 6.25801 15.9376 6.54359 15.3736C6.00117 15.1699 5.47763 14.9187 4.97904 14.6228C5.11027 14.5271 5.2386 14.4285 5.36261 14.3329C6.81338 15.0187 8.39679 15.3743 10 15.3743C11.6032 15.3743 13.1866 15.0187 14.6374 14.3329C14.7629 14.4358 14.8912 14.5344 15.021 14.6228C14.5215 14.9192 13.997 15.1709 13.4535 15.3751C13.7388 15.9388 14.0711 16.477 14.447 16.9841C16.1165 16.4781 17.6867 15.6866 19.0888 14.6445C19.4695 10.6755 18.4385 7.23563 16.3635 4.18569ZM6.95455 12.5383C6.05043 12.5383 5.30349 11.7134 5.30349 10.6987C5.30349 9.68402 6.02448 8.85194 6.95167 8.85194C7.87886 8.85194 8.62004 9.68402 8.60421 10.6987C8.58829 11.7134 7.87598 12.5383 6.95455 12.5383ZM13.0455 12.5383C12.1399 12.5383 11.3959 11.7134 11.3959 10.6987C11.3959 9.68402 12.1168 8.85194 13.0455 8.85194C13.9741 8.85194 14.7095 9.68402 14.6936 10.6987C14.6778 11.7134 13.9669 12.5383 13.0455 12.5383Z" fill="currentColor"/>
                </svg>
              </button>
              
              <button
                disabled
                className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              
              <button
                disabled
                className="flex-1 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-600 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <svg fill="currentColor" viewBox="0 0 814 1000" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" className="-mt-[3px]" height="22" width="22">
                  <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2m-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3"/>
                </svg>
              </button>
            </div>

            {/* Terms */}
            <span className="text-white-500 mt-4 max-w-72 text-center text-balance text-xs">
              By signing in you agree to our{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                terms of service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                privacy policy
              </a>.
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
