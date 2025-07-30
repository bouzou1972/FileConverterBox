import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, MessageSquare, User, Send, CheckCircle, Globe, Shield, Zap } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.name.trim()) {
      newErrors.push('Name is required');
    }
    
    if (!formData.email.trim()) {
      newErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }
    
    if (!formData.subject.trim()) {
      newErrors.push('Subject is required');
    }
    
    if (!formData.message.trim()) {
      newErrors.push('Message is required');
    } else if (formData.message.trim().length < 10) {
      newErrors.push('Message must be at least 10 characters long');
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Since this is a client-side only app, we'll just show a success message
    // In a real app, this would send the data to a server
    setIsSubmitted(true);
    setErrors([]);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "All tools work completely offline in your browser. No data is ever uploaded to our servers."
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "No waiting for uploads or downloads. Everything processes instantly on your device."
    },
    {
      icon: Globe,
      title: "Always Available",
      description: "Works offline once loaded. Perfect for field work, travel, or areas with poor internet."
    }
  ];

  const commonQuestions = [
    {
      question: "Are my files safe?",
      answer: "Yes! All processing happens in your browser. Files never leave your device."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account needed. All tools are completely free and work without registration."
    },
    {
      question: "Can I use this offline?",
      answer: "Yes! Once the page loads, most tools work completely offline."
    },
    {
      question: "Is there a file size limit?",
      answer: "Limits depend on your device's memory. Most tools handle files up to several hundred MB."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Have questions, suggestions, or feedback about File Converter Box? 
          We'd love to hear from you! Our privacy-first tools are built to serve your needs.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sm font-bold mb-1 uppercase tracking-wider text-gray-900 dark:text-white">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Send Us a Message
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-700 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600">
                    Your message has been received. We'll get back to you soon!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">
                        <User className="w-4 h-4 inline mr-2" />
                        Your Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="John Smith"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Feature request, bug report, or general inquiry"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Tell us about your experience, suggestions for new tools, or any issues you've encountered..."
                      className="mt-1"
                    />
                  </div>

                  {errors.length > 0 && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Us & FAQ */}
        <div className="space-y-8">
          {/* Features */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold mb-1 uppercase tracking-wider text-gray-900 dark:text-white">Why Choose File Converter Box?</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="bg-white dark:bg-gray-600 p-2 rounded-lg flex-shrink-0">
                        <feature.icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold mb-1 uppercase tracking-wider text-gray-900 dark:text-white">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {commonQuestions.map((faq, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold mb-1 uppercase tracking-wider text-gray-900 dark:text-white">Our Community</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                  <div className="text-lg font-bold text-blue-600">50+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Free Tools</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                  <div className="text-lg font-bold text-green-600">100%</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Privacy</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                  <div className="text-lg font-bold text-purple-600">0</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Data Uploads</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center">
                  <div className="text-lg font-bold text-orange-600">∞</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Usage Limit</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-16 text-center">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <CardContent className="pt-6">
            <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-gray-900 dark:text-white">We're Here to Help</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6 text-xs leading-relaxed">
              File Converter Box is built by developers who understand the need for reliable, 
              privacy-focused tools. Whether you're a field technician, content creator, 
              developer, or just someone who values privacy, we're here to support you.
            </p>
            <div className="flex justify-center items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span>• Response within 24 hours</span>
              <span>• No account required</span>
              <span>• Always free</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}