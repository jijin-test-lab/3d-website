// This script watches the sections and fades them in when you scroll to them
document.addEventListener("DOMContentLoaded", function() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
        observer.observe(section);
    });
});
