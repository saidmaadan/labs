import { Github, Twitter, Linkedin } from "lucide-react"

export const siteConfig = {
  name: "InventiveLabs",
  description: "Innovative solutions for modern software development and AI integration.",
  url: 'https://inventivelabs.co',
  ogImage: 'https://inventivelabs.co/og.jpg',
  links: {
    twitter: 'https://twitter.com/inventivelabs',
    github: 'https://github.com/inventivelabs',
  },
  links2: [
    {
      title: "Twitter",
      href: "https://twitter.com/inventivelabs",
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      title: "GitHub",
      href: "https://github.co/inventivelabs.com",
      icon: <Github className="h-4 w-4" />,
    },
    {
      title: "LinkedIn",
      href: "https://linkedin.com/company/inventivelabs",
      icon: <Linkedin className="h-4 w-4" />,
    },
  ],
  nav: [
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Services",
      href: "/services",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact",
      href: "/contact",
    },
  ],
  features: [
    {
      title: 'AI Development',
      description:
        'Build intelligent applications with our expertise in machine learning and artificial intelligence.',
      icon: 'Brain',
    },
    {
      title: 'Web Development',
      description:
        'Create modern, responsive web applications using the latest technologies.',
      icon: 'Globe',
    },
    {
      title: 'Mobile Development',
      description:
        'Develop cross-platform mobile applications that work seamlessly on all devices.',
      icon: 'Smartphone',
    },
    {
      title: 'Cloud Solutions',
      description:
        'Deploy and scale your applications with our cloud-native architecture expertise.',
      icon: 'Cloud',
    },
    {
      title: 'UI/UX Design',
      description:
        'Design beautiful and intuitive user interfaces that provide the best user experience.',
      icon: 'Palette',
    },
    {
      title: 'Consulting',
      description:
        'Get expert advice on technology strategy and digital transformation.',
      icon: 'Users',
    },
  ],
  faqs: [
    {
      question: 'What services does InventiveLabs offer?',
      answer:
        'We offer a wide range of services including AI development, web development, mobile development, cloud solutions, UI/UX design, and technology consulting.',
    },
    {
      question: 'How do you handle project management?',
      answer:
        'We follow an agile methodology with regular client communication, sprint planning, and iterative development to ensure project success.',
    },
    {
      question: 'What technologies do you specialize in?',
      answer:
        'We specialize in modern technologies including React, Next.js, Node.js, Python, TensorFlow, and cloud platforms like AWS and Google Cloud.',
    },
    {
      question: 'How do you ensure project quality?',
      answer:
        'We maintain high quality through code reviews, automated testing, continuous integration, and regular quality assurance checks.',
    },
    {
      question: 'What is your project development process?',
      answer:
        'Our process includes discovery, planning, design, development, testing, deployment, and ongoing support and maintenance.',
    },
  ],
}
