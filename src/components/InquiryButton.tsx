import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  HelpCircle, 
  Send, 
  X, 
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const InquiryButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    console.log('Inquiry submitted:', formData);
    
    toast({
      title: "Inquiry Submitted Successfully!",
      description: "We'll get back to you within 24 hours.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    
    setIsOpen(false);
  };

  return (
    <>
      {/* Inquiry Button */}
      <div className="fixed z-40" style={{ bottom: '7rem', right: '1.5rem' }}>
        <Button
          data-inquiry-button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-secondary to-yellow-500 hover:shadow-lg transition-all duration-300"
        >
          <HelpCircle className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Inquiry Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <MessageSquare className="h-6 w-6 mr-2 text-primary" />
              Send us an Inquiry
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                name="name"
                placeholder="Your Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Input
                name="email"
                type="email"
                placeholder="Your Email *"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Input
                name="phone"
                type="tel"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
              />
            </div>

            <div>
              <Input
                name="subject"
                placeholder="Subject *"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <Textarea
                name="message"
                placeholder="Your Message *"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-eco"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Inquiry
              </Button>
            </div>
          </form>

          {/* Contact Info */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold text-sm mb-3">Or contact us directly:</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>support@trash2trade.com</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InquiryButton;
