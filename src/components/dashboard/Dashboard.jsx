import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 flex items-center space-x-3 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl shadow-md">F</div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-slate-800">FraudLens</h1>
              <p className="text-xs text-slate-400">Data Integrity</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { name: 'Home', active: true },
              { name: 'Fraud & Phishing', active: false, badge: '2' },
              { name: 'My Files', active: false },
              { name: 'Learn & Stay Safe', active: false },
              { name: 'Settings', active: false }
            ].map((item) => (
              <a key={item.name} href="#" className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${item.active ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                <span>{item.name}</span>
                {item.badge && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>}
              </a>
            ))}
          </nav>
        </div>

        <div className="p-4 m-4 bg-slate-900 rounded-xl text-white">
          <p className="text-xs text-slate-400 mb-1">Need help?</p>
          <p className="text-sm font-bold mb-3">Chat with us or call<br/>0800 123 456</p>
          <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-semibold transition">Call now</button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Good morning, Thandi</h2>
            <p className="text-sm text-slate-500">Here is what is happening with your business today.</p>
          </div>
          <div className="flex items-center space-x-3 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <span className="text-sm font-semibold text-slate-700">Thandi Beauty and Supplies</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xs">T</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">&#10003;</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Protected</p>
              <h3 className="text-lg font-bold text-slate-800">Your business is secure</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center text-xl font-bold">!</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Needs attention</p>
              <h3 className="text-lg font-bold text-slate-800">2 active alerts</h3>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">*</div>
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Last backup</p>
              <h3 className="text-lg font-bold text-slate-800">Today, 10:24</h3>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent alerts</h3>
            <a href="#" className="text-sm text-blue-600 font-semibold hover:underline">View all &#8594;</a>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-bold mt-1">!</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Suspicious email detected</h4>
                  <p className="text-xs text-slate-500 mt-1">Looks like a fake payment request from a supplier.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition">View details</button>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-bold mt-1">?</div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">New device login</h4>
                  <p className="text-xs text-slate-500 mt-1">A new device accessed your account.</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition">View details</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
