import { useState } from 'react'
import { supabase } from '../lib/supabase'

type Step = 'email' | 'otp' | 'loading'

export default function Login() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  async function sendOtp() {
    if (!email) return
    setStep('loading')
    setError('')

    const { error } = await supabase.auth.signInWithOtp({ email })

    if (error) {
      setError(error.message)
      setStep('email')
    } else {
      setStep('otp')
    }
  }

  async function verifyOtp() {
    if (!otp) return
    setStep('loading')
    setError('')

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    })

    if (error) {
      setError(error.message)
      setStep('otp')
    }
    // On success, App.tsx will detect the session and show the dashboard
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600">Antigravity</h1>
          <p className="text-sm text-gray-500 mt-1">Clinic Management Platform</p>
        </div>

        {step === 'loading' && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-gray-500 mt-3">Please wait...</p>
          </div>
        )}

        {step === 'email' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendOtp()}
                placeholder="doctor@yourclinic.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Send Login Code
            </button>
            <p className="text-xs text-gray-400 text-center">
              We'll send a 6-digit code to your email. No password needed.
            </p>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Code sent to <span className="font-medium">{email}</span>
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter 6-digit code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                placeholder="123456"
                maxLength={6}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={verifyOtp}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Verify & Login
            </button>
            <button
              onClick={() => { setStep('email'); setOtp(''); setError('') }}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              Use different email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
