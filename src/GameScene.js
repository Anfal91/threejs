import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import Input from './Input';
export default class GameScence{
    constructor({canvas}){
        this.canvas= canvas;

        this.init();
        this.render();
    }
    init(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight,0.1,1000)
        // this.camera.position.set(0,2,0)
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.resize();
        this.setUpEvents();
        this.setUpControls();
        this.setup();

        Input.init();
    }

    render(){
        this.renderer.render(this.scene, this.camera);
        this.update();
        Input.clear();
        requestAnimationFrame(()=>{this.render()})
    }
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth,window.innerHeight)
    }

    setUpEvents(){
        window.addEventListener('resize',()=> this.resize())
    }

    setUpControls(){
        this.OrbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    }
}