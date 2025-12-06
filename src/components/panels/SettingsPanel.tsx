import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AppSettings } from '@/types/panel';
import { toast } from '@/hooks/use-toast';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
}

export function SettingsPanel({ open, onClose, settings, onSettingsChange }: SettingsPanelProps) {
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-card border-border">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="text-foreground">Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-8">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Appearance</h3>
            <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border">
              <Label htmlFor="dark-mode" className="text-sm text-foreground cursor-pointer">
                Dark mode
              </Label>
              <Switch
                id="dark-mode"
                checked={settings.isDarkMode}
                onCheckedChange={(checked) => 
                  onSettingsChange({ ...settings, isDarkMode: checked })
                }
              />
            </div>
          </div>

          {/* Currency Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Currency</h3>
            <div className="p-4 rounded-lg bg-background/50 border border-border">
              <Label htmlFor="currency" className="text-sm text-muted-foreground mb-2 block">
                Display currency
              </Label>
              <Select
                value={settings.currency}
                onValueChange={(value: 'USD' | 'EUR' | 'GBP') => 
                  onSettingsChange({ ...settings, currency: value })
                }
              >
                <SelectTrigger id="currency" className="w-full bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Notifications</h3>
            <div className="space-y-3 p-4 rounded-lg bg-background/50 border border-border">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="email-renewal"
                  checked={settings.emailOnRenewal}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ ...settings, emailOnRenewal: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="email-renewal" className="text-sm text-foreground cursor-pointer leading-relaxed">
                  Email me when a subscription is about to renew
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="budget-notify"
                  checked={settings.notifyOnBudgetExceed}
                  onCheckedChange={(checked) => 
                    onSettingsChange({ ...settings, notifyOnBudgetExceed: checked as boolean })
                  }
                  className="mt-0.5"
                />
                <Label htmlFor="budget-notify" className="text-sm text-foreground cursor-pointer leading-relaxed">
                  Notify me when I exceed my subscriptions budget
                </Label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            Save settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
