fontSize = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38]

for(let i = 0; i < fontSize.length; i++)
{
    let oldHTML = fontSizeBtn.innerHTML;
    let newHTML = oldHTML + `<option>${fontSize[i]}</option>`;
    fontSizeBtn.innerHTML = newHTML;
}
fontSizeBtn.value = 12;

fonts = ["Sans-Serif", "Arial", "Roboto", "Times New Roman", "Segoe UI", "Courier New", "Arial Black", "Calibri", "Cambria", "Candara", "Comic Sans MS", "Constantia", "Verdana"];
for(let i = 0; i < fonts.length; i++)
{
    let oldHTML = fontFamilyBtn.innerHTML;
    let newHTML = oldHTML + `<option>${fonts[i]}</option>`;
    fontFamilyBtn.innerHTML = newHTML;
}

leftAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        lastCellSelected.style.textAlign = "left";
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "left";

        leftAlign.classList.add("selected");
        rightAlign.classList.remove("selected");
        centerAlign.classList.remove("selected");
    }
})

centerAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "center";
        lastCellSelected.style.textAlign = "center";

        leftAlign.classList.remove("selected");
        rightAlign.classList.remove("selected");
        centerAlign.classList.add("selected");
    }
})

rightAlign.addEventListener("click", function(e){

    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].align = "right";
        lastCellSelected.style.textAlign = "right";

        leftAlign.classList.remove("selected");
        rightAlign.classList.add("selected");
        centerAlign.classList.remove("selected");
    }
})

bold.addEventListener("click", function(){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        
        if(!dataObj[address].isBold)
        {
            dataObj[address].isBold = true;
            lastCellSelected.style.fontWeight = "bold";
            bold.classList.add("selected");
        }
        else
        {
            dataObj[address].isBold = false;
            lastCellSelected.style.fontWeight = "";
            bold.classList.remove("selected");
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
            italic.classList.add("selected");
        }
        else
        {
            dataObj[address].isItalic = false;
            lastCellSelected.style.fontStyle = "";
            italic.classList.remove("selected");
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
            underline.classList.add("selected");
        }
        else
        {
            dataObj[address].isUnderline = false;
            lastCellSelected.style.textDecoration = "";
            underline.classList.remove("selected");
        }
    }
})

fileBtn.addEventListener("click", function(){
    
    let isOpen = fileBtn.getAttribute("data-open");
    
    if(isOpen == "true")
    {
        let dropdown = document.querySelector(".dropdown");
        fileBtn.setAttribute("data-open", "false");
        dropdown.style.display = "none";
    }
    else
    {
        fileBtn.setAttribute("data-open", "true");
        let dropdownMenu = document.querySelector(".dropdown");
        dropdownMenu.style.display = "block";
        
        let saveBtn = document.querySelectorAll(".dropdown p")[0];
        saveBtn.addEventListener("click", function(){
            let sheetName = document.querySelector(".title").innerText;
            localStorage.setItem(`${sheetName}`, JSON.stringify(dataObj));
        })

        let clearBtn = document.querySelectorAll(".dropdown p")[1];
        clearBtn.addEventListener("click", function(){
            let sheetName = document.querySelector(".title").innerText;
            localStorage.removeItem(`${sheetName}`);
        })
    }
})

bgColor.addEventListener("click", function(){

    let colorPicker = document.createElement("input");
    colorPicker.type = "color";
    body.append(colorPicker);
    colorPicker.click();

    colorPicker.addEventListener("input", function(e){
        if(lastCellSelected)
        {
            let address = lastCellSelected.getAttribute("data-address");
            dataObj[address].bgColor = e.currentTarget.value;
            lastCellSelected.style.backgroundColor = e.currentTarget.value;
        }
    })
})

textColor.addEventListener("click", function(){

    let colorPicker = document.createElement("input");
    colorPicker.type = "color";
    body.append(colorPicker);
    colorPicker.click();

    colorPicker.addEventListener("input", function(e){
        if(lastCellSelected)
        {
            let address = lastCellSelected.getAttribute("data-address");
            dataObj[address].color = e.currentTarget.value;
            lastCellSelected.style.color = e.currentTarget.value;
        }
    })
})

fontFamilyBtn.addEventListener("change", function(e){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].fontFamily = e.currentTarget.value;
        lastCellSelected.style.fontFamily = e.currentTarget.value;
    }
})

fontSizeBtn.addEventListener("change", function(e){
    if(lastCellSelected)
    {
        let address = lastCellSelected.getAttribute("data-address");
        dataObj[address].fontSize = e.currentTarget.value;
        lastCellSelected.style.fontSize = `${Number(e.currentTarget.value)}px`;
    }
})

downloadBtn.addEventListener("click", function(){
    
    let sheetName = document.querySelector(".title").innerText;
    let blob = new Blob([JSON.stringify(dataObj, null, 2)],{type:"application/json"});
    let url = URL.createObjectURL(blob);

    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${sheetName}`;
    downloadLink.click();
})
