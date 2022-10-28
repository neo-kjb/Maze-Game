const{Engine , Render, Runner , World , Bodies , Body , Events} = Matter
const engine=Engine.create();
engine.world.gravity.y=0;
const{world}=engine;
const cellsHorizontal=10;
const cellsVertival =8;
const height=window.innerHeight;
const width=window.innerWidth;
const unitLengthX = width/cellsHorizontal;
const unitLengthY = height/cellsVertival;
const render=Render.create({
    element: document.body,
    engine:engine,
    options:{
        wireframes:false,
        height,
        width
    }
})
Render.run(render);
Runner.run(Runner.create(), engine)

const walls=[
    Bodies.rectangle(width/2,0,width,2,{isStatic:true}),
    Bodies.rectangle(width/2,height,width,2,{isStatic:true}),
    Bodies.rectangle(width,height/2,2,height,{isStatic:true}),
    Bodies.rectangle(0,height/2,2,height,{isStatic:true})

]

World.add(world,walls);

const grid= Array(cellsVertival).fill(null).map(()=>Array(cellsHorizontal).fill(false));
const horizontal =Array(cellsVertival-1).fill(null).map(()=>Array(cellsHorizontal).fill(false));
const vertical = Array(cellsVertival).fill(null).map(()=>Array(cellsHorizontal-1).fill(false));
const startRow = Math.floor(Math.random()*cellsVertival);
const startColumn = Math.floor(Math.random()*cellsHorizontal);
const shuffle=(arr)=>{
    let counter = arr.length;
    while(counter > 0){
        const index = Math.floor(Math.random()*counter);
        counter--;
        const temp = arr[counter];
        arr[counter]=arr[index];
        arr[index]=temp;
    }
    return arr;
};



const stepThroughCell=(row,column)=>{
    if(grid[row][column]){
        return;
    }
    

    grid[row][column]=true;


    const neighbors= shuffle([
        [row,column-1,'left'],
        [row-1,column,'up'],
        [row,column+1,'right'],
        [row+1,column,'down']
    ])


    for (let neighbor of neighbors){
        const[nextRow,nextColumn,direction]=neighbor;

        if (nextRow<0 || nextRow >= cellsVertival || nextColumn <0 || nextColumn >=cellsHorizontal){
            continue;
        }
        if (grid[nextRow][nextColumn]){
            continue;
        };
        if (direction === 'left') {
            vertical[row][column - 1] = true;
          } else if (direction === 'right') {
            vertical[row][column] = true;
          } else if (direction === 'up') {
            horizontal[row - 1][column] = true;
          } else if (direction === 'down') {
            horizontal[row][column] = true;
          }
        stepThroughCell(nextRow,nextColumn);
    }




};
stepThroughCell(startRow,startColumn)


vertical.forEach((row,rowIdx)=>{
    row.forEach((open,columnIdx)=>{
        if(open){
            return;
        }
        const wall = Bodies.rectangle(
            (columnIdx*unitLengthX)+unitLengthX,
            (rowIdx*unitLengthY)+(unitLengthY/2),
            5,
            unitLengthY,
            {
                label:'wall',
                isStatic: true,
                render:{
                    fillStyle:'red'
                }
            }
        )
        World.add(world,wall)
        })
});


horizontal.forEach((row,rowIdx)=>{
    row.forEach((open,columnIdx)=>{
        if (open){
            return
        }
        const wall = Bodies.rectangle(
            columnIdx*unitLengthX+unitLengthX/2,
            rowIdx*unitLengthY+unitLengthY,
            unitLengthX,
            5,
            {
                label:'wall',
                isStatic:true,
                render:{
                    fillStyle:'red'
                }
            }
        )
        World.add(world,wall)

    })
})

const goal = Bodies.rectangle(
    width-unitLengthX/2,
    height-unitLengthY/2,
    unitLengthX*0.7,
    unitLengthY*0.7,{
        label:'goal',
        isStatic : true,
        render:{
            fillStyle:'green'
        }
    }
)

World.add(world,goal)
const ballRad = Math.min(unitLengthX,unitLengthY)/4;
const ball = Bodies.circle(
    unitLengthX*0.5,
    unitLengthY*0.5,
    ballRad,
    {
        label:'ball',
        render:{
            fillStyle:'white'
        }
    }
)
World.add(world,ball)

document.addEventListener('keydown', (event)=>{
    const {x,y}=ball.velocity;
    

    if (event.code ==='KeyA'){
        Body.setVelocity(ball,{x:x-5,y})
    }
    if (event.code==='KeyW'){
        Body.setVelocity(ball,{x,y:y-5})

    }

    if (event.code==='KeyD'){
        Body.setVelocity(ball,{x:x+5,y})

    }

    if (event.code==='KeyS'){
        Body.setVelocity(ball,{x,y:y+5})

    }


})

Events.on(engine,'collisionStart', event=>{
    event.pairs.forEach((collision)=>{
    const labels = ['goal', 'ball']
    if (labels.includes(collision.bodyA.label)&&
    labels.includes(collision.bodyB.label)){
        document.querySelector('.winner').classList.remove('hidden')
        world.gravity.y=1;
        world.bodies.forEach(body=>{
            if(body.label==='wall'){
                Body.setStatic(body,false)
            }
        })

    }

    })
    
})

