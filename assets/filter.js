document.addEventListener("DOMContentLoaded", function () {
    let channelBlocks = document.querySelector('#channel-blocks');
    let filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            let filter = this.getAttribute('data-filter');

            // Remove previous filter classes
            channelBlocks.classList.remove('show-video', 'show-image', 'show-audio', 'show-link', 'show-quotes');

            // Apply new filter if it's not "all"
            if (filter !== 'all') {
                channelBlocks.classList.add(`show-${filter}`);
            }

            // Remove active class from all buttons & set to clicked one
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
