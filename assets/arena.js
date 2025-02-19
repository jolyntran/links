// Load Markdown-It for parsing Are.na descriptions
let markdownIt = document.createElement('script');
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js';
document.head.appendChild(markdownIt);

let channelSlug = 'strange-things-nnzzri6ojsq';

let placeChannelInfo = (data) => {
    let channelTitle = document.querySelector('#channel-title');
    let channelCount = document.querySelector('#channel-count');
    let channelLink = document.querySelector('#channel-link');

    channelTitle.innerHTML = data.title;
    channelCount.innerHTML = data.length;
    channelLink.href = `https://www.are.na/channel/${channelSlug}`;
};

let renderBlock = (block) => {
    let channelBlocks = document.querySelector('#channel-blocks');
    let blockItem = document.createElement('li');

    // Determine category class for filtering
    if (block.class === 'Link') {
        blockItem.classList.add("link");
        blockItem.innerHTML = `<h4>Article</h4><p>${block.title} ↗</p>`;
    } 
    else if (block.class === 'Image') {
        blockItem.classList.add("image");
        blockItem.innerHTML = `
            <img src="${block.image?.original?.url}" alt="Image Block">
        `;
    } 
    else if (block.class === 'Text') {
        blockItem.classList.add("quotes");
        blockItem.innerHTML = `<h4>Quote</h4><p>${block.title}</p>`;
    } 
    else if (block.class === 'Attachment') {
        let attachment = block.attachment.content_type;
        if (attachment.includes('video')) {
            blockItem.classList.add("video");
            blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
        } else if (attachment.includes('audio')) {
            blockItem.classList.add("audio");
            blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
        } else if (attachment.includes('pdf')) {
            blockItem.innerHTML = `<h4>PDF</h4><p>${block.title} ↗</p>`;
        }
    } 
    else if (block.class === 'Media' && block.embed?.html) {
        blockItem.classList.add("video");
        blockItem.innerHTML = block.embed.html;
    }

    channelBlocks.appendChild(blockItem);
};

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json()) 
    .then((data) => {
        console.log(data); 
        placeChannelInfo(data);

        data.contents.reverse().forEach(renderBlock);

        let channelUsers = document.querySelector('#channel-users');
        data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers));
        renderUser(data.user, channelUsers);
    })
    .catch((error) => console.error('Error fetching Are.na data:', error));


// FILTERING SYSTEM
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-button");
    const channelBlocks = document.getElementById("channel-blocks");

    if (!channelBlocks) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filterValue = button.getAttribute("data-filter");
            const filterItems = channelBlocks.querySelectorAll("li"); 

            filterItems.forEach(item => {
                if (filterValue === "all" || item.classList.contains(filterValue)) {
                    item.style.display = "block"; 
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});

