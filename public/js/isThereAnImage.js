const questionImages = document.querySelectorAll(".questionImage")

const imageModal = document.querySelector(".modal.view-image")

const closeButton = document.querySelector(".modal.view-image .close-button")

const overlay = document.querySelector(".overlay")


questionImages.forEach(image => {

    const imageSrc = image.getAttribute("src")

    if(!imageSrc){
        image.style.display = "none"
    }else{
        image.addEventListener("click", ()=> {
            viewImage(imageSrc)
        })
    }

})


function viewImage(src){

    imageModal.querySelector("img").setAttribute("src", src)

    showHideModal()
    
}

function showHideModal(){
    imageModal.classList.toggle("none")
    overlay.classList.toggle("none")
    document.querySelector("body").classList.toggle("noOverflow")
}

closeButton.addEventListener("click", showHideModal)
overlay.addEventListener("click", showHideModal)