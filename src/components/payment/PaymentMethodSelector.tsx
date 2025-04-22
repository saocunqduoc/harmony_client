
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PaymentMethod } from '@/api/services/paymentService';

interface PaymentMethodSelectorProps {
  methods: PaymentMethod[];
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
  isLoading?: boolean;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  methods,
  selectedMethod,
  onSelectMethod,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Phương thức thanh toán</h3>
      <RadioGroup value={selectedMethod} onValueChange={onSelectMethod} className="space-y-2">
        {methods.map((method) => (
          <Card key={method.id} className={`cursor-pointer border transition-colors ${
            method.id === selectedMethod ? 'border-primary' : ''
          }`}>
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                {method.logoUrl && (
                  <img src={method.logoUrl} alt={method.name} className="h-8 w-8 object-contain" />
                )}
                <Label htmlFor={`payment-${method.id}`} className="flex-1 font-medium">
                  {method.name}
                </Label>
                {method.isDefault && (
                  <span className="text-xs text-muted-foreground">Mặc định</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
