import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PlantPassAccessModal from '../../src/components/Home/PlantPassAccessModal';
import ForgotPasswordDialog from '../../src/components/AdminConsole/ForgotPasswordDialog';
import { authenticateAdmin } from '../../src/api/authentication/passwordAuthentication';
import { loginFailureMessage, NO_ANSWER, TOO_MANY_TRIES } from '../../src/api/apiClient';

// What a person is told when a login-type request fails. Only a refusal from
// the server may say "incorrect". The server limits how fast these routes can
// be tried (429), and a browser often cannot read that answer at all, in
// which case the request simply fails with no status.

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
const noAnswer = async () => {
  throw new TypeError('Failed to fetch');
};

describe('Login failure messages', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('says "incorrect" only when the server refused', () => {
    const wrong = 'Password incorrect';
    const withStatus = (status?: number) => Object.assign(new Error('x'), { status });
    expect(loginFailureMessage(withStatus(401), wrong)).toBe(wrong);
    expect(loginFailureMessage(withStatus(429), wrong)).toBe(TOO_MANY_TRIES);
    expect(loginFailureMessage(withStatus(500), wrong)).toBe(NO_ANSWER);
    expect(loginFailureMessage(new TypeError('Failed to fetch'), wrong)).toBe(NO_ANSWER);
  });

  describe('staff passphrase box', () => {
    async function submitWith(answer: () => Promise<Response>) {
      vi.mocked(fetch).mockImplementation(answer);
      const user = userEvent.setup();
      render(<PlantPassAccessModal open onClose={() => {}} onSuccess={() => {}} />);
      await user.type(screen.getByLabelText('Passphrase'), 'a guess');
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      return (await screen.findByRole('alert')).textContent;
    }

    it('rate-limited: too many tries', async () => {
      expect(await submitWith(async () => json(429, { message: 'Too Many Requests' }))).toBe(TOO_MANY_TRIES);
    });

    it('no readable answer: could not reach the server, not "incorrect"', async () => {
      expect(await submitWith(noAnswer)).toBe(NO_ANSWER);
    });
  });

  describe('admin login', () => {
    it('passes the status on, so the screen can tell a limit from a wrong password', async () => {
      vi.mocked(fetch).mockResolvedValue(json(429, { message: 'Too Many Requests' }));
      await expect(authenticateAdmin('a guess')).rejects.toMatchObject({ status: 429 });
      vi.mocked(fetch).mockResolvedValue(json(401, { error: 'Invalid password' }));
      await expect(authenticateAdmin('a guess')).rejects.toMatchObject({ status: 401 });
    });
  });

  describe('forgot password', () => {
    async function askWith(answer: () => Promise<Response>) {
      vi.mocked(fetch).mockImplementation(answer);
      const user = userEvent.setup();
      render(<ForgotPasswordDialog open onClose={() => {}} onCancel={() => {}} />);
      await user.click(screen.getByRole('button', { name: 'Send Reset Email' }));
      return (await screen.findByRole('alert')).textContent;
    }
    const failed = 'Failed to send password reset email. Please try again.';

    it('shows the server\'s reason when one was just sent', async () => {
      const reason = 'A reset email was just sent. Please wait a minute before asking again.';
      expect(await askWith(async () => json(429, { error: reason }))).toBe(reason);
    });

    it('rate-limited with no reason given: too many tries', async () => {
      expect(await askWith(async () => json(429, { message: 'Too Many Requests' }))).toBe(TOO_MANY_TRIES);
    });

    it('never shows the browser\'s or the server\'s raw error text', async () => {
      expect(await askWith(noAnswer)).toBe(failed);
    });

    it('a server error gets the same plain sentence', async () => {
      expect(await askWith(async () => json(500, { error: 'Internal server error' }))).toBe(failed);
    });
  });
});
