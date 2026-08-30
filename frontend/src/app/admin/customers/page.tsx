import React from 'react';
import { getDbCustomersSummary } from '@/lib/user-store';
import { Users, Mail, Calendar, ShoppingCart, UserCheck } from 'lucide-react';

export const metadata = {
  title: 'VELOCITY | Admin Customers',
  description: 'View registered customers directory and their shopping activity logs.',
};

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await getDbCustomersSummary();

  return (
    <div className="space-y-8 text-neutral-100 font-sans">
      
      {/* Title section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-neutral-500 stroke-[1.5]" />
          Customers Directory
        </h1>
        <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
          View registered members and their local purchasing logs
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-950 border border-neutral-800 p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">
              Total Members
            </span>
            <span className="text-2xl font-black text-white block">
              {customers.length}
            </span>
          </div>
          <div className="w-10 h-10 bg-neutral-900 border border-neutral-800 flex items-center justify-center">
            <UserCheck className="w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Customers Table Card */}
      <div className="bg-neutral-950 border border-neutral-800">
        
        {/* Card Header */}
        <div className="px-6 py-5 border-b border-neutral-800 bg-neutral-950/60">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Registered Customers List
          </h3>
        </div>

        {/* Content */}
        {customers.length === 0 ? (
          <div className="p-12 text-center text-xs font-bold uppercase tracking-widest text-neutral-500">
            No registered customers found in the local database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-900/30">
                  <th className="py-4 px-6">Customer Details</th>
                  <th className="py-4 px-6">Email Address</th>
                  <th className="py-4 px-6">Registered Date</th>
                  <th className="py-4 px-6 text-right">Orders Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-300">
                {customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-neutral-900/20 transition-colors"
                  >
                    {/* Customer Info (Avatar & Name) */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-neutral-900 border border-neutral-800 text-white flex items-center justify-center font-black text-xs">
                          {customer.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-white block">
                            {customer.name}
                          </span>
                          <span className="text-[9px] text-neutral-500 block font-bold tracking-widest mt-0.5">
                            ID: {customer.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Mail className="w-3.5 h-3.5 text-neutral-600" />
                        <span className="lowercase font-medium tracking-normal text-neutral-300">{customer.email}</span>
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-neutral-400">
                        <Calendar className="w-3.5 h-3.5 text-neutral-600" />
                        <span>
                          {new Date(customer.created_at).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Orders Placed */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <span 
                          className={`px-2.5 py-1 text-[9px] font-black tracking-widest flex items-center gap-1.5 ${
                            customer.total_orders > 0 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40' 
                              : 'bg-neutral-900 text-neutral-500 border border-neutral-800'
                          }`}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          {customer.total_orders} Orders
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
