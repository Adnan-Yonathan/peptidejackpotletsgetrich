"use client";

import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Finally a peptide site that starts with evidence and red flags instead of pushing random stacks. I can compare options fast without feeling sold to.",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    name: "Lauren Mitchell",
    role: "Strength Coach",
  },
  {
    text: "The vendor notes and compliance warnings are the reason I keep using it. Most sites bury that information or pretend it does not matter.",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    name: "Kevin Liu",
    role: "Independent Researcher",
  },
  {
    text: "I wanted a cleaner way to research recovery peptides without hype. The directory and goal hubs make the tradeoffs obvious.",
    image: "https://randomuser.me/api/portraits/women/24.jpg",
    name: "Dr. Anika Patel",
    role: "Sports Rehab Clinician",
  },
  {
    text: "This feels closer to a decision platform than a store. The risk labels and stack warnings save time and keep the research process honest.",
    image: "https://randomuser.me/api/portraits/men/31.jpg",
    name: "Daniel Chen",
    role: "Performance Consultant",
  },
  {
    text: "The best part is seeing what not to combine. Most peptide content online skips that entirely.",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    name: "Sofia Ramirez",
    role: "Wellness Clinic Operator",
  },
  {
    text: "I used the goal pages to narrow the field quickly, then the vendor section to see who actually documents what they sell.",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    name: "Noah Bennett",
    role: "Health Content Editor",
  },
  {
    text: "It is one of the few sites in this category that treats regulation, WADA status, and evidence quality like first-class data.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    name: "Priya Shah",
    role: "Clinical Operations Consultant",
  },
  {
    text: "The planner gives me a much better starting point than generic forum advice. It feels structured instead of random.",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    name: "Ethan Brooks",
    role: "Online Fitness Coach",
  },
  {
    text: "As soon as I saw the cautions, exclusions, and route notes in one place, I knew this was built for serious research rather than impulse buying.",
    image: "https://randomuser.me/api/portraits/women/57.jpg",
    name: "Mina Park",
    role: "Health Research Writer",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 bg-background pb-6"
      >
        {new Array(2).fill(0).map((_, index) => (
          <React.Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="w-full max-w-xs rounded-3xl border bg-background p-8 shadow-lg shadow-primary/10"
                key={`${name}-${i}`}
              >
                <div className="text-sm leading-6 text-foreground/90">{text}</div>
                <div className="mt-5 flex items-center gap-3">
                  <img
                    width={40}
                    height={40}
                    src={image}
                    alt={name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="font-medium leading-5 tracking-tight">{name}</div>
                    <div className="leading-5 tracking-tight text-muted-foreground">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative my-20 bg-background">
      <div className="container z-10 mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-[640px] flex-col items-center justify-center"
        >
          <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What serious users value most
          </h2>
          <p className="mt-5 text-center text-muted-foreground">
            Researchers, coaches, and operators use PeptidePros to compare evidence, spot risks early,
            and make more defensible decisions.
          </p>
        </motion.div>

        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
