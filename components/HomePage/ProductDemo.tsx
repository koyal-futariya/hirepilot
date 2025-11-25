// components/HomePage/ProductDemo.tsx

export default function ProductDemo() {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-6">
          See HirePilot in Action
        </h2>
        <p className="text-gray-600 text-center mb-10 max-w-2xl">
          Discover how simple it is to automate your job search, apply to dozens of jobs with one click, and track all your applications in one clear dashboard.
        </p>
        <div className="w-full flex justify-center mb-4">
          {/* Replace the below <img> with your real screenshot, GIF, or embed a video player */}
          <img
            src="/demo.png"
            alt="HirePilot Application Dashboard"
            className="rounded-2xl shadow-2xl max-w-full max-h-[340px] border border-gray-200"
          />
        </div>
        {/* Optional: Add a video link or “Watch Demo” button */}
        <a
          href="https://www.youtube.com/watch?v=ntLJmHOJ0ME&list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-blue-600 font-semibold hover:underline"
        >
          Watch Full Demo &rarr;
        </a>
      </div>
    </section>
  );
}
