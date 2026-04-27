import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - PATA',
  description: 'Privacy Policy for PATA platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-chalk">
      <div className="max-w-[480px] mx-auto px-5 py-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <h1 className="text-2xl font-serif font-semibold text-ink mb-6">
            Privacy Policy
          </h1>
          
          <div className="space-y-6 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="font-semibold text-base text-ink mb-3">🔐 PATA — PRIVACY POLICY</h2>
              <p className="text-stone-600 mb-2">Effective Date: [Insert Date]</p>
              
              <h3 className="font-medium text-ink mb-2">1. Information We Collect</h3>
              <p>We may collect:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>a) Personal Info:</strong> Name, Email, Phone number</li>
                <li><strong>b) Usage Data:</strong> Pages visited, Interactions, Device/browser info</li>
                <li><strong>c) Location Data:</strong> Approximate location (for &quot;near you&quot; features)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">2. How We Use Your Data</h3>
              <p>We use your data to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide and improve services</li>
                <li>Enable bookings</li>
                <li>Personalize recommendations</li>
                <li>Communicate updates</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">3. Data Sharing</h3>
              <p>We do NOT sell your data.</p>
              <p>We may share data with:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Service providers (for bookings)</li>
                <li>Payment providers (if enabled, e.g., M-Pesa)</li>
                <li>Legal authorities (if required)</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">4. Data Storage</h3>
              <p>Data may be stored securely on cloud services</p>
              <p>We take reasonable measures to protect it</p>
              <p>No system is 100% secure</p>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">5. Cookies</h3>
              <p>We may use cookies to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Improve performance</li>
                <li>Analyze usage</li>
                <li>Maintain sessions</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">6. Your Rights</h3>
              <p>You may:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Request access to your data</li>
                <li>Request correction</li>
                <li>Request deletion</li>
              </ul>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">7. Third-Party Services</h3>
              <p>PATA may link to external platforms such as WhatsApp.</p>
              <p>We are not responsible for their privacy practices.</p>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">8. Children&apos;s Privacy</h3>
              <p>PATA is not intended for children under 13.</p>
            </section>

            <section>
              <h3 className="font-medium text-ink mb-2">9. Policy Updates</h3>
              <p>We may update this policy periodically.</p>
            </section>

            <section className="mt-8 p-4 bg-stone-50 rounded-xl">
              <h3 className="font-semibold text-base text-ink mb-3">🔐 Contact Information</h3>
              <p className="text-stone-600 mb-2">For privacy inquiries or data requests, contact us at:</p>
              <p className="text-stone-700 font-medium">privacy@pata.co.ke</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
