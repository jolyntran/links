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

    if (block.class === 'Link') {
        blockItem.innerHTML = `
            <a href="${block.source.url}" target="_blank">
                <img src="${block.image?.original?.url || 'default-thumbnail.jpg'}" alt="Link Preview">
            </a>
        `;
    }

    else if (block.class === 'Image') {
        blockItem.innerHTML = `
            <img src="${block.image?.original?.url}" alt="Image Block">
        `;
    }

    else if (block.class === 'Text') {
        blockItem.innerHTML = `
            <p>${block.content}</p>
        `;
    }

    else if (block.class === 'Attachment') {
        let attachment = block.attachment.content_type;

        if (attachment.includes('video')) {
            blockItem.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
        } else if (attachment.includes('audio')) {
            blockItem.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
        } else if (attachment.includes('pdf')) {
            blockItem.innerHTML = `<a href="${block.attachment.url}" target="_blank">View PDF</a>`;
        }
    }

    else if (block.class === 'Media' && block.embed?.html) {
        blockItem.innerHTML = block.embed.html;
    }

    channelBlocks.appendChild(blockItem);
};

let renderUser = (user, container) => {
    let userAddress = `
        <address>
            <img src="${user.avatar_image.display}">
            <h3>${user.first_name}</h3>
            <p><a href="https://are.na/${user.slug}">Are.na profile ↗</a></p>
        </address>
    `;
    container.insertAdjacentHTML('beforeend', userAddress);
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
