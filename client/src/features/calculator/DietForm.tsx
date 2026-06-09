import React, { useState } from 'react';
import { Slider } from '../../components/ui/Slider';
import { Button } from '../../components/ui/Button';
import { DietInputSchema, FoodCategories, type DietInput, type FoodCategory } from '@carbon/shared';
import { Utensils, Info } from 'lucide-react';

interface DietFormProps {
  onSubmit: (data: DietInput) => Promise<void>;
  isLoading: boolean;
}

export const DietForm: React.FC<DietFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Record<FoodCategory, number>>({
    beef: 0,
    lamb: 0,
    pork: 0,
    chicken: 0,
    fish: 0,
    dairy: 0,
    eggs: 0,
    vegetables: 0,
    fruits: 0,
    grains: 0,
    legumes: 0,
  });

  const handleSliderChange = (category: FoodCategory, val: number) => {
    setFormData((prev) => ({
      ...prev,
      [category]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map record back to DietInput schema format: { items: Array<{ category: FoodCategory; kgPerWeek: number }> }
    const items = FoodCategories.map((cat) => ({
      category: cat,
      kgPerWeek: formData[cat],
    })).filter((item) => item.kgPerWeek > 0); // Only submit non-zero items

    const payload: DietInput = { items };

    // Validate
    const validationResult = DietInputSchema.safeParse(payload);
    if (!validationResult.success) {
      alert(validationResult.error.errors[0]?.message || 'Please input at least one food item.');
      return;
    }

    await onSubmit(validationResult.data);
  };

  // Group food categories for clean display
  const foodGroups = [
    {
      name: 'Animal Proteins',
      categories: ['beef', 'lamb', 'pork', 'chicken', 'fish'] as FoodCategory[],
      glow: 'rose'
    },
    {
      name: 'Dairy & Eggs',
      categories: ['dairy', 'eggs'] as FoodCategory[],
      glow: 'amber'
    },
    {
      name: 'Plant-Based',
      categories: ['vegetables', 'fruits', 'grains', 'legumes'] as FoodCategory[],
      glow: 'emerald'
    }
  ];

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ color: 'var(--accent-emerald)', padding: '8px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
          <Utensils size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '18px', fontFamily: 'var(--font-heading)', margin: 0, textAlign: 'left' }}>
            Dietary carbon calculator
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', textAlign: 'left' }}>
            <Info size={12} /> Compute greenhouse gas emissions for weekly food consumption.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {foodGroups.map((group) => (
          <div
            key={group.name}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-glass)',
              background: 'rgba(255, 255, 255, 0.01)'
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                color: group.glow === 'emerald' ? 'var(--accent-emerald)' : group.glow === 'rose' ? 'var(--accent-rose)' : 'var(--accent-amber)',
                marginBottom: '16px',
                textAlign: 'left'
              }}
            >
              {group.name}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}>
              {group.categories.map((cat) => (
                <Slider
                  key={cat}
                  label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  min={0}
                  max={cat === 'dairy' ? 20 : 10}
                  step={0.5}
                  value={formData[cat]}
                  onChange={(val) => handleSliderChange(cat, val)}
                  unit="kg / week"
                />
              ))}
            </div>
          </div>
        ))}
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
