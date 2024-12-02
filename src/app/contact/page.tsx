import React from 'react';
import ContactForm from './components/ContactForm';
import GoogleMap from './components/GoogleMap';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            聯絡我們
          </h1>
          <p className="text-2xl text-white opacity-90">
            我們期待聽到您的聲音
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phone Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">電話</h3>
            <p className="text-gray-600 text-lg hover:text-green-600 transition-colors duration-300">(02) 2345-6789</p>
          </div>

          {/* Email Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Email</h3>
            <p className="text-gray-600 text-lg hover:text-green-600 transition-colors duration-300">info@volunteer.org.tw</p>
          </div>

          {/* Address Card */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">地址</h3>
            <p className="text-gray-600 text-lg hover:text-green-600 transition-colors duration-300">台北市信義區志工路123號</p>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <section>
            <ContactForm />
          </section>

          {/* Google Map */}
          <section>
            <GoogleMap />
          </section>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
