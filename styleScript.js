let allAlignmentOptions = document.querySelectorAll(".alignment span")
let fileBtn = document.querySelector(".file");
let body = document.querySelector("body");

let leftAlign = allAlignmentOptions[0];
let centerAlign = allAlignmentOptions[1];
let rightAlign = allAlignmentOptions[2];
let lastAlignSelected = "left";

leftAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        lastCellSelected.style.textAlign = "left";
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "left";
    }
})

centerAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "center";
        lastCellSelected.style.textAlign = "center";
    }
})

rightAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "right";
        lastCellSelected.style.textAlign = "right";
    }
})

let bold = document.querySelectorAll(".bold-italic-under span")[0];
let italic = document.querySelectorAll(".bold-italic-under span")[1];
let underline = document.querySelectorAll(".bold-italic-under span")[2];

bold.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        
        if(!dataObj[address].isBold)
        {
            dataObj[address].isBold = true;
            lastCellSelected.style.fontWeight = "bold";
        }
        else
        {
            dataObj[address].isBold = false;
            lastCellSelected.style.fontWeight = "";
        }
    }
})

italic.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        
        if(!dataObj[address].isItalic)
        {
            dataObj[address].isItalic = true;
            lastCellSelected.style.fontStyle = "italic";
        }
        else
        {
            dataObj[address].isItalic = false;
            lastCellSelected.style.fontStyle = "";
        }
    }
})

underline.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        if(!dataObj[address].isUnderline)
        {
            dataObj[address].isUnderline = true;
            lastCellSelected.style.textDecoration = "underline";
        }
        else
        {
            dataObj[address].isUnderline = false;
            lastCellSelected.style.textDecoration = "";
        }
    }
})

fileBtn.addEventListener("click", function(){
    
    let isOpen = fileBtn.getAttribute("data-open");
    
    if(isOpen == "true")
    {
        let dropdown = document.querySelector(".dropdown");
        body.remove(dropdown);
        fileBtn.setAttribute("data-open", false);
    }
    else
    {
        fileBtn.setAttribute("data-open", true);
        let dropdownMenu = document.createElement("div");
        dropdownMenu.style.backgroundColor = "white";
        dropdownMenu.style.border = "0.5px solid";
        dropdownMenu.innerHTML = "<p>Save</p><p>Clear</p>"
        dropdownMenu.classList.add("dropdown")
        body.append(dropdownMenu);
    }
})
