"use client";

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fadeIn, staggerContainer, textVariant } from '@/lib/utils'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-background md:justify-end">
        <div className="aspect-square w-full max-w-2xl rounded-full bg-gradient-to-tr from-primary/20 to-primary/0 blur-3xl" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container relative"
      >
        <div className="mx-auto max-w-3xl text-center">
          <motion.div variants={textVariant} className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Building the Future with{' '}
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                AI Innovation
              </span>
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground sm:text-xl">
              We specialize in developing cutting-edge AI solutions that transform
              businesses and drive innovation. Let's build something amazing
              together.
            </p>
          </motion.div>

          <motion.div
            variants={fadeIn('up')}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" asChild>
              <Link href="/contact">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">View Our Work</Link>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeIn('up')}
            className="mt-16 flex items-center justify-center gap-8 grayscale"
          >
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-bold">200+</h3>
              <p className="text-sm text-muted-foreground">Projects Delivered</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-bold">50+</h3>
              <p className="text-sm text-muted-foreground">Happy Clients</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="space-y-3 text-center">
              <h3 className="text-3xl font-bold">95%</h3>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Background grid */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
    </section>
  )
}

// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";

// export function Hero() {
//   return (
//     <div className="relative isolate overflow-hidden bg-background">
//       <div className="pb-24 pt-10 sm:pb-32 lg:flex lg:py-40">
//         <motion.div
//           className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <div className="mt-24 sm:mt-32 lg:mt-16">
//             <motion.a
//               href="/projects"
//               className="inline-flex space-x-6"
//               whileHover={{ scale: 1.05 }}
//             >
//               <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/20">
//                 Latest Projects
//               </span>
//             </motion.a>
//           </div>
//           <motion.h1
//             className="mt-10 text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//           >
//             Transforming Ideas into
//             <span className="text-primary"> AI-Powered</span> Solutions
//           </motion.h1>
//           <motion.p
//             className="mt-6 text-lg leading-8 text-muted-foreground"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//           >
//             We specialize in developing cutting-edge AI software solutions that help businesses
//             innovate and scale. Our expertise spans machine learning, natural language processing,
//             and computer vision.
//           </motion.p>
//           <motion.div
//             className="mt-10 flex items-center gap-x-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.6 }}
//           >
//             <Button size="lg">
//               Get Started
//             </Button>
//             <Button variant="ghost" size="lg">
//               Learn More
//             </Button>
//           </motion.div>
//         </motion.div>
//         <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
//           <motion.div
//             className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 1, delay: 0.4 }}
//           >
//             <img
//               src="/hero-illustration.svg"
//               alt="App screenshot"
//               width={2432}
//               height={1442}
//               className="w-[76rem] rounded-md bg-background/5 shadow-2xl ring-1 ring-white/10"
//             />
//           </motion.div>
//         </div>
//       </div>
//       <div className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true">
//         <div
//           className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
//           style={{
//             clipPath:
//               'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
//           }}
//         />
//       </div>
//     </div>
//   );
// }
