export default function HelpCenterPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="mb-4">Welcome to our Help Center. Browse FAQs, policies, and guides to get the support you need.</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><a href="/faq" className="text-blue-600 underline">Frequently Asked Questions</a></li>
        <li><a href="/returns" className="text-blue-600 underline">Returns & Refund Policy</a></li>
        <li><a href="/contact-us" className="text-blue-600 underline">Contact Our Team</a></li>
      </ul>
    </div>
  );
}
