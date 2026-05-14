import type { UserEvent } from '@testing-library/user-event';

export async function typeInto(user: UserEvent, input: HTMLElement, value: string): Promise<void> {
  await user.click(input);
  await user.clear(input);
  await user.type(input, value);
}

export async function pressKey(user: UserEvent, key: string): Promise<void> {
  await user.keyboard(`{${key}}`);
}

export function expectValidity(input: HTMLInputElement, expected: { valid: boolean; message?: string }): void {
  if (input.checkValidity() !== expected.valid)
    throw new Error(`expected valid=${expected.valid}, got ${input.checkValidity()} (msg='${input.validationMessage}')`);
  if (expected.message !== undefined && input.validationMessage !== expected.message)
    throw new Error(`expected message='${expected.message}', got '${input.validationMessage}'`);
}
