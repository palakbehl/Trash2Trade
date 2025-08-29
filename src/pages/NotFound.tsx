import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  ArrowLeft, 
  Search,
  Recycle,
  TreePine,
  Leaf
} from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    if (user) {
      navigate(`/${user.role}`);
    } else {
      navigate('/');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-success/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Animated Icons */}
          <div className="relative mb-8">
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="animate-bounce delay-0">
                <Recycle className="h-12 w-12 text-primary" />
              </div>
              <div className="animate-bounce delay-150">
                <TreePine className="h-12 w-12 text-success" />
              </div>
              <div className="animate-bounce delay-300">
                <Leaf className="h-12 w-12 text-green-600" />
              </div>
            </div>
            
            {/* 404 Text */}
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Oops! Page Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              The page you're looking for seems to have been recycled! 
              Don't worry, we'll help you find your way back to making a positive impact.
            </p>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Path:</strong> {location.pathname}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome}
              className="w-full"
              size="lg"
            >
              <Home className="h-4 w-4 mr-2" />
              {user ? 'Go to Dashboard' : 'Go to Home'}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleGoBack}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Need help? Try these popular pages:
            </p>
            <div className="flex flex-col space-y-2">
              {!user ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                    Sign In
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/signup')}>
                    Create Account
                  </Button>
                </>
              ) : user.role === 'citizen' ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/book-pickup')}>
                    Book Pickup
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/rewards')}>
                    View Rewards
                  </Button>
                </>
              ) : user.role === 'collector' ? (
                <>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/collector')}>
                    Collector Dashboard
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => navigate('/ngo')}>
                  NGO Dashboard
                </Button>
              )}
            </div>
          </div>

          {/* Eco Message */}
          <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success-foreground">
              🌱 <strong>Did you know?</strong> Even lost pages can be recycled into better user experiences!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
