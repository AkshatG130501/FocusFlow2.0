"use client";

import { useEffect, useState } from "react";
import { motion } from "@/lib/motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "FocusFlow helped me land my internship! The curated roadmap eliminated all the guesswork from my learning.",
    author: "Ayush Sharma",
    role: "Student, NIT Trichy",
    rating: 5,
    image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote: "Finally a roadmap I can actually follow. No more jumping between random tutorials hoping to learn something useful.",
    author: "Riya Patel",
    role: "Job Seeker",
    rating: 5,
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote: "The distraction-free environment helps me focus solely on learning. I've doubled my productivity!",
    author: "Karthik Reddy",
    role: "Frontend Developer",
    rating: 4,
    image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    quote: "I've tried many learning platforms, but FocusFlow's structure and roadmaps are unmatched. It's exactly what I needed.",
    author: "Zara Khan",
    role: "CS Student",
    rating: 5,
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

export default function Testimonials() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("testimonials");
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section id="testimonials" className="py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of learners who've transformed their education journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md transition-all duration-300 ${
                activeIndex === index 
                  ? 'border-2 border-blue-500 dark:border-blue-400 scale-[1.02]' 
                  : 'border border-gray-200 dark:border-gray-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isVisible ? 1 : 0,
                y: isVisible ? 0 : 20,
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: index * 0.1,
              }}
              onClick={() => setActiveIndex(index)}
            >
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0 mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 text-blue-200 dark:text-blue-800 opacity-40" />
                <p className="text-muted-foreground pt-2 pl-5">{testimonial.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full mx-1 ${
                activeIndex === index
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-700"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}