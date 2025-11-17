import { useEffect } from "react";

export default function Chat() {
    useEffect(() => {
        // Directly assign Tawk_API and Tawk_LoadStart as in the script
        // @ts-expect-error: Tawk_API is not defined on window type
        window.Tawk_API = window.Tawk_API || {};
        // @ts-expect-error: Tawk_LoadStart is not defined on window type
        window.Tawk_LoadStart = new Date();

        (function () {
            const s1 = document.createElement("script");
            const s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/677b7b37af5bfec1dbe735b6/1igt5ikki';
            s1.setAttribute('crossorigin', '*');
            s0.parentNode?.insertBefore(s1, s0);
        })();
    }, []);

    return null;
}
