import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What are digital products and how do they work?",
    answer:
      "Digital products are downloadable files that you can access instantly after purchase. They include ebooks, templates, graphics, courses, and more. Once you buy a digital product, you'll receive a download link via email and can access your files immediately from your account dashboard.",
  },
  {
    question: "How do I optimize my digital products for SEO?",
    answer:
      "To optimize digital products for SEO: 1) Use keyword-rich titles and descriptions, 2) Create compelling meta descriptions, 3) Include relevant tags and categories, 4) Optimize file names with keywords, 5) Create landing pages with valuable content, 6) Build backlinks through content marketing, and 7) Use schema markup for better search visibility.",
  },
  {
    question: "What's included in your product bundles?",
    answer:
      "Our bundles combine multiple related products at a discounted price. Each bundle includes all individual files, bonus materials, and often exclusive content not available separately. You'll get instant access to everything with a single purchase, plus any future updates to the bundled products.",
  },
  {
    question: "How do bundle discounts work?",
    answer:
      "Bundle discounts automatically apply when you purchase multiple related products together. Savings range from 30-60% compared to buying items individually. The more products in a bundle, the greater your savings. All bundle purchases include lifetime access and updates.",
  },
  {
    question: "Can I resell or redistribute your digital products?",
    answer:
      "Our standard license allows personal and commercial use but prohibits resale or redistribution. However, we offer special reseller licenses for certain products. Please check the specific license terms for each product or contact us for reseller opportunities.",
  },
  {
    question: "What file formats do you provide?",
    answer:
      "We provide various formats depending on the product type: PDFs for ebooks and guides, PSD/AI/Figma files for design templates, DOCX for editable documents, PNG/JPG for graphics, and specialized formats for specific tools like Notion templates or Canva designs.",
  },
  {
    question: "Do you offer refunds on digital products?",
    answer:
      "Due to the instant nature of digital downloads, we have a 7-day satisfaction guarantee. If you're not completely satisfied with your purchase, contact us within 7 days for a full refund. We stand behind the quality of our products and want you to be happy with your purchase.",
  },
  {
    question: "How do I access my purchases after buying?",
    answer:
      "After purchase, you'll receive an email with download links and access to your customer dashboard. All your purchases are stored permanently in your account, so you can re-download files anytime. We also provide cloud storage links for easy access across devices.",
  },
]

export default function FAQSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know about our digital products and services</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-purple-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
