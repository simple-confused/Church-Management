"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function HomePage() {
  const navigate = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* <!-- Hero Section --> */}
      <section className="flex flex-col items-center justify-center h-screen w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center">
        <h1 className="text-5xl md:text-7xl font-bold animate-fadeIn">
          Strengthen Your Church Community
        </h1>
        <p className="mt-4 text-xl md:text-2xl font-light animate-slideUp">
          Manage church events, members, and donations with ease
        </p>
        <Button
          className="mt-6 px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-200 animate-bounce"
          onClick={() => navigate.push("/sign-up")}
        >
          Get Started
        </Button>
        <p className="mt-4 text-lg md:text-lg font-light animate-slideUp">
          Already Have account{" "}
          <span
            className="cursor-pointer hover:underline"
            onClick={() => navigate.push("/sign-in")}
          >
            Click Here
          </span>
        </p>
      </section>

      {/* <!-- Features Section --> */}
      <section className="py-16 px-6 bg-white text-gray-800 w-full text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 animate-slideUp">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* <!-- Feature 1 --> */}
          <div className="p-8 border rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 animate-fadeIn">
            <img
              src="event.jpg"
              alt="Event Management"
              className="w-5/6 h-28 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Event Management</h3>
            <p className="mt-2 text-gray-600">
              Plan, organize, and invite members to church events seamlessly.
            </p>
          </div>

          {/* <!-- Feature 2 --> */}
          <div className="p-8 border rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 animate-fadeIn delay-200">
            <img
              src="people.png"
              alt="People Management"
              className="w-5/6 h-28 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">People Management</h3>
            <p className="mt-2 text-gray-600">
              Easily track member information, groups, and volunteer activities.
            </p>
          </div>

          {/* <!-- Feature 3 --> */}
          <div className="p-8 border rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 animate-fadeIn delay-400">
            <img
              src="donation.webp"
              alt="Donation Tracking"
              className="w-5/6 h-28 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold">Donation Tracking</h3>
            <p className="mt-2 text-gray-600">
              Monitor and manage church donations with detailed reports.
            </p>
          </div>
        </div>
      </section>

      {/* <!-- Testimonials Section --> */}
      <section className="py-16 bg-gray-100 w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          What Our Members Say
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="testimonial-carousel flex items-center justify-center">
            {/* <!-- Testimonial 1 --> */}
            <div className="p-6 bg-white shadow-lg rounded-lg animate-fadeIn">
              <p className="text-lg text-gray-700">
                "This app has transformed how we manage church events and
                volunteers."
              </p>
              <p className="mt-4 text-gray-500">- XYZ</p>
            </div>
            {/* <!-- Additional testimonials... --> */}
          </div>
        </div>
      </section>

      {/* <!-- Call to Action Section --> */}
      <section className="py-16 bg-indigo-600 w-full text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold">Join Us Today</h2>
        <p className="mt-4 text-xl">
          Start managing your church with modern tools
        </p>
        <Button
          className="mt-6 px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-200"
          onClick={() => navigate.push("/sign-up")}
        >
          Start Free Trial
        </Button>
      </section>
    </div>
  );
}

export default HomePage;
