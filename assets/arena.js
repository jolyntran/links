// Load Markdown-It for parsing Are.na descriptions
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script');
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js';
document.head.appendChild(markdownIt);

// Okay, Are.na stuff!
let channelSlug = 'strange-things-nnzzri6ojsq'; // The "slug" is just the end of the URL

// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
    // Target some elements in your HTML:
    let channelTitle = document.querySelector('#channel-title');
    let channelDescription = document.querySelector('#channel-description');
    let channelCount = document.querySelector('#channel-count');
    let channelLink = document.querySelector('#channel-link');

    // Then set their content/attributes to our data:
    channelTitle.innerHTML = data.title;
    channelDescription.innerHTML = window.markdownit().render(data.metadata.description); // Converts Markdown → HTML
    channelCount.innerHTML = data.contents.length;
    channelLink.href = `https://www.are.na/channel/${channelSlug}`;
};

// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
    // To start, a shared `ul` where we’ll insert all our blocks
    let channelBlocks = document.querySelector('#channel-blocks');

    // Links!
    if (block.class === 'Link') {
        let linkItem = `
            <li>
                <p><a href="${block.source.url}" target="_blank">${block.title} ↗</a></p>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', linkItem);
    } 
    // Images!
    else if (block.class === 'Image') {
        let imageItem = `
            <li>
                <img src="${block.image?.original?.url}" alt="Image Block">
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', imageItem);
    } 
    // Text!
    else if (block.class === 'Text') {
        let textItem = `
            <li>
                <p><em>Text</em></p>
                <h4>${block.title}</h4>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', textItem);
    } 
    // Uploaded (not linked) media…
    else if (block.class === 'Attachment') {
        let attachment = block.attachment.content_type; // Save us some repetition

        // Uploaded videos!
        if (attachment.includes('video')) {
            let videoItem = `
                <li>
                    <video controls src="${block.attachment.url}"></video>
                </li>
            `;
            channelBlocks.insertAdjacentHTML('beforeend', videoItem);
        } 
        // Uploaded audio!
        else if (attachment.includes('audio')) {
            let audioItem = `
                <li>
                    <audio controls src="${block.attachment.url}"></audio>
                </li>
            `;
            channelBlocks.insertAdjacentHTML('beforeend', audioItem);
        } 
        // Uploaded PDFs!
        else if (attachment.includes('pdf')) {
            let pdfItem = `    
                <li>
                    <p><em>PDF</em></p>
                    <h4><a href="${block.attachment.url}" target="_blank">${block.title} ↗</a></h4>
                </li>
            `;
            channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
        }
    } 
    // Linked media…
    else if (block.class === 'Media' && block.embed?.html) {
        let mediaItem = `
            <li>
                ${block.embed.html}
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', mediaItem);
    }
};

// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json()) // Return it as JSON data
    .then((data) => { // Do stuff with the data
        console.log(data); // Always good to check your response!
        placeChannelInfo(data); // Pass the data to the first function

        // Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
        data.contents.reverse().forEach(renderBlock);
    })
    .catch((error) => console.error('Error fetching Are.na data:', error));

// Filtering System
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-button");
    const channelBlocks = document.getElementById("channel-blocks");

    if (!channelBlocks) return;

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filterValue = button.getAttribute("data-filter");
            const filterItems = channelBlocks.querySelectorAll("li");

            filterItems.forEach(item => {
                item.style.display = (filterValue === "all" || item.classList.contains(filterValue)) ? "block" : "none";
            });
        });
    });
});
