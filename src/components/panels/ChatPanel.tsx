import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { MessageCircle } from 'lucide-react';

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  userName?: string;
}

export function ChatPanel({ open, onClose, userName = '' }: ChatPanelProps) {
  const [name, setName] = useState(userName);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !message.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in your email and message.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thanks! Your message has been sent. We'll get back to you soon.",
      });
      setEmail('');
      setMessage('');
      setIsSubmitting(false);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border">
        <SheetHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-foreground">Chat with Mint support</SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Send us a message and we'll get back to you.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="chat-name" className="text-sm text-foreground">
              Name
            </Label>
            <Input
              id="chat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="bg-background border-border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chat-email" className="text-sm text-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="chat-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-background border-border"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chat-message" className="text-sm text-foreground">
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="chat-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help you?"
              rows={5}
              className="bg-background border-border resize-none"
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
