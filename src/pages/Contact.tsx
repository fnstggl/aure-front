import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getSupabaseClient } from "@/integrations/supabase/safeClient";
import { Container, SectionEyebrow, Reveal } from "@/components/site/primitives";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  organization: z.string().trim().min(1, "Organization is required").max(200, "Organization must be less than 200 characters"),
  role: z.string().trim().min(1, "Role is required").max(100, "Role must be less than 100 characters"),
  compute_environment: z.string().trim().min(1, "Compute environment is required").max(500, "Description must be less than 500 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const inputClass =
  "bg-black rounded-none border-white text-white placeholder:text-white/40 focus-visible:ring-white/40 focus-visible:border-white";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", organization: "", role: "", compute_environment: "", email: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Supabase SDK is loaded on demand here (not at page load).
      const supabase = await getSupabaseClient();
      if (!supabase) {
        toast({
          title: "Form not configured",
          description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to enable submissions.",
          variant: "destructive",
        });
        return;
      }
      const { error } = await supabase.from("pilot_requests").insert({
        name: data.name,
        organization: data.organization,
        role: data.role,
        compute_environment: data.compute_environment,
        email: data.email,
      });
      if (error) throw error;
      toast({ title: "Request submitted", description: "We will be in touch shortly." });
      form.reset();
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Could not submit request",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden pb-24 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50" aria-hidden />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Context column */}
            <div className="lg:col-span-5">
              <Reveal>
                <SectionEyebrow noLine>Get access</SectionEyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-6 text-balance text-[clamp(1.9rem,4vw,2.8rem)] font-normal leading-[1.08] tracking-tight text-foreground">
                  See how much economic value Aurelius could unlock for your fleet
                </h1>
              </Reveal>
              <Reveal delay={140}>
                <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/62">
                  Start with a read-only shadow-run evaluation using scheduler metadata. Historical replay and live shadow deployments supported. No payload access. No execution impact.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <ul className="mt-8 space-y-2.5">
                  {["Metadata only", "Read-only shadow mode", "Counterfactual savings report", "+724% avg SLA-safe goodput/$ vs a production scheduler (uncapped high-load replay)"].map((t) => (
                    <li key={t} className="flex items-center gap-3 font-mono text-[12px] text-white/55">
                      <span className="inline-block h-1 w-1 shrink-0 bg-white" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Form column */}
            <div className="lg:col-span-7">
              <Reveal delay={160}>
                <div className="border border-white bg-black p-6 md:p-8">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.04em] text-white">
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" className={inputClass} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.04em] text-white">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="you@company.com" className={inputClass} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="organization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.04em] text-white">
                                Organization
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Company or institution" className={inputClass} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-mono text-[11px] uppercase tracking-[0.04em] text-white">
                                Role
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="Your position" className={inputClass} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="compute_environment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-mono text-[11px] uppercase tracking-[0.04em] text-white">
                              Compute environment
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Scheduler, GPU pools, regions, rough fleet size"
                                className={`${inputClass} min-h-[110px]`}
                                {...field}
                              />
                            </FormControl>
                            <p className="font-mono text-[11px] text-white/45">
                              Metadata only. Never share secrets or customer data.
                            </p>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex h-11 w-full items-center justify-center bg-foreground px-6 text-sm font-medium tracking-tight text-background transition-all duration-200 ease-premium hover:bg-white active:translate-y-px disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting…" : submitted ? "Submitted, we'll be in touch" : "Submit request"}
                      </button>
                    </form>
                  </Form>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </Layout>
  );
}
