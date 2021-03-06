import React, { PureComponent } from 'react';
import * as THREE from 'three';

export default class Scene extends PureComponent {
  setupScene() {
    // Create renderer.
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    // Set the pixel ratio.
    // This kills performance on high res monitors (especially my laptop)
    //this.renderer.setPixelRatio(window.devicePixelRatio);

    // Create camera.
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    // Position Camera.
    this.camera.position.z = 400;

    // Create Scene.
    this.scene = new THREE.Scene();

    // Create and add AmbientLight.
    this.light = new THREE.AmbientLight(0x404040); // soft white light
    this.scene.add(this.light);

    // Add rotating lights.
    this.light1 = new THREE.PointLight(0xff0000);
    this.scene.add(this.light1);
    this.pointLightHelper1 = new THREE.PointLightHelper(this.light1, 10);
    this.scene.add(this.pointLightHelper1);
    this.light2 = new THREE.PointLight(0x00ff00);
    this.scene.add(this.light2);
    this.pointLightHelper2 = new THREE.PointLightHelper(this.light2, 10);
    this.scene.add(this.pointLightHelper2);

    // Create initial Material.
    this.material = new THREE.MeshBasicMaterial();

    // Create and add mesh/object.
    //this.geometry = new THREE.BoxGeometry(200, 200, 200);
    //this.mesh = new THREE.Mesh(this.geometry, this.material);
    //this.scene.add(this.mesh);

    this.addMesh();

    // Add resize listener.
    window.addEventListener('resize', this.sizeRenderer.bind(this), false);
  }

  addMesh(shapeOb = null) {
    // remove previous mesh.
    if (Boolean(this.mesh)) {
      this.scene.remove(this.mesh);
    }
    // Add new mesh, default if no shapeOb.
    if (!Boolean(shapeOb)) {
      this.geometry = new THREE.BoxGeometry(200, 200, 200, 50, 50, 50);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    } else {
      this.geometry = new THREE[shapeOb.class](...shapeOb.args);
      this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    this.scene.add(this.mesh);
  }

  sizeRenderer() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  componentDidMount() {
    this.setupScene();
    this.sizeRenderer();
    this.scenecontainer.appendChild(this.renderer.domElement);
    this.animate();
  }

  componentWillReceiveProps(nextProps) {
    // Only add/change the mesh if it is different.
    if (this.mesh.geometry.constructor.name !== nextProps.currentShape.class) {
      this.addMesh(nextProps.currentShape);
    }
    this.mesh.material = nextProps.currentShader;
  }

  // shouldComponentUpdate() {
  //   return false;
  // }

  /**
   * Animation loop
   */
  animate() {
    let timer = Date.now() * 0.0005;
    this.mesh.rotation.x += 0.005;
    this.mesh.rotation.y += 0.01;

    // Check for props for light distance, or just put 400
    this.light1.position.x =
      Math.cos(timer) * (this.props.light1distance || 250);
    this.light1.position.z =
      Math.sin(timer) * (this.props.light1distance || 250);
    this.light2.position.y =
      Math.cos(timer * 1.25) * (this.props.light2distance || 250);
    this.light2.position.z =
      Math.sin(timer * 1.25) * (this.props.light2distance || 250);

    if (typeof this.props.onAnimate === 'function') {
      this.props.onAnimate();
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate.bind(this));
  }

  render() {
    return (
      <div
        id="scene"
        ref={div => {
          this.scenecontainer = div;
        }}
      />
    );
  }
}
