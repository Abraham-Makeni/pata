'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function BusinessServicesPage() {
  const [services, setServices] = useState([
    { id: 1, name: 'Classic Haircut', duration: '30 mins', price: 'KES 500', active: true },
    { id: 2, name: 'Beard Trim & Style', duration: '20 mins', price: 'KES 300', active: true },
    { id: 3, name: 'Hair Fade', duration: '45 mins', price: 'KES 800', active: true },
    { id: 4, name: 'Kids Haircut', duration: '25 mins', price: 'KES 400', active: false },
    { id: 5, name: 'Hair Treatment', duration: '60 mins', price: 'KES 1,200', active: true },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [editingService, setEditingService] = useState<typeof services[0] | null>(null)
  const [newService, setNewService] = useState({ name: '', duration: '', price: '' })

  const handleAddService = () => {
    if (newService.name && newService.duration && newService.price) {
      const service = {
        id: services.length + 1,
        name: newService.name,
        duration: newService.duration,
        price: newService.price,
        active: true
      }
      setServices([...services, service])
      setNewService({ name: '', duration: '', price: '' })
      setShowAddForm(false)
    }
  }

  const handleUpdateService = () => {
    if (editingService) {
      setServices(services.map(s => 
        s.id === editingService.id ? editingService : s
      ))
      setEditingService(null)
    }
  }

  const handleToggleActive = (id: number) => {
    setServices(services.map(s => 
      s.id === id ? { ...s, active: !s.active } : s
    ))
  }

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id))
  }

  const activeServices = services.filter(s => s.active)
  const inactiveServices = services.filter(s => !s.active)

  return (
    <div className="min-h-screen bg-surface-soft">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-surface-border">
        <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
          Services
        </h1>
        <p className="text-sm text-ink-muted mt-1">Manage your business services and pricing</p>
      </div>

      {/* Content */}
      <div className="px-4 py-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-surface-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="text-xs text-ink-muted uppercase tracking-wider" style={{ fontFamily:'var(--font-outfit)' }}>Active</span>
            </div>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
              {activeServices.length}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 border border-surface-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span className="text-xs text-ink-muted uppercase tracking-wider" style={{ fontFamily:'var(--font-outfit)' }}>Inactive</span>
            </div>
            <p className="text-2xl font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
              {inactiveServices.length}
            </p>
          </div>
        </div>

        {/* Add Service Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 bg-brand text-white rounded-2xl font-semibold text-[15px] tap-effect transition-all flex items-center justify-center gap-2"
          style={{ fontFamily:'var(--font-outfit)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add New Service
        </button>

        {/* Active Services */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily:'var(--font-outfit)' }}>
            Active Services
          </h2>
          <div className="space-y-3">
            {activeServices.map((service) => (
              <div key={service.id} className="bg-white rounded-2xl p-4 border border-surface-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                      {service.name}
                    </h3>
                    <p className="text-sm text-ink-muted mt-1">{service.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
                      {service.price}
                    </p>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full mt-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      Active
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-surface-border">
                  <button
                    onClick={() => setEditingService(service)}
                    className="flex-1 py-2 bg-surface-soft rounded-xl text-sm font-medium text-brand hover:bg-surface-muted transition-all"
                    style={{ fontFamily:'var(--font-outfit)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleActive(service.id)}
                    className="flex-1 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200 transition-all"
                    style={{ fontFamily:'var(--font-outfit)' }}
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="py-2 px-3 bg-red-50 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
                    style={{ fontFamily:'var(--font-outfit)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inactive Services */}
        {inactiveServices.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3" style={{ fontFamily:'var(--font-outfit)' }}>
              Inactive Services
            </h2>
            <div className="space-y-3">
              {inactiveServices.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl p-4 border border-surface-border opacity-75">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900" style={{ fontFamily:'var(--font-outfit)' }}>
                        {service.name}
                      </h3>
                      <p className="text-sm text-ink-muted mt-1">{service.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900" style={{ fontFamily:'var(--font-syne)' }}>
                        {service.price}
                      </p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mt-1">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        Inactive
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-surface-border">
                    <button
                      onClick={() => setEditingService(service)}
                      className="flex-1 py-2 bg-surface-soft rounded-xl text-sm font-medium text-brand hover:bg-surface-muted transition-all"
                      style={{ fontFamily:'var(--font-outfit)' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleActive(service.id)}
                      className="flex-1 py-2 bg-green-100 rounded-xl text-sm font-medium text-green-700 hover:bg-green-200 transition-all"
                      style={{ fontFamily:'var(--font-outfit)' }}
                    >
                      Activate
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="py-2 px-3 bg-red-50 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 transition-all"
                      style={{ fontFamily:'var(--font-outfit)' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Service Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
              Add New Service
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-ink-muted mb-1 block font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                  Service Name
                </label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:border-brand focus:outline-none transition-all"
                  placeholder="e.g., Haircut"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-sm text-ink-muted mb-1 block font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                  Duration
                </label>
                <input
                  type="text"
                  value={newService.duration}
                  onChange={(e) => setNewService({...newService, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:border-brand focus:outline-none transition-all"
                  placeholder="e.g., 30 mins"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-sm text-ink-muted mb-1 block font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                  Price
                </label>
                <input
                  type="text"
                  value={newService.price}
                  onChange={(e) => setNewService({...newService, price: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:border-brand focus:outline-none transition-all"
                  placeholder="e.g., KES 500"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-2 border border-surface-border rounded-xl text-sm font-medium text-gray-600 hover:bg-surface-soft transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="flex-1 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] bg-white rounded-2xl p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily:'var(--font-outfit)' }}>
              Edit Service
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-ink-muted mb-1 block font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                  Service Name
                </label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-sm text-ink-muted mb-1 block font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                  Duration
                </label>
                <input
                  type="text"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({...editingService, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
              <div>
                <label className="text-sm text-ink-muted mb-1 block font-medium" style={{ fontFamily:'var(--font-outfit)' }}>
                  Price
                </label>
                <input
                  type="text"
                  value={editingService.price}
                  onChange={(e) => setEditingService({...editingService, price: e.target.value})}
                  className="w-full px-3 py-2 border border-surface-border rounded-xl text-sm focus:border-brand focus:outline-none transition-all"
                  style={{ fontFamily:'var(--font-outfit)' }}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingService(null)}
                className="flex-1 py-2 border border-surface-border rounded-xl text-sm font-medium text-gray-600 hover:bg-surface-soft transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateService}
                className="flex-1 py-2 bg-brand text-white rounded-xl text-sm font-medium hover:bg-brand/90 transition-all"
                style={{ fontFamily:'var(--font-outfit)' }}
              >
                Update Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
