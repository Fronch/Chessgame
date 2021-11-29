const canvas = document.getElementById("board")
const ctx = canvas.getContext("2d")
ctx.fillStyle = "grey"
ctx.fillRect(0,0,810,810)
ctx.fillStyle = "black"
for (let x=0;x<=7;x++){
    for (let y=0;y<=7;y++){
        a = 100*x
        b = 100*y
        if ((x+y)%2==0){
            ctx.fillStyle = "white"
        }
        else{
            ctx.fillStyle = "black"
        }
        ctx.fillRect(a+5,b+5,95,95)
    }
}