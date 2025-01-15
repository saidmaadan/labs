"use client";

import { motion } from "framer-motion";
import { Brain, Code2, Cpu, Database, Lock, Zap } from "lucide-react";

const features = [
  {
    name: "AI Development",
    description: "Build custom AI solutions tailored to your business needs using cutting-edge machine learning technologies.",
    icon: Brain,
  },
  {
    name: "Software Engineering",
    description: "Develop scalable and maintainable software solutions using modern technologies and best practices.",
    icon: Code2,
  },
  {
    name: "Machine Learning",
    description: "Implement advanced ML models for predictive analytics, computer vision, and natural language processing.",
    icon: Cpu,
  },
  {
    name: "Data Engineering",
    description: "Design and build robust data pipelines and infrastructure to support AI/ML applications.",
    icon: Database,
  },
  {
    name: "Security First",
    description: "Ensure your AI solutions are secure and compliant with industry standards and regulations.",
    icon: Lock,
  },
  {
    name: "High Performance",
    description: "Optimize AI models and applications for maximum performance and efficiency.",
    icon: Zap,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <div className="py-24 sm:py-32 dark:bg-accent bg-violet-50">
      <div className="container-center ">
        <div className="mx-auto max-w-2xl lg:text-center">
          <motion.h2
            className="text-base font-semibold leading-7 text-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Expertise
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Everything you need to build AI-powered solutions
          </motion.p>
          <motion.p
            className="mt-6 text-lg leading-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            We provide end-to-end AI development services, from concept to deployment,
            helping businesses leverage the power of artificial intelligence.
          </motion.p>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div
                key={feature.name}
                variants={item}
                className="flex flex-col"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>
    </div>
  );
}
