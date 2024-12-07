"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Code, Database, LineChart, Star } from "lucide-react";

const services = [
  {
    title: "AI Solutions",
    description:
      "Custom AI solutions tailored to your business needs. From natural language processing to computer vision, we help you leverage the power of artificial intelligence.",
    icon: Bot,
    features: [
      "Natural Language Processing",
      "Computer Vision",
      "Machine Learning Models",
      "AI Integration",
    ],
  },
  {
    title: "Software Development",
    description:
      "End-to-end software development services with a focus on scalability, performance, and user experience. We build robust applications that drive business growth.",
    icon: Code,
    features: [
      "Web Applications",
      "Mobile Apps",
      "API Development",
      "Cloud Solutions",
    ],
  },
  {
    title: "Data Analytics",
    description:
      "Transform your data into actionable insights. Our analytics solutions help you make data-driven decisions and uncover hidden opportunities.",
    icon: LineChart,
    features: [
      "Business Intelligence",
      "Predictive Analytics",
      "Data Visualization",
      "Real-time Analytics",
    ],
  },
  {
    title: "Database Solutions",
    description:
      "Optimize your data infrastructure with our database solutions. From design to implementation, we ensure your data is secure, scalable, and efficient.",
    icon: Database,
    features: [
      "Database Design",
      "Performance Optimization",
      "Data Migration",
      "Database Management",
    ],
  },
];

const testimonials = [
  {
    content:
      "InventiveLabs transformed our customer service with their AI solution. The implementation was smooth, and the results exceeded our expectations.",
    author: "Sarah Johnson",
    role: "CTO",
    company: "TechCorp Inc.",
  },
  {
    content:
      "Working with InventiveLabs was a game-changer for our data analytics. Their expertise and dedication to quality are unmatched.",
    author: "Michael Chen",
    role: "Head of Data",
    company: "DataFlow Systems",
  },
  {
    content:
      "The software development team at InventiveLabs delivered our project on time and with exceptional quality. Highly recommended!",
    author: "Emily Rodriguez",
    role: "Product Manager",
    company: "Innovation Hub",
  },
];

export default function ServicesPage() {
  return (
    <div className="py-24 sm:py-32">
      <div className="">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Services
          </motion.h1>
          <motion.p
            className="mt-2 text-lg leading-8 text-foreground/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Comprehensive solutions for your technology needs
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="mx-auto mt-16 grid gap-8 lg:max-w-none md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow transition-all hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <service.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-semibold">{service.title}</h3>
              <p className="mt-2 text-foreground/60">{service.description}</p>
              <ul className="mt-6 space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mx-auto mt-24 max-w-7xl rounded-3xl bg-primary/5 px-6 py-20 sm:px-12 sm:py-24 lg:px-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to transform your business?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-foreground/60">
              Let's discuss how our services can help you achieve your goals. Our team of experts is
              ready to create a custom solution for your needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Testimonials */}
        <div className="mx-auto mt-24 max-w-7xl">
          <h2 className="text-center text-2xl font-semibold">What Our Clients Say</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl border bg-card p-6 shadow"
              >
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <Star className="h-5 w-5 text-yellow-400" />
                <p className="mt-4 text-sm text-foreground/60">{testimonial.content}</p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-foreground/60">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
