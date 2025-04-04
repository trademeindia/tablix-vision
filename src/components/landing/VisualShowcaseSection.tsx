
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Phone, Laptop, CreditCard } from 'lucide-react';

const VisualShowcaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <section id="visual-showcase" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Experience the Polished Interface
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            See how Menu 360 looks and works across all devices, providing a seamless experience for everyone.
          </p>
        </div>

        <Tabs defaultValue="customer" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> Customer View
            </TabsTrigger>
            <TabsTrigger value="owner" className="flex items-center gap-2">
              <Laptop className="h-4 w-4" /> Owner Dashboard
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment Flow
            </TabsTrigger>
          </TabsList>
          
          {/* Customer View */}
          <TabsContent value="customer" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="text-center mb-2 text-xs uppercase tracking-wide text-slate-500 font-medium">Mobile View</div>
                <div className="max-w-[240px] mx-auto">
                  <div className="rounded-2xl overflow-hidden border-4 border-slate-800">
                    <AspectRatio ratio={9/16}>
                      <div className="bg-white p-2">
                        {/* Navigation Bar */}
                        <div className="bg-slate-100 rounded-lg p-2 mb-3 flex justify-between items-center">
                          <span className="text-xs font-medium">Menu</span>
                          <div className="flex gap-2">
                            <div className="w-4 h-4 rounded-full bg-slate-300"></div>
                            <div className="w-4 h-4 rounded-full bg-primary"></div>
                          </div>
                        </div>
                        
                        {/* Menu Grid */}
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-slate-50 rounded p-1">
                              <div className="bg-slate-200 w-full h-10 rounded mb-1"></div>
                              <div className="h-2 bg-slate-300 w-12 rounded-full mb-1"></div>
                              <div className="h-2 bg-slate-300 w-8 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Bottom Navigation */}
                        <div className="bg-slate-100 rounded-lg p-2 flex justify-around">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-slate-300 mb-1"></div>
                            <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-primary mb-1"></div>
                            <div className="w-6 h-1 bg-primary rounded-full"></div>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-slate-300 mb-1"></div>
                            <div className="w-6 h-1 bg-slate-300 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </AspectRatio>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Elegant Customer Experience</h3>
                <p className="mb-4 text-slate-600">
                  The customer interface is designed for maximum ease of use on mobile devices, with:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Visually rich menu with high-quality images and 3D models</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Intuitive navigation and item selection process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Quick filtering options for dietary preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Secure, smooth payment process</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          {/* Owner Dashboard */}
          <TabsContent value="owner" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Powerful Owner Dashboard</h3>
                <p className="mb-4 text-slate-600">
                  Take control of every aspect of your restaurant with our comprehensive dashboard:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Real-time sales and order metrics at a glance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Easy menu management with drag-and-drop interface</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Staff performance tracking and management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Interactive visualizations of business data</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="text-center mb-2 text-xs uppercase tracking-wide text-slate-500 font-medium">Desktop View</div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <AspectRatio ratio={16/9}>
                    <div className="bg-white p-3">
                      {/* Top Nav */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="w-24 h-4 bg-slate-200 rounded"></div>
                        <div className="flex gap-2">
                          <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                          <div className="w-4 h-4 rounded-full bg-slate-200"></div>
                        </div>
                      </div>
                      
                      {/* Dashboard Layout */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="col-span-2 bg-slate-100 rounded p-2 h-20">
                          <div className="flex justify-between mb-2">
                            <div className="w-20 h-3 bg-slate-300 rounded"></div>
                            <div className="w-10 h-3 bg-slate-300 rounded"></div>
                          </div>
                          <div className="flex gap-2">
                            <div className="w-1/3 h-10 bg-primary/20 rounded"></div>
                            <div className="w-1/3 h-10 bg-blue-100 rounded"></div>
                            <div className="w-1/3 h-10 bg-green-100 rounded"></div>
                          </div>
                        </div>
                        <div className="bg-slate-100 rounded p-2 h-20">
                          <div className="w-12 h-3 bg-slate-300 rounded mb-2"></div>
                          <div className="w-full h-12 bg-slate-200 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Tables */}
                      <div className="bg-slate-100 rounded p-2 mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <div className="w-16 h-3 bg-slate-300 rounded"></div>
                          <div className="w-8 h-3 bg-slate-300 rounded"></div>
                        </div>
                        <div className="grid grid-cols-5 gap-1 h-8">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className={`rounded ${i % 2 === 0 ? 'bg-primary/20' : 'bg-slate-200'}`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AspectRatio>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Payment Flow */}
          <TabsContent value="payment" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="text-center mb-2 text-xs uppercase tracking-wide text-slate-500 font-medium">Payment Interface</div>
                <div className="max-w-[240px] mx-auto">
                  <div className="rounded-2xl overflow-hidden border-4 border-slate-800">
                    <AspectRatio ratio={9/16}>
                      <div className="bg-white p-2">
                        {/* Header */}
                        <div className="text-center mb-2">
                          <div className="text-xs font-bold">Payment</div>
                          <div className="text-xs text-slate-500">Table #12</div>
                        </div>
                        
                        {/* Order Summary */}
                        <div className="bg-slate-50 rounded-lg p-2 mb-3">
                          <div className="text-xs font-medium mb-1">Order Summary</div>
                          {[1, 2].map((i) => (
                            <div key={i} className="flex justify-between text-xs mb-1">
                              <span className="text-slate-600">Item {i}</span>
                              <span>₹{120 * i}</span>
                            </div>
                          ))}
                          <div className="border-t border-slate-200 my-1 pt-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span>Total</span>
                              <span>₹360</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Payment Methods */}
                        <div className="mb-3">
                          <div className="text-xs font-medium mb-2">Select Payment Method</div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="bg-primary/10 border border-primary/30 rounded p-1 text-center text-xs">
                              Card
                            </div>
                            <div className="bg-slate-100 border border-slate-200 rounded p-1 text-center text-xs">
                              UPI
                            </div>
                          </div>
                        </div>
                        
                        {/* Pay Button */}
                        <div className="bg-primary text-white text-center py-2 rounded text-xs font-medium">
                          Pay Now
                        </div>
                      </div>
                    </AspectRatio>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Seamless Payment Experience</h3>
                <p className="mb-4 text-slate-600">
                  Our payment system is designed to be secure, fast, and hassle-free:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Multiple payment options including cards, UPI, and wallets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">End-to-end encryption for all transaction data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Instant digital receipts for customers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="bg-green-100 text-green-700 p-1 rounded-full mt-0.5">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span className="text-slate-700">Built-in tipping feature to boost staff earnings</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default VisualShowcaseSection;
