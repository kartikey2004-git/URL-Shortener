import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3, LinkIcon, QrCode, Zap } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
    <div className="mx-auto flex max-w-5xl flex-col items-center">
      <section className="flex w-full flex-col items-center pb-20 pt-8 text-center lg:pb-32 lg:pt-16">
        <Badge variant="secondary" className="mb-6 px-3 py-1 font-medium">
          <Zap className="mr-1.5 h-3 w-3 fill-primary text-primary" />
          The fastest way to share links
        </Badge>

        <h1 className="mb-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          Shorten. Share. <span className="text-primary">Track.</span>
        </h1>

        <p className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Transform long, complex URLs into powerful short links and QR codes.
          Gain deep insights with real-time analytics.
        </p>

        <form
          onSubmit={handleShorten}
          className="flex w-full max-w-2xl flex-col gap-2 rounded-xl border bg-background p-1.5 shadow-sm sm:flex-row"
        >
          <div className="flex-1">
            <IconInput
              icon={LinkIcon}
              type="url"
              value={longUrl}
              aria-label="Long URL to shorten"
              placeholder="Paste your long link here..."
              onChange={(event) => setLongUrl(event.target.value)}
              className="h-12 text-base"
              required
            />
          </div>
          <Button type="submit" size="lg" className="font-semibold">
            Shorten Now
            <ArrowRight />
          </Button>
        </form>
      </section>

      <section className="w-full py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="bg-card/50">
              <CardContent className="flex flex-col items-start gap-4 p-8">
                <div className="rounded-lg border border-primary/10 bg-primary/5 p-2.5 text-primary">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="w-full max-w-3xl pt-24">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about {APP_NAME}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          {FAQS.map(({ question, answer }, index) => (
            <AccordionItem
              key={question}
              value={`faq-${index}`}
              className="rounded-lg border bg-card px-2 transition-colors duration-base data-[state=open]:border-primary/20"
            >
              <AccordionTrigger className="px-3 py-4 text-left text-base font-semibold hover:no-underline">
                {question}
              </AccordionTrigger>
              <AccordionContent className="px-3 pb-4 text-sm text-muted-foreground">
                {answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </div>
  );
};

export default LandingPage;
