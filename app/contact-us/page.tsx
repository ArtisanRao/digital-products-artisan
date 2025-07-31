export default function ContactUsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-4">Have questions or need help? Reach out using the form below or email us at <a href="mailto:support@digitalproductsartisan.com" className="text-blue-600 underline">support@digitalproductsartisan.com</a>.</p>
      <form className="space-y-4">
        <input type="text" placeholder="Your Name" className="w-full border p-2 rounded" />
        <input type="email" placeholder="Your Email" className="w-full border p-2 rounded" />
        <textarea placeholder="Your Message" className="w-full border p-2 rounded h-32"></textarea>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Send Message</button>
      </form>
    </div>
  );
}
