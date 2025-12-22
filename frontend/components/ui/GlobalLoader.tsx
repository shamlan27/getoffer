export default function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
            <div className="flex flex-col items-center">
                <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white animate-pulse text-center">
                    GetOffer<span className="text-[var(--color-accent)]">.lk</span>
                </h1>
                <div className="mt-4 flex space-x-1">
                    <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-3 h-3 bg-[var(--color-accent)] rounded-full animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
