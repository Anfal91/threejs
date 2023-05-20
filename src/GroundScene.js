import GameScence from "./GameScene";
import * as THREE from 'three'
import Input from "./Input";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class GroundScene extends GameScence {
    setup() {
        this.clock = new THREE.Clock();

        this.OrbitControls.enabled = true;
        this.OrbitControls.enableZoom = false;
        this.OrbitControls.maxPolarAngle = Math.PI * 0.49;
        this.OrbitControls.minPolarAngle = Math.PI * 0.49;

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: "rgb(120,120,120)" });
        const box = new THREE.Mesh(geometry, material);
        box.castShadow = true;
        box.position.y = 0.5;
        box.position.x = 0;


        // creating light
        const light = new THREE.PointLight(0xffffff, 0.5)
        light.castShadow = true;
        light.position.y = 2;
        light.position.x = 1;


        // creating sphear
        const sphereGeomerty = new THREE.SphereGeometry(0.05, 24, 24);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        const sphere = new THREE.Mesh(sphereGeomerty, sphereMaterial);

        light.add(sphere)

        // creating plane
        const plane = new THREE.PlaneGeometry(20, 20);
        const planematerial = new THREE.MeshStandardMaterial({
            color: ("rgb(120,120,120)"),
            side: THREE.DoubleSide
        });
        const planeMesh = new THREE.Mesh(plane, planematerial);
        planeMesh.receiveShadow = true;
        planeMesh.rotation.x = Math.PI / 2;

        this.mixer = null;
        this.clips = null;
        const loader = new GLTFLoader();
        loader.load('../models/mychar.glb', (object) => {
            // console.log(object)
            let mesh = object.scene;
            this.player = mesh;
            this.player.position.set(JSON.parse(localStorage.getItem('try')).x,JSON.parse(localStorage.getItem('try')).y,JSON.parse(localStorage.getItem('try')).z);
            // mesh.position.set(2,0,1)
            // this.camera.position.set(this.player.position.clone, this.player.position.y+2, this.player.position.z)

            let scale = 1;

            mesh.scale.set(scale, scale, scale)
            this.scene.add(mesh);
            // console.log(object)
            this.mixer = new THREE.AnimationMixer(object.scene);
            this.clips = object.animations;

            this.animations = {
                idle: this.mixer.clipAction(this.clips[0]),
                run: this.mixer.clipAction(this.clips[1]),
                walk: this.mixer.clipAction(this.clips[2])
            }
            this.animations.idle.play();

            // this.render();
        });

        this.scene.add(light, planeMesh)
        window.addEventListener('load', (event) => {

            // this.player.position = localStorage.getItem('try')
    
        });
    }

    
    update() {
        if (this.mixer) {
            let d = this.clock.getDelta();
            this.mixer.update(d);
            this.OrbitControls.target = this.player.position.clone().add({ x: 0, y: 2, z: 0 })
            this.player.rotation.set(0, this.OrbitControls.getAzimuthalAngle() + Math.PI, 0)

        }

        if (Input.keyUp) {
            if (Input.keyUp.keyCode == 38 || Input.keyUp.keyCode == 82) {
                if (!this.animations.idle.isRunning()) {
                    this.animations.idle.play();
                    this.animations.run.stop();
                    this.animations.walk.stop();
                }

            }
        }



        if (Object.keys(Input.keyDown).length > 0) {
            if (Input.keyDown[38]) {
                if (!this.animations.walk.isRunning()) {
                    this.animations.walk.play();
                    this.animations.run.stop();
                    this.animations.idle.stop();
                }
                this.player.translateZ(0.1)
                this.playerPos = this.player.position;
                localStorage.setItem("try", JSON.stringify(this.playerPos));
                // this.player.position.y(JSON.parse(localStorage.getItem('try')).y);
                // this.player.position.z(JSON.parse(localStorage.getItem('try')).z);
                

                this.camera.translateZ(-0.1)
            }


            else if (Input.keyDown[82]) {
                if (!this.animations.run.isRunning()) {
                    this.animations.run.play();
                    this.animations.idle.stop();
                    this.animations.walk.stop();
                }
                this.player.translateZ(0.2)
                this.camera.translateZ(-0.2)

            }
        }

    }
}