<!-- PAGE WRAP -->
<div class="min-h-screen bg-white text-[#1a1a1a]">
  <!-- HEADER (твоя шапка) -->
  <header class="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
    <div class="relative mx-auto flex h-16 items-center px-4 md:h-20 md:max-w-6xl md:px-6">
      <!-- LEFT: burger + desktop nav -->
      <div class="flex items-center gap-3 md:gap-10">
        <details class="group md:hidden">
          <summary
            aria-label="Open menu"
            class="list-none inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </summary>

          <nav class="absolute left-0 right-0 top-16 border-t border-black/10 bg-white shadow-sm">
            <div class="mx-auto max-w-6xl px-4 py-4">
              <a class="block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70" href="/">
                Home
              </a>
              <a class="block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70" href="/collections">
                Collections
              </a>
              <a class="block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70" href="/new">
                New
              </a>
            </div>
          </nav>
        </details>

        <nav class="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium text-[#2E4C9A]">
          <a class="hover:opacity-70" href="/">Home</a>
          <a class="hover:opacity-70" href="/collections">Collections</a>
          <a class="hover:opacity-70" href="/new">New</a>
        </nav>
      </div>

      <!-- CENTER: logo -->
      <a
        href="/"
        aria-label="Home"
        class="absolute left-1/2 -translate-x-1/2 inline-flex items-center"
      >
        <!-- Заменишь на <img src="/logo.svg" class="h-10 md:h-12 w-auto" /> -->
        <img
          src="https://dummyimage.com/140x48/ffffff/2E4C9A&text=MOE"
          alt="Logo"
          class="h-10 w-auto md:h-12"
        />
      </a>

      <!-- RIGHT: icon -->
      <div class="ml-auto flex items-center">
        <a
          href="/cart"
          aria-label="Cart"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2E4C9A] text-[#2E4C9A] hover:bg-black/5 md:h-12 md:w-12"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 7h15l-1.2 12H7.2L6 7Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M9 7a3 3 0 0 1 6 0"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </header>

  <!-- HERO -->
  <section class="mx-auto max-w-6xl px-4 md:px-6">
    <div class="mt-4 overflow-hidden rounded-2xl bg-black/5">
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2400&auto=format&fit=crop"
        alt="Hero"
        class="h-[320px] w-full object-cover md:h-[520px]"
      />
    </div>
  </section>

  <!-- BIG LOGO + LEFT SIDEBAR (как на макете) -->
  <section class="mx-auto max-w-6xl px-4 md:px-6">
    <div class="mt-10 grid gap-10 md:grid-cols-[320px_1fr]">
      <!-- LEFT COLUMN -->
      <aside class="space-y-6">
        <img
          src="https://dummyimage.com/220x120/ffffff/FF6A3D&text=MOE"
          alt="Big logo"
          class="h-auto w-[220px]"
        />

        <div class="space-y-2 text-[11px] uppercase tracking-wide text-black/45">
          <a class="block w-fit hover:text-black/70" href="#">Мальчики</a>
          <a class="block w-fit hover:text-black/70" href="#">Девочки</a>
        </div>

        <div class="rounded-md border border-black/10 bg-black/[0.02] px-3 py-2">
          <div class="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="text-black/40">
              <path
                d="M21 21l-4.3-4.3M10.8 18.6a7.8 7.8 0 1 1 0-15.6 7.8 7.8 0 0 1 0 15.6Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <input
              placeholder="Поиск"
              class="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
            />
          </div>
        </div>
      </aside>

      <!-- RIGHT COLUMN: NEW COLLECTION -->
      <div>
        <div class="flex items-end justify-between">
          <div>
            <p class="text-xs uppercase tracking-wide text-black/35">Новая</p>
            <h2 class="mt-1 text-2xl font-semibold tracking-tight">Коллекция</h2>
          </div>

          <div class="flex items-center gap-2">
            <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 hover:bg-black/5" aria-label="Prev">
              ‹
            </button>
            <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 hover:bg-black/5" aria-label="Next">
              ›
            </button>
          </div>
        </div>

        <div class="mt-6 grid gap-6 sm:grid-cols-2">
          <!-- product 1 -->
          <article class="group overflow-hidden rounded-2xl bg-black/5">
            <img
              src="https://images.unsplash.com/photo-1520975958225-9bbf8abf2541?q=80&w=1200&auto=format&fit=crop"
              alt="Product"
              class="h-[320px] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </article>

          <!-- product 2 -->
          <article class="group overflow-hidden rounded-2xl bg-black/5">
            <img
              src="https://images.unsplash.com/photo-1520975869011-44c2b55e3f0b?q=80&w=1200&auto=format&fit=crop"
              alt="Product"
              class="h-[320px] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </article>
        </div>
      </div>
    </div>
  </section>

  <!-- POPULAR PRODUCTS -->
  <section class="mx-auto max-w-6xl px-4 md:px-6">
    <div class="mt-16">
      <div class="flex items-end justify-between">
        <div>
          <p class="text-xs uppercase tracking-wide text-black/35">Популярные</p>
          <h2 class="mt-1 text-2xl font-semibold tracking-tight">Товары</h2>
        </div>

        <a href="#" class="text-sm text-black/40 hover:text-black/70">Посмотреть всё</a>
      </div>

      <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- card -->
        <article class="group">
          <div class="overflow-hidden rounded-2xl bg-black/5">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="Item"
              class="h-[260px] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </div>
          <div class="mt-3 text-xs text-black/40">Embroidered Seamster Shirt</div>
          <div class="mt-1 flex items-center justify-between text-sm">
            <span class="text-black/70">Basic Slim Fit T-Shirt</span>
            <span class="text-black/60">$ 199</span>
          </div>
        </article>

        <article class="group">
          <div class="overflow-hidden rounded-2xl bg-black/5">
            <img
              src="https://images.unsplash.com/photo-1520975958225-9bbf8abf2541?q=80&w=1200&auto=format&fit=crop"
              alt="Item"
              class="h-[260px] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </div>
          <div class="mt-3 text-xs text-black/40">Denim Shirt</div>
          <div class="mt-1 flex items-center justify-between text-sm">
            <span class="text-black/70">Basic Slim Fit T-Shirt</span>
            <span class="text-black/60">$ 199</span>
          </div>
        </article>

        <article class="group">
          <div class="overflow-hidden rounded-2xl bg-black/5">
            <img
              src="https://images.unsplash.com/photo-1520975869011-44c2b55e3f0b?q=80&w=1200&auto=format&fit=crop"
              alt="Item"
              class="h-[260px] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </div>
          <div class="mt-3 text-xs text-black/40">Blended Shirt</div>
          <div class="mt-1 flex items-center justify-between text-sm">
            <span class="text-black/70">Full Slim Zip</span>
            <span class="text-black/60">$ 199</span>
          </div>
        </article>

        <article class="group">
          <div class="overflow-hidden rounded-2xl bg-black/5">
            <img
              src="https://images.unsplash.com/photo-1520975732138-4a16c9f0b52b?q=80&w=1200&auto=format&fit=crop"
              alt="Item"
              class="h-[260px] w-full object-cover transition group-hover:scale-[1.02]"
            />
          </div>
          <div class="mt-3 text-xs text-black/40">Cotton T-Shirt</div>
          <div class="mt-1 flex items-center justify-between text-sm">
            <span class="text-black/70">Soft Mesh Washed Fit</span>
            <span class="text-black/60">$ 199</span>
          </div>
        </article>
      </div>

      <div class="mt-6 flex justify-center gap-2">
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 hover:bg-black/5" aria-label="Prev">
          ‹
        </button>
        <button class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 hover:bg-black/5" aria-label="Next">
          ›
        </button>
      </div>
    </div>
  </section>

  <!-- ALL CLOTHING -->
  <section class="mx-auto max-w-6xl px-4 md:px-6">
    <div class="mt-20">
      <div>
        <p class="text-xs uppercase tracking-wide text-black/35">Вся</p>
        <h2 class="mt-1 text-2xl font-semibold tracking-tight">Одежда</h2>
      </div>

      <div class="mt-6 flex flex-wrap items-center gap-6 text-sm text-black/45">
        <button class="text-black/80 hover:text-black">New</button>
        <button class="hover:text-black">Menswear</button>
        <button class="hover:text-black">Womenswear</button>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <article class="group overflow-hidden rounded-2xl bg-black/5">
          <img
            src="https://images.unsplash.com/photo-1520975732138-4a16c9f0b52b?q=80&w=1600&auto=format&fit=crop"
            alt="Item"
            class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
          />
          <div class="px-4 py-4">
            <div class="text-xs text-black/40">Cotton T-Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/70">Basic Heavy Weight</span>
              <span class="text-black/60">$ 199</span>
            </div>
          </div>
        </article>

        <article class="group overflow-hidden rounded-2xl bg-black/5">
          <img
            src="https://images.unsplash.com/photo-1520975869011-44c2b55e3f0b?q=80&w=1600&auto=format&fit=crop"
            alt="Item"
            class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
          />
          <div class="px-4 py-4">
            <div class="text-xs text-black/40">Cotton Pants</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/70">Soft Mesh Straight Fit</span>
              <span class="text-black/60">$ 199</span>
            </div>
          </div>
        </article>

        <article class="group overflow-hidden rounded-2xl bg-black/5">
          <img
            src="https://images.unsplash.com/photo-1520975958225-9bbf8abf2541?q=80&w=1600&auto=format&fit=crop"
            alt="Item"
            class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
          />
          <div class="px-4 py-4">
            <div class="text-xs text-black/40">Cotton T-Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/70">Soft Mesh Washed Fit</span>
              <span class="text-black/60">$ 199</span>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-10 flex justify-center">
        <button class="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black/80">
          Больше
          <span class="text-lg">⌄</span>
        </button>
      </div>
    </div>
  </section>

  <div class="h-16"></div>
</div>









Каталог 
<div class="min-h-screen bg-white text-[#111]">
  <!-- TOP: reuse header you already have -->
  <!-- сюда вставь твою шапку (header) -->
<header class="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
    <div class="relative mx-auto flex h-16 items-center px-4 md:h-20 md:max-w-6xl md:px-6">
      <!-- LEFT: burger + desktop nav -->
      <div class="flex items-center gap-3 md:gap-10">
        <details class="group md:hidden">
          <summary
            aria-label="Open menu"
            class="list-none inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-black/5 cursor-pointer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h10"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </summary>

          <nav class="absolute left-0 right-0 top-16 border-t border-black/10 bg-white shadow-sm">
            <div class="mx-auto max-w-6xl px-4 py-4">
              <a class="block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70" href="/">
                Home
              </a>
              <a class="block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70" href="/collections">
                Collections
              </a>
              <a class="block py-2 text-sm font-medium text-[#2E4C9A] hover:opacity-70" href="/new">
                New
              </a>
            </div>
          </nav>
        </details>

        <nav class="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium text-[#2E4C9A]">
          <a class="hover:opacity-70" href="/">Home</a>
          <a class="hover:opacity-70" href="/collections">Collections</a>
          <a class="hover:opacity-70" href="/new">New</a>
        </nav>
      </div>

      <!-- CENTER: logo -->
      <a
        href="/"
        aria-label="Home"
        class="absolute left-1/2 -translate-x-1/2 inline-flex items-center"
      >
        <!-- Заменишь на <img src="/logo.svg" class="h-10 md:h-12 w-auto" /> -->
        <img
          src="https://dummyimage.com/140x48/ffffff/2E4C9A&text=MOE"
          alt="Logo"
          class="h-10 w-auto md:h-12"
        />
      </a>

      <!-- RIGHT: icon -->
      <div class="ml-auto flex items-center">
        <a
          href="/cart"
          aria-label="Cart"
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2E4C9A] text-[#2E4C9A] hover:bg-black/5 md:h-12 md:w-12"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 7h15l-1.2 12H7.2L6 7Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
            <path
              d="M9 7a3 3 0 0 1 6 0"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </a>
      </div>
    </div>
  </header>
  <!-- PAGE -->
  <main class="mx-auto max-w-7xl px-4 md:px-6 py-8">
    <!-- BREADCRUMBS -->
    <div class="text-xs text-black/45">
      <a class="hover:text-black/70" href="/">Home</a>
      <span class="px-2">/</span>
      <span class="text-black/70">Products</span>
    </div>

    <!-- TITLE + SEARCH + TAGS (wraps on small screens) -->
    <div class="mt-3 grid gap-6 lg:grid-cols-[320px_1fr]">
      <!-- LEFT spacer (align with filters column on desktop) -->
      <div class="hidden lg:block"></div>

      <div>
        <h1 class="text-2xl font-semibold tracking-tight">PRODUCTS</h1>

        <div class="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
          <!-- SEARCH -->
          <div class="flex items-center gap-3 rounded-md border border-black/10 bg-black/[0.02] px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="text-black/35">
              <path
                d="M21 21l-4.3-4.3M10.8 18.6a7.8 7.8 0 1 1 0-15.6 7.8 7.8 0 0 1 0 15.6Z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <input
              class="w-full bg-transparent text-sm outline-none placeholder:text-black/35"
              placeholder="Search"
            />
          </div>

          <!-- TAGS -->
          <div class="flex flex-wrap gap-2 justify-start md:justify-end">
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">NEW</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">BEST SELLERS</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">SHIRTS</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">T-SHIRTS</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">POLO SHIRTS</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">JEANS</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">SHORTS</button>
            <button class="h-9 px-4 rounded-md border border-black/10 text-xs hover:bg-black/5">JACKETS</button>
          </div>
        </div>
      </div>
    </div>

    <!-- CONTENT: FILTERS + GRID -->
    <section class="mt-10 grid gap-10 lg:grid-cols-[320px_1fr]">
      <!-- FILTERS (left) -->
      <aside class="space-y-8">
        <h2 class="text-lg font-semibold">Filters</h2>

        <!-- Size -->
        <div>
          <div class="text-sm font-semibold">Size</div>
          <div class="mt-4 grid grid-cols-6 gap-2 max-w-[280px]">
            <button class="h-10 border border-black/15 text-xs hover:bg-black/5">XS</button>
            <button class="h-10 border border-black/15 text-xs hover:bg-black/5">S</button>
            <button class="h-10 border border-black/15 text-xs hover:bg-black/5">M</button>
            <button class="h-10 border border-black/15 text-xs hover:bg-black/5">L</button>
            <button class="h-10 border border-black/15 text-xs hover:bg-black/5">XL</button>
            <button class="h-10 border border-black/15 text-xs hover:bg-black/5">2X</button>
          </div>
        </div>

        <!-- Availability -->
        <div class="border-t border-black/10 pt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm font-semibold">Availability</div>
            <span class="text-black/40">^</span>
          </div>

          <div class="mt-4 space-y-3 text-sm">
            <label class="flex items-center gap-3">
              <input type="checkbox" class="h-4 w-4 accent-black" />
              <span class="text-black/70">Availability <span class="text-[#2E4C9A]">(450)</span></span>
            </label>

            <label class="flex items-center gap-3">
              <input type="checkbox" class="h-4 w-4 accent-black" />
              <span class="text-black/70">Out of Stock <span class="text-[#2E4C9A]">(18)</span></span>
            </label>
          </div>
        </div>

        <!-- Collapsible rows like in mock -->
        <button class="w-full border-t border-black/10 pt-6 flex items-center justify-between text-sm font-semibold">
          Category <span class="text-black/40">›</span>
        </button>

        <button class="w-full border-t border-black/10 pt-6 flex items-center justify-between text-sm font-semibold">
          Colors <span class="text-black/40">›</span>
        </button>

        <button class="w-full border-t border-black/10 pt-6 flex items-center justify-between text-sm font-semibold">
          Price Range <span class="text-black/40">›</span>
        </button>

        <button class="w-full border-t border-black/10 pt-6 flex items-center justify-between text-sm font-semibold">
          Collections <span class="text-black/40">›</span>
        </button>

        <button class="w-full border-t border-black/10 pt-6 flex items-center justify-between text-sm font-semibold">
          Tags <span class="text-black/40">›</span>
        </button>

        <button class="w-full border-t border-black/10 pt-6 flex items-center justify-between text-sm font-semibold">
          Ratings <span class="text-black/40">›</span>
        </button>
      </aside>

      <!-- PRODUCTS GRID (right) -->
      <div>
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <!-- CARD 1 -->
          <article class="group">
            <div class="overflow-hidden rounded-2xl bg-black/5">
              <img
                class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1520975869011-44c2b55e3f0b?q=80&w=1600&auto=format&fit=crop"
                alt="Product"
              />
            </div>
            <div class="mt-3 text-xs text-black/45">Cotton T Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/75">Basic Slim Fit T-Shirt</span>
              <span class="text-black/65">$ 199</span>
            </div>
          </article>

          <!-- CARD 2 -->
          <article class="group">
            <div class="overflow-hidden rounded-2xl bg-black/5">
              <img
                class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1520975958225-9bbf8abf2541?q=80&w=1600&auto=format&fit=crop"
                alt="Product"
              />
            </div>
            <div class="mt-3 text-xs text-black/45">Crewneck T-Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/75">Basic Heavy Weight T-Shirt</span>
              <span class="text-black/65">$ 199</span>
            </div>
          </article>

          <!-- CARD 3 -->
          <article class="group">
            <div class="overflow-hidden rounded-2xl bg-black/5">
              <img
                class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1520975732138-4a16c9f0b52b?q=80&w=1600&auto=format&fit=crop"
                alt="Product"
              />
            </div>
            <div class="mt-3 text-xs text-black/45">Cotton T Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/75">Full Sleeve Zipper</span>
              <span class="text-black/65">$ 199</span>
            </div>
          </article>

          <!-- CARD 4 -->
          <article class="group">
            <div class="overflow-hidden rounded-2xl bg-black/5">
              <img
                class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop"
                alt="Product"
              />
            </div>
            <div class="mt-3 text-xs text-black/45">Cotton T Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/75">Basic Heavy Weight T-Shirt</span>
              <span class="text-black/65">$ 199</span>
            </div>
          </article>

          <!-- CARD 5 -->
          <article class="group">
            <div class="overflow-hidden rounded-2xl bg-black/5">
              <img
                class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1520976080860-20d0e62eebf1?q=80&w=1600&auto=format&fit=crop"
                alt="Product"
              />
            </div>
            <div class="mt-3 text-xs text-black/45">Cotton T Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/75">Basic Heavy Weight T-Shirt</span>
              <span class="text-black/65">$ 199</span>
            </div>
          </article>

          <!-- CARD 6 -->
          <article class="group">
            <div class="overflow-hidden rounded-2xl bg-black/5">
              <img
                class="h-[360px] w-full object-cover transition group-hover:scale-[1.02]"
                src="https://images.unsplash.com/photo-1520976058702-9b3b1e3f33c7?q=80&w=1600&auto=format&fit=crop"
                alt="Product"
              />
            </div>
            <div class="mt-3 text-xs text-black/45">Cotton T Shirt</div>
            <div class="mt-1 flex items-center justify-between text-sm">
              <span class="text-black/75">Basic Heavy Weight T-Shirt</span>
              <span class="text-black/65">$ 199</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</div>


