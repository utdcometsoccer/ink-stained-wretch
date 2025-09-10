import { useEffect } from "react";
import { trackComponent } from "../services/trackComponent";

export function useTrackComponent(componentName: string, props: any): void {
    useEffect(() => {
        trackComponent(componentName, props);
    }, [componentName, props]);
}