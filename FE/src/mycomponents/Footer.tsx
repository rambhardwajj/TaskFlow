import {cn} from '@/lib/utils';
import {JSX} from 'react';

export interface FooterProps {

  tagline: string;
  socialLinks: {
    icon: JSX.Element;
    href: string;
    label: string;
  }[];
  socialLinksStyle?: string;
  linkSections: {
    title: string;
    links: {
      name: string;
      href: string;
    }[];
  }[];
  linkStyle?: string;
  copyrightText: string;
  builtByText: string;
  className?: string;
}

const Footer = ({

  tagline,
  socialLinks,
  socialLinksStyle,
  linkSections,
  linkStyle,
  copyrightText,
  builtByText,
  className = '',
}: FooterProps) => {

  return (
    <footer
      className={`w-full px-4 sm:px-8 md:px-10  bg-neutral-900 border-t-neutral-800 border-t ${className}`}
    >
      <div className="max-w-7xl mx-auto py-8 flex flex-col gap-10 md:flex-row md:justify-between">
        {/* Left Section */}
        <div className="flex flex-col gap-6 max-w-md">
          <div className="w-20 hover:scale-105 transition-all cursor-pointer">
            <img
              alt="Logo"
              className="h-full w-full object-contain"
              src={'logo.png'}
            />
          </div>

          <p className="text-sm  text-cyan-600 ">{tagline}</p>

          {/* social links */}
          <div className="flex gap-4 text-neutral-500">
            {socialLinks.map(({icon, href, label}) => (
              <a
                key={label}
                href={href}
                target="_blank"
                aria-label={label}
                rel="noopener noreferrer"
                className={cn(
                  'hover:text-neutral-800 hover:scale-105 transition-all',
                  socialLinksStyle
                )}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm  text-neutral-400">
          {linkSections.map(({title, links}) => (
            <div key={title} className="flex flex-col gap-2">
              <h3 className="text-neutral-800  font-semibold">
                {title}
              </h3>
              {/* links */}
              {links.map(({name, href}) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    ' hover:text-neutral-100',
                    linkStyle
                  )}
                >
                  {name}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className=" ">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-sm text-neutral-800 gap-3">
          <div>© 2025 {copyrightText}. All rights reserved.</div>
          <div>
            <span>Built with ❤️ by </span>{' '}
            <span className="underline cursor-pointer">{builtByText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export {Footer};
