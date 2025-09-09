import { useEffect } from "react";

export function useCountdownIndicatorLogic(countdown: number | undefined, countdownRef: React.RefObject<HTMLDivElement | null>) {
    const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;

    useEffect(() => {
        if (countdownRef?.current) {
            const percent = `${(COUNTDOWN_SECONDS - (countdown ?? 0)) * (100 / COUNTDOWN_SECONDS)}%`;
            countdownRef.current.style.setProperty('--countdown-width', percent);
        }
    }, [countdown, COUNTDOWN_SECONDS, countdownRef]);

    return {
        COUNTDOWN_SECONDS,
    };
}
