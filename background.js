let originalTop = null
let originalLeft = null

let originalMouseX = null
let originalMouseY = null

const offsetFactor = 5

document.onmousemove = handleMouseMove
function handleMouseMove(event) {
	const mouseX = event.pageX
	const mouseY = event.pageY
	
	if (!originalMouseX) {
		originalMouseX = mouseX
	}
	if (!originalMouseY) {
		originalMouseY = mouseY
	}
	
	const width = $(window).width()
	const height = $(window).height()
	
	if (!originalTop) {
  		originalTop = parseFloat($(".background").css('top').replace('px', ''))
	}
	if (!originalLeft) {
  		originalLeft = parseFloat($(".background").css('left').replace('px', ''))
	}
	
	$(".background").css('top', (originalTop - (originalTop*offsetFactor/100*(mouseY - originalMouseY)/height)) + "px")
	$(".background").css('left', (originalLeft - (originalLeft*offsetFactor/100*(mouseX - originalMouseX)/width)) + "px")
}
