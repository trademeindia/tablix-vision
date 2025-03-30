
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { redeemLoyaltyPoints } from '@/services/loyaltyService';
import Spinner from '@/components/ui/spinner';

interface LoyaltyPointsCardProps {
  points: number;
  customerId?: string;
  onPointsRedeemed?: (newPoints: number, discountAmount: number) => void;
}

const LoyaltyPointsCard: React.FC<LoyaltyPointsCardProps> = ({ 
  points, 
  customerId,
  onPointsRedeemed
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const handleRedeem = async (pointsToRedeem: number) => {
    if (!customerId) {
      toast({
        title: "Error",
        description: "You need to be signed in to redeem points",
        variant: "destructive",
      });
      return;
    }
    
    setIsRedeeming(true);
    
    try {
      const result = await redeemLoyaltyPoints(customerId, pointsToRedeem);
      
      if (!result.success) {
        throw new Error("Failed to redeem points");
      }
      
      toast({
        title: "Points Redeemed!",
        description: `You received a ₹${result.discountAmount} discount.`,
      });
      
      if (onPointsRedeemed) {
        onPointsRedeemed(result.remainingPoints, result.discountAmount);
      }
      
    } catch (error) {
      console.error('Error redeeming points:', error);
      toast({
        title: "Redemption Failed",
        description: "There was an error redeeming your points. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRedeeming(false);
    }
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-primary/10 pb-2">
        <CardTitle className="flex items-center text-lg">
          <Gift className="mr-2 h-5 w-5" /> Loyalty Program
        </CardTitle>
        <CardDescription>
          Earn points with every order
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {points} Points
              </Badge>
            </div>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-primary"
              disabled={points < 50 || isRedeeming}
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" /> Hide
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" /> Redeem
                </>
              )}
            </Button>
          </div>
        </div>
        
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
          <CollapsibleContent className="space-y-2">
            {points < 50 ? (
              <div className="text-center text-sm text-muted-foreground py-2">
                <Info className="h-4 w-4 inline-block mr-1" />
                Earn more points to unlock rewards!
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {[
                  { points: 50, discount: 250 },
                  { points: 100, discount: 500 },
                  { points: 200, discount: 1000 }
                ].map((reward) => (
                  points >= reward.points && (
                    <AlertDialog key={reward.points}>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-between"
                          disabled={isRedeeming}
                        >
                          <span>₹{reward.discount} Discount</span>
                          <Badge variant="secondary">{reward.points} points</Badge>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Redeem Points</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to redeem {reward.points} points for a ₹{reward.discount} discount?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleRedeem(reward.points)}
                            disabled={isRedeeming}
                          >
                            {isRedeeming ? (
                              <>
                                <Spinner className="mr-2" />
                                Redeeming...
                              </>
                            ) : (
                              'Redeem'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )
                ))}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground pt-1 border-t mt-2">
              <p>• Earn 1 point for every ₹50 spent</p>
              <p>• Points can be redeemed for discounts on future orders</p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default LoyaltyPointsCard;
