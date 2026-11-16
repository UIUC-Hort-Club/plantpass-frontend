import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import OrderLookup from '../../src/components/core/OrderLookup';
import { NotificationProvider } from '../../src/contexts/NotificationContext';
import { FeatureToggleProvider } from '../../src/contexts/FeatureToggleContext';
import * as readApi from '../../src/api/transaction_interface/readTransaction';
import * as recentApi from '../../src/api/transaction_interface/getRecentUnpaidTransactions';
import * as updateApi from '../../src/api/transaction_interface/updateTransaction';
import * as paymentMethodsApi from '../../src/api/payment_methods_interface/getAllPaymentMethods';

vi.mock('../../src/api/feature_toggles_interface/getFeatureToggles', () => ({
  getFeatureToggles: vi.fn().mockResolvedValue({
    collectEmailAddresses: false,
    passwordProtectAdmin: true,
    protectPlantPassAccess: true,
  }),
}));
vi.mock('../../src/api/transaction_interface/readTransaction');
vi.mock('../../src/api/transaction_interface/getRecentUnpaidTransactions');
vi.mock('../../src/api/transaction_interface/updateTransaction');
vi.mock('../../src/api/transaction_interface/deleteTransaction');
vi.mock('../../src/api/payment_methods_interface/getAllPaymentMethods');

// an unpaid order, exactly as the server returns it
const order = {
  purchase_id: 'ABC-DEF',
  timestamp: 1700000000,
  items: [{ SKU: 'PLANT-001', item: 'Monstera', quantity: 2, price_ea: 25.99 }],
  discounts: [],
  club_voucher: 0,
  customer_email: '',
  receipt: { subtotal: 51.98, discount: 0, total: 51.98 },
  payment: { method: '', paid: false },
};

async function loadOrderAndChooseCash() {
  vi.mocked(recentApi.getRecentUnpaidTransactions).mockResolvedValue([order] as never);
  vi.mocked(readApi.readTransaction).mockResolvedValue(order as never);
  vi.mocked(paymentMethodsApi.getAllPaymentMethods).mockResolvedValue([{ name: 'Cash' }] as never);
  const user = userEvent.setup();
  render(
    <NotificationProvider>
      <FeatureToggleProvider>
        <OrderLookup />
      </FeatureToggleProvider>
    </NotificationProvider>
  );
  await user.click(await screen.findByText('ABC-DEF'));
  const complete = await screen.findByRole('button', { name: /complete order/i });
  await user.click(screen.getByRole('combobox'));
  await user.click(await screen.findByRole('option', { name: 'Cash' }));
  await waitFor(() => expect(complete).toBeEnabled());
  return { user, complete };
}

describe('Completing an order', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends one completion when the button is tapped twice on a slow connection', async () => {
    vi.mocked(updateApi.updateTransaction).mockReturnValue(new Promise(() => {}));
    const { complete } = await loadOrderAndChooseCash();

    act(() => {
      complete.click();
      complete.click();
    });

    expect(updateApi.updateTransaction).toHaveBeenCalledTimes(1);
    expect(updateApi.updateTransaction).toHaveBeenCalledWith('ABC-DEF', {
      payment: { method: 'Cash', paid: true },
      email: '',
    });
    expect(complete).toBeDisabled();
    expect(complete).toHaveTextContent('Completing...');
  });

  it('keeps the order on screen and lets the cashier try again when the request fails', async () => {
    vi.mocked(updateApi.updateTransaction).mockRejectedValue(new Error('Network error'));
    const { user, complete } = await loadOrderAndChooseCash();

    await user.click(complete);

    expect(await screen.findByText('Failed to complete order. Please try again.')).toBeInTheDocument();
    await waitFor(() => expect(complete).toBeEnabled());
    expect(screen.getByLabelText('Quantity for Monstera')).toHaveValue('2');
    await user.click(complete);
    expect(updateApi.updateTransaction).toHaveBeenCalledTimes(2);
  });
});
