const COUNTERS_CONFIG = [
    { id: 'users',     target:  90, duration: 4000 },
    { id: 'locations', target:  30, duration: 4500 },
    { id: 'servers',   target:  50, duration: 5000 }
];

const getCounterElements = (configArray) => {
    return configArray.map(({ id }) => {
        return document.getElementById(id);
    });
}

const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
}

const animateCounter = (element, targetValue, durationMs) => {
    let startTimestamp = null;
    const START_VALUE = targetValue - 11;
    const delta = targetValue - START_VALUE;
    const step = (timestamp) => {
        if (!startTimestamp) {
            startTimestamp = timestamp;
        }
        const elapsed = timestamp - startTimestamp;
        const rawProgress = Math.min(elapsed / durationMs, 1);
        const easedProgress = easeOutCubic(rawProgress);
        const currentValue = Math.floor(START_VALUE + delta * easedProgress);
        element.textContent = `${currentValue}+`;
        if (rawProgress < 1) {
            window.requestAnimationFrame(step);
        }
    }
    window.requestAnimationFrame(step);
}

window.addEventListener('DOMContentLoaded', () => {
    const counterElements = getCounterElements(COUNTERS_CONFIG);

    const observer = new IntersectionObserver(
        (entries, obsInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    obsInstance.unobserve(el);

                    const config = COUNTERS_CONFIG.find(cfg => cfg.id === el.id);
                    if (config) {
                        animateCounter(el, config.target, config.duration);
                    }
                }
            });
        },
        {
            root: null,
            threshold: 0.1
        }
    );
    counterElements.forEach(el => {
        if (el instanceof HTMLElement) {
            observer.observe(el);
        }
    });
});