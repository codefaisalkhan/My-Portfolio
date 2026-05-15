document.addEventListener('DOMContentLoaded', () => {
    // 1. Philosophical Quotes Logic
    const quotes = [
        `"Adapt what is useful, reject what is useless, and add what is specifically your own." - Bruce Lee`,
        `"Knowing is not enough, we must apply. Willing is not enough, we must do." - Bruce Lee`,
        `"Action is the foundational key to all success." - Pablo Picasso`,
        `"Learn the rules like a pro, so you can break them like an artist." - Pablo Picasso`,
        `"Simplicity is the ultimate sophistication." - Leonardo da Vinci`,
        `"Learning never exhausts the mind." - Leonardo da Vinci`,
        `"It had long since come to my attention that people of accomplishment rarely sat back and let things happen to them. They went out and happened to things." - Leonardo da Vinci`,
        `"The unexamined life is not worth living." - Socrates`,
        `"We can easily forgive a child who is afraid of the dark; the real tragedy of life is when men are afraid of the light." - Plato`,
        `"Knowing yourself is the beginning of all wisdom." - Aristotle`,
        `"It does not matter how slowly you go as long as you do not stop." - Confucius`,
        `"There is nothing on this earth more to be prized than true friendship." - Thomas Aquinas`,
        `"The philosophers have only interpreted the world, in various ways. The point, however, is to change it." - Karl Marx`
    ];

    const quoteElement = document.getElementById('philosopher-quote');
    
    // Pick a random quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteElement.textContent = randomQuote;

    // 2. Visitor Counter Logic
    const visitorElement = document.getElementById('visitor-counter');
    
    // Determine the suffix (st, nd, rd, th)
    const getSuffix = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return s[(v - 20) % 10] || s[v] || s[0];
    };

    const updateVisitorDisplay = (count) => {
        const formattedCount = count.toLocaleString();
        visitorElement.textContent = `You are the ${formattedCount}${getSuffix(count)} visitor`;
    };

    const counterNamespace = 'faisalkhan_portfolio';
    const counterName = 'visits_global';

    // We use sessionStorage so the counter doesn't increment on every page refresh,
    // but increments when opened in a new tab or browser.
    const hasVisitedSession = sessionStorage.getItem('portfolio_visited_session');

    if (!hasVisitedSession) {
        // Increment the global count
        fetch(`https://api.counterapi.dev/v1/${counterNamespace}/${counterName}/up`, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                const count = data.count;
                sessionStorage.setItem('portfolio_visited_session', 'true');
                localStorage.setItem('portfolio_global_count', count.toString());
                updateVisitorDisplay(count);
            })
            .catch(error => {
                console.error('Error fetching global visitor count:', error);
                // Fallback to local count if API fails
                let localCount = parseInt(localStorage.getItem('portfolio_global_count') || '1');
                updateVisitorDisplay(localCount);
            });
    } else {
        // Just fetch the current global count without incrementing
        fetch(`https://api.counterapi.dev/v1/${counterNamespace}/${counterName}?t=${new Date().getTime()}`, { cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                const count = data.count;
                localStorage.setItem('portfolio_global_count', count.toString());
                updateVisitorDisplay(count);
            })
            .catch(error => {
                console.error('Error fetching global visitor count:', error);
                // Fallback
                let localCount = parseInt(localStorage.getItem('portfolio_global_count') || '1');
                updateVisitorDisplay(localCount);
            });
    }

    // Prevent form submission from reloading page (since there is no backend yet)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.submit-btn');
            btn.textContent = 'Message Sent!';
            btn.style.backgroundColor = '#444'; // Grey success color
            setTimeout(() => {
                contactForm.reset();
                btn.textContent = 'Send Message';
                btn.style.backgroundColor = 'var(--accent-color)';
            }, 3000);
        });
    }

    // 3. Local Time Logic
    const timeElement = document.getElementById('local-time');
    if (timeElement) {
        const updateTime = () => {
            const now = new Date();
            // User timezone is IST (+05:30)
            const options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
            const timeString = now.toLocaleTimeString('en-US', options);
            timeElement.textContent = timeString + ' IST';
        };
        updateTime();
        setInterval(updateTime, 1000 * 60); // Update every minute
    }

    // 4. Theme Toggle Logic
    const themeCheckbox = document.getElementById('theme-checkbox');
    if (themeCheckbox) {
        const currentTheme = localStorage.getItem('portfolio_theme') || 'dark';
        
        // Initialize theme
        if (currentTheme === 'light') {
            document.body.setAttribute('data-theme', 'light');
            themeCheckbox.checked = true;
        } else {
            themeCheckbox.checked = false;
        }

        themeCheckbox.addEventListener('change', () => {
            if (themeCheckbox.checked) {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('portfolio_theme', 'light');
            } else {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('portfolio_theme', 'dark');
            }
        });
    }
});
