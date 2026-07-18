import type { Attachment } from 'svelte/attachments';

import { createAttachmentKey } from 'svelte/attachments';

export interface AttachmentProps<Element extends EventTarget = HTMLElement> { [key: symbol]: Attachment<Element> }

export type ParentAttachmentAdapter = (attachment: Attachment<HTMLElement>) => AttachmentProps<HTMLElement>;

const parentAttachmentKey = createAttachmentKey();

/** Lift an attachment from an element to its immediate parent. */
export const attachToParent: ParentAttachmentAdapter = attachment => ({
  [parentAttachmentKey]: (node: HTMLElement) => {
    if (!node.parentElement) return;
    return attachment(node.parentElement);
  },
});

/** empty no-op attachment function */
export function noopAttachment() {}
