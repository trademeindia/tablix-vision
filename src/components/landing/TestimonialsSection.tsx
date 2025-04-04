
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  restaurant: string;
  rating: number;
  image?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  restaurant,
  rating,
  image
}) => {
  return (
    <Card className="border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} 
            />
          ))}
        </div>
        <blockquote className="text-slate-700 mb-6">"{quote}"</blockquote>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={image} />
            <AvatarFallback>{author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{author}</div>
            <div className="text-sm text-slate-500">{role}, {restaurant}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const TestimonialsSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  const testimonials = [
    {
      quote: "Menu 360 cut our order errors significantly and sped up service. Customers love the QR menu and the 3D models are a game changer!",
      author: "Amit Sharma",
      role: "Owner",
      restaurant: "Spice Garden",
      rating: 5,
    },
    {
      quote: "Finally, a system that integrates ordering, payments, and menu updates easily. The dashboard insights are invaluable for making business decisions.",
      author: "Priya Patel",
      role: "Manager",
      restaurant: "Cafe Delight",
      rating: 5,
    },
    {
      quote: "Setting up was incredibly easy and the support team was there every step of the way. Our staff learned to use it in minutes.",
      author: "Rahul Mehta",
      role: "Owner",
      restaurant: "Urban Bites",
      rating: 4,
    },
  ];

  return (
    <section id="testimonials" className="bg-slate-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            See Why Restaurant Owners Choose Menu 360
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Join hundreds of successful restaurants that have transformed their operations
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <TestimonialCard {...testimonial} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="static translate-y-0 mr-2" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
        
        <div className="mt-16 text-center">
          <h3 className="text-lg font-medium mb-6">Integrates with your favorite payment gateways</h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <div className="text-xl font-bold text-primary">PayU</div>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <div className="text-xl font-bold text-blue-600">Stripe</div>
            </div>
            <div className="bg-white px-6 py-3 rounded-lg shadow-sm border">
              <div className="text-xl font-bold text-green-600">RazorPay</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
