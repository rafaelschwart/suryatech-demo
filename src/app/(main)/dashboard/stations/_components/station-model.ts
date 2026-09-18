import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export type PartId = "solar" | "battery" | "electronics" | "connector" | "enclosure" | "frame" | "base";
export type ViewId = "iso" | "front" | "side" | "top";
export type ViewerState = { exploded: boolean; engineering: boolean; selected: PartId | null; view: ViewId };
const OFFSETS: Record<PartId, THREE.Vector3> = {
  solar: new THREE.Vector3(0, 0.52, 0),
  enclosure: new THREE.Vector3(-0.58, 0, 0.66),
  battery: new THREE.Vector3(-0.7, 0.05, 0),
  electronics: new THREE.Vector3(0.66, 0, 0.18),
  connector: new THREE.Vector3(0.58, 0, 0),
  frame: new THREE.Vector3(),
  base: new THREE.Vector3(),
};

export function mountStationModel(
  host: HTMLDivElement,
  onSelect: (part: PartId | null) => void,
  onError: () => void,
  modelUrl = "/media/charging-station.glb",
) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute(
    "aria-label",
    "Charging station 3D model. Use the view and component buttons to inspect.",
  );
  host.appendChild(renderer.domElement);
  const camera = new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = false;
  controls.enablePan = false;
  controls.minZoom = 0.7;
  controls.maxZoom = 2.5;
  controls.maxPolarAngle = Math.PI / 2 + 0.04;
  controls.target.set(0, 1.15, 0);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const env = pmrem.fromScene(room, 0.04);
  scene.environment = env.texture;
  room.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xeaf1ff, 0x667080, 2));
  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(3, 5, 4);
  scene.add(light);
  const fill = new THREE.DirectionalLight(0xd9e6ff, 1.5);
  fill.position.set(-3, 2, 1);
  scene.add(fill);
  const grid = new THREE.GridHelper(3.6, 24, 0x8594aa, 0x8594aa);
  grid.position.y = -0.003;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.17;
  scene.add(grid);
  const dimensions = new THREE.Group();
  const dimMaterial = new THREE.LineBasicMaterial({ color: 0x8c9aa9, transparent: true, opacity: 0.8 });
  function dimLine(points: number[][]) {
    dimensions.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))),
        dimMaterial,
      ),
    );
  }
  dimLine([
    [-0.88, 0, 0],
    [-0.88, 2.31, 0],
  ]);
  for (const y of [0, 2.31]) {
    dimLine([
      [-0.94, y, 0],
      [-0.69, y, 0],
    ]);
    dimLine([
      [-0.91, y - 0.035, 0],
      [-0.85, y + 0.035, 0],
    ]);
  }
  dimLine([
    [-0.62, 2.5, 0],
    [0.62, 2.5, 0],
  ]);
  for (const x of [-0.62, 0.62])
    dimLine([
      [x, 2.44, 0],
      [x, 2.55, 0],
    ]);
  const labelTextures: THREE.Texture[] = [];
  function dimLabel(text: string, pos: [number, number, number]) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.font = "32px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#8793a3";
    ctx.fillText(text, 256, 40);
    const texture = new THREE.CanvasTexture(canvas);
    labelTextures.push(texture);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthTest: false }));
    sprite.position.set(...pos);
    sprite.scale.set(0.7, 0.11, 1);
    dimensions.add(sprite);
  }
  dimLabel("~2.31 m", [-1.08, 1.1, 0]);
  dimLabel("1.24 m", [0, 2.59, 0]);
  scene.add(dimensions);

  let disposed = false,
    inView = true,
    raf = 0,
    last = 0;
  let model: THREE.Group | null = null;
  let state: ViewerState = { exploded: false, engineering: true, selected: null, view: "iso" };
  const parts = new Map<PartId, { object: THREE.Object3D; rest: THREE.Vector3 }>();
  const materials = new Map<
    THREE.MeshStandardMaterial,
    { color: THREE.Color; emission: THREE.Color; intensity: number; part: PartId }
  >();
  const edges: THREE.LineSegments[] = [];
  const sourceMaterials = new Set<THREE.Material>();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  function render(now = performance.now()) {
    raf = 0;
    if (disposed || !inView || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    let moving = false;
    for (const [id, part] of parts) {
      const target = part.rest.clone().addScaledVector(OFFSETS[id], state.exploded ? 1 : 0);
      if (motion.matches) part.object.position.copy(target);
      else part.object.position.lerp(target, 1 - Math.exp(-12 * dt));
      if (part.object.position.distanceTo(target) > 0.0005) moving = true;
      else part.object.position.copy(target);
    }
    renderer.render(scene, camera);
    host.dataset.triangles = String(renderer.info.render.triangles);
    host.dataset.drawCalls = String(renderer.info.render.calls);
    if (moving) raf = requestAnimationFrame(render);
  }
  function invalidate() {
    if (!raf && !disposed) {
      last = performance.now();
      raf = requestAnimationFrame(render);
    }
  }
  function resize() {
    const width = host.clientWidth,
      height = host.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height);
    const aspect = width / height;
    const span = Math.max(state.exploded ? 3.5 : 3.05, (state.exploded ? 3.5 : 2.65) / aspect);
    camera.left = (-span * aspect) / 2;
    camera.right = (span * aspect) / 2;
    camera.top = span / 2;
    camera.bottom = -span / 2;
    camera.updateProjectionMatrix();
    invalidate();
  }
  function setView(view: ViewId) {
    const target = new THREE.Vector3(0, state.exploded ? 1.3 : 1.2, 0);
    controls.target.copy(target);
    const dir = { iso: [3.1, 1.8, 5.2], front: [0, 0, 6], side: [6, 0, 0], top: [0, 6, 0.001] }[view];
    camera.position.copy(target).add(new THREE.Vector3(dir[0], dir[1], dir[2]));
    camera.zoom = 1;
    controls.update();
    resize();
  }
  function update(next: ViewerState) {
    const changedView = state.view !== next.view || state.exploded !== next.exploded;
    state = next;
    dimensions.visible = next.engineering && !next.exploded;
    for (const edge of edges) edge.visible = next.engineering;
    for (const [m, original] of materials) {
      m.color.copy(original.color);
      m.emissive.copy(original.emission);
      m.emissiveIntensity = original.intensity;
      if (next.selected === original.part) {
        m.emissive.set(0xe9af36);
        m.emissiveIntensity = 0.2;
      }
    }
    host.dataset.exploded = String(next.exploded);
    host.dataset.selected = next.selected ?? "none";
    host.dataset.view = next.view;
    if (changedView) setView(next.view);
    invalidate();
  }
  controls.addEventListener("change", invalidate);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const visibility = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) invalidate();
  });
  visibility.observe(host);
  document.addEventListener("visibilitychange", invalidate);
  motion.addEventListener("change", invalidate);
  renderer.domElement.addEventListener("webglcontextlost", onError);
  let down = { x: 0, y: 0 };
  function pointerDown(e: PointerEvent) {
    down = { x: e.clientX, y: e.clientY };
  }
  const raycaster = new THREE.Raycaster();
  function pointerUp(e: PointerEvent) {
    if (!model || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) return;
    const r = renderer.domElement.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, (-(e.clientY - r.top) / r.height) * 2 + 1),
      camera,
    );
    const hit = raycaster.intersectObject(model, true).find((h) => h.object instanceof THREE.Mesh);
    let object = hit?.object;
    while (object && !(object.name in OFFSETS)) object = object.parent ?? undefined;
    onSelect(object ? (object.name as PartId) : null);
  }
  renderer.domElement.addEventListener("pointerdown", pointerDown);
  renderer.domElement.addEventListener("pointerup", pointerUp);
  setView("iso");
  function disposeScene(root: THREE.Object3D) {
    root.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      if (m.material) for (const material of Array.isArray(m.material) ? m.material : [m.material]) material.dispose();
    });
  }
  const ready = new GLTFLoader().loadAsync(modelUrl).then((gltf) => {
    if (disposed) {
      disposeScene(gltf.scene);
      return;
    }
    model = gltf.scene;
    scene.add(model);
    for (const id of Object.keys(OFFSETS) as PartId[]) {
      const object = model.getObjectByName(id);
      if (!object) throw new Error(`Missing assembly: ${id}`);
      parts.set(id, { object, rest: object.position.clone() });
      const meshes: THREE.Mesh[] = [];
      object.traverse((o) => {
        if (o instanceof THREE.Mesh) meshes.push(o);
      });
      for (const o of meshes) {
        const originals = Array.isArray(o.material) ? o.material : [o.material];
        for (const original of originals) sourceMaterials.add(original);
        const copies = originals.map((m) => {
          const material = m instanceof THREE.MeshStandardMaterial ? m.clone() : new THREE.MeshStandardMaterial();
          materials.set(material, {
            color: material.color.clone(),
            emission: material.emissive.clone(),
            intensity: material.emissiveIntensity,
            part: id,
          });
          return material;
        });
        o.material = Array.isArray(o.material) ? copies : copies[0];
        const outline = new THREE.LineSegments(
          new THREE.EdgesGeometry(o.geometry, 32),
          new THREE.LineBasicMaterial({ color: 0x899eae, transparent: true, opacity: 0.2 }),
        );
        o.add(outline);
        edges.push(outline);
      }
    }
    host.dataset.loaded = "true";
    update(state);
  });
  return {
    ready,
    update,
    reset() {
      setView(state.view);
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      controls.dispose();
      observer.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", invalidate);
      motion.removeEventListener("change", invalidate);
      renderer.domElement.removeEventListener("webglcontextlost", onError);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      disposeScene(scene);
      for (const material of sourceMaterials) material.dispose();
      for (const texture of labelTextures) texture.dispose();
      env.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
