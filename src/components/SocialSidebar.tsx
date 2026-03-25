import type { ReactNode } from "react";
import { Facebook, Youtube } from "lucide-react";

type SocialLink = {
  label: string;
  href: string;
  icon: ReactNode;
  className: string;
};

function IconX(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className}
      fill="currentColor"
    >
      <path d="M18.9 2H22l-6.8 7.8L23.3 22h-6.6l-5.2-6.6L5.7 22H2.6l7.4-8.5L1 2h6.7l4.7 6.1L18.9 2Zm-1.1 18h1.7L6.8 3.9H5L17.8 20Z" />
    </svg>
  );
}

function IconWhatsApp(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className}
      fill="currentColor"
    >
      <path d="M20.5 3.5A11 11 0 0 0 3.4 17.2L2 22l4.9-1.3A11 11 0 0 0 22 12a11 11 0 0 0-1.5-8.5ZM12 20a9 9 0 0 1-4.6-1.2l-.3-.2-2.9.7.8-2.8-.2-.3A9 9 0 1 1 12 20Zm5.2-6.8c-.3-.2-1.6-.8-1.9-.9-.3-.1-.5-.2-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7 0a7.4 7.4 0 0 1-2.2-1.4 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.5 0 1.5 1.1 2.9 1.3 3.1.2.2 2.2 3.3 5.4 4.6.7.3 1.3.5 1.8.6.8.2 1.5.2 2.1.1.6-.1 1.6-.7 1.9-1.4.2-.7.2-1.3.2-1.4 0-.1-.3-.2-.6-.3Z" />
    </svg>
  );
}

function IconMessenger(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={props.className}
      fill="currentColor"
    >
      <path d="M12 2C6.3 2 2 6.2 2 11.8c0 3.2 1.5 6 4.1 7.9V22l3.2-1.8c.9.2 1.8.3 2.7.3 5.7 0 10-4.2 10-9.7S17.7 2 12 2Zm1 12.7-2.6-2.8-5.1 2.8 5.6-5.9 2.6 2.8 5.1-2.8-5.6 5.9Z" />
    </svg>
  );
}

const iconSize = "h-5 w-5";

const links: SocialLink[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/201111536173",
    icon: <IconWhatsApp className={iconSize} />,
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/golabsys",
    icon: <Facebook className={iconSize} />,
    className: "bg-blue-600 text-white hover:bg-blue-700",
  },
  {
    label: "Messenger",
    href: "https://m.me/golabsys",
    icon: <IconMessenger className={iconSize} />,
    className: "bg-sky-500 text-white hover:bg-sky-600",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: <Youtube className={iconSize} />,
    className: "bg-red-600 text-white hover:bg-red-700",
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: <IconX className={iconSize} />,
    className: "bg-zinc-900 text-white hover:bg-black",
  },
];

export function SocialSidebar() {
  return (
    <div className="hidden md:block fixed right-3 lg:right-4 top-1/2 z-50 -translate-y-1/2">
      <div className="flex flex-col gap-2">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
            className={[
              "group inline-flex h-11 w-11 items-center justify-center rounded-full shadow-lg",
              "transition-all duration-300 ease-out hover:scale-110 hover:-translate-x-2 hover:shadow-xl",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              link.className,
            ].join(" ")}
          >
            <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
              {link.icon}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

