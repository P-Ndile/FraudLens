import React, { useState } from 'react';

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [businessSize, setBusinessSize] = useState('1-5');
  const [departments, setDepartments] = useState([]);

  const toggleDept = (dept) => {
    setDepartments(prev =>
      prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="text-sm text-blue-600 font-semibold mb-2">Step {step} of 4</div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Tell us about your business</h2>
            <p className="text-slate-500 mb-6">This helps us set up the right protection for your business.</p>
            <label className="block text-sm font-medium mb-3">How many people work at your business?</label>
            {['1-5', '6-20', '21-50', '51-100', '101-200', '201+'].map((range) => (
              <label key={range} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg mb-2 cursor-pointer hover:bg-slate-100 border border-slate-200">
                <input
                  type="radio"
                  name="size"
                  checked={businessSize === range}
                  onChange={() => setBusinessSize(range)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-slate-700">{range} employees</span>
              </label>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Which departments are in your business?</h2>
            <p className="text-slate-500 mb-6">Select all that apply.</p>
            <div className="grid grid-cols-3 gap-3">
              {['Administration', 'Finance', 'Sales', 'Operations', 'HR / People', 'Marketing', 'IT / Technology', 'Other'].map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleDept(dept)}
                  className={`p-4 rounded-xl border text-center text-sm font-medium transition ${
                    departments.includes(dept)
                      ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Connect your data <span className="text-xs text-slate-400 font-normal">(optional)</span></h2>
            <p className="text-slate-500 mb-6">We will link your existing systems so we can protect your data and make things easier.</p>
            <div className="space-y-3">
              {['WhatsApp (Messages & Files)', 'Email (Gmail / Outlook)', 'Xero (Accounting)', 'Google Drive (Files)', 'Microsoft 365 (Files & Email)'].map((service) => (
                <div key={service} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">{service}</span>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-xs rounded font-semibold text-white transition">Connect</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg text-white">&#10003;</div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">You are all set!</h2>
            <p className="text-slate-500 mb-6">Your account is ready. We will now start protecting your business.</p>
            <button
              onClick={onComplete}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-md transition"
            >
              Go to Dashboard &#8594;
            </button>
          </div>
        )}

        {step < 4 && (
          <div className="flex justify-between mt-8 border-t pt-6">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition">&#8592; Back</button>
            ) : <div />}
            <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold text-white shadow-md transition">Next &#8594;</button>
          </div>
        )}
      </div>
    </div>
  );
}
