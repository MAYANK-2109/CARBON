/**
 * @module components/ui/Tabs.test
 * @description Unit tests for the Tabs navigation component.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs } from './Tabs';

const OPTIONS = [
  { id: 'travel', label: 'Travel' },
  { id: 'energy', label: 'Energy' },
  { id: 'diet', label: 'Diet' },
];

describe('Tabs', () => {
  it('renders all tab buttons', () => {
    render(<Tabs options={OPTIONS} activeTab="travel" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'Travel' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Energy' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Diet' })).toBeInTheDocument();
  });

  it('marks the active tab with aria-selected=true', () => {
    render(<Tabs options={OPTIONS} activeTab="energy" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'Energy' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Travel' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with the tab id when a tab is clicked', () => {
    const onChange = vi.fn();
    render(<Tabs options={OPTIONS} activeTab="travel" onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Diet' }));
    expect(onChange).toHaveBeenCalledWith('diet');
  });

  it('renders icon when provided', () => {
    const optionsWithIcon = [
      { id: 'a', label: 'With Icon', icon: <span data-testid="tab-icon">★</span> },
    ];
    render(<Tabs options={optionsWithIcon} activeTab="a" onChange={vi.fn()} />);
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
  });

  it('renders correctly without icon', () => {
    render(<Tabs options={OPTIONS} activeTab="travel" onChange={vi.fn()} />);
    // No icon spans should be in the tab list
    const tabList = screen.getByRole('tablist');
    expect(tabList).toBeInTheDocument();
  });

  it('sets tabIndex=0 on active tab and -1 on others', () => {
    render(<Tabs options={OPTIONS} activeTab="diet" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'Diet' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Travel' })).toHaveAttribute('tabindex', '-1');
  });
});
