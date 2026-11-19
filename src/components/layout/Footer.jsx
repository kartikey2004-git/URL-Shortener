import { Github, Linkedin, Twitter } from "lucide-react";

import { APP_NAME, APP_TAGLINE, AUTHOR } from "@/lib/constants";

const SOCIAL_LINKS = [
  { label: "Twitter", href: AUTHOR.twitter, icon: Twitter },
  { label: "GitHub", href: AUTHOR.github, icon: Github },
  { label: "LinkedIn", href: AUTHOR.linkedin, icon: Linkedin },
];

export function Footer() {
  return (
    <footer className="w-full border-t bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
        <div className="space-y-3">
          <h2 className="text-xl font-black tracking-tighter">{APP_NAME}</h2>
          <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
            {APP_TAGLINE}
          </p>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <div className="flex gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="rounded-md p-2 text-muted-foreground transition-colors duration-base hover:bg-muted hover:text-foreground"
              >
                <Icon aria-hidden="true" className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Made by <span className="font-bold italic text-foreground">{AUTHOR.name}</span>
          </p>
        </div>
      </div>

      <div className="border-t bg-muted/30 py-4 text-center">
        <p className="eyebrow opacity-60">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
