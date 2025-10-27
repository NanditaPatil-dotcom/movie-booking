import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, Target, Award, Heart } from 'lucide-react';
import type { Page } from '../App';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl mb-4">About CineBook</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Your trusted partner for seamless movie ticket booking experiences since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600">
              We're on a mission to revolutionize the way people book movie tickets. Our platform
              combines cutting-edge technology with user-friendly design to provide the best
              booking experience possible.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Customer First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We prioritize your experience and satisfaction above everything else.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Target className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Continuously improving our platform with the latest technology.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Committed to delivering exceptional service at every touchpoint.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Heart className="w-12 h-12 text-blue-600 mb-2" />
                <CardTitle>Passion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We love movies and we love making your experience memorable.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Story Section */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-3xl mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                CineBook was founded in 2020 with a simple vision: to make movie ticket booking
                effortless and enjoyable. What started as a small startup has grown into a
                platform trusted by millions of movie enthusiasts.
              </p>
              <p>
                Our team of passionate developers, designers, and movie lovers work tirelessly to
                bring you features that matter. From seat selection to seamless payments, every
                aspect of our platform is designed with you in mind.
              </p>
              <p>
                Today, we partner with hundreds of theaters across the country, offering you access
                to the latest blockbusters and indie gems. We're proud to be part of your movie
                experience, from browsing to booking to the big screen.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-4xl mb-2 text-blue-600">2M+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-blue-600">500+</div>
              <div className="text-gray-600">Partner Theaters</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2 text-blue-600">10M+</div>
              <div className="text-gray-600">Tickets Booked</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
