import { Link } from 'react-router-dom'
export default function LandingPage() {
  return (
    <div>
      <section className="bg-brand-blue text-white py-24 px-6 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Powering the Philippines</h1>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">Order electrical products and request specialized services from Wyn Power Corporation online.</p>
        <div className="flex gap-4 justify-center">
          <Link to="/catalog" className="btn-primary">Browse Products</Link>
          <Link to="/services" className="btn-outline border-white text-white hover:bg-white hover:text-brand-blue">Our Services</Link>
        </div>
      </section>
    </div>
  )
}
