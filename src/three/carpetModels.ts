import * as THREE from 'three';
import type { CarpetProduct } from '../data/carpets';
import {
  createCarpetTexture,
  createRollSpiralTexture,
} from './carpetTextures';

export interface ShowroomResources {
  disposables: Array<{ dispose: () => void }>;
  clickableTargets: THREE.Object3D[];
  rollGroups: Array<{ productId: number; group: THREE.Group; baseY: number }>;
  spotlightGroup: THREE.Group;
  spotlightCarpetMat: THREE.MeshStandardMaterial;
  spotlightTextureCache: Map<number, THREE.CanvasTexture>;
  maxAnisotropy: number;
}

export function buildGalleryArchitecture(
  scene: THREE.Scene,
  woodTexture: THREE.CanvasTexture,
  disposables: Array<{ dispose: () => void }>
) {
  // Walnut gallery floor
  const floorGeo = new THREE.PlaneGeometry(24, 18);
  const floorMat = new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.72,
    metalness: 0.05,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  scene.add(floor);
  disposables.push(floorGeo, floorMat);

  // Gallery Back Wall
  const wallGeo = new THREE.BoxGeometry(20, 7.5, 0.35);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x2a201a,
    roughness: 0.88,
    metalness: 0.02,
  });
  const backWall = new THREE.Mesh(wallGeo, wallMat);
  backWall.position.set(0, 3.75, -3.4);
  backWall.receiveShadow = true;
  scene.add(backWall);
  disposables.push(wallGeo, wallMat);

  // Architectural Baseboard & Wainscot Trim
  const baseboardGeo = new THREE.BoxGeometry(20, 0.32, 0.42);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0x19120e,
    roughness: 0.65,
    metalness: 0.08,
  });
  const baseboard = new THREE.Mesh(baseboardGeo, trimMat);
  baseboard.position.set(0, 0.16, -3.35);
  scene.add(baseboard);
  disposables.push(baseboardGeo, trimMat);

  // Warm Brass Gallery Molding Strip
  const brassGeo = new THREE.BoxGeometry(16.5, 0.045, 0.44);
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd6b16b,
    roughness: 0.28,
    metalness: 0.88,
  });
  const molding = new THREE.Mesh(brassGeo, brassMat);
  molding.position.set(0, 0.34, -3.34);
  scene.add(molding);
  disposables.push(brassGeo, brassMat);

  // Two Flanking Architectural Pilasters
  const pilasterGeo = new THREE.BoxGeometry(0.42, 7.5, 0.46);
  [-7.8, 7.8].forEach((px) => {
    const pilaster = new THREE.Mesh(pilasterGeo, trimMat);
    pilaster.position.set(px, 3.75, -3.26);
    pilaster.castShadow = true;
    pilaster.receiveShadow = true;
    scene.add(pilaster);
  });
  disposables.push(pilasterGeo);
}

export function buildHangingTapestryGroup(
  product: CarpetProduct,
  xPos: number,
  weaveBump: THREE.CanvasTexture,
  maxAnisotropy: number,
  disposables: Array<{ dispose: () => void }>
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(xPos, 0, -3.14);
  group.userData.productId = product.id;

  const rugTex = createCarpetTexture(product.pattern, maxAnisotropy);
  disposables.push(rugTex);

  // 1. Carved Walnut Mounting Rod
  const rodGeo = new THREE.CylinderGeometry(0.042, 0.042, 2.05, 20);
  const rodMat = new THREE.MeshStandardMaterial({
    color: 0x241711,
    roughness: 0.55,
    metalness: 0.08,
  });
  const rod = new THREE.Mesh(rodGeo, rodMat);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(0, 4.95, 0.04);
  rod.castShadow = true;
  group.add(rod);

  // 2. Two Antique Brass Rod Finials & Wall Brackets
  const finialGeo = new THREE.SphereGeometry(0.062, 16, 12);
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd6b16b,
    roughness: 0.25,
    metalness: 0.9,
  });
  [-1.04, 1.04].forEach((fx) => {
    const finial = new THREE.Mesh(finialGeo, brassMat);
    finial.position.set(fx, 4.95, 0.04);
    group.add(finial);
  });

  // 3. Hanging Woven Tapestry Body
  const panelGeo = new THREE.BoxGeometry(1.75, 2.55, 0.035);
  const panelMat = new THREE.MeshStandardMaterial({
    map: rugTex,
    bumpMap: weaveBump,
    bumpScale: 0.015,
    roughness: 0.86,
    metalness: 0.02,
  });
  const panel = new THREE.Mesh(panelGeo, panelMat);
  panel.position.set(0, 3.62, 0.02);
  panel.castShadow = true;
  panel.receiveShadow = true;
  panel.userData.productId = product.id;
  group.add(panel);

  // 4. Woven Cotton Fringe Row at Bottom
  const fringeGeo = new THREE.BoxGeometry(1.72, 0.09, 0.018);
  const fringeMat = new THREE.MeshStandardMaterial({
    color: 0xeadfcb,
    roughness: 0.92,
    metalness: 0,
  });
  const fringe = new THREE.Mesh(fringeGeo, fringeMat);
  fringe.position.set(0, 2.31, 0.02);
  group.add(fringe);

  disposables.push(rodGeo, rodMat, finialGeo, brassMat, panelGeo, panelMat, fringeGeo, fringeMat);
  return group;
}

export function buildRolledCarpetGroup(
  product: CarpetProduct,
  xPos: number,
  zPos: number,
  rotY: number,
  weaveBump: THREE.CanvasTexture,
  maxAnisotropy: number,
  disposables: Array<{ dispose: () => void }>
): THREE.Group {
  const group = new THREE.Group();
  group.position.set(xPos, 0, zPos);
  group.rotation.y = rotY;
  group.userData.productId = product.id;

  const sideTex = createCarpetTexture(product.pattern, maxAnisotropy);
  const capTex = createRollSpiralTexture(product.pattern, maxAnisotropy);
  disposables.push(sideTex, capTex);

  const radius = 0.25;
  const height = 1.95;

  // 1. Rolled Carpet Cylinder Body (bottom-center grounded at y = 0)
  const bodyGeo = new THREE.CylinderGeometry(radius, radius, height, 32, 1, true);
  const bodyMat = new THREE.MeshStandardMaterial({
    map: sideTex,
    bumpMap: weaveBump,
    bumpScale: 0.016,
    roughness: 0.86,
    metalness: 0.02,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = height / 2 + 0.015;
  body.castShadow = true;
  body.receiveShadow = true;
  body.userData.productId = product.id;
  group.add(body);

  // 2. Top Spiral Cross-Section Cap
  const capGeo = new THREE.CircleGeometry(radius, 32);
  const capMat = new THREE.MeshStandardMaterial({
    map: capTex,
    roughness: 0.8,
    metalness: 0.04,
  });
  const topCap = new THREE.Mesh(capGeo, capMat);
  topCap.rotation.x = -Math.PI / 2;
  topCap.position.y = height + 0.015;
  topCap.userData.productId = product.id;
  group.add(topCap);

  // 3. Brass Inventory Tag Collar Band near base
  const bandGeo = new THREE.CylinderGeometry(radius + 0.008, radius + 0.008, 0.075, 32, 1, true);
  const bandMat = new THREE.MeshStandardMaterial({
    color: 0xd6b16b,
    roughness: 0.3,
    metalness: 0.85,
  });
  const band = new THREE.Mesh(bandGeo, bandMat);
  band.position.y = 0.24;
  band.userData.productId = product.id;
  group.add(band);

  // 4. Cotton Fringe Base Ring touching floor
  const baseFringeGeo = new THREE.CylinderGeometry(radius * 0.96, radius * 1.02, 0.03, 24);
  const baseFringeMat = new THREE.MeshStandardMaterial({
    color: 0xe7dcc8,
    roughness: 0.95,
    metalness: 0,
  });
  const baseFringe = new THREE.Mesh(baseFringeGeo, baseFringeMat);
  baseFringe.position.y = 0.015;
  group.add(baseFringe);

  disposables.push(
    bodyGeo,
    bodyMat,
    capGeo,
    capMat,
    bandGeo,
    bandMat,
    baseFringeGeo,
    baseFringeMat
  );
  return group;
}

export function buildSpotlightCarpetGroup(
  initialProduct: CarpetProduct,
  weaveBump: THREE.CanvasTexture,
  maxAnisotropy: number,
  disposables: Array<{ dispose: () => void }>
): {
  group: THREE.Group;
  carpetMat: THREE.MeshStandardMaterial;
  textureCache: Map<number, THREE.CanvasTexture>;
} {
  const group = new THREE.Group();
  group.position.set(0, 0, 1.45);
  group.userData.productId = initialProduct.id;

  const textureCache = new Map<number, THREE.CanvasTexture>();
  const initialTex = createCarpetTexture(initialProduct.pattern, maxAnisotropy);
  textureCache.set(initialProduct.id, initialTex);
  disposables.push(initialTex);

  // 1. Low Walnut Exhibition Plinth (grounded at y = 0)
  const plinthGeo = new THREE.BoxGeometry(2.65, 0.08, 3.65);
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x221712,
    roughness: 0.62,
    metalness: 0.08,
  });
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = 0.04;
  plinth.castShadow = true;
  plinth.receiveShadow = true;
  group.add(plinth);

  // 2. Antique Brass Trim Frame around Plinth
  const trimGeo = new THREE.BoxGeometry(2.7, 0.025, 3.7);
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xd6b16b,
    roughness: 0.28,
    metalness: 0.88,
  });
  const trim = new THREE.Mesh(trimGeo, trimMat);
  trim.position.y = 0.02;
  group.add(trim);

  // 3. Unrolled Display Carpet Surface (offset cleanly above plinth to prevent Z-fighting)
  const carpetGeo = new THREE.BoxGeometry(2.15, 0.032, 3.15);
  const carpetMat = new THREE.MeshStandardMaterial({
    map: initialTex,
    bumpMap: weaveBump,
    bumpScale: 0.022,
    roughness: 0.85,
    metalness: 0.02,
  });
  const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
  carpetMesh.position.y = 0.098;
  carpetMesh.castShadow = true;
  carpetMesh.receiveShadow = true;
  carpetMesh.userData.isSpotlightCarpet = true;
  group.add(carpetMesh);

  // 4. Top & Bottom Woven Silk/Cotton Fringes
  const fringeGeo = new THREE.BoxGeometry(2.08, 0.015, 0.12);
  const fringeMat = new THREE.MeshStandardMaterial({
    color: 0xefe3ce,
    roughness: 0.92,
    metalness: 0,
  });
  [-1.63, 1.63].forEach((fz) => {
    const fringe = new THREE.Mesh(fringeGeo, fringeMat);
    fringe.position.set(0, 0.09, fz);
    group.add(fringe);
  });

  disposables.push(
    plinthGeo,
    plinthMat,
    trimGeo,
    trimMat,
    carpetGeo,
    carpetMat,
    fringeGeo,
    fringeMat
  );

  return { group, carpetMat, textureCache };
}
