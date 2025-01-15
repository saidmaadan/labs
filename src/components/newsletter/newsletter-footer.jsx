"use client"

import * as React from "react"
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { fadeIn, staggerContainer } from '@/lib/utils'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
})

export function NewsletterFooter({ className }) {
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  })

  async function onSubmit(data) {
    setIsLoading(true)
    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to subscribe")
      }

      toast.success("Please check your email to confirm your subscription")
      form.reset()
    } catch (error) {
      console.error("Newsletter subscription error:", error)
      toast.error(error.message || "Failed to subscribe. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="container "
      >
        <div className="">
          <motion.div variants={fadeIn('up')} className="space-y-2">
            <h3 className="text-sm text-muted-foreground ">
            Subscribe to our newsletter
            </h3>
            
          </motion.div>
          <Form {...form}>
            <motion.form
              variants={fadeIn('up')}
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 flex gap-1 w-full"
            >
              
              <FormField
                className="w-full"
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                        disabled={isLoading}
                        className="h-12 xl:min-w-[300px] lg:min-w-[250px] md:min-w-[450px] sm:min-w-[400px] min-w-[250px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="flex-none h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  <>
                        
                  <ArrowRight className="ml-2 h-4 w-4 flex justify-end" />
                  </>
                )}
              </Button>
              
            </motion.form>
          </Form>
          <motion.p
            variants={fadeIn('up')}
            className="mt-4 text-xs text-muted-foreground"
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </div>
      </motion.div>
    </section>
  )
}
