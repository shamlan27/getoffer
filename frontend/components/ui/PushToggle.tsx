import { useState, useEffect } from 'react';

export function PushToggle({ brandId }: { brandId?: string | number }) {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        if (!brandId) return;
        const stored = localStorage.getItem(`push_enabled_${brandId}`);
        if (stored === 'true') setIsEnabled(true);
    }, [brandId]);

    const toggle = () => {
        if (!brandId) return;
        const newState = !isEnabled;
        setIsEnabled(newState);
        if (newState) {
            localStorage.setItem(`push_enabled_${brandId}`, 'true');
            // Simulate "Enabling" (e.g. asking for permission)
            if ('Notification' in window && Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        } else {
            localStorage.removeItem(`push_enabled_${brandId}`);
        }
    };

    return (
        <button
            onClick={toggle}
            className={`rounded-full p-1 w-10 h-6 flex items-center transition-colors relative ${isEnabled ? 'bg-green-500' : 'bg-white/20 hover:bg-white/30'}`}
        >
            <span
                className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0'}`}
            />
        </button>
    );
}
