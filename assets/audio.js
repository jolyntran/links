// AGAIN THE AUDIO HELPS TIE THE CONCEPT TOGETHER THAT THE BLOCKS ARE SONAR PINGS
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
// MAKES THE EXPLORE BUTTON PLAY OR RESTART THE AUDIO. IF IT'S PLAYING, IT'LL PAUSE AND RESET

document.addEventListener("DOMContentLoaded", () => {
    let exploreButtons = document.querySelectorAll(".explore-button");

    exploreButtons.forEach(button => {
        button.addEventListener("click", () => {
            let audio = button.nextElementSibling; 
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
                audio.currentTime = 0; 
        	};
    	});
	});
})
