const footerLinks = {
  Company: [
    "About Us", "Swiggy Corporate", "Careers",
    "Team", "Swiggy One", "Swiggy Instamart",
    "Swiggy Dineout", "Minis", "Pyng",
  ],
  "Contact us": ["Help & Support", "Partner With Us", "Ride With Us"],
  Legal: ["Terms & Conditions", "Cookie Policy", "Privacy Policy"],
  "Life at Swiggy": ["Explore With Swiggy", "Swiggy News", "Snackables"],
};

const availableCities = ["Bangalore", "Gurgaon", "Hyderabad", "Delhi", "Mumbai", "Pune"];

const socialIcons = [
  {
    name: "LinkedIn",
    path: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    name: "Instagram",
    path: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 3h9A4.5 4.5 0 0121 7.5v9a4.5 4.5 0 01-4.5 4.5h-9A4.5 4.5 0 013 16.5v-9A4.5 4.5 0 017.5 3z",
  },
  {
    name: "Facebook",
    path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
  },
  {
    name: "Pinterest",
    path: "M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.56 1.9-2.56.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.85 0 3.1-2.38 3.1-5.2 0-2.14-1.45-3.74-4.07-3.74-2.96 0-4.79 2.21-4.79 4.67 0 .85.25 1.44.64 1.9.18.22.21.3.14.55-.05.18-.15.61-.19.78-.06.25-.25.34-.46.25-1.28-.52-1.87-1.93-1.87-3.5 0-2.6 2.19-5.73 6.53-5.73 3.49 0 5.79 2.53 5.79 5.25 0 3.6-1.99 6.29-4.92 6.29-.98 0-1.91-.53-2.23-1.12l-.63 2.43c-.23.88-.85 1.98-1.27 2.65.95.29 1.96.45 3 .45 5.52 0 10-4.48 10-10S17.52 2 12 2z",
  },
  {
    name: "Twitter",
    path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 pb-10 border-b border-gray-200">

          {/* Logo + Copyright */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-md">
                <svg viewBox="0 0 36 36" className="w-6 h-6 fill-white">
                  <path d="M18 3C9.7 3 3 9.7 3 18s6.7 15 15 15 15-6.7 15-15S26.3 3 18 3zm0 5c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4zm0 21.2c-3.7 0-7-1.9-9-4.8.04-3 6-4.65 9-4.65s8.96 1.65 9 4.65c-2 2.9-5.3 4.8-9 4.8z" />
                </svg>
              </div>
              <span className="text-2xl font-extrabold text-orange-500">Swiggy</span>
            </a>
            <p className="text-sm text-gray-500 font-medium">© 2025 Swiggy Limited</p>
          </div>

          {/* Footer Link Columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-extrabold text-gray-900 mb-4">{heading}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Available In */}
          <div>
            <h4 className="text-sm font-extrabold text-gray-900 mb-4">Available in:</h4>
            <ul className="space-y-3 mb-4">
              {availableCities.map(city => (
                <li key={city}>
                  <a href="#" className="text-sm text-gray-500 hover:text-orange-500 transition-colors">{city}</a>
                </li>
              ))}
            </ul>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-600 outline-none cursor-pointer hover:border-orange-400 transition-colors">
              <option>685 cities</option>
            </select>
          </div>
        </div>

        {/* Social Links row */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-extrabold text-gray-900 mb-3">Social Links</h4>
            <div className="flex items-center gap-4">
              {socialIcons.map(icon => (
                <a key={icon.name} href="#" aria-label={icon.name}
                  className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center hover:border-orange-400 hover:text-orange-500 text-gray-500 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip - app download */}
        <div className="border-t border-gray-200 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-base font-semibold text-gray-700">
            For better experience, download the Swiggy app now
          </p>
          <div className="flex items-center gap-3">
            {/* App Store */}
            <a href="#" className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2.5 hover:bg-gray-800 transition-colors">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div>
                <div className="text-xs text-gray-400 leading-none">Download on the</div>
                <div className="text-sm font-bold leading-tight">App Store</div>
              </div>
            </a>

            {/* Google Play */}
            <a href="#" className="flex items-center gap-2 bg-black text-white rounded-xl px-4 py-2.5 hover:bg-gray-800 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path d="M3.18 23.76c.38.2.82.21 1.24-.02l12.55-7.25-2.83-2.83-10.96 10.1z" fill="#EA4335" />
                <path d="M20.93 10.02L17.97 8.3 14.9 11.36l3.07 3.07 2.98-1.72c.85-.49.85-1.7-.02-2.19z" fill="#FBBC04" />
                <path d="M3.18.24L14.14 11.2l-2.83 2.83L1.94 2.27c-.4-.47-.38-1.56.24-2.03h1z" fill="#34A853" />
                <path d="M3.18.24c-.38-.2-.83-.22-1.24.03C1.1.74.82 1.5.82 2.27v19.46c0 .77.28 1.53.88 2l.48.27L14.14 13.03 3.18.24z" fill="#4285F4" />
              </svg>
              <div>
                <div className="text-xs text-gray-400 leading-none">GET IT ON</div>
                <div className="text-sm font-bold leading-tight">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
