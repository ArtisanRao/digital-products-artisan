"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Package, CreditCard, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import Image from "next/image"

// ✅ single source of truth for product data
import { productsBySlug, type Product } from "@/data/products"
import { formatCurrency } from "@/lib/money" // ← centralized currency formatter

interface Order {
  id: string
  date: string
  total: number
  status: "completed" | "pending" | "failed"
  items: Array<{
    id: number
    title: string
    price: number
    downloadUrl: string
    image: string
  }>
}

interface Subscription {
  id: string
  plan: string
  status: "active" | "cancelled" | "expired"
  nextBilling: string
  amount: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalDownloads: 0,
    activeSubscriptions: 0,
  })

  useEffect(() => {
    // ---- Example order built from the catalog (no hard-coded prices) ----
    const pick = (slug: string): Product | undefined => productsBySlug[slug]

    const p1 = pick("chatgpt-side-hustles")
    const p2 = pick("passive-income-ebook")

    const items: Order["items"] = [p1, p2]
      .filter(Boolean)
      .map((p) => ({
        id: p!.id,
        title: p!.title,
        price: p!.price, // ← dynamic from catalog
        downloadUrl: p!.downloadPath ? `/private/${p!.downloadPath}` : `/downloads/${p!.slug}.zip`,
        image: p!.image,
      }))

    const total = items.reduce((sum, it) => sum + it.price, 0)

    const exampleOrder: Order = {
      id: "order_demo_001",
      date: new Date().toISOString().slice(0, 10),
      total,
      status: "completed",
      items,
    }

    setOrders([exampleOrder])

    // Subscriptions can remain mocked or be fetched from your backend/Stripe
    setSubscriptions([
      {
        id: "sub_demo_001",
        plan: "Pro Monthly",
        status: "active",
        nextBilling: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
        amount: 29.99,
      },
    ])

    // Derive stats from orders/subscriptions
    const totalOrders = 1
    const totalSpent = total
    const totalDownloads = items.length
    const activeSubscriptions = 1

    setStats({ totalOrders, totalSpent, totalDownloads, activeSubscriptions })
  }, [])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600">Manage your orders, downloads, and subscriptions</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-blue-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-gray-600 text-sm">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-green-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                <p className="text-gray-600 text-sm">Total Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Download className="w-8 h-8 text-purple-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
                <p className="text-gray-600 text-sm">Downloads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-orange-600 mr-4" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                <p className="text-gray-600 text-sm">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="downloads">Downloads</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(order.total)}</p>
                        <Badge variant={order.status === "completed" ? "default" : "secondary"}>{order.status}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                            <span className="text-sm">{item.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700">{formatCurrency(item.price)}</span>
                            <Button size="sm" variant="outline" asChild>
                              <a href={item.downloadUrl} download>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders
                  .flatMap((order) => order.items)
                  .map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover rounded mb-3"
                        />
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <Button size="sm" className="w-full" asChild>
                          <a href={item.downloadUrl} download>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((subscription) => (
                  <div key={subscription.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{subscription.plan}</h3>
                        <p className="text-sm text-gray-600">
                          Next billing: {new Date(subscription.nextBilling).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(subscription.amount)}/month</p>
                        <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                          {subscription.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-4 space-x-2">
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div className="pt-4">
                  <Button>Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
