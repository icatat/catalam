'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { themeClasses } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send, Mail, MapPin } from 'lucide-react';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowConfirmation(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        alert('Sorry, there was an error sending your message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending contact form:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <>
        <div className={cn("min-h-screen", themeClasses.gradientBg('primary'))}>
          <Navigation currentPage="contact" />
          
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-xl shadow-xl p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Send className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className={cn(themeClasses.heading('h2', 'primary'), 'mb-4')}>
                  Message Sent!
                </h2>
                
                <p className={cn(themeClasses.body('large'), 'text-gray-700 mb-6')}>
                  Thank you for reaching out! We&apos;ve received your message and will get back to you as soon as possible.
                </p>
                
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    variant="outline"
                    size="lg"
                    className="flex-1"
                  >
                    Send Another Message
                  </Button>
                  <Button
                    onClick={() => {window.location.href = '/';}}
                    variant="default"
                    size="lg"
                    className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cn("min-h-screen", themeClasses.gradientBg('primary'))}>
        <Navigation currentPage="contact" />
        
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className={cn(themeClasses.heading('h1', 'primary'), 'mb-4')}>
                Contact Us
              </h1>
              <p className={cn(themeClasses.body('large'), 'text-gray-700 max-w-2xl mx-auto')}>
                We&apos;d love to hear from you! Whether you have questions about our wedding celebrations, 
                need help with your RSVP, or just want to send us a message, we&apos;re here for you.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className={cn("bg-white rounded-xl shadow-xl p-8", themeClasses.card('base'))}>
                <h2 className={cn(themeClasses.heading('h3', 'primary'), 'mb-6')}>
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="Your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select a subject</option>
                      <option value="RSVP Help">RSVP Help</option>
                      <option value="Romania Wedding">Romania Wedding Question</option>
                      <option value="Vietnam Wedding">Vietnam Wedding Question</option>
                      <option value="Travel & Accommodation">Travel & Accommodation</option>
                      <option value="Dietary Requirements">Dietary Requirements</option>
                      <option value="Gift Registry">Gift Registry</option>
                      <option value="General Question">General Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className={cn(themeClasses.body('small'), 'font-medium text-gray-700 block mb-2')}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Tell us what&apos;s on your mind..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className={cn(
                      'w-full font-medium text-white transition-all duration-200 bg-rose-500 hover:bg-rose-600',
                      isSubmitting && 'opacity-50 cursor-not-allowed'
                    )}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div className={cn("bg-white rounded-xl shadow-xl p-8", themeClasses.card('base'))}>
                  <h3 className={cn(themeClasses.heading('h4', 'primary'), 'mb-6')}>
                    Get in Touch
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-rose-500 mt-1" />
                      <div>
                        <p className={cn(themeClasses.body('small'), 'font-medium text-gray-700')}>
                          Email
                        </p>
                        <a 
                          href="mailto:catalam@catalam.com"
                          className={cn(themeClasses.body('base'), 'text-rose-600 hover:text-rose-700 underline')}
                        >
                          catalam@catalam.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-emerald-500 mt-1" />
                      <div>
                        <p className={cn(themeClasses.body('small'), 'font-medium text-gray-700')}>
                          Wedding Locations
                        </p>
                        <p className={cn(themeClasses.body('base'), 'text-gray-600')}>
                          📍 Oradea, Romania - September 11-12, 2026
                        </p>
                        <p className={cn(themeClasses.body('base'), 'text-gray-600')}>
                          📍 Hanoi, Vietnam - September 26, 2026
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={cn("bg-white rounded-xl shadow-xl p-8", themeClasses.card('base'))}>
                  <h3 className={cn(themeClasses.heading('h4', 'primary'), 'mb-4')}>
                    Quick Links
                  </h3>
                  
                  <div className="space-y-3">
                    <a 
                      href="/romania"
                      className={cn(themeClasses.body('base'), 'block text-rose-600 hover:text-rose-700 underline')}
                    >
                      → Romania Wedding Details & RSVP
                    </a>
                    <a 
                      href="/vietnam"
                      className={cn(themeClasses.body('base'), 'block text-emerald-600 hover:text-emerald-700 underline')}
                    >
                      → Vietnam Wedding Details & RSVP
                    </a>
                    <Link 
                      href="/"
                      className={cn(themeClasses.body('base'), 'block text-gray-600 hover:text-gray-700 underline')}
                    >
                      → Back to Home
                    </Link>
                  </div>
                </div>

                <div className={cn("bg-gradient-to-r from-rose-50 to-emerald-50 rounded-xl p-6 border border-gray-200")}>
                  <p className={cn(themeClasses.body('small'), 'text-gray-700 text-center italic')}>
                    &quot;We can&apos;t wait to celebrate with you! 💕&quot;
                    <br />
                    <span className="text-gray-500">- Cata & Lam</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}