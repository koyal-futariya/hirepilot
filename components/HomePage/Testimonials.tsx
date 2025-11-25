// components/HomePage/Testimonials.tsx

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold text-black mb-8">Loved by Job Seekers Worldwide</h3>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* Testimonial 1 */}
          <div className="bg-[#F9FAFC] rounded-xl p-6 max-w-xs mx-auto shadow">
            <p className="text-gray-600 mb-4">
              “I landed 4 interviews in my first week! HirePilot’s auto apply is a total game changer.”
            </p>
            <div className="flex items-center gap-3 justify-center">
              <img
                src="https://avatar.vercel.sh/priya.svg?text=PS"
                className="w-10 h-10 rounded-full"
                alt="Priya S."
              />
              <span className="text-gray-900 font-semibold">Priya S.</span>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-[#F9FAFC] rounded-xl p-6 max-w-xs mx-auto shadow">
            <p className="text-gray-600 mb-4">
              “Applying for jobs used to take hours. Now it's just a few clicks—so easy and fast!”
            </p>
            <div className="flex items-center gap-3 justify-center">
              <img
                src="https://avatar.vercel.sh/rahul.svg?text=RM"
                className="w-10 h-10 rounded-full"
                alt="Rahul M."
              />
              <span className="text-gray-900 font-semibold">Rahul M.</span>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="bg-[#F9FAFC] rounded-xl p-6 max-w-xs mx-auto shadow">
            <p className="text-gray-600 mb-4">
              “HirePilot helped me land my dream role. I recommend it to all my friends.”
            </p>
            <div className="flex items-center gap-3 justify-center">
              <img
                src="https://avatar.vercel.sh/emily.svg?text=ED"
                className="w-10 h-10 rounded-full"
                alt="Emily D."
              />
              <span className="text-gray-900 font-semibold">Emily D.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
