"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Facebook, Instagram, Twitter } from "lucide-react";

function HomePage() {
  const navigate = useRouter();
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-cover bg-center h-screen   ">
        <div className="absolute inset-0 sni ">
          <img
            src={"../church.jpg"}
            className="h-lvh w-full brightness-50 fade-in-5"
          />
        </div>
        <div className="relative flex flex-col justify-center items-center text-center h-full text-white px-4 ">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-5xl font-bold"
          >
            Welcome to Church Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="mt-4 text-xl"
          >
            Simplify your church management today.
          </motion.p>
          <motion.a
            href="#features"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            onClick={(e) => (e.preventDefault(), navigate.push("/sign-up"))}
          >
            Sign Up
          </motion.a>
          <p className="mt-2">
            If already a member{" "}
            <span
              className="cursor-pointer hover:underline"
              onClick={(e) => (e.preventDefault(), navigate.push("/sign-in"))}
            >
              Click Here
            </span>
          </p>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Event Management",
                description:
                  "Easily organize church events with scheduling tools.",
                icon: "📅",
              },
              {
                title: "Group Organization",
                description: "Manage your ministries and groups effortlessly.",
                icon: "👥",
              },
              {
                title: "Attendance Tracking",
                description:
                  "Keep track of attendance with comprehensive reports.",
                icon: "✔️",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-8">What Our Users Say</h2>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {[
              {
                quote:
                  "This app transformed how we organize our church events!",
                name: "Pastor John Doe",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE1fHxwYXN0b3J8ZW58MHx8fHwxNjM0Mjg5Njg4&ixlib=rb-1.2.1&q=80&w=400",
              },
              {
                quote: "Our community has grown closer thanks to this tool.",
                name: "Mary Jane",
                image:
                  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fHdvbWFufGVufDB8fHx8MTYzNDI1NzAxNg&ixlib=rb-1.2.1&q=80&w=400",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.5 }}
                className="p-4 bg-white text-black rounded-lg shadow-lg max-w-sm"
              >
                <p className="italic mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center justify-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="mb-4">Follow Us</h3>
          <div className="flex justify-center space-x-6">
            {[
              "https://facebook.com",
              "https://instagram.com",
              "https://twitter.com",
            ].map((link, index) => (
              <motion.a
                key={index}
                href={link}
                whileHover={{ scale: 1.2 }}
                className="text-2xl"
              >
                {index === 0 ? (
                  <Facebook />
                ) : index === 1 ? (
                  <Instagram />
                ) : (
                  <Twitter />
                )}
              </motion.a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
