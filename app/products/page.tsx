useEffect(() => {
  const fetchProducts = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase env vars missing:", { supabaseUrl, supabaseAnonKey });
      setError("Supabase configuration missing. Products cannot be loaded.");
      setLoading(false);
      return;
    }

    const supabase = getSupabaseClient();
    setLoading(true);

    try {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Supabase fetch error:", error);
        setError(`Failed to load products: ${error.message}`);
        setProducts([]);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("No products found in Supabase table.");
        setError("No products available right now.");
        setProducts([]);
        return;
      }

      setProducts(data);
      setError(null);
    } catch (err: any) {
      console.error("Unexpected error fetching products:", err);
      setError(`Unexpected error: ${err.message || err}`);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);
