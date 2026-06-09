import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { 
  TravelInputSchema, 
  VehicleTypes, 
  FuelTypes, 
  FlightTypes, 
  type TravelInput
} from '@carbon/shared';
import { Car, Plane, Train, Info } from 'lucide-react';

interface TravelFormProps {
  onSubmit: (data: TravelInput) => Promise<void>;
  isLoading: boolean;
}

export const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<TravelInput>>({
    vehicleType: 'car',
    fuelType: 'petrol',
    distanceKm: 0,
    frequency: 'one-time',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TravelInput, string>>>({});

  const vehicleOptions = VehicleTypes.map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));

  const fuelOptions = FuelTypes.map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));

  const flightOptions = FlightTypes.map(type => ({
    value: type,
    label: type === 'shortHaul' ? 'Short Haul (< 3700 km)' : 
           type === 'longHaul' ? 'Long Haul (> 3700 km)' : 
           'Domestic'
  }));

  const frequencyOptions = [
    { value: 'one-time', label: 'One Time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  // Adjust conditional fields based on vehicle type
  useEffect(() => {
    if (formData.vehicleType === 'car') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({
        ...prev,
        fuelType: prev.fuelType || 'petrol',
        flightType: undefined
      }));
    } else if (formData.vehicleType === 'flight') {
      setFormData(prev => ({
        ...prev,
        fuelType: undefined,
        flightType: prev.flightType || 'domestic'
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        fuelType: undefined,
        flightType: undefined
      }));
    }
  }, [formData.vehicleType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const isNum = name === 'distanceKm';
    
    setFormData((prev) => ({
      ...prev,
      [name]: isNum ? Number(value) : value,
    }));

    if (errors[name as keyof TravelInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name as keyof TravelInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side schema validation
    const validationResult = TravelInputSchema.safeParse(formData);
    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof TravelInput, string>> = {};
      validationResult.error.errors.forEach((err) => {
        const path = err.path[0] as keyof TravelInput;
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
        <div style={{ color: 'var(--accent-emerald)', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
          {formData.vehicleType === 'car' ? <Car size={24} /> : 
           formData.vehicleType === 'flight' ? <Plane size={24} /> : 
           <Train size={24} />}
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', margin: 0, textAlign: 'left' }}>
            Travel calculator
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'left' }}>
            <Info size={12} /> Compute greenhouse gas emissions for transportation activities.
          </p>
        </div>
      </div>

      <Select
        label="Transport Mode"
        id="vehicleType"
        options={vehicleOptions}
        value={formData.vehicleType}
        onChange={(e) => handleSelectChange('vehicleType', e.target.value)}
        error={errors.vehicleType}
      />

      {formData.vehicleType === 'car' && (
        <Select
          label="Fuel Type"
          id="fuelType"
          options={fuelOptions}
          value={formData.fuelType || 'petrol'}
          onChange={(e) => handleSelectChange('fuelType', e.target.value)}
          error={errors.fuelType}
        />
      )}

      {formData.vehicleType === 'flight' && (
        <Select
          label="Flight Distance Tier"
          id="flightType"
          options={flightOptions}
          value={formData.flightType || 'domestic'}
          onChange={(e) => handleSelectChange('flightType', e.target.value)}
          error={errors.flightType}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Input
          label="Distance (km)"
          id="distanceKm"
          name="distanceKm"
          type="number"
          placeholder="0"
          value={formData.distanceKm || ''}
          onChange={handleChange}
          error={errors.distanceKm}
          min={0}
          required
        />

        <Select
          label="Frequency"
          id="frequency"
          options={frequencyOptions}
          value={formData.frequency}
          onChange={(e) => handleSelectChange('frequency', e.target.value)}
          error={errors.frequency}
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
