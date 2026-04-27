import { useEffect, useState } from 'react'
import { Calendar, Users, FileText, BarChart2, Settings, Bell } from 'lucide-react'
import { supabase } from './lib/supabase'
import Login from './pages/Login'
import type { Session } from '@supabase/supabase-js'

const stats = [
  { label: "Today's Appointments", value: '24', color: 'bg-blue-50 text-blue-700' },
  { label: 'Patients Seen', value: '18', color: 'bg-green-50 text-green-700' },
  { label: 'Pending Billing', value: '₹42,000', color: 'bg-orange-50 text-orange-700' },
  { label: 'New Patients', value: '6', color: 'bg-purple-50 text-purple-700' },
]

const appointments = [
  { time: '10:00 AM', patient: 'Rahul Sharma', doctor: 'Dr. Mehta', type: 'Root Canal', status: 'Confirmed' },
  { time: '10:30 AM', patient: 'Priya Patel', doctor: 'Dr. Singh', type: 'Cleaning', status: 'Waiting' },
  { time: '11:00 AM', patient: 'Arun Kumar', doctor: 'Dr. Mehta', type: 'Consultation', status: 'Confirmed' },
  { time: '11:30 AM', patient: 'Sneha Joshi', doctor: 'Dr. Singh', type: 'Braces Check', status: 'Confirmed' },
]

const navItems = [
  { icon: BarChart2, label: 'Dashboard', active: true },
  { icon: Calendar, label: 'Appointments' },
  { icon: Users, label: 'Patients' },
  { icon: FileText, label: 'Billing' },
  { icon: Settings, label: 'Settings' },
]

const statusColors: Record<string, string> = {
  Confirmed: 'bg-green-100 text-green-700',
  Waiting: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <Login />

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">Antigravity</h1>
          <p className="text-xs text-gray-500 mt-1">SmileCare Dental</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              DR
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{session.user.email}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
            <p className="text-sm text-gray-500">Sunday, 27 April 2026</p>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {stats.map(({ label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                <p className="text-sm text-gray-500">{label}</p>
                <p className={`text-2xl font-bold mt-1 px-2 py-0.5 rounded-md inline-block ${color}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Today's Appointments</h3>
              <button className="text-sm text-blue-600 hover:underline">View all</button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3 text-left font-medium">Time</th>
                  <th className="px-6 py-3 text-left font-medium">Patient</th>
                  <th className="px-6 py-3 text-left font-medium">Doctor</th>
                  <th className="px-6 py-3 text-left font-medium">Treatment</th>
                  <th className="px-6 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.patient} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-gray-800">{appt.time}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{appt.patient}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{appt.doctor}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{appt.type}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[appt.status]}`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
