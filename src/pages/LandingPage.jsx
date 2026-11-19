import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, LinkIcon, QrCode, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/shared/IconInput";
import { APP_NAME } from "@/lib/constants";
import { routes, withPendingUrl } from "@/lib/routes";

const FEATURES = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Redirects happen in milliseconds. Your users won't wait.",
  },
  {
    icon: QrCode,
    title: "Smart QR Codes",
    description: "Every link comes with a customizable, high-quality QR code.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Track clicks by location, device, and referrer in real-time.",
  },
];

const FAQS = [
  {
    question: "How does URL shortening work?",
    answer: `When you paste a long URL, we create a tiny path that maps to it. When someone clicks your ${APP_NAME} link, our server instantly directs them to the original destination.`,
  },
  {
    question: "Is it really free?",
    answer:
      "Absolutely. Our core features are free for everyone. We believe in making the web more accessible for everyone.",
  },
  {
    question: "What kind of analytics do I get?",
    answer:
      "You can track total clicks, unique visitors, geographic location (country/city), device types (mobile/desktop), and even which websites sent traffic to your links.",
  },
];

const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const navigate = useNavigate();

  const handleShorten = (event) => {
    event.preventDefault();
    if (longUrl) navigate(withPendingUrl(routes.auth, longUrl));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="flex flex-col"
    >
      <section className="space-y-5 pb-12 sm:pb-14">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
          Shorten. Share. Track.
        </h1>

        <p className="max-w-xl body-text text-foreground">
          Transform long, complex URLs into powerful short links and QR codes. Gain deep insights
          with real-time analytics.
        </p>

        <form onSubmit={handleShorten} className="flex w-full flex-col gap-2 pt-3 sm:flex-row">
          <div className="flex-1">
            <IconInput
              icon={LinkIcon}
              type="url"
              value={longUrl}
              aria-label="Long URL to shorten"
              placeholder="Paste your long link here..."
              onChange={(event) => setLongUrl(event.target.value)}
              className="h-10"
              required
            />
          </div>
          <Button type="submit" size="lg">
            Shorten Now
            <ArrowRight />
          </Button>
        </form>
      </section>

      <section className="border-t border-border/60 py-10 sm:py-14">
        <p className="eyebrow mb-6">Features</p>
        <div className="divide-y divide-border/60">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 py-6 first:pt-0 last:pb-0">
              <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0">
                <h3 className="font-sans text-lg font-[450] text-foreground sm:text-xl">{title}</h3>
                <p className="mt-2 max-w-xl body-text">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/60 py-10 sm:py-14">
        <p className="eyebrow mb-2">FAQ</p>
        <h2 className="heading-lg mb-6">Frequently asked questions</h2>

        <Accordion type="single" collapsible className="w-full">
          {FAQS.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`faq-${index}`}
              className="border-b border-border/60 last:border-b-0"
            >
              <AccordionTrigger className="py-4 text-left text-copy-16 font-[450] hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="body-text">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </motion.div>
  );
};

export default LandingPage;
