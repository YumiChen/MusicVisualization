import React, {Component} from "react";
// import {THREE} from 'three';

const material = new THREE.MeshNormalMaterial({
    wireframe: false,
    wireframeLineWidth: 1,
    morphTargets: false,
    transparent: false,
    opacity: 1,
    depthTest: true,
    depthWrite: true,
    depthFunc: THREE.LessEqualDepth,
    blending: THREE.NormalBlending,
    blendSrc: THREE.SrcAlphaFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    blendEquation: THREE.AddEquation,
    polygonOffset: false,
    polygonOffsetFactor: 0,
    polygonOffsetUnits: 0,
    clippingPlanes: null,
    clipShadows: false,
    overdraw: 0,
    needsUpdate: false,
    alphaTest: 0,
    visible: true,
    side: THREE.FrontSide
});

export default class Cubes extends Component{
    constructor(props){
        super(props);

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.meshes = [];
        this.meshnum = 100;
        this.radius = this.width / 600;
        this.PI2 = Math.PI*2;
    }
    componentDidMount(){
        this.init();
        this.generateCubes(); 
        requestAnimationFrame(this.animateCubes);

        window.addEventListener('resize', this.onResize);
    }
    render(){
        return (<div ref={conatiner=>(this.conatiner=conatiner)}></div>);
    }
    init=()=>{
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0x59EBF9);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        
        this.conatiner.appendChild(this.renderer.domElement);

        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.animation = 'threeEnter 5s 1';
        this.renderer.domElement.style.animationFillMode = 'forwards';
        this.renderer.domElement.style.filter = 'blur(4px) brightness(1.1) contrast(1.12) grayscale(0.1) hue-rotate(0deg) invert(0.1) opacity(65%) saturate(2.2) sepia(0.5) drop-shadow(0px 0px 2px #000)';
        
        //camera
        this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 0.1, 3000);
        this.camera.position.set(0,0,0);

        //scene
        this.scene = new THREE.Scene();
        //light
        this.light1 = new THREE.AmbientLight(0xffffff, 0.5);
        this.light2 = new THREE.PointLight(0xffffff, 0.5);

        this.scene.add(this.light1);
        this.scene.add(this.light2);

        this.camera.lookAt(this.scene.position);
    }
    generateCubes=()=>{
        this.meshes = [];
        for(let i=0;i<this.meshnum;i+=1){
            var geometry = new THREE.CubeGeometry(20, 20, 20);
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.random()*10, Math.random(), -900+Math.random()*100);
            mesh.deg = Math.random()*360;
            this.meshes.push(mesh);
        }
        this.meshes.forEach(mesh=>{
            this.scene.add(mesh);
        });
    }
    onResize=()=>{
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.radius = this.width / 600;

        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
    animateCubes=()=>{
        if (this.requestAnimationId) {
            window.cancelAnimationFrame(this.requestAnimationId);
            this.requestAnimationId = undefined;
        }

        this.meshes.forEach(mesh=>{
            mesh.rotation.x += Math.random()*0.05;
            mesh.rotation.y += Math.random()*0.05;
            mesh.rotation.z += Math.random()*0.05;

            mesh.translateX(this.radius*Math.sin((mesh.deg/360)*this.PI2));
            mesh.translateY(this.radius*Math.cos((mesh.deg/360)*this.PI2));
            mesh.translateZ(this.radius*Math.sin((mesh.deg/360)*this.PI2));
            if(this.props.val !== null && this.props.val !== NaN){
                mesh.scale.set(this.props.val,this.props.val,this.props.val);
            }else if(mesh.scale.x !== 1) mesh.scale.set(1,1,1);

            mesh.deg+=1;
        });

        this.renderer.render(this.scene, this.camera);
        this.requestAnimationId = requestAnimationFrame(this.animateCubes);
    }
}