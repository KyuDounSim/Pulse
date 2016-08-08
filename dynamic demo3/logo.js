var canvas = document.getElementById("logo"),
    ctx= canvas.getContext("2d"),
    img = new Image();

// Load image
img.crossOrigin = "anonymous";

// When the image has loaded
img.onload = function(){
    // Draw it and get it's data
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(0, 0, img.width, img.height),
        data = imgData.data;

    // Iterate over all the pixels
    for (var i = 0; i < data.length; i += 4) {
            data[i] = 76;   // Red
            data[i+1]=162;
            data[i+2]=237;
    }

    // Re-draw the image.
    ctx.putImageData(imgData, 0, 0);
}

img.src = 'logo_pulse.png';

canvas.height=img.height;
canvas.width=img.width;
