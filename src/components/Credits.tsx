
import React from 'react';
import { Zap, Crown, Star, Check, CreditCard, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    name: 'Starter',
    price: '$12',
    openaiCost: '$10',
    ourFee: '$2',
    credits: '100',
    period: 'per month',
    features: [
      '100 AI transformations',
      'All art styles available',
      'High quality outputs',
      'Priority processing',
      'Email support'
    ],
    icon: Zap,
    popular: false,
    cta: 'Upgrade to Starter'
  },
  {
    name: 'Pro',
    price: '$25',
    openaiCost: '$20',
    ourFee: '$5',
    credits: '250',
    period: 'per month',
    features: [
      '250 AI transformations',
      'All premium art styles',
      '4K quality outputs',
      'Instant processing',
      'Custom style requests',
      'Priority support',
      'Commercial usage rights'
    ],
    icon: Star,
    popular: true,
    cta: 'Go Pro'
  },
  {
    name: 'Studio',
    price: '$45',
    openaiCost: '$35',
    ourFee: '$10',
    credits: '500',
    period: 'per month',
    features: [
      '500 AI transformations',
      'All styles + exclusive ones',
      '4K+ quality outputs',
      'Instant processing',
      'Custom prompts & styles',
      'Dedicated support',
      'API access',
      'White-label options'
    ],
    icon: Crown,
    popular: false,
    cta: 'Go Studio'
  }
];

export const Credits = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { toast } = useToast();

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive"
      });
      return;
    }

    // Here you would integrate with your billing system
    // For now, showing a toast with billing information
    toast({
      title: "Billing Integration",
      description: `Upgrading to ${plan.name} plan. You'll pay $${plan.price}/month (includes our service fee of $${plan.ourFee}).`
    });
  };

  return (
    <section id="pricing" className="relative w-full py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Choose Your Plan</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Start with 5 free credits monthly. Our billing system handles OpenAI costs plus our service fee seamlessly.
          </p>
          
          {user && (
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-medium">
              <Zap className="w-5 h-5 mr-2" />
              Current Credits: {profile?.credits || 0}
            </div>
          )}
        </div>

        {/* Free Tier Card */}
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Free Tier</h3>
            <div className="flex items-baseline justify-center mb-4 ">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
              <span className="text-gray-500 ml-1 dark:text-white">/month</span>
            </div>
            <p className="text-green-600 font-semibold mb-4 ">5 credits included</p>
            <ul className="space-y-2 text-sm text-gray-700 mb-6 dark:text-white">
              <li className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                5 transformations/month
              </li>
              <li className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Basic art styles
              </li>
              <li className="flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500 mr-2" />
                Standard quality
              </li>
            </ul>
            <div className="text-xs text-gray-500 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-3 rounded-xl dark:text-white">
              <strong>How it works:</strong> Your OpenAI API key handles the processing costs directly. 
              We provide the platform and interface for free!
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div 
                key={plan.name}
                className={`relative bg-gradient-r dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg ${
                  plan.popular 
                    ? 'border-blue-600 shadow-lg scale-105' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center dark:text-white mb-8">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.popular ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${plan.popular ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 dark:text-white">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                  <p className="text-blue-600 font-semibold">{plan.credits} credits included</p>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>OpenAI costs:</span>
                      <span className="font-semibold">{plan.openaiCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Our service fee:</span>
                      <span className="font-semibold">{plan.ourFee}</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>{plan.price}</span>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-white">
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleUpgrade(plan)}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {plan.cta}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-16">
          <div className="bg-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">How Our Billing Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">You Pay Us</h4>
                <p className="text-gray-600 text-sm">One simple payment through our secure billing system</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">We Handle OpenAI</h4>
                <p className="text-gray-600 text-sm">We automatically pay OpenAI for your usage</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">You Create</h4>
                <p className="text-gray-600 text-sm">Focus on creating amazing art without billing worries</p>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mt-8 mb-4 dark:text-white">Need a custom enterprise solution?</p>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-white">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};
