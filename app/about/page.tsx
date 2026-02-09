import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="bg-[#faf7f3]">
      <section className="mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-24">
        {/* Заголовок */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-light tracking-[0.2em] text-[#2E4C9A]">
            О НАС
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-base md:text-lg leading-7 text-black/55">
            at elegant vogue , we blend creativity with craftsmanship to create fashion that
            transcends trends and stands the test of time each design is meticulously crafted,
            ensuring the highest quality exquisite finish
          </p>
        </div>

        {/* Галерея */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 items-end">
          {/* card 1 */}
          <div className="overflow-hidden bg-white shadow-sm border border-black/10">
            <div className="relative h-[260px] w-full md:h-[320px]">
              <Image
                src="/images/about/about-1.jpg"
                alt="About image 1"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* card 2 */}
          <div className="overflow-hidden bg-white shadow-sm border border-black/10 translate-y-6 lg:translate-y-10">
            <div className="relative h-[260px] w-full md:h-[320px]">
              <Image
                src="/images/about/about-2.jpg"
                alt="About image 2"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* card 3 */}
          <div className="overflow-hidden bg-white shadow-sm border border-black/10">
            <div className="relative h-[260px] w-full md:h-[320px]">
              <Image
                src="/images/about/about-3.jpg"
                alt="About image 3"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* card 4 */}
          <div className="overflow-hidden bg-white shadow-sm border border-black/10 translate-y-4 lg:translate-y-8">
            <div className="relative h-[260px] w-full md:h-[320px]">
              <Image
                src="/images/about/about-4.jpg"
                alt="About image 4"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
