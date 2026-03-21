import type { NeoDialogProps } from '../dialog/neo-dialog.model.js';
import type { NeoDialogConfirmProps } from '~/floating/dialog/neo-dialog-confirm.model.js';
import type { NeoDialogStepperProps } from '~/floating/dialog/neo-dialog-stepper.model.js';

export type NeoDrawerProps<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = Omit<NeoDialogProps<Tag>, 'modal'>;

export type NeoDrawerConfirmProps<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = Omit<NeoDialogConfirmProps<Tag>, 'modal'>;

export type NeoDrawerStepperProps<Tag extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> = Omit<NeoDialogStepperProps<Tag>, 'modal'>;
