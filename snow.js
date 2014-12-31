window.onload = function(){
    //canvas init
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    
    //canvas dimensions
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    
    //snowflake particles
    var mp = 100; //max particles
    var particles = [];
    for(var i = 0; i < mp; i++)
    {
        particles.push({
            x: Math.random()*W, //x-coordinate
            y: Math.random()*H, //y-coordinate
            r: Math.random()*4+1, //radius
            d: Math.random()*mp //density
        })
    }
    


var player = new (function(){
//create new object based on function and assign 
//what it returns to the 'player' variable

    var that = this;
//'that' will be the context now

//attributes
    that.image = new Image();
    that.image.src = "angel.png";
//create new Image and set it's source to the 
//'angel.png' image I upload above

    that.width = 65;
//width of the single frame
    that.height = 95;
//height of the single frame

    that.X = 0;
    that.Y = 0;
//X&Y position

    that.angle = 0;

    that.frames = 1;
//number of frames indexed from zero
    that.actualFrame = 0;
//start from which frame
    that.interval = 0;
//we don't need to switch animation frame
//on each game loop, interval will helps
//with this.


//methods 
    that.setPosition = function(x, y){
    that.X = x;
    that.Y = y;
}

    that.update = function() {
        that.angle += 0.01;
        that.Y += Math.cos(angle) + 1;
        that.X += Math.sin(angle) * 2;

        that.setPosition(that.X, that.Y);
        if (that.X > W+5 || that.X < -5 || that.Y > H) {
            that.X = Math.random() * W;
            that.Y = -50;
            that.setPosition(that.X, that.Y);
        }

    }

    that.draw = function(){
        try {
            ctx.drawImage(that.image, 0, that.height * that.actualFrame, that.width, that.height, that.X, that.Y, that.width, that.height);
//cutting source image and pasting it into destination one, drawImage(Image Object, source X, source Y, source Width, source Height, destination X (X position), destination Y (Y position), Destination width, Destination height)
        } catch (e) {
//sometimes, if character's image is too big and will not load until the drawing of the first frame, Javascript will throws error and stop executing everything. To avoid this we have to catch an error and retry painting in another frame. It is invisible for the user with 50 frames per second.
        }

        if (that.interval == 4 ) {
            if (that.actualFrame == that.frames) {
                that.actualFrame = 0;
            } else {
                that.actualFrame++;
            }
            that.interval = 0;
        }
    that.interval++;
//all that logic above just
//switch frames every 4 loops 
        that.update();
    }
})();
//we immediately execute the function above and 
//assign its result to the 'player' variable
//as a new object 

player.setPosition(~~((W-player.width)/2),  ~~((H - player.height)/2));
//our character is ready, let's move it 
//to the center of the screen,
//'~~' returns nearest lower integer from
//given float, equivalent of Math.floor()

    //Lets draw the flakes
    function draw()
    {
        ctx.clearRect(0, 0, W, H);
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.beginPath();
        for(var i = 0; i < mp; i++)
        {
            var p = particles[i];
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, p.r, 0, Math.PI*2, true);
        }
        ctx.fill();
        update();
    }
    
    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;
    function update()
    {
        angle += 0.01;
        for(var i = 0; i < mp; i++)
        {
            var p = particles[i];
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += Math.cos(angle+p.d) + 1 + p.r/2;
            p.x += Math.sin(angle) * 2;
            
            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if(p.x > W+5 || p.x < -5 || p.y > H)
            {
                if(i%3 > 0) //66.67% of the flakes
                {
                    particles[i] = {x: Math.random()*W, y: -10, r: p.r, d: p.d};
                }
                else
                {
                    //If the flake is exitting from the right
                    if(Math.sin(angle) > 0)
                    {
                        //Enter from the left
                        particles[i] = {x: -5, y: Math.random()*H, r: p.r, d: p.d};
                    }
                    else
                    {
                        //Enter from the right
                        particles[i] = {x: W+5, y: Math.random()*H, r: p.r, d: p.d};
                    }
                }
            }
        }
    }
    


var GameLoop = function(){
    draw();
    player.draw();
    gLoop = setTimeout(GameLoop, 1000 / 50);
}
GameLoop();

}





