import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const faqs = [
  {
    question: "What is Fully Homomorphic Encryption (FHE)?",
    answer:
      "FHE is a form of encryption that allows computations to be performed on encrypted data without decrypting it first. This means your trading amounts can be processed on-chain while remaining completely private to everyone, including validators and other traders.",
  },
  {
    question: "How is my trading information protected?",
    answer:
      "All sensitive trading data, including order amounts and your total positions, are encrypted using FHE before being submitted to the blockchain. Only you hold the decryption keys, ensuring complete privacy of your trading strategies and portfolio size.",
  },
  {
    question: "Are prices also encrypted?",
    answer:
      "No, market prices remain public to ensure fair price discovery and market efficiency. Only individual order amounts and your personal balances are encrypted, allowing for transparent pricing while protecting your trading privacy.",
  },
  {
    question: "Can I see other traders' positions?",
    answer:
      "No, you cannot see other traders' exact positions or order amounts as they are encrypted. You can only see aggregated market data like total liquidity and public price levels, which helps maintain a fair and private trading environment.",
  },
  {
    question: "Is PrivateDEX decentralized?",
    answer:
      "Yes, PrivateDEX is fully decentralized. All trades are executed via smart contracts on the blockchain, and FHE computations are performed in a trustless manner. You always maintain custody of your funds through your wallet.",
  },
  {
    question: "What are the fees for private trading?",
    answer:
      "PrivateDEX charges a competitive 0.3% trading fee, similar to other DEXs. There's a small additional gas cost for FHE operations, but we've optimized the protocol to keep these costs minimal while maintaining maximum privacy.",
  },
];

export const FAQ = () => {
  return (
    <section className="py-16 animate-fade-in">
      <div className="container mx-auto px-4">
        <Card className="border-border shadow-glow">
          <CardHeader>
            <CardTitle className="text-3xl text-center gradient-primary text-gradient">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
