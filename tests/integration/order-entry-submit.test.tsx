import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OrderEntry from '../../src/components/core/OrderEntry';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import { FeatureToggleProvider } from '../../src/contexts/FeatureToggleContext';
import * as productsApi from '../../src/api/products_interface/getAllProducts';
import * as discountsApi from '../../src/api/discounts_interface/getAllDiscounts';
import * as createApi from '../../src/api/transaction_interface/createTransaction';

vi.mock('../../src/api/products_interface/getAllProducts');
vi.mock('../../src/api/discounts_interface/getAllDiscounts');
vi.mock('../../src/api/feature_toggles_interface/getFeatureToggles', () => ({
  getFeatureToggles: vi.fn().mockResolvedValue({
    collectEmailAddresses: false,
    passwordProtectAdmin: true,
    protectPlantPassAccess: true,
  }),
}));
vi.mock('../../src/api/transaction_interface/createTransaction');
vi.mock('../../src/api/transaction_interface/updateTransaction');

const products = [
  { SKU: 'PLANT-001', item: 'Monstera', price_ea: 25.99, sort_order: 1 },
  { SKU: 'PLANT-002', item: 'Pothos', price_ea: 15.99, sort_order: 2 },
];

async function renderWithTwoMonsteras() {
  const user = userEvent.setup();
  render(
    <NotificationProvider>
      <FeatureToggleProvider>
        <OrderEntry />
      </FeatureToggleProvider>
    </NotificationProvider>
  );
  const quantity = await screen.findByLabelText('Quantity for Monstera');
  await user.type(quantity, '2');
  await user.tab();
  return { user, quantity, enter: screen.getByRole('button', { name: /enter order/i }) };
}

describe('Entering an order', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(productsApi.getAllProducts).mockResolvedValue(products as never);
    vi.mocked(discountsApi.getAllDiscounts).mockResolvedValue([]);
  });

  it('sends one order when the button is tapped twice on a slow connection', async () => {
    // the server has not answered yet
    vi.mocked(createApi.createTransaction).mockReturnValue(new Promise(() => {}));
    const { enter } = await renderWithTwoMonsteras();

    // two taps before the screen has had a chance to grey the button out
    act(() => {
      enter.click();
      enter.click();
    });

    expect(createApi.createTransaction).toHaveBeenCalledTimes(1);
    expect(enter).toBeDisabled();
    const sent = vi.mocked(createApi.createTransaction).mock.calls[0][0];
    expect(sent.items.find((i) => i.SKU === 'PLANT-001')).toMatchObject({ quantity: 2, price_ea: 25.99 });
  });

  it('keeps the cart and lets the volunteer try again when the request fails', async () => {
    vi.mocked(createApi.createTransaction).mockRejectedValue(new Error('Network error'));
    const { user, quantity, enter } = await renderWithTwoMonsteras();

    await user.click(enter);

    await waitFor(() => expect(enter).toBeEnabled());
    expect(quantity).toHaveValue('2');
    await user.click(enter);
    expect(createApi.createTransaction).toHaveBeenCalledTimes(2);
  });
});
