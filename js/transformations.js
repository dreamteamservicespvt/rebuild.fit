document.addEventListener('DOMContentLoaded', function() {
    // Get all filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Add click event to each button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter category
            const category = this.getAttribute('data-category');
            
            // Filter the transformation items
            filterTransformations(category);
        });
    });
    
    // Function to filter transformation items
    function filterTransformations(category) {
        const transformationItems = document.querySelectorAll('.transformation-item');
        
        transformationItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // Add touch scrolling behavior for mobile
    const filterContainer = document.querySelector('.transformation-filters');
    
    if (filterContainer && window.innerWidth <= 767) {
        let isScrolling = false;
        let startX;
        let scrollLeft;
        
        filterContainer.addEventListener('touchstart', (e) => {
            isScrolling = true;
            startX = e.touches[0].pageX - filterContainer.offsetLeft;
            scrollLeft = filterContainer.scrollLeft;
        });
        
        filterContainer.addEventListener('touchmove', (e) => {
            if (!isScrolling) return;
            e.preventDefault();
            const x = e.touches[0].pageX - filterContainer.offsetLeft;
            const walk = (x - startX) * 2;
            filterContainer.scrollLeft = scrollLeft - walk;
        });
        
        filterContainer.addEventListener('touchend', () => {
            isScrolling = false;
        });
    }
});
