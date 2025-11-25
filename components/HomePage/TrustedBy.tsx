// components/HomePage/TrustedBy.tsx

export default function TrustedBy() {
  return (
    <section className="bg-[#F9FAFC] py-10">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-base text-gray-500 mb-6 font-semibold tracking-wide">
          Trusted by candidates at
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
          <img src="/logos/linkedin.svg" alt="LinkedIn" className="h-8 w-auto" />
          <img src="/logos/indeed.svg" alt="Indeed" className="h-8 w-auto" />
          <img src="/logos/google.svg" alt="Google" className="h-8 w-auto" />
          <img src="/logos/microsoft.svg" alt="Microsoft" className="h-8 w-auto" />
          <img src="/logos/zoho.svg" alt="Zoho" className="h-8 w-auto" />
        </div>
      </div>
    </section>
  );
}
