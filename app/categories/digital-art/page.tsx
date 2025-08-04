<button
  className="snipcart-add-item bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  data-item-id={art.id}
  data-item-name={art.title}
  data-item-price={art.price}
  data-item-url="/categories/digital-art"
  data-item-description={art.description}
  data-item-image={art.image}
  data-item-custom1-name="download_url"
  data-item-custom1-value={art.fileUrl}
  data-item-custom1-type="hidden"
>
  Add to Cart
</button>
