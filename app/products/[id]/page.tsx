import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Download } from "lucide-react"

type PageProps = { params: { id: string } }

export async function generateStaticParams() {
  return products.map(p => ({ id: String(p.id) }))
}

export function generateMetadata({ params }: PageProps) {
  const p = products.find(x => x.id === Number(params.id))
  if (!p) return { title: "Product not found" }
  return {
    title: `${p.title} | Digital Products Artisan`,
    description: p.description,
    openGraph: { images: [{ url: p.image }] },
  }
}

export default function ProductPage({ params }: PageProps) {
  const product = products.find(p => p.id === Number(params.id))
  if (!product) return notFound()

  return (
    <main className="container mx-auto px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:underline">← Back to all products</Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
                priority
              />
            </div>
          </CardContent>
        </Card>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{product.title}</h1>
          <p className="mt-3 text-gray-600">{product.description}</p>

          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{product.rating}</span>
            <span>({product.reviews} reviews)</span>
            <span>•</span>
            <span>{product.downloads} downloads</span>
          </div>

          <div className="mt-6 flex items-center space-x-3">
            <span className="text-2xl font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            {/* Adjust this to your real checkout flow */}
            <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Link href={`/checkout?product=${product.id}`}>Buy now</Link>
            </Button>

            {/* If you want this to download a file after purchase, route it accordingly.
                For now, take users to the same detail page (no 404).
            */}
            <Button variant="outline" asChild>
              <Link href={`/checkout?product=${product.id}`}>
                <Download className="w-4 h-4 mr-2" />
                Download after purchase
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
