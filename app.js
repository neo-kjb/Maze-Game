const{Engine , Render, Runner , World , Bodies} = Matter
const engine=Engine.create();
const{world}=engine;
const cells = 5;
const height=600;
const width=600;
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
