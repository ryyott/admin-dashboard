export function CheckoutShippingForm() {
  return (
    <section className="space-y-4">
      <h2 className="text-xs tracking-wider uppercase">SHIPPING ADDRESS</h2>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First name"
          className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Last name"
          className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
        />
      </div>

      <input
        type="text"
        placeholder="Address"
        className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
      />

      <input
        type="text"
        placeholder="Apartment, unit, etc. (optional)"
        className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
      />

      <input
        type="text"
        placeholder="City"
        className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
      />

      <div className="grid grid-cols-3 gap-4">
        <select className="col-span-1 border border-black bg-white px-4 py-3 text-sm uppercase focus:border-black/60 focus:outline-none">
          <option>United States</option>
          <option>Canada</option>
          <option>United Kingdom</option>
        </select>
        <input
          type="text"
          placeholder="State"
          className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
        />
        <input
          type="text"
          placeholder="ZIP"
          className="border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <select className="col-span-1 border border-black bg-white px-2 py-3 text-sm focus:border-black/60 focus:outline-none">
          <option>🇺🇸 +1</option>
          <option>🇨🇦 +1</option>
          <option>🇬🇧 +44</option>
        </select>
        <input
          type="tel"
          placeholder="Phone number"
          className="col-span-3 border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
        />
      </div>

      <p className="text-xs text-black/60">Enter your shipping address to see available shipping options.</p>
    </section>
  );
}
