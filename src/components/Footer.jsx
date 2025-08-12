export default function Footer() {
  return (
    <footer className="py-10 border-t border-base-200">
      <div className="container flex flex-col items-center text-center gap-4">
        {/* Brand & Contact Info */}
        <div>
          <p className="font-bold">Milink Digital Agency</p>
          <p className="text-sm opacity-80">
            📍 GTA, Ontario, Canada | 📧 info@milink.com | 📞 +1 (437) 999-3668
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4">
          {[
            {
              href: "https://www.instagram.com",
              label: "Instagram",
              icon: (
                <path d="M7.5 2A5.5 5.5 0 002 7.5v9A5.5 5.5 0 007.5 22h9a5.5 5.5 0 005.5-5.5v-9A5.5 5.5 0 0016.5 2h-9zm0 2h9A3.5 3.5 0 0120 7.5v9a3.5 3.5 0 01-3.5 3.5h-9A3.5 3.5 0 014 16.5v-9A3.5 3.5 0 017.5 4zm9.25 1a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
              ),
            },
            {
              href: "https://www.linkedin.com",
              label: "LinkedIn",
              icon: (
                <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7.5 0h3.7v2.3h.05c.52-1 1.8-2.3 3.7-2.3 3.96 0 4.7 2.6 4.7 6v9.7h-4V15c0-2.2 0-5-3-5s-3.5 2.3-3.5 4.8V24h-4V8z" />
              ),
            },
            {
              href: "https://wa.me/14379993668",
              label: "WhatsApp",
              icon: (
                <path d="M20.52 3.48A11.78 11.78 0 0012 0C5.38 0 0 5.38 0 12c0 2.12.55 4.18 1.6 6.02L0 24l6.16-1.6A11.96 11.96 0 0012 24c6.62 0 12-5.38 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 21.82c-1.83 0-3.6-.5-5.14-1.45l-.37-.22-3.65.95.97-3.56-.24-.37a9.78 9.78 0 01-1.52-5.17c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.09 1.02 6.94 2.88 1.85 1.85 2.88 4.32 2.88 6.94 0 5.42-4.4 9.82-9.82 9.82zm5.6-7.4c-.31-.15-1.84-.91-2.13-1.02-.29-.11-.5-.15-.71.15-.21.29-.82 1.02-1.01 1.23-.19.21-.37.23-.68.08-.31-.15-1.31-.48-2.5-1.53-.92-.82-1.53-1.83-1.71-2.14-.18-.31-.02-.48.13-.63.14-.14.31-.37.46-.55.15-.18.2-.31.31-.52.1-.21.05-.4-.02-.55-.08-.15-.71-1.72-.97-2.36-.26-.63-.52-.54-.71-.55h-.61c-.21 0-.55.08-.84.4-.29.31-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.15.21 2.22 3.39 5.37 4.75.75.32 1.34.51 1.8.65.76.24 1.45.21 2-.13.31-.21 1.02-1.01 1.17-1.42.15-.4.15-.74.1-.82-.05-.08-.29-.18-.6-.32z" />
              ),
            },
          ].map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              aria-label={item.label}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-circle btn-outline text-base-content/80 border-base-content/40 hover:bg-base-content/10 hover:text-base-content hover:border-base-content transition-all duration-300 transform hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="h-4 w-4"
              >
                {item.icon}
              </svg>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="opacity-70 text-sm">
          © {new Date().getFullYear()} Milink. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
