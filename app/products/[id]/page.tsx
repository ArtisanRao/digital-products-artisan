import { notFound } from "next/navigation"
import Link from "next/link"
import { products } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Download } from "lucide-react"
import ProductGallery from "@/components/product-gallery"

type Params = { id: string }

export async function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const p = products.find((x) => x.id === Number(id))
  if (!p) return { title: "Product not found" }
  return {
    title: `${p.title} | Digital Products Artisan`,
    description: p.description,
    openGraph: { images: [{ url: p.image }] },
  }
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { id } = await params
  const product = products.find((p) => p.id === Number(id))
  if (!product) return notFound()

  return (
    <main className="container mx-auto px-4 py-10">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/products" className="hover:underline">← Back to all products</Link>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            {/* Full-cover visible + thumbnails */}
            <ProductGallery
              images={product.images ?? [product.image]}
              alt={product.title}
            />
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
              <span className="text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            {/* Still linking to your checkout page for now */}
            <Button asChild className="bg-gradient-to-r from-blue-600 to-cyan-600">
              <Link href={`/checkout?product=${product.id}`}>Buy now</Link>
            </Button>
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
