import React from 'react';
import Link from 'next/link';
import CookieSettingsButton from './legal/CookieSettingsButton';
import Logo from './ui/Logo';

export default function Footer() {
  const footerLinks = {
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" }
    ],
    Travel: [
      { name: "Search Trips", href: "/" },
      { name: "Offers", href: "/offers" }
    ],
    Support: [
      { name: "Help Center", href: "/help" },
      { name: "Cancellation", href: "/help" },
      { name: "Refunds", href: "/help" }
    ]
  };

  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          
          <div className="col-span-2 lg:col-span-1 mb-8 lg:mb-0">
            <div className="mb-6">
              <Logo variant="long" theme="light" />
            </div>
            <p className="text-secondary text-sm">
              Your journey. Your choice. Compare trains and buses in one place.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.Company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-secondary hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Travel</h4>
            <ul className="space-y-3">
              {footerLinks.Travel.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-secondary hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.Support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-secondary hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-secondary hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-secondary hover:text-primary transition-colors text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-secondary hover:text-primary transition-colors text-sm">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-secondary hover:text-primary transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-secondary hover:text-primary transition-colors text-sm">
                  Accessibility Statement
                </Link>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-border pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-secondary space-y-4 md:space-y-0">
          <p>© 2026 TravelEase. All rights reserved.</p>
          <div>
            <CookieSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
