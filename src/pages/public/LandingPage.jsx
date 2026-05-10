import { Link } from 'react-router-dom'
import { FiZap, FiSun, FiTool, FiGrid, FiPackage, FiSettings } from 'react-icons/fi'

const serviceCards = [
  {
    icon: FiSun,
    title: 'Solar Rooftop',
    desc: 'Complete supply and installation of solar rooftop systems for commercial and residential buildings.',
  },
  {
    icon: FiZap,
    title: 'Transformer Installation',
    desc: 'Professional installation of distribution transformers including civil and electrical works.',
  },
  {
    icon: FiGrid,
    title: 'Substation Construction',
    desc: 'End-to-end construction of electrical substations for utility and industrial clients.',
  },
  {
    icon: FiSun,
    title: 'Solar PV Utility Plant',
    desc: 'Design, supply, and construction of utility-scale solar photovoltaic power plants.',
  },
  {
    icon: FiTool,
    title: 'Transmission & Distribution',
    desc: 'Layout, design, and construction of transmission and distribution systems nationwide.',
  },
  {
    icon: FiSettings,
    title: 'Electrical Layout & Design',
    desc: 'Complete layout and design of electrical systems for commercial and industrial facilities.',
  },
]

const stats = [
  { value: '310+', label: 'Clients Served' },
  { value: '2,300+', label: 'Projects Delivered' },
  { value: '4,000+', label: 'Transformers Installed' },
  { value: '12,550 km', label: 'Power Lines Covered' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-blue text-white py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #22c55e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2d8cf0 0%, transparent 50%)' }}
        />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block bg-brand-green/20 text-brand-greenLight text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            Wyn Power Corporation
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Powering the Philippines
          </h1>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Order electrical products and request specialized services from Wyn Power Corporation online.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/catalog" className="btn-primary px-8 py-3 text-base">Browse Products</Link>
            <Link to="/services" className="px-8 py-3 text-base rounded-lg border border-white text-white hover:bg-white hover:text-brand-blue transition-colors">Our Services</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-greenDark py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="font-display text-3xl font-bold text-white">{value}</p>
              <p className="text-green-200 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-brand-blue mb-3">What We Offer</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From solar installations to substation construction, we deliver end-to-end electrical solutions across the Philippines.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {serviceCards.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-brand-green transition-all group">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-green transition-colors">
                  <Icon className="w-6 h-6 text-brand-green group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display font-semibold text-brand-blue mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                <Link to="/services" className="inline-flex items-center gap-1 text-brand-green text-sm font-medium mt-4 hover:underline">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-display text-3xl font-bold text-brand-blue mb-4">Quality Electrical Products</h2>
            <p className="text-gray-500 mb-6">Browse our catalog of transformers, street lighting, and control panels — all available for delivery nationwide.</p>
            <Link to="/catalog" className="btn-primary px-8 py-3">Browse Catalog</Link>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            {[
              { icon: FiPackage, label: 'Transformers' },
              { icon: FiZap, label: 'Street Lighting' },
              { icon: FiGrid, label: 'Control Panels' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-5 text-center border border-gray-100">
                <Icon className="w-8 h-8 text-brand-green mx-auto mb-2" />
                <p className="text-sm font-medium text-brand-blue">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-brand-blue py-16 px-6 text-center">
        <h2 className="font-display text-3xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-blue-200 mb-8">Create an account and place your first order today.</p>
        <Link to="/register" className="btn-primary px-10 py-3 text-base">Get Started</Link>
      </section>
    </div>
  )
}