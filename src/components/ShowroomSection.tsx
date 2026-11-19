import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Eye,
  Plus,
  RotateCcw,
} from 'lucide-react';
import {
  SHOWROOM_IDS,
  byId,
  formatFaNumber,
  toFaDigits,
  type CarpetProduct,
} from '../data/carpets';
import {
  createCarpetTexture,
  createWeaveBumpTexture,
  createWoodFloorTexture,
} from '../three/carpetTextures';
import {
  buildGalleryArchitecture,
  buildHangingTapestryGroup,
  buildRolledCarpetGroup,
  buildSpotlightCarpetGroup,
} from '../three/carpetModels';

interface ShowroomSectionProps {
  onOpenProduct: (product: CarpetProduct) => void;
  onAddToCart: (product: CarpetProduct) => void;
}

type CameraPreset = 'overview' | 'closeup' | 'rolls';

const CAMERA_PRESETS: Record<
  CameraPreset,
  { label: string; pos: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    label: 'نمای کل گالری',
    pos: [0, 3.35, 6.4],
    target: [0, 1.15, -0.4],
  },
  closeup: {
    label: 'نمای نزدیک بافت',
    pos: [1.1, 2.35, 3.25],
    target: [0, 0.12, 1.45],
  },
  rolls: {
    label: 'نمای ردیف طاقه‌ها',
    pos: [0, 2.25, 3.45],
    target: [0, 1.0, -1.65],
  },
};

const HANGING_IDS = [2, 4, 6];

// Reusable module-level math objects (zero GC inside animation loop)
const _pointer = new THREE.Vector2();
const _targetCamPos = new THREE.Vector3();
const _targetCtrl = new THREE.Vector3();

export function ShowroomSection({ onOpenProduct, onAddToCart }: ShowroomSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState<number>(SHOWROOM_IDS[0]);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const showroomProducts = useMemo(
    () => SHOWROOM_IDS.map((id) => byId(id)).filter((p): p is CarpetProduct => Boolean(p)),
    []
  );

  const activeProduct = useMemo(
    () => byId(selectedProductId) ?? showroomProducts[0],
    [selectedProductId, showroomProducts]
  );

  const selectedRollIndex = useMemo(
    () => SHOWROOM_IDS.indexOf(selectedProductId),
    [selectedProductId]
  );

  const canvasMountRef = useRef<HTMLDivElement>(null);
  const selectedIdRef = useRef<number>(selectedProductId);
  const cameraPresetRef = useRef<CameraPreset>(cameraPreset);
  const cameraTransitionActiveRef = useRef<boolean>(false);
  const requestRenderRef = useRef<() => void>(() => {});
  const updateSpotlightRef = useRef<(productId: number) => void>(() => {});

  // Keep refs synced with React state
  useEffect(() => {
    selectedIdRef.current = selectedProductId;
    updateSpotlightRef.current(selectedProductId);
    requestRenderRef.current();
  }, [selectedProductId]);

  const applyCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(preset);
    cameraPresetRef.current = preset;
    cameraTransitionActiveRef.current = true;
    requestRenderRef.current();
  }, []);

  // Initialize Three.js WebGL Gallery Scene once
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    // Detect Software WebGL (SwiftShader / llvmpipe / WARP)
    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!gl) {
        setWebglUnavailable(true);
        return;
      }
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 360);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.setAttribute(
      'aria-label',
      'نمای سه‌بعدی تعاملی نمایشگاه فرش؛ با کشیدن ماوس زاویه دید را بچرخانید و روی فرش‌ها کلیک کنید'
    );
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x16110e);
    scene.fog = new THREE.FogExp2(0x16110e, 0.045);

    // Studio Environment Reflection (PMREM + RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 60);
    camera.position.set(...CAMERA_PRESETS.overview.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...CAMERA_PRESETS.overview.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.07;
    controls.minDistance = 2.1;
    controls.maxDistance = 10.5;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.06;
    controls.minAzimuthAngle = -Math.PI / 2.2;
    controls.maxAzimuthAngle = Math.PI / 2.2;
    controls.update();

    // Cancel scripted preset transition if user takes manual control
    const handleControlStart = () => {
      cameraTransitionActiveRef.current = false;
    };
    controls.addEventListener('start', handleControlStart);

    // Warm/Cool Gallery 3-Point Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xcdd9eb, 0x3b2a1e, 0.65);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.1);
    keyLight.position.set(4.5, 7.5, 5.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 22;
    keyLight.shadow.camera.left = -6.5;
    keyLight.shadow.camera.right = 6.5;
    keyLight.shadow.camera.top = 6.5;
    keyLight.shadow.camera.bottom = -6.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb8c8df, 0.75);
    rimLight.position.set(-5.5, 4.5, -2.5);
    scene.add(rimLight);

    const gallerySpot = new THREE.SpotLight(0xffe5bd, 18, 16, Math.PI / 4, 0.55, 1.4);
    gallerySpot.position.set(0, 6.2, 2.2);
    gallerySpot.target.position.set(0, 0.1, 1.45);
    scene.add(gallerySpot);
    scene.add(gallerySpot.target);

    // Build Procedural Textures & 3D Gallery Models
    const disposables: Array<{ dispose: () => void }> = [envRT];
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const weaveBump = createWeaveBumpTexture(maxAnisotropy);
    const woodTex = createWoodFloorTexture(maxAnisotropy);
    disposables.push(weaveBump, woodTex);

    buildGalleryArchitecture(scene, woodTex, disposables);

    const clickableTargets: THREE.Object3D[] = [];

    // 3 Hanging Tapestries on the Back Wall
    HANGING_IDS.forEach((hid, idx) => {
      const product = byId(hid);
      if (!product) return;
      const xPos = (idx - 1) * 2.55;
      const tapestry = buildHangingTapestryGroup(
        product,
        xPos,
        weaveBump,
        maxAnisotropy,
        disposables
      );
      scene.add(tapestry);
      clickableTargets.push(tapestry);
    });

    // 7 Standing Rolled Carpets in a Gentle Curved Arc
    const rollEntries: Array<{ productId: number; group: THREE.Group; baseY: number }> = [];
    showroomProducts.forEach((product, idx) => {
      const t = idx - (showroomProducts.length - 1) / 2;
      const xPos = t * 0.92;
      const zPos = -1.75 + Math.abs(t) * 0.16;
      const rotY = -t * 0.09;
      const rollGroup = buildRolledCarpetGroup(
        product,
        xPos,
        zPos,
        rotY,
        weaveBump,
        maxAnisotropy,
        disposables
      );
      scene.add(rollGroup);
      clickableTargets.push(rollGroup);
      rollEntries.push({ productId: product.id, group: rollGroup, baseY: 0 });
    });

    // Centerpiece Unrolled Spotlight Carpet on Low Walnut Plinth
    const spotlight = buildSpotlightCarpetGroup(
      byId(selectedIdRef.current) ?? showroomProducts[0],
      weaveBump,
      maxAnisotropy,
      disposables
    );
    scene.add(spotlight.group);

    updateSpotlightRef.current = (productId: number) => {
      const product = byId(productId);
      if (!product) return;
      let tex = spotlight.textureCache.get(productId);
      if (!tex) {
        tex = createCarpetTexture(product.pattern, maxAnisotropy);
        spotlight.textureCache.set(productId, tex);
        disposables.push(tex);
      }
      spotlight.carpetMat.map = tex;
      spotlight.carpetMat.needsUpdate = true;
    };

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Coalesced On-Demand Render Loop with Software-WebGL Pacing & Smooth Damping
    let frameId = 0;
    let disposed = false;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (gl && typeof gl.fenceSync === 'function') {
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          if (disposed) return;
          const status = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.SIGNALED;
          if (status === gl.UNSIGNALED) {
            frameId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            frameId = window.setTimeout(cb, 80);
          }
        };
        frameId = window.setTimeout(poll, 5);
      } else {
        frameId = window.setTimeout(cb, 80);
      }
    }

    function requestRender() {
      if (disposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (disposed) return;
        renderDirty = false;
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        let needsAnotherFrame = false;

        // Smooth lift on selected rolled carpet
        for (const entry of rollEntries) {
          const targetY = entry.productId === selectedIdRef.current ? 0.18 : 0;
          const nextY = THREE.MathUtils.damp(entry.group.position.y, targetY, 8, delta);
          if (Math.abs(nextY - targetY) > 0.002) {
            entry.group.position.y = nextY;
            needsAnotherFrame = true;
          } else {
            entry.group.position.y = targetY;
          }
        }

        // Smooth camera preset transition
        if (cameraTransitionActiveRef.current) {
          const preset = CAMERA_PRESETS[cameraPresetRef.current];
          _targetCamPos.set(...preset.pos);
          _targetCtrl.set(...preset.target);

          camera.position.x = THREE.MathUtils.damp(camera.position.x, _targetCamPos.x, 7, delta);
          camera.position.y = THREE.MathUtils.damp(camera.position.y, _targetCamPos.y, 7, delta);
          camera.position.z = THREE.MathUtils.damp(camera.position.z, _targetCamPos.z, 7, delta);

          controls.target.x = THREE.MathUtils.damp(controls.target.x, _targetCtrl.x, 7, delta);
          controls.target.y = THREE.MathUtils.damp(controls.target.y, _targetCtrl.y, 7, delta);
          controls.target.z = THREE.MathUtils.damp(controls.target.z, _targetCtrl.z, 7, delta);

          if (
            camera.position.distanceTo(_targetCamPos) < 0.015 &&
            controls.target.distanceTo(_targetCtrl) < 0.015
          ) {
            camera.position.copy(_targetCamPos);
            controls.target.copy(_targetCtrl);
            cameraTransitionActiveRef.current = false;
          } else {
            needsAnotherFrame = true;
          }
        }

        const controlsUpdated = controls.update();
        if (controlsUpdated && !isSoftwareGl) {
          // Allow damping tail to settle smoothly on GPU
          needsAnotherFrame = true;
        }

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (!disposed && (renderDirty || needsAnotherFrame)) {
            requestRender();
          }
        };

        if (isSoftwareGl) {
          afterDraw(done);
        } else {
          done();
        }
      });
    }

    requestRenderRef.current = requestRender;

    const handleControlChange = () => {
      requestRender();
    };
    controls.addEventListener('change', handleControlChange);

    // Raycasting for Selecting Rolled Carpets & Hanging Tapestries
    const raycaster = new THREE.Raycaster();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const pickProduct = (clientX: number, clientY: number): number | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      _pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      _pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(_pointer, camera);
      const hits = raycaster.intersectObjects(clickableTargets, true);
      if (hits.length === 0) return null;
      let obj: THREE.Object3D | null = hits[0].object;
      while (obj && obj.userData.productId === undefined) {
        obj = obj.parent;
      }
      return obj?.userData.productId ?? null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Ignore orbit drags
      const pid = pickProduct(e.clientX, e.clientY);
      if (pid !== null) {
        setSelectedProductId(pid);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 60) return;
      lastHoverCheck = now;
      const pid = pickProduct(e.clientX, e.clientY);
      renderer.domElement.style.cursor = pid !== null ? 'pointer' : 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = Math.max(entry.contentRect.width, 300);
        const h = Math.max(entry.contentRect.height, 340);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        requestRender();
      }
    });
    resizeObserver.observe(container);

    // Initial render
    requestRender();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', handleControlStart);
      controls.removeEventListener('change', handleControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [showroomProducts]);

  const handlePrev = () => {
    const curIdx = selectedRollIndex >= 0 ? selectedRollIndex : 0;
    const prevIdx = curIdx > 0 ? curIdx - 1 : showroomProducts.length - 1;
    setSelectedProductId(showroomProducts[prevIdx].id);
  };

  const handleNext = () => {
    const curIdx = selectedRollIndex >= 0 ? selectedRollIndex : 0;
    const nextIdx = curIdx < showroomProducts.length - 1 ? curIdx + 1 : 0;
    setSelectedProductId(showroomProducts[nextIdx].id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handlePrev();
    }
  };

  return (
    <section
      id="showroom"
      aria-labelledby="showroom-heading"
      className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 lg:py-16"
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold text-[var(--kf-brass)]">نمایشگاه مجازی سه‌بعدی</p>
          <h2
            id="showroom-heading"
            className="font-display mt-1 text-3xl font-bold text-[var(--kf-ink)] sm:text-4xl"
          >
            گالری تعاملی فرش دستباف (Three.js)
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-[var(--kf-muted)]">
            با کشیدن تصویر سه‌بعدی زاویه دید را بچرخانید، با اسکرول بزرگ‌نمایی کنید و با کلیک روی
            طاقه‌ها یا فرش‌های دیواری، بافت پهن‌شده را روی سکوی مرکزی ببینید.
          </p>
        </div>

        <div className="text-sm font-semibold text-[var(--kf-ink)] tabular-nums">
          اثر انتخابی:{' '}
          <span className="font-bold text-[var(--kf-crimson)]">{activeProduct.code}</span>
        </div>
      </div>

      {/* 3D Gallery Container + Unobstructed Viewport + Collapsible Bottom Dock */}
      <div
        role="region"
        aria-roledescription="نمایشگاه سه‌بعدی فرش"
        aria-label="گالری سه‌بعدی تعاملی فرش دستباف"
        onKeyDown={handleKeyDown}
        className="overflow-hidden rounded-3xl border border-[var(--kf-border-strong)] bg-[#16110E] shadow-2xl"
      >
        {/* 3D WebGL Viewport (100% unobstructed center, no backdrop-blur overlays) */}
        <div className="relative h-[430px] w-full sm:h-[520px] lg:h-[560px]">
          {webglUnavailable ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-[#F2E8D8]">
              <p className="font-display text-2xl font-bold">
                نمایش سه‌بعدی در این مرورگر در دسترس نیست
              </p>
              <p className="mt-2 max-w-md text-sm text-[#CFC3B4]">
                می‌توانید از دکمه‌های زیر برای انتخاب و بررسی مستقیم تمامی آثار نمایشگاه استفاده
                کنید.
              </p>
            </div>
          ) : (
            <div ref={canvasMountRef} className="h-full w-full" />
          )}

          {/* Minimal Top-Right Spec Tag (no backdrop-filter over WebGL) */}
          <div className="pointer-events-none absolute top-4 right-4 rounded-xl border border-white/15 bg-[#191411]/90 px-3.5 py-2 text-xs text-[#F4E9D8]">
            <span className="font-semibold text-[var(--kf-brass-bright)]">
              {activeProduct.name}
            </span>
            <span className="mx-2 text-white/40" aria-hidden="true">
              ·
            </span>
            <span className="tabular-nums">{activeProduct.size}</span>
          </div>

          {/* Collapse / Expand Dock Toggle */}
          <button
            type="button"
            onClick={() => setControlsCollapsed((prev) => !prev)}
            aria-expanded={!controlsCollapsed}
            className="dark-focus absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-white/20 bg-[#191411]/95 px-4 text-xs font-semibold text-[#F4E9D8] hover:bg-[#2A1F18]"
          >
            {controlsCollapsed ? (
              <>
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                <span>نمایش پنل کنترل و مشخصات</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                <span>بستن پنل برای نمای کامل سه‌بعدی</span>
              </>
            )}
          </button>
        </div>

        {/* Collapsible Unified Bottom Control & Inspector Dock (below canvas, zero occlusion) */}
        {!controlsCollapsed && (
          <div className="border-t border-white/10 bg-[var(--kf-dark-surface)] p-4 sm:p-5 text-[#FAF6EF]">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Roll Selector Tabs + Camera Presets */}
              <div className="flex flex-col gap-3">
                {/* Roll Navigation */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="فرش قبلی"
                    className="dark-focus inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <div
                    className="flex flex-wrap items-center gap-1.5"
                    role="tablist"
                    aria-label="انتخاب فرش در نمایشگاه"
                  >
                    {showroomProducts.map((product, idx) => {
                      const active = product.id === selectedProductId;
                      return (
                        <button
                          key={product.id}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          onClick={() => setSelectedProductId(product.id)}
                          className={`dark-focus inline-flex h-11 min-w-[42px] items-center justify-center rounded-xl px-2.5 text-xs font-bold tabular-nums transition-colors ${
                            active
                              ? 'bg-[var(--kf-brass-bright)] text-[#191411]'
                              : 'border border-white/15 bg-white/5 text-[#E5D9C7] hover:bg-white/15'
                          }`}
                        >
                          {toFaDigits(String(idx + 1).padStart(2, '0'))}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="فرش بعدی"
                    className="dark-focus inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* Camera Angle Presets */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#CFC3B4]">
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>زاویه دوربین:</span>
                  </span>
                  {(Object.keys(CAMERA_PRESETS) as CameraPreset[]).map((key) => {
                    const active = cameraPreset === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => applyCameraPreset(key)}
                        aria-pressed={active}
                        className={`dark-focus inline-flex min-h-[38px] items-center rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap ${
                          active
                            ? 'bg-white text-[#191411] font-bold'
                            : 'border border-white/15 bg-white/5 text-[#E5D9C7] hover:bg-white/15'
                        }`}
                      >
                        {CAMERA_PRESETS[key].label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => applyCameraPreset('overview')}
                    aria-label="بازنشانی زاویه دوربین"
                    className="dark-focus inline-flex min-h-[38px] items-center gap-1 rounded-lg border border-white/15 px-3 text-xs text-[#E5D9C7] hover:bg-white/10"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>بازنشانی</span>
                  </button>
                </div>
              </div>

              {/* Active Product Inspector & Actions */}
              <div
                aria-live="polite"
                className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between lg:border-t-0 lg:pt-0 lg:gap-5"
              >
                <div>
                  <h3 className="text-base font-bold text-white">{activeProduct.name}</h3>
                  <p className="mt-0.5 text-xs text-[#DFD5C7] tabular-nums">
                    مکتب {activeProduct.cat} · {activeProduct.size} · {activeProduct.material} ·{' '}
                    <strong className="text-[var(--kf-brass-bright)]">
                      {formatFaNumber(activeProduct.price)} تومان
                    </strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenProduct(activeProduct)}
                    className="dark-focus inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-white/25 px-4 text-xs font-semibold text-white hover:bg-white/10 whitespace-nowrap"
                  >
                    <Eye className="h-4 w-4" aria-hidden="true" />
                    <span>مشاهده جزئیات</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onAddToCart(activeProduct)}
                    className="dark-focus inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[var(--kf-brass-bright)] px-4 text-xs font-bold text-[#191411] hover:bg-[#E5C68A] whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    <span>افزودن به سبد</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
