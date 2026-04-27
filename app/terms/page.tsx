import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - PATA',
  description: 'Terms of Service for PATA platform',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-chalk">
      <div className="max-w-[480px] mx-auto px-5 py-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <h1 className="text-2xl font-serif font-semibold text-ink mb-6">
            Terms of Service
          </h1>
          
          <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="font-semibold text-base text-ink mb-3">1. Overview</h2>
              <p>PATA is a platform that connects users with independent service providers (e.g., barbers, stylists, photographers).</p>
              <p>We do not directly provide services listed on the platform.</p>
              <p>By using PATA, you agree to these Terms.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">2. Eligibility</h2>
              <p>You must:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Be at least 18 years old (or have guardian consent)</li>
                <li>Provide accurate account information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">3. User Accounts</h2>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Keeping your login details secure</li>
                <li>All activity under your account</li>
              </ul>
              <p>We may suspend accounts for misuse.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">4. Bookings</h2>
              <p>Bookings are made between you and the service provider</p>
              <p>Providers are responsible for:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Service quality</li>
                <li>Availability</li>
                <li>Pricing</li>
              </ul>
              <p>PATA only facilitates discovery and booking.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">5. Payments (Future-Ready Clause)</h2>
              <p>If payments are enabled:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Payments may be processed via third-party providers such as Safaricom (e.g., M-Pesa)</li>
                <li>PATA may charge service or booking fees</li>
                <li>Refunds depend on provider policies unless stated otherwise</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">6. Cancellations & No-Shows</h2>
              <p>Each provider sets their own cancellation policy</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Users may be penalized for repeated no-shows</li>
                <li>Providers may refuse future bookings</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">7. Reviews & Content</h2>
              <p>You may leave reviews, but you must not:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Post false or misleading information</li>
                <li>Use abusive or harmful language</li>
                <li>Upload inappropriate content</li>
              </ul>
              <p>We may remove content at our discretion.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">8. Messaging & Communication</h2>
              <p>PATA may provide chat features and external links to platforms like WhatsApp.</p>
              <p>We are not responsible for conversations or agreements made outside of the platform.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">9. Limitation of Liability</h2>
              <p>PATA is not liable for:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Service quality issues</li>
                <li>Injuries, damages, or losses</li>
                <li>Missed appointments</li>
                <li>Disputes between users and providers</li>
              </ul>
              <p>Use of platform at your own risk.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">10. Termination</h2>
              <p>We may suspend or terminate accounts that:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violate these terms</li>
                <li>Abuse the platform</li>
                <li>Engage in fraudulent behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">11. Changes to Terms</h2>
              <p>We may update these Terms at any time. Continued use = acceptance.</p>
            </section>

            <section>
              <h2 className="font-semibold text-base text-ink mb-3">12. Governing Law</h2>
              <p>These Terms are governed by the laws of:</p>
              <p className="font-medium">Kenya</p>
            </section>

            <section className="mt-8 p-4 bg-stone-50 rounded-xl">
              <h3 className="font-semibold text-base text-ink mb-3">⚠️ IMPORTANT (READ THIS)</h3>
              <p className="text-stone-600 mb-2">This is a strong startup baseline, but:</p>
              <ul className="list-disc list-inside ml-4 space-y-2 text-stone-600">
                <li>It is NOT a substitute for a lawyer</li>
                <li>Once you add: Payments, Real providers, Real disputes</li>
                <li>You should get a Kenyan legal review</li>
              </ul>
              <p className="text-stone-700 font-medium mt-2">Most startups ignore this until it&apos;s too late.</p>
              <p className="text-stone-600">You didn&apos;t. That already puts you ahead.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
