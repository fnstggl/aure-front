import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  organization: z
    .string()
    .trim()
    .min(1, "Organization is required")
    .max(200, "Organization must be less than 200 characters"),
  role: z
    .string()
    .trim()
    .min(1, "Role is required")
    .max(100, "Role must be less than 100 characters"),
  compute_environment: z
    .string()
    .trim()
    .min(1, "Compute environment is required")
    .max(500, "Description must be less than 500 characters"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      organization: "",
      role: "",
      compute_environment: "",
      email: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("pilot_requests").insert({
        name: data.name,
        organization: data.organization,
        role: data.role,
        compute_environment: data.compute_environment,
        email: data.email,
      });

      if (error) throw error;

      toast({
        title: "Request submitted",
        description: "We will be in touch shortly.",
      });
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Request pilot access
          </h1>
        </div>
      </section>

      {/* Form */}
      <section className="px-6 pb-24 lg:px-8">
        <div className="mx-auto max-w-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Organization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company or institution"
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                        {...field}
                      />
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
                    <FormLabel className="text-foreground">Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your position"
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="compute_environment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">Compute environment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your compute infrastructure"
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-[100px]"
                        {...field}
                      />
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
                    <FormLabel className="text-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                variant="outline"
                size="lg"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit request"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </Layout>
  );
}