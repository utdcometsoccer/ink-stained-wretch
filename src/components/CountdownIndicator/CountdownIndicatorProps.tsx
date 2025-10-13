import type { RefObject } from "react";

export type CountdownIndicatorProps = {
    countdown?: number;
    showRedirect?: boolean;
    countdownRef: RefObject<HTMLDivElement | null>;
    text?: string;
};
