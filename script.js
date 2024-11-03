'use strict';
let BUG = true;
let initialSize = {
    width: 0,
    height: 0
};
function getDefaultCanvasSizes(){
    let canvas = document.querySelector("#drawing-canvas");
    initialSize.width = canvas.width;
    initialSize.height = canvas.height;
}
function drawStuff(){
    let canvas = document.querySelector("#drawing-canvas");
    let entry = document.querySelector('#word-entry');
    let word = entry.value;
    let draw_context = canvas.getContext('2d');
    let current_fontname = "Yuji Syuku";
    let current_font_displayname = "Yuji Syuku";

    let combo_entry = document.querySelector('#combo-entry');
    let combo_list = document.querySelector('#combo-list');    
    
    
    current_fontname = current_font_displayname = document.querySelector("#combo-entry").value;    
    let found = 0;
    for(let i=0; !found && i < combo_list.options.length; i++){
        let option = combo_list.options[i];
        // innerText is more appropriate for this purpose.
        // I've however chosen textContent to prevent Reflow.    
        let option_font_displayname = option.textContent || option.innerText;
        let option_fontname = combo_list.value;
        if(current_font_displayname == option_font_displayname){
            current_font_displayname = option_font_displayname;
            current_fontname = option_fontname;
            found = 1;            
        }
    }
    draw_context.font = ((canvas.width-20)*1.0/word.length) + "px '"+ current_fontname+"'";
    draw_context.textBaseline = 'top';
    draw_context.fillText(word, 10, 10);
}
function redrawStuff(incdec){
    let canvas = document.querySelector("#drawing-canvas");    
    if(incdec < 0) {
        if ( canvas.width + incdec < 1) {
            drawStuff();
            return;
        }
    }
    if(BUG)
        console.log(incdec);
    canvas.width = canvas.width + incdec;
    let ratio = (canvas.width * 1.0) / initialSize.width;
    canvas.height = initialSize.height * ratio;
    drawStuff();
}

function drawit(){
    redrawStuff(0);  
}

function resize_font(stepsize)
{
    redrawStuff(parseInt(stepsize));
}
function body_onload()
{
  if (typeof ClipboardItem === 'undefined'){
    document.querySelector('#copy-button').style.display = 'none';
  }    
  getDefaultCanvasSizes();
  drawStuff();
  setTimeout(drawit, 1000);
}
function hide_copied_popup()
{
  let popup = document.querySelector('#copied-verify-div');
  popup.style.display = 'none';
}

//https://stackoverflow.com/a/42546234
function downloadCanvasAsImage(){

    let canvas = document.querySelector('#drawing-canvas');
    let image = canvas.toDataURL('image/png');
    let entry = document.querySelector('#word-entry');
    let word = entry.value;

    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(xhr.response);
        anchor.download = word + '.png';
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
      };
      xhr.open('GET', image); // This is to download the canvas Image
      xhr.send();
}
//https://stackoverflow.com/questions/27863617/is-it-possible-to-copy-a-canvas-image-to-the-clipboard
function copy_button_clicked()
{
  const canvas = document.querySelector("#drawing-canvas");
  if (typeof ClipboardItem !== 'undefined'){
    canvas.toBlob(
      function(blob){ 
          const item = new ClipboardItem({ "image/png": blob});
          navigator.clipboard.write([item]); 
      } // function(blog)
    ); // canvas.toBlob
    let popup = document.querySelector('#copied-verify-div');
    popup.style.display = 'block';
  }   
}
function reset_canvas()
{
    let canvas = document.querySelector("#drawing-canvas");
    let width_entry = document.querySelector('#width-entry');
    let height_entry = document.querySelector('#height-entry');
    canvas.width = width_entry.value;
    canvas.height = height_entry.value;

    if (typeof ClipboardItem === 'undefined'){
        document.querySelector('#copy-button').style.display = 'none';
    }    
    getDefaultCanvasSizes();
    drawStuff();
    setTimeout(drawit, 1000);
}
function fill_combo_entry(){
    let combo_entry = document.querySelector('#combo-entry');
    let combo_list = document.querySelector('#combo-list');
    let option = combo_list.optons[combo_list.selectedIndex];
    let option_fontname = option.value;
    
    // innerText is more appropriate for this purpose.
    // I've however chosen textContent to prevent Reflow.
    let option_font_displayname = option.textContent || option.innerText;
    
    //combo_entry.value = option_fontname;
    combo_entry.value = option_font_displayname;
}
