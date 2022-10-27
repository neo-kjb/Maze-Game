const{Engine , Render, Runner , World , Bodies} = Matter
const engine=Engine.create();
const{world}=engine;
const cells = 10;
const height=600;
const width=600;
const unitLength = width/cells;
const render=Render.create({
    element: document.body,
    engine:engine,
    options:{
        height,
        width
    }
})
Render.run(render);
Runner.run(Runner.create(), engine)

const walls=[
    Bodies.rectangle(width/2,0,width,40,{isStatic:true}),
    Bodies.rectangle(width/2,height,width,40,{isStatic:true}),
    Bodies.rectangle(width,height/2,40,height,{isStatic:true}),
    Bodies.rectangle(0,height/2,40,height,{isStatic:true})

]

World.add(world,walls);

const grid= Array(cells).fill(null).map(()=>Array(cells).fill(false));
const horizontal =Array(cells-1).fill(null).map(()=>Array(cells).fill(false));
const vertical = Array(cells).fill(null).map(()=>Array(cells-1).fill(false));
const startRow = Math.floor(Math.random()*cells);
const startColumn = Math.floor(Math.random()*cells);
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

        if (nextRow<0 || nextRow >= cells || nextColumn <0 || nextColumn >=cells){
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
            (columnIdx*unitLength)+unitLength,
            (rowIdx*unitLength)+(unitLength/2),
            5,
            unitLength,
            {
                isStatic: true
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
            columnIdx*unitLength+unitLength/2,
            rowIdx*unitLength+unitLength,
            unitLength,
            5,
            {
                isStatic:true
            }
        )
        World.add(world,wall)

    })
})

