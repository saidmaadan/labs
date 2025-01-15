"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of AI solutions do you develop?",
    answer: "We develop a wide range of AI solutions including natural language processing systems, computer vision applications, machine learning models, and predictive analytics tools. Our solutions are customized to meet specific business needs and can be integrated with existing systems.",
  },
  {
    question: "How long does it typically take to develop an AI solution?",
    answer: "The development timeline varies depending on the complexity of the solution and specific requirements. Simple projects might take 2-3 months, while more complex enterprise solutions could take 6-12 months. We provide detailed timelines during our initial consultation.",
  },
  {
    question: "Do you provide maintenance and support after deployment?",
    answer: "Yes, we offer comprehensive maintenance and support packages for all our solutions. This includes regular updates, performance monitoring, bug fixes, and continuous improvement based on user feedback and changing business needs.",
  },
  {
    question: "What industries do you work with?",
    answer: "We work with a diverse range of industries including healthcare, finance, manufacturing, retail, and technology. Our experience across different sectors allows us to bring innovative solutions and best practices to any industry.",
  },
  {
    question: "How do you ensure the security of AI solutions?",
    answer: "Security is a top priority in all our developments. We implement industry-standard security protocols, regular security audits, and compliance checks. Our solutions adhere to relevant data protection regulations and industry-specific security requirements.",
  },
];

export function FAQ() {
  return (
    <div className="w-full dark:bg-accent bg-violet-50 py-24 sm:py-32">
      <div className="">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Frequently asked questions
          </motion.h2>
          <motion.p
            className="mt-4 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Find answers to common questions about our AI development services
          </motion.p>
        </div>
        <motion.div
          className="mx-auto mt-16 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
