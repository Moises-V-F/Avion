var Colors = {
	red: 0xf25346,
	white: 0xd8d0d1,
	brown: 0x59332e,
	pink: 0xF5986E,
	brownDark: 0x23190f,
	blue: 0x68c3c0
};

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container, THREE;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	
    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 60;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
	camera.position.x = 0;
	camera.position.z = 200;
	camera.position.y = 100;
    renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
	});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
	container.appendChild(renderer.domElement);
}

var Sea, Cloud, Sky;

var mat = new THREE.MeshPhongMaterial({
		color: Colors.blue,
		transparent: true,
		opacity: 0.6,
		shading: THREE.FlatShading
	});

Sea = function () {
	var geom = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
	
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
	
	this.mesh = new THREE.Mesh(geom, mat);
	this.mesh.receiveShadow = true;
};

function createSea() {
	Sea = new Sea();
	Sea.mesh.position.y = -600;
	scene.add(Sea.mesh);
}

var nBlocs = 3 + Math.floor(Math.random() * 3);
var mat = new THREE.MeshPhongMaterial({
		color: Colors.white
	});

Cloud = function () {
	var i, s, m, geom;
	this.mesh = new THREE.Object3D();
	geom = new THREE.BoxGeometry(20, 20, 20);
	
	for (i = 0; i < nBlocs; i + 1) {
		m = new THREE.Mesh(geom, mat);
		m.position.x = i * 15;
		m.position.y = Math.random() * 10;
		m.position.z = Math.random() * 10;
		m.rotation.z = Math.random() * Math.PI * 2;
		m.rotation.y = Math.random() * Math.PI * 2;
		s = 0.1 + Math.random() * 0.9;
		m.scale.set(s, s, s);
		m.castShadow = true;
		m.receiveShadow = true;
		this.mesh.add(m);
	}
};

Sky = function () {
	var i, a, c, h, s, stepAngle;
	
	this.mesh = new THREE.Object3D();
	this.nClouds = 20;
	stepAngle = Math.PI * 2 / this.nClouds;

	for (i = 0; i < this.nClouds; i + 1) {
		c = new Cloud();
		a = stepAngle * i;
		h = 750 + Math.random() * 200;
		c.mesh.position.y = Math.sin(a) * h;
		c.mesh.position.x = Math.cos(a) * h;
		c.mesh.rotation.z = a + Math.PI / 2;
		c.mesh.position.z = -400 - Math.random() * 400;
		s = 1 + Math.random() * 2;
		c.mesh.scale.set(s, s, s);
		this.mesh.add(c.mesh);
	}
};

function createSky() {
	Sky = new Sky();
	Sky.mesh.position.y = -600;
	scene.add(Sky.mesh);
}

var geomBlade, matBlade, blade, matTailPlane;
var geomCockpit, matCockpit, cockpit, geomEngine, matEngine, engine, geomTailPlane;
var tailPlane, geomSideWing, matSideWing, sideWing, geomPropeller, matPropeller;

var AirPlane = function () {
	
	this.mesh = new THREE.Object3D();
	geomCockpit = new THREE.BoxGeometry(60, 50, 50, 1, 1, 1);
	matCockpit = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
	cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);
	geomEngine = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
	matEngine = new THREE.MeshPhongMaterial({color: Colors.white, shading: THREE.FlatShading});
	engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	this.mesh.add(engine);
	geomTailPlane = new THREE.BoxGeometry(15, 20, 5, 1, 1, 1);
	matTailPlane = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
	tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35, 25, 0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	this.mesh.add(tailPlane);
	geomSideWing = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
	matSideWing = new THREE.MeshPhongMaterial({color: Colors.red, shading: THREE.FlatShading});
	sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	this.mesh.add(sideWing);
	geomPropeller = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
	matPropeller = new THREE.MeshPhongMaterial({color: Colors.brown, shading: THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;
	geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
	matBlade = new THREE.MeshPhongMaterial({color: Colors.brownDark, shading: THREE.FlatShading});
	
	blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8, 0, 0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.add(blade);
	this.propeller.position.set(50, 0, 0);
	this.mesh.add(this.propeller);
};

var airplane;

function createPlane() {
	airplane = new AirPlane();
	airplane.mesh.scale.set(0.25, 0.25, 0.25);
	airplane.mesh.position.y = 100;
	scene.add(airplane.mesh);
}

var hemisphereLight, shadowLight;

function createLights() {
	hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
	shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
	shadowLight.position.set(150, 350, 350);
	shadowLight.castShadow = true;
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;
	scene.add(hemisphereLight);
	scene.add(shadowLight);
}

var mousePos = {x : 0, y : 0};

function handleMouseMove(event) {
	var tx, ty;
	
	tx = -1 + (event.clientX / WIDTH) * 2;
	ty = 1 - (event.clientY / HEIGHT) * 2;
	mousePos = {x : tx, y : ty};

}

function loop() {

	airplane.propeller.rotation.x += 0.3;
	Sea.mesh.rotation.z += 0.005;
	Sky.mesh.rotation.z += 0.01;

	renderer.render(scene, camera);

	requestAnimationFrame(loop);
}

function normalize(v, vmin, vmax, tmin, tmax) {
	var nv, dv, pc, dt, tv;
	
	nv = Math.max(Math.min(v, vmax), vmin);
	dv = vmax - vmin;
	pc = (nv - vmin) / dv;
	dt = tmax - tmin;
	tv = tmin + (pc * dt);
	return tv;

}

function updatePlane() {
	var targetX, targetY;
	
	targetX = normalize(mousePos.x, -1, 1, -100, 100);
	targetY = normalize(mousePos.y, -1, 1, 25, 175);

	airplane.mesh.position.y = targetY;
	airplane.mesh.position.x = targetX;
	airplane.propeller.rotation.x += 0.3;
}

function loop() {
	Sea.mesh.rotation.z += 0.005;
	Sky.mesh.rotation.z += 0.01;

	updatePlane();
	
	renderer.render(scene, camera);
	requestAnimationFrame(loop);
}

renderer.render(scene, camera);

function init() {
    createScene();
	createLights();
	createPlane();
	createSea();
	createSky();
	
	document.addEventListener('mousemove', handleMouseMove, false);
	loop();
}
window.addEventListener('load', init, false);