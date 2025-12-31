export function CheckoutExpressMethods() {
  return (
    <section className="space-y-4">
      <h2 className="text-xs tracking-wider uppercase">EXPRESS CHECKOUT</h2>

      <button className="w-full bg-[#FFC439] py-3 text-sm font-medium text-black transition-opacity hover:opacity-90">
        PayPal
      </button>

      <div className="relative text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-black/10"></div>
        </div>
        <div className="relative bg-white px-4">
          <span className="text-xs uppercase">OR CONTINUE BELOW</span>
        </div>
      </div>
    </section>
  );
}
