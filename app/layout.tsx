<DropdownMenuContent>
  {session ? (
    // ... your logged-in menu items
  ) : (
    <>
      <DropdownMenuItem asChild>
        <Link href="/login">Login</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/signup">Sign Up</Link>
      </DropdownMenuItem>
    </>
  )}
</DropdownMenuContent>  
