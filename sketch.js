/*
Hezion Studios
Based on the Evolution Modeling software from Siraj Raval
*/
let person;
let boundary;
let creatures = []

const Render = Matter.Render
const engine = Matter.Engine.create();
const world = engine.world;
const generationPeriod = 20;
let generation = new Generation(25);
let settled = false;

function setup() {
	let canvas = createCanvas(windowWidth * 0.99, windowHeight * 0.95);
	frameRate(60);
	rectMode(CENTER);
	textSize(18)
	fill(255);

	// Initialize Generation
	generation.initialize(Person);
	generation.species.forEach((creature) => { creature.add_to_world(world) });

	// Boundary
	boundary = new SimpleBoundary();
	boundary.add_to_world();

	// Mouse Constraint
	let canvasMouse = Matter.Mouse.create(canvas.elt);
	canvasMouse.pixelRatio = pixelDensity();
	let m = Matter.MouseConstraint.create(engine, { mouse: canvasMouse });
	Matter.World.add(world, m);

	// Restart Generation after 5 seconds
	setInterval(() => {
		generation.evolve();
		console.log(generation.avg_score);
		settled = false;
	}, generationPeriod * 1000);


}

let counter = 1;
function draw() {
	if (counter >= 60) {
		counter = 0;
		settled = true;
	}
	counter++;
	background(color(135, 206, 241));

	// Display Boundary
	boundary.display();

	// Display Creatures
	generation.species.forEach((creature) => {
		creature.show();
		creature.adjust_score();
		if (counter % 4 === 0 && settled) {
			creature.think(boundary);
		}
	});

	// Display Stats
	textSize(18)
	fill("black");
	text("Generación: " + generation.generation, 40, 50);
	text("Máximo: " + generation.high_score.toFixed(2), 40, 70);
	text("Puntaje promedio: " + generation.avg_score.toFixed(2), 40, 90);
	text("Población: " + generation.population, 40, 110);
	text("Tiempo por generación: " + generationPeriod + " seconds", 40, 130);
	text("Radio de mutación: " + 5 + "%", 40, 150);
	text("Progreso: " + generation.progress.toFixed(2), 40, 170);
	
	// Run Matter-JS Engine
	Matter.Engine.update(engine);
}