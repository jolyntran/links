// Load Markdown-It for parsing Are.na descriptions
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
			<li class="block-link">
				<figcaption>Article</figcaption>
				<h4><a href="${block.source.url}">${block.title} ↗</a></h4>
			</li>
			`
        channelBlocks.insertAdjacentHTML('beforeend', linkItem);
    } 
    // Images!
    else if (block.class === 'Image') {
        let imageItem = `
            <li class="block-image" >
                <button>
                    <img src="${block.image.original.url}">
                </button>
                <dialog>
                    <div class="dialog-content">
                        <p class="block-title">${block.title}</p>
                        <img src="${block.image.original.url}">
                    </div>
                    <button class="close-button">Explore more</button>
                </dialog>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', imageItem);
    } 
    // Text!
    else if (block.class === 'Text') {
        let textItem = `
            <li class="block-quotes">
                <button>
                    <figcaption>Text</figcaption>
                    <h4>${block.title}</h4>
                </button>
                <dialog>
                    <div class="dialog-content">
                        <p class="block-title">${block.title}</p>
                        <p class="dialog-text">${block.content}</p>
                    </div>
                    <button class="close-button">Explore more</button>
                </dialog>
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
                <li class="block-video">
                    <button>
                        <video src="${block.attachment.url}" type="video/mp4"></video>
                    </button>
                    <dialog>
                        <div class="dialog-content">
                            <p class="block-title">${block.title}</p>
                            <a href="${block.attachment.url}">See original ↗</a>
                            <video controls>
                                <source src="${block.attachment.url}">
                            </video>
                        </div>
                        <button class="close-button">Explore more</button>
                    </dialog>
                </li>
            `;
            channelBlocks.insertAdjacentHTML('beforeend', videoItem);
        } 
        // Uploaded audio! took off bc it displayed as null
        // else if (attachment.includes('audio')) {
        //     let audioItem = `
        //         <li class="block-audio">
        //             <button>
        //                 <audio controls src="${block.attachment.url}"></audio>
        //             </button>
        //             <dialog>
        //                 <div class="dialog-content">
        //                     <p class="block-title">${block.generated_title}</p>
        //                     <audio controls src="${block.attachment.url}"></audio>
        //                 </div>
        //                 <button class="close-button">×</button>
        //             </dialog>
        //         </li>
        //     `;
        //     channelBlocks.insertAdjacentHTML('beforeend', audioItem);
        // } 
        
        // Uploaded PDFs!
        else if (attachment.includes('pdf')) {
            let pdfItem = `    
                <li class="block-pdf">
                    <figcaption>PDF</figcaption>
                    <h4><a href="${block.attachment.url}">${block.title} ↗</a></h4>
                </li>
            `;
            channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
        }
    } 
    // Linked media…
    else if (block.class === 'Media') {
        let mediaItem = `
            <li class="block-media">
                <button>
                    <img src="${block.image.original.url}">
                </button>
                <dialog>
                    <div class="dialog-content">
                        <p class="block-title">${block.title}</p>
                        <a href="${block.source.url}">See original ↗</a>
                        ${block.embed.html}
                    </div>
                    <button class="close-button">Explore more</button>
                </dialog>
            </li>
        `;
        channelBlocks.insertAdjacentHTML('beforeend', mediaItem);
        } 
    // Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
			let linkedAudioItem = 
			`
			<li class="block-linked-audio">
			    <button>
				    <img src="${ block.image.thumb.url }"></img>
			    </button>
				<dialog>
						<div class ="dialog-content">>
							<p class="block-title">${ block.generated_title }</p>
						    <a href="${block.source.url}">See original ↗</a>
                            ${block.embed.html}
						</div>
						<button class="close-button">Explore more</button>
				</dialog>
			</li>
			`
			channelBlocks.insertAdjacentHTML('beforeend', linkedAudioItem)
            } 
};

let initInteraction = () => {
	let blocks = document.querySelectorAll('.block-image, .block-quotes, .block-video, .block-media, .block-linked-audio')
	blocks.forEach((block) => {
		let openButton = block.querySelector('button')
		let dialog = block.querySelector('dialog')
		let closeButton = dialog.querySelector('button')
		
		openButton.onclick = () => {
			dialog.showModal()
		}

		closeButton.onclick = () => {
			dialog.close()
		}

		dialog.onclick = (event) => { 
			if (event.target == dialog) { 
				dialog.close() 
			}}
	})
}

// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log("data", data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})
		initInteraction()
	})

// FILTERING SYSTEM
document.addEventListener("DOMContentLoaded", () => {
    const channelBlocks = document.getElementById("channel-blocks");

    if (!channelBlocks) return;

    document.getElementById("filter-buttons").addEventListener("click", (event) => {
        if (event.target.classList.contains("filter-button")) {
            const filterValue = event.target.getAttribute("data-filter");
            const filterItems = channelBlocks.querySelectorAll("li");

            filterItems.forEach(item => {
                let classListArray = Array.from(item.classList);

                if (filterValue === "all" || 
                    classListArray.includes(filterValue) || 
                    classListArray.some(cls => cls === `block-${filterValue}`)) {
                    item.style.display = "";
                } else {
                    item.style.display = "none";
                }
            });
        };
    });
});

