{/* Desktop Header */}
<div className="hidden md:flex items-center justify-center gap-8 w-full h-16">
  {/* Logo */}
  <Logo size="md" />

  {/* Menu Links */}
  <Link href="/products" className="nav-link">Products</Link>
  <Link href="/bundles" className="nav-link">Bundles</Link>
  <Link href="/categories" className="nav-link">Categories</Link>
  <Link href="/about" className="nav-link">About</Link>

  {/* Support Dropdown */}
  <DropdownMenu open={isSupportOpenDesktop} onOpenChange={setIsSupportOpenDesktop}>
    <DropdownMenuTrigger asChild>
      <button className="nav-link inline-flex items-center space-x-1">
        <span>Support</span>
        <ChevronDown className="w-3 h-3 mt-0.5" />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="border-blue-200">
      {[
        { href: '/help', label: 'Help Center' },
        { href: '/faq', label: 'FAQ' },
        { href: '/returns', label: 'Returns & Refund Policy' },
        { href: '/contact', label: 'Contact Us' },
      ].map(({ href, label }) => (
        <DropdownMenuItem key={href} asChild>
          <Link href={href} onClick={() => setIsSupportOpenDesktop(false)}>{label}</Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>

  {/* Search */}
  <div className="relative flex-shrink-0">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-4 h-4" />
    <Input
      type="search"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 w-64 border-blue-200 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-1 rounded-md"
      aria-label="Search products"
    />
    {searchTerm && (
      <button
        onClick={clearSearch}
        aria-label="Clear search input"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        &times;
      </button>
    )}
  </div>

  {/* Auth Buttons */}
  {user ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700 inline-flex items-center">
          <User className="w-4 h-4 mr-2" />
          {user.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-blue-200">
        <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/orders">My Orders</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href="/subscriptions">Subscriptions</Link></DropdownMenuItem>
        <DropdownMenuItem
          onClick={logout}
          className="hover:bg-red-50 hover:text-red-700 cursor-pointer"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <>
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">Login</Link>
      </Button>
      <Button size="sm" asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
        <Link href="/signup">Sign Up</Link>
      </Button>
    </>
  )}

  {/* Menu Button */}
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="hover:bg-blue-50">
        <Menu className="w-5 h-5 text-blue-600" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="border-blue-200">
      <DropdownMenuItem asChild>
        <Link href="/cart" className="flex items-center space-x-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span>Cart</span>
          {itemCount > 0 && (
            <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
              {itemCount}
            </span>
          )}
        </Link>
      </DropdownMenuItem>
      {!user ? (
        <>
          <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/signup">Sign Up</Link></DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem asChild><Link href="/dashboard">Dashboard</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/orders">My Orders</Link></DropdownMenuItem>
          <DropdownMenuItem asChild><Link href="/subscriptions">Subscriptions</Link></DropdownMenuItem>
          <DropdownMenuItem
            onClick={logout}
            className="hover:bg-red-50 hover:text-red-700 cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  </DropdownMenu>
</div>
