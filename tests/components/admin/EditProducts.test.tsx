import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProductTable from '../../../src/components/AdminConsole/EditProducts';
import { NotificationProvider } from '../../../src/contexts/NotificationContext';
import * as productsApi from '../../../src/api/products_interface/getAllProducts';
import * as replaceApi from '../../../src/api/products_interface/replaceAllProducts';
import * as lockApi from '../../../src/api/lock_interface/getLockState';

vi.mock('../../../src/api/products_interface/getAllProducts');
vi.mock('../../../src/api/products_interface/replaceAllProducts');
vi.mock('../../../src/api/lock_interface/getLockState');
vi.mock('../../../src/api/lock_interface/setLockState');

// Every order carries every product, and an order with a zero-priced product
// is refused. So one product saved at $0.00 stops every order.
describe('Product editor: a price of zero', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(lockApi.getLockState).mockResolvedValue({ isLocked: false } as never);
    vi.mocked(replaceApi.replaceAllProducts).mockResolvedValue(undefined as never);
  });

  async function open(products: unknown[]) {
    vi.mocked(productsApi.getAllProducts).mockResolvedValue(products as never);
    const user = userEvent.setup();
    render(
      <NotificationProvider>
        <ProductTable />
      </NotificationProvider>
    );
    await screen.findByText('Edit Products');
    return user;
  }

  it('refuses to save a new product whose price was left at 0.00, and names it', async () => {
    const user = await open([{ SKU: 'MON001', item: 'Monstera', price_ea: 25.99, sort_order: 1 }]);
    await user.click(screen.getByRole('button', { name: 'Add Product' }));
    // the new row is the last one; its boxes are SKU, name, price
    const newRow = screen.getAllByRole('row').at(-1)!;
    await user.type(within(newRow).getAllByRole('textbox')[1], 'Fern');
    await user.tab();

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(/Every product needs a price above \$0\.00 \(check "Fern"\)/)).toBeInTheDocument();
    expect(replaceApi.replaceAllProducts).not.toHaveBeenCalled();
  });

  it('blocks other edits while a stored product is at zero, and saves once it is fixed', async () => {
    const user = await open([
      { SKU: 'MON001', item: 'Monstera', price_ea: 25.99, sort_order: 1 },
      { SKU: 'FREE001', item: 'Freebie', price_ea: 0, sort_order: 2 },
    ]);
    const monsteraPrice = screen.getByDisplayValue('25.99');
    await user.clear(monsteraPrice);
    await user.type(monsteraPrice, '30');
    await user.tab();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText(/check "Freebie"/)).toBeInTheDocument();
    expect(replaceApi.replaceAllProducts).not.toHaveBeenCalled();

    const freebiePrice = screen.getByDisplayValue('0.00');
    await user.clear(freebiePrice);
    await user.type(freebiePrice, '0.01');
    await user.tab();
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(replaceApi.replaceAllProducts).toHaveBeenCalledTimes(1));
  });
});
