import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { EnergyInputSchema, type EnergyInput } from '@carbon/shared';
import { Zap, Info } from 'lucide-react';

interface EnergyFormProps {
  onSubmit: (data: EnergyInput) => Promise<void>;
  isLoading: boolean;
}

export const EnergyForm: React.FC<EnergyFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<EnergyInput>({
    electricityKwh: 0,
    naturalGasM3: 0,
    heatingOilLitres: 0,
    period: 'monthly',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnergyInput, string>>>({});

  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));

    if (errors[name as keyof EnergyInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof EnergyInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side schema validation
    const validationResult = EnergyInputSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof EnergyInput, string>> = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path[0] as keyof EnergyInput;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(validationResult.data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ color: 'var(--accent-sky)', padding: '8px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '8px' }}>
          <Zap size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', margin: 0, textAlign: 'left' }}>
            Household Energy Calculator
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'left' }}>
            <Info size={12} /> Compute greenhouse gas emissions for utility consumption.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Electricity (kWh)"
          id="electricityKwh"
          name="electricityKwh"
          type="number"
          placeholder="0"
          value={formData.electricityKwh || ''}
          onChange={handleChange}
          error={errors.electricityKwh}
          min={0}
        />

        <Input
          label="Natural Gas (m³)"
          id="naturalGasM3"
          name="naturalGasM3"
          type="number"
          placeholder="0"
          value={formData.naturalGasM3 || ''}
          onChange={handleChange}
          error={errors.naturalGasM3}
          min={0}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Heating Oil (Litres)"
          id="heatingOilLitres"
          name="heatingOilLitres"
          type="number"
          placeholder="0"
          value={formData.heatingOilLitres || ''}
          onChange={handleChange}
          error={errors.heatingOilLitres}
          min={0}
        />

        <Select
          label="Billing Period"
          id="period"
          options={periodOptions}
          value={formData.period}
          onChange={(e) => handleSelectChange('period', e.target.value)}
          error={errors.period}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        isLoading={isLoading}
        style={{ marginTop: '16px' }}
      >
        Calculate Emissions
      </Button>
    </form>
  );
};
