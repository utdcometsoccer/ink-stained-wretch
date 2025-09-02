import type { RefObject } from "react";

export type CountdownIndicatorProps = {
    countdown?: number | null;
    showRedirect?: boolean;
    countdownRef: RefObject<HTMLDivElement | null>;
    text: string;
};
