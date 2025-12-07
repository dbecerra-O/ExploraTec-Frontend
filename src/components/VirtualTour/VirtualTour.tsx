import React, { useEffect, useRef, useState } from "react";
import Marzipano from "marzipano";
import { useChatbotContext } from "../../context/ChatbotContext";
import appData from "./appData";
import './VirtualTour.css';
import { useNavigate } from "react-router-dom";

const CURRENT_SCENE_KEY = "current_scene_id";

type SceneData = any;

const VirtualTour: React.FC = () => {
  const panoRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<any>(null);
  const scenesRef = useRef<any[]>([]);
  const [currentSceneId, setCurrentSceneId] = useState<string>(() => {
    return localStorage.getItem(CURRENT_SCENE_KEY) || "";
  });
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activeInfoHotspot, setActiveInfoHotspot] = useState<any>(null);
  const { clearConversation, updateSceneContext } = useChatbotContext();
  const navigate = useNavigate();



  useEffect(() => {
    if (!panoRef.current) return;

    panoRef.current.style.overflow = 'hidden';

    const M = (Marzipano as any);

    const viewer = new M.Viewer(panoRef.current, {
      controls: { mouseViewMode: appData.settings?.mouseViewMode ?? "drag" },
    });
    viewerRef.current = viewer;

    const createdScenes = appData.scenes.map((sceneData: SceneData) => {
      const source = M.ImageUrlSource.fromString(
        `${sceneData.tileUrl}/{z}/{f}/{y}/{x}.jpg`,
        { cubeMapPreviewUrl: `${sceneData.tileUrl}/preview.jpg` }
      );

      const geometry = new M.CubeGeometry(sceneData.levels);

      const faceSize = sceneData.faceSize ?? 1024;
      const limiter = M.RectilinearView.limit.traditional(
        faceSize,
        100 * Math.PI / 180,
        120 * Math.PI / 180
      );

      const view = new M.RectilinearView(sceneData.initialViewParameters, limiter);

      const scene = viewer.createScene({
        source,
        geometry,
        view,
        pinFirstLevel: true,
      });

      (sceneData.linkHotspots || []).forEach((hotspot: any) => {
        const el = createLinkHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(el, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      // Info hotspots
      (sceneData.infoHotspots || []).forEach((hotspot: any) => {
        const el = createSimpleInfoHotspotElement(hotspot);
        scene.hotspotContainer().createHotspot(el, { yaw: hotspot.yaw, pitch: hotspot.pitch });
      });

      return { data: sceneData, scene, view };
    });

    scenesRef.current = createdScenes;

    // Helper to process a navigation path step-by-step
    const processNavPath = (navPath: string[], startIndex = 0) => {
      if (!navPath || navPath.length === 0) return;
      let idx = startIndex;
      const stepThrough = () => {
        if (!navPath || idx >= navPath.length) {
          return;
        }
        const nextScene = navPath[idx];
        const target = createdScenes.find(s => s.data.id === nextScene);
        if (target) {
          target.scene.switchTo();
          setCurrentSceneId(nextScene);
          updateSceneContext(nextScene);
          localStorage.setItem(CURRENT_SCENE_KEY, nextScene);
        }
        idx++;
        localStorage.setItem("navigation_step_index", String(idx));
        if (idx < navPath.length) {
          setTimeout(stepThrough, 1200);
        } else {
          // finished
          localStorage.removeItem("navigation_path");
          localStorage.removeItem("navigation_step_index");
        }
      };
      // begin stepping
      setTimeout(stepThrough, 300);
    };

    // Listen for external navigation requests (from Chatbot)
    const navHandler = (e: Event) => {
      try {
        const ce = e as CustomEvent;
        const detail = ce.detail || {};
        const mode = detail.mode;
        if (mode === 'step') {
          const path = detail.path || JSON.parse(localStorage.getItem('navigation_path') || 'null');
          const startIdx = Number(localStorage.getItem('navigation_step_index') || 0);
          if (path && Array.isArray(path)) {
            processNavPath(path, startIdx);
          }
        } else if (mode === 'direct') {
          const to = detail.to || localStorage.getItem(CURRENT_SCENE_KEY);
          if (to) {
            const target = createdScenes.find(s => s.data.id === to);
            if (target) {
              target.scene.switchTo();
              setCurrentSceneId(to);
              updateSceneContext(to);
              localStorage.setItem(CURRENT_SCENE_KEY, to);
            }
          }
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener('tour:navigate', navHandler as EventListener);

    if (createdScenes.length > 0) {
      const savedSceneId = localStorage.getItem(CURRENT_SCENE_KEY);
      const initialScene = savedSceneId
        ? createdScenes.find(s => s.data.id === savedSceneId) || createdScenes[0]
        : createdScenes[0];

      initialScene.scene.switchTo();
      setCurrentSceneId(initialScene.data.id);
      updateSceneContext(initialScene.data.id);
      localStorage.setItem(CURRENT_SCENE_KEY, initialScene.data.id);
      // If a navigation path was requested (from chatbot) at startup, process it step-by-step
      try {
        const navPathRaw = localStorage.getItem("navigation_path");
        if (navPathRaw) {
          const navPath: string[] = JSON.parse(navPathRaw);
          const startIdx = Number(localStorage.getItem("navigation_step_index") || 0);
          processNavPath(navPath, startIdx);
        }
      } catch (err) {
        localStorage.removeItem("navigation_path");
        localStorage.removeItem("navigation_step_index");
      }
    }

    return () => {
      try {
        if (viewerRef.current && typeof viewerRef.current.destroy === "function") {
          viewerRef.current.destroy();
        }
      } catch { }
      viewerRef.current = null;
      scenesRef.current = [];
      updateSceneContext(null);
      window.removeEventListener('tour:navigate', navHandler as EventListener);
    };
  }, []);

  const handleSwitchScene = (sceneId: string) => {
    const target = scenesRef.current.find((s) => s.data.id === sceneId);
    if (target) {
      target.scene.switchTo();
      setCurrentSceneId(sceneId);
      updateSceneContext(sceneId);
      localStorage.setItem(CURRENT_SCENE_KEY, sceneId);
      setActiveInfoHotspot(null);
    }
  };

  function createLinkHotspotElement(hotspot: any) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('hotspot', 'link-hotspot');

    const icon = document.createElement('img');
    icon.src = '/img/link.png';
    icon.classList.add('link-hotspot-icon');

    // Aplicar rotación
    if (hotspot.rotation) {
      const style = icon.style as any;
      style.transform = `rotate(${hotspot.rotation}rad)`;
      style.webkitTransform = `rotate(${hotspot.rotation}rad)`;
      style.msTransform = `rotate(${hotspot.rotation}rad)`;
    }

    const tooltip = document.createElement('div');
    tooltip.classList.add('hotspot-tooltip', 'link-hotspot-tooltip');
    const targetData = findSceneDataById(hotspot.target);
    tooltip.innerHTML = targetData?.name ?? '';

    wrapper.appendChild(icon);
    wrapper.appendChild(tooltip);

    wrapper.addEventListener('click', function () {
      const targetScene = findSceneById(hotspot.target);
      if (targetScene) {
        targetScene.scene.switchTo();
        setCurrentSceneId(targetScene.data.id);
        updateSceneContext(targetScene.data.id);
        localStorage.setItem(CURRENT_SCENE_KEY, targetScene.data.id);
      }
    });

    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  function createSimpleInfoHotspotElement(hotspot: any) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('hotspot', 'info-hotspot', 'simple-info-hotspot');

    const icon = document.createElement('img');
    icon.src = '/img/info.png';
    icon.classList.add('info-hotspot-icon');
    wrapper.appendChild(icon);
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      console.log("Info hotspot clickeado:", hotspot);
      setActiveInfoHotspot(hotspot);
    });

    stopTouchAndScrollEventPropagation(wrapper);

    return wrapper;
  }

  function stopTouchAndScrollEventPropagation(element: HTMLElement) {
    const eventList = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel', 'mousewheel'];
    for (let i = 0; i < eventList.length; i++) {
      element.addEventListener(eventList[i], function (event) {
        event.stopPropagation();
      });
    }
  }

  function findSceneById(id: string) {
    return scenesRef.current.find((s) => s.data.id === id) ?? null;
  }

  function findSceneDataById(id: string) {
    return appData.scenes.find((s: any) => s.id === id) ?? null;
  }

  const currentScene = scenesRef.current.find(s => s.data.id === currentSceneId)?.data;

  const handleExitTour = () => {
    clearConversation();
    localStorage.removeItem(CURRENT_SCENE_KEY);
    navigate("/");
  };

  return (
    <div className="multiple-scenes flex h-screen relative bg-gray-900 overflow-hidden">

      {/* Panorama */}
      <div
        id="pano"
        ref={panoRef}
        className="flex-1 w-full h-full"
      />

      {/* Sidebar*/}
      <aside
        id="sceneList"
        className={`
          fixed top-0 right-0 h-full z-40 transition-transform duration-300
          bg-white/95 backdrop-blur-xl shadow-2xl overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ width: '280px' }}
      >
        {sidebarOpen && (
          <div className="p-6">
            <img
              src="/img/tecsup-logo.png"
              alt="Tecsup Logo"
              className="w-4/5 mx-auto my-5 p-2"
            />

            <h3 className="text-xl font-bold text-gray-800 mb-4">Ubicaciones</h3>

            <ul className="space-y-2">
              {appData.scenes.map((s: SceneData) => (
                <li
                  key={s.id}
                  onClick={() => handleSwitchScene(s.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border
                    ${currentSceneId === s.id ?
                      'bg-indigo-100 text-indigo-700 border-indigo-300 shadow-md' :
                      'bg-white border-gray-200 text-gray-700 hover:border-indigo-200 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${currentSceneId === s.id ? 'bg-sky-500' : 'bg-gray-400'
                      }`} />
                    <span className="font-medium">{s.name}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      {/* Botón toggle sidebar*/}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
          absolute top-1/2 z-50 bg-white rounded-full p-3 shadow-lg 
          transition-all duration-300 hover:shadow-xl transform -translate-y-1/2
          border border-gray-200
          ${sidebarOpen ? 'right-72' : 'right-4'}
        `}
      >
        {sidebarOpen ? '▶' : '◀'}
      </button>

      {/* Modal de información*/}
      {activeInfoHotspot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setActiveInfoHotspot(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <img src="/img/info.png" alt="Info" className="w-6 h-6 filter brightness-0 invert" />
                </div>
              </div>
              <button
                onClick={() => setActiveInfoHotspot(null)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <span className="text-white text-xl font-bold">×</span>
              </button>
            </div>

            {/* Contenido */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{
                  __html: activeInfoHotspot.text || 'No hay información disponible.'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Botón de salir del recorrido */}
      <button
        onClick={handleExitTour}
        className="absolute top-6 left-6 z-30 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border border-white/20"
        title="Salir del recorrido y limpiar conversación"
      >
        Salir del tour
      </button>

      {/* Indicador de escena actual */}
      {currentScene && !sidebarOpen && (
        <div className="absolute top-6 right-6 z-30 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-3 border border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse" />
            <span className="font-semibold text-gray-800">{currentScene.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualTour;