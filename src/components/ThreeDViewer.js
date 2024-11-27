// This pages creates a Three Scene
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ThreeDViewer = ({ fileUrl, alignToPlane, rotationX, rotationY }) => {
  const viewerRef = useRef();

  useEffect(() => {
    if (!fileUrl) return;

    const viewerElement = viewerRef.current; // Store the ref value at the start of the effect

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      viewerRef.current.clientWidth,
      viewerRef.current.clientHeight
    ); // Dynamically set size

    viewerElement.appendChild(renderer.domElement);

    viewerRef.current.appendChild(renderer.domElement);

    const currentViewer = viewerRef.current; // Capture the current ref
    currentViewer.appendChild(renderer.domElement);

    // Set scene background to dark grey
    const backgroundColor = new THREE.Color(0x2b2b2b); // Dark grey
    scene.background = backgroundColor;

    // Initial camera position
    camera.position.set(100, 100, 100); // Position at 45 degrees both vertically and horizontally
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // Point camera at the origin or object centre

    // Add lights
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Bright light
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft ambient light
    scene.add(ambientLight);

    // Add a subtle spotlight to create the gradient effect
    const spotlight = new THREE.SpotLight(0xffffff, 0.6);
    spotlight.position.set(50, 50, 50);
    spotlight.castShadow = true;
    scene.add(spotlight);

    // Add OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Smooth motion
    controls.dampingFactor = 0.05;
    controls.minDistance = 10; // Minimum zoom
    controls.maxDistance = 500; // Maximum zoom

    // Add ground plane
    const planeGeometry = new THREE.PlaneGeometry(300, 300);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a, // Slightly lighter grey
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    plane.position.y = -10; // Position slightly below the model
    scene.add(plane);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(300, 10, 0xffffff, 0xffffff); // White grid
    gridHelper.position.y = -9.99; // Slightly above the plane to avoid z-fighting
    scene.add(gridHelper);

    // Load STL file
    const loader = new STLLoader();
    loader.load(fileUrl, (geometry) => {
      const material = new THREE.MeshStandardMaterial({
        color: 0x0077ff,
        metalness: 0.2, // Adjust for shininess
        roughness: 0.6, // Adjust for smoother reflection
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Auto-centre and scale the model
      const box = new THREE.Box3().setFromObject(mesh);
      const size = box.getSize(new THREE.Vector3()).length();
      const center = box.getCenter(new THREE.Vector3());

      // Translate the model to the scene's centre
      mesh.geometry.translate(-center.x, -center.y, -center.z);
      mesh.position.y = 100; // Position slightly above the ground

      // Adjust camera to fit the object and look at its centre
      const distance = size * 2; // Adjust distance multiplier as needed
      camera.position.set(
        center.x + distance,
        center.y + distance,
        center.z + distance
      );
      camera.lookAt(center); // Focus the camera on the centre of the object

      mesh.rotation.x += 0.01;
      mesh.rotation.y += 0.01;

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        /*if (mesh) {
          // Rotate the object
          mesh.rotation.x += 0.01;
          mesh.rotation.y += 0.01;
        }*/

        // Apply rotation from props
        mesh.rotation.x = rotationX;
        mesh.rotation.y = rotationY;

        renderer.render(scene, camera);
      };

      animate();

      // Align to ground plane
      if (alignToPlane && mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        const minY = box.min.y; // Get the lowest point of the model
        mesh.position.y -= minY; // Adjust position to sit on the ground plane
      }
    });

    // Clean up on unmount
    return () => {
      while (viewerElement.firstChild) {
        viewerElement.removeChild(viewerElement.firstChild);
      }
    };
  }, [fileUrl, alignToPlane, rotationX, rotationY]);

  return (
    <div
      ref={viewerRef}
      style={{
        width: '100%',
        height: '100%',
        border: '1px solid #ccc',
        borderRadius: '8px',
      }}
    />
  );
};

export default ThreeDViewer;
