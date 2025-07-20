'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Html, 
  Text, 
  Box, 
  Sphere, 
  Cylinder, 
  Cone,
  Environment,
  PerspectiveCamera,
  ContactShadows
} from '@react-three/drei';
import { Search, Settings, X, Volume2, BookOpen, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import * as THREE from 'three';

interface ObjectPart {
  id: string;
  name: string;
  translation: string;
  pronunciation: string;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  description: string;
  synonyms: string[];
  antonyms: string[];
  relatedTerms: string[];
  slang: string[];
  languages: {
    [key: string]: {
      translation: string;
      pronunciation: string;
      phonetic: string;
    };
  };
  instances?: [number, number, number][];
}

interface VisualObject {
  id: string;
  name: string;
  category: string;
  parts: ObjectPart[];
  description: string;
  type: 'human' | 'animal' | 'object' | 'motion' | 'abstract';
  complexity: 'basic' | 'intermediate' | 'advanced';
  animations?: {
    [key: string]: {
      type: 'rotation' | 'translation' | 'scale' | 'morph';
      keyframes: any[];
      duration: number;
    };
  };
}

interface DetailLevel {
  level: 'minimal' | 'basic' | 'detailed' | 'comprehensive';
  partsToShow: string[];
  maxParts: number;
}

interface VisualDictionary3DProps {
  language: string;
  onClose: () => void;
}

const detailLevels: { [key: string]: DetailLevel } = {
  minimal: { level: 'minimal', partsToShow: ['main'], maxParts: 5 },
  basic: { level: 'basic', partsToShow: ['main', 'primary'], maxParts: 10 },
  detailed: { level: 'detailed', partsToShow: ['main', 'primary', 'secondary'], maxParts: 20 },
  comprehensive: { level: 'comprehensive', partsToShow: ['main', 'primary', 'secondary', 'detailed'], maxParts: 50 }
};

const InteractiveObjectPart = ({ 
  part, 
  onClick, 
  isHighlighted, 
  detailLevel, 
  showLabels,
  geometry = 'box'
}: {
  part: ObjectPart;
  onClick: (part: ObjectPart) => void;
  isHighlighted: boolean;
  detailLevel: string;
  showLabels: boolean;
  geometry?: 'box' | 'sphere' | 'cylinder' | 'cone';
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (isHighlighted) {
        meshRef.current.material.emissive.setHex(0x444444);
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
      }
    }
  });

  const getGeometry = () => {
    const props = {
      position: part.position,
      scale: part.scale,
      onClick: () => onClick(part),
      onPointerOver: () => setHovered(true),
      onPointerOut: () => setHovered(false),
      ref: meshRef
    };

    const material = (
      <meshStandardMaterial 
        color={part.color} 
        transparent={true}
        opacity={hovered ? 0.8 : 0.7}
      />
    );

    switch (geometry) {
      case 'sphere':
        return <Sphere {...props}>{material}</Sphere>;
      case 'cylinder':
        return <Cylinder {...props}>{material}</Cylinder>;
      case 'cone':
        return <Cone {...props}>{material}</Cone>;
      default:
        return <Box {...props}>{material}</Box>;
    }
  };

  return (
    <group>
      {getGeometry()}
      
      {/* Multiple instances if specified */}
      {part.instances?.map((position, index) => (
        <group key={index}>
          {geometry === 'sphere' && (
            <Sphere position={position} scale={part.scale} onClick={() => onClick(part)}>
              <meshStandardMaterial color={part.color} transparent opacity={0.7} />
            </Sphere>
          )}
          {geometry === 'box' && (
            <Box position={position} scale={part.scale} onClick={() => onClick(part)}>
              <meshStandardMaterial color={part.color} transparent opacity={0.7} />
            </Box>
          )}
          {geometry === 'cylinder' && (
            <Cylinder position={position} scale={part.scale} onClick={() => onClick(part)}>
              <meshStandardMaterial color={part.color} transparent opacity={0.7} />
            </Cylinder>
          )}
        </group>
      ))}

      {/* Labels */}
      {showLabels && (hovered || isHighlighted) && (
        <Html position={[part.position[0], part.position[1] + 0.5, part.position[2]]}>
          <div className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm pointer-events-none">
            {part.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const MotionAnimation = ({ 
  motionType, 
  children 
}: { 
  motionType: string;
  children: React.ReactNode;
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    
    switch (motionType) {
      case 'nod':
        groupRef.current.rotation.x = Math.sin(time * 2) * 0.3;
        break;
      case 'shake':
        groupRef.current.rotation.y = Math.sin(time * 4) * 0.3;
        break;
      case 'bounce':
        groupRef.current.position.y = Math.sin(time * 3) * 0.2;
        break;
      case 'spin':
        groupRef.current.rotation.y = time;
        break;
      case 'speed':
        groupRef.current.position.x = Math.sin(time * 2) * 2;
        break;
      default:
        break;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const WordInfoWindow = ({ 
  part, 
  languages, 
  onClose 
}: { 
  part: ObjectPart;
  languages: string[];
  onClose: () => void;
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedTranscription, setSelectedTranscription] = useState('ipa');

  const playPronunciation = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const transcriptionTypes = ['ipa', 'simplified', 'native'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{part.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Definition</h3>
              <p className="text-gray-700">{part.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {part.synonyms.map((synonym, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {synonym}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Antonyms</h3>
              <div className="flex flex-wrap gap-2">
                {part.antonyms.map((antonym, index) => (
                  <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                    {antonym}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {part.relatedTerms.map((term, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    {term}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Slang & Informal</h3>
              <div className="flex flex-wrap gap-2">
                {part.slang.map((slangTerm, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                    {slangTerm}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Languages</h3>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`w-full text-left p-3 rounded-lg border ${
                      selectedLanguage === lang
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{lang}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playPronunciation(part.languages[lang]?.translation || part.translation, lang);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg text-blue-600">
                      {part.languages[lang]?.translation || part.translation}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pronunciation</h3>
              <div className="space-y-2">
                <div className="flex gap-2">
                  {transcriptionTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedTranscription(type)}
                      className={`px-3 py-1 rounded ${
                        selectedTranscription === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {type.toUpperCase()}
                    </button>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-lg font-mono">
                    /{part.languages[selectedLanguage]?.phonetic || part.pronunciation}/
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VisualDictionary3D({ language, onClose }: VisualDictionary3DProps) {
  const [objects, setObjects] = useState<VisualObject[]>([]);
  const [selectedObject, setSelectedObject] = useState<VisualObject | null>(null);
  const [selectedPart, setSelectedPart] = useState<ObjectPart | null>(null);
  const [detailLevel, setDetailLevel] = useState<string>('basic');
  const [showLabels, setShowLabels] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedPart, setHighlightedPart] = useState<string | null>(null);
  const [animationMode, setAnimationMode] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState({
    adaptiveDetail: true,
    preferredLanguages: ['english', 'spanish', 'french'],
    learningGoal: 'vocabulary-building',
    knowledgeLevel: 'intermediate'
  });

  const availableLanguages = ['english', 'spanish', 'french', 'german', 'italian', 'portuguese'];

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = () => {
    const mockObjects: VisualObject[] = [
      {
        id: 'human-face',
        name: 'Human Face',
        category: 'human',
        type: 'human',
        complexity: 'detailed',
        description: 'The front part of the human head',
        parts: [
          {
            id: 'eyes',
            name: 'Eyes',
            translation: 'Ojos',
            pronunciation: 'OH-hohs',
            position: [-0.3, 0.2, 0.8],
            scale: [0.2, 0.1, 0.1],
            color: '#4A90E2',
            description: 'Organs of sight',
            synonyms: ['sight organs', 'orbs', 'peepers'],
            antonyms: [],
            relatedTerms: ['vision', 'sight', 'retina', 'pupil', 'iris'],
            slang: ['peepers', 'orbs', 'windows to the soul'],
            languages: {
              english: { translation: 'Eyes', pronunciation: 'aɪz', phonetic: 'aɪz' },
              spanish: { translation: 'Ojos', pronunciation: 'OH-hohs', phonetic: 'ˈoxos' },
              french: { translation: 'Yeux', pronunciation: 'yø', phonetic: 'jø' }
            },
            instances: [[-0.3, 0.2, 0.8], [0.3, 0.2, 0.8]]
          },
          {
            id: 'nose',
            name: 'Nose',
            translation: 'Nariz',
            pronunciation: 'nah-REES',
            position: [0, 0, 0.9],
            scale: [0.15, 0.3, 0.2],
            color: '#F5A623',
            description: 'Organ of smell and breathing',
            synonyms: ['schnoz', 'snout', 'beak'],
            antonyms: [],
            relatedTerms: ['nostrils', 'smell', 'breathing', 'olfactory'],
            slang: ['schnoz', 'honker', 'snout'],
            languages: {
              english: { translation: 'Nose', pronunciation: 'noʊz', phonetic: 'noʊz' },
              spanish: { translation: 'Nariz', pronunciation: 'nah-REES', phonetic: 'naˈɾis' },
              french: { translation: 'Nez', pronunciation: 'ne', phonetic: 'ne' }
            }
          },
          {
            id: 'mouth',
            name: 'Mouth',
            translation: 'Boca',
            pronunciation: 'BOH-kah',
            position: [0, -0.3, 0.8],
            scale: [0.3, 0.1, 0.1],
            color: '#D0021B',
            description: 'Organ for eating and speaking',
            synonyms: ['lips', 'oral cavity', 'maw'],
            antonyms: [],
            relatedTerms: ['teeth', 'tongue', 'lips', 'speech', 'eating'],
            slang: ['trap', 'pie hole', 'kisser'],
            languages: {
              english: { translation: 'Mouth', pronunciation: 'maʊθ', phonetic: 'maʊθ' },
              spanish: { translation: 'Boca', pronunciation: 'BOH-kah', phonetic: 'ˈboka' },
              french: { translation: 'Bouche', pronunciation: 'buʃ', phonetic: 'buʃ' }
            }
          }
        ]
      },
      {
        id: 'dog-anatomy',
        name: 'Dog',
        category: 'animal',
        type: 'animal',
        complexity: 'intermediate',
        description: 'Domesticated canine animal',
        parts: [
          {
            id: 'tail',
            name: 'Tail',
            translation: 'Cola',
            pronunciation: 'KOH-lah',
            position: [-1, 0, 0],
            scale: [0.1, 0.1, 0.5],
            color: '#8B4513',
            description: 'Rear appendage for balance and communication',
            synonyms: ['rear appendage'],
            antonyms: [],
            relatedTerms: ['wagging', 'balance', 'communication'],
            slang: ['waggy thing'],
            languages: {
              english: { translation: 'Tail', pronunciation: 'teɪl', phonetic: 'teɪl' },
              spanish: { translation: 'Cola', pronunciation: 'KOH-lah', phonetic: 'ˈkola' },
              french: { translation: 'Queue', pronunciation: 'kø', phonetic: 'kø' }
            }
          },
          {
            id: 'ears',
            name: 'Ears',
            translation: 'Orejas',
            pronunciation: 'oh-REH-has',
            position: [0, 0.5, 0.3],
            scale: [0.2, 0.3, 0.1],
            color: '#D2691E',
            description: 'Organs of hearing',
            synonyms: ['hearing organs', 'auditory organs'],
            antonyms: [],
            relatedTerms: ['hearing', 'sound', 'listening'],
            slang: ['floppers', 'listeners'],
            languages: {
              english: { translation: 'Ears', pronunciation: 'ɪrz', phonetic: 'ɪrz' },
              spanish: { translation: 'Orejas', pronunciation: 'oh-REH-has', phonetic: 'oˈɾexas' },
              french: { translation: 'Oreilles', pronunciation: 'ɔrɛj', phonetic: 'ɔrɛj' }
            },
            instances: [[0.3, 0.5, 0.3], [-0.3, 0.5, 0.3]]
          }
        ]
      },
      {
        id: 'abstract-speed',
        name: 'Speed',
        category: 'abstract',
        type: 'abstract',
        complexity: 'basic',
        description: 'Rate of motion or activity',
        parts: [
          {
            id: 'motion-indicator',
            name: 'Motion',
            translation: 'Velocidad',
            pronunciation: 'veh-loh-see-DAHD',
            position: [0, 0, 0],
            scale: [0.5, 0.5, 0.5],
            color: '#FF4500',
            description: 'Visual representation of rapid movement',
            synonyms: ['velocity', 'pace', 'rate', 'swiftness'],
            antonyms: ['slowness', 'sluggishness'],
            relatedTerms: ['fast', 'quick', 'rapid', 'acceleration'],
            slang: ['zip', 'zoom', 'lightning'],
            languages: {
              english: { translation: 'Speed', pronunciation: 'spiːd', phonetic: 'spiːd' },
              spanish: { translation: 'Velocidad', pronunciation: 'veh-loh-see-DAHD', phonetic: 'belosiˈðað' },
              french: { translation: 'Vitesse', pronunciation: 'vitɛs', phonetic: 'vitɛs' }
            }
          }
        ],
        animations: {
          speed: {
            type: 'translation',
            keyframes: [],
            duration: 1.0
          }
        }
      }
    ];

    setObjects(mockObjects);
    setSelectedObject(mockObjects[0]);
  };

  const handlePartClick = (part: ObjectPart) => {
    setSelectedPart(part);
    setHighlightedPart(part.id);
  };

  const adaptDetailLevel = () => {
    if (!userSettings.adaptiveDetail) return detailLevel;
    
    // Adaptive logic based on user settings
    if (userSettings.knowledgeLevel === 'beginner') {
      return 'basic';
    } else if (userSettings.knowledgeLevel === 'advanced') {
      return 'comprehensive';
    }
    return 'detailed';
  };

  const getFilteredParts = (parts: ObjectPart[]) => {
    const currentDetailLevel = adaptDetailLevel();
    const maxParts = detailLevels[currentDetailLevel].maxParts;
    
    return parts
      .filter(part => 
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.translation.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, maxParts);
  };

  const CameraControls = () => {
    const { camera } = useThree();
    
    const resetCamera = () => {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    };

    return (
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={resetCamera}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">3D Visual Dictionary</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search objects or parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={detailLevel}
            onChange={(e) => setDetailLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="minimal">Minimal Detail</option>
            <option value="basic">Basic Detail</option>
            <option value="detailed">Detailed</option>
            <option value="comprehensive">Comprehensive</option>
          </select>
          
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`px-4 py-2 rounded-lg ${
              showLabels ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Labels
          </button>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Object List */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <h3 className="font-semibold text-gray-900 mb-4">Objects</h3>
          <div className="space-y-2">
            {objects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => setSelectedObject(obj)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  selectedObject?.id === obj.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{obj.name}</div>
                <div className="text-sm text-gray-600">{obj.category}</div>
                <div className="text-xs text-gray-500">
                  {obj.parts.length} parts
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3D View */}
        <div className="flex-1 relative">
          <Canvas>
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Environment preset="sunset" />
              
              {selectedObject && (
                <group>
                  {animationMode && selectedObject.type === 'abstract' && animationMode === 'speed' ? (
                    <MotionAnimation motionType="speed">
                      {getFilteredParts(selectedObject.parts).map((part) => (
                        <InteractiveObjectPart
                          key={part.id}
                          part={part}
                          onClick={handlePartClick}
                          isHighlighted={highlightedPart === part.id}
                          detailLevel={detailLevel}
                          showLabels={showLabels}
                          geometry={selectedObject.type === 'abstract' ? 'box' : 'sphere'}
                        />
                      ))}
                    </MotionAnimation>
                  ) : selectedObject.type === 'motion' ? (
                    <MotionAnimation motionType="nod">
                      {getFilteredParts(selectedObject.parts).map((part) => (
                        <InteractiveObjectPart
                          key={part.id}
                          part={part}
                          onClick={handlePartClick}
                          isHighlighted={highlightedPart === part.id}
                          detailLevel={detailLevel}
                          showLabels={showLabels}
                          geometry="sphere"
                        />
                      ))}
                    </MotionAnimation>
                  ) : (
                    getFilteredParts(selectedObject.parts).map((part) => (
                      <InteractiveObjectPart
                        key={part.id}
                        part={part}
                        onClick={handlePartClick}
                        isHighlighted={highlightedPart === part.id}
                        detailLevel={detailLevel}
                        showLabels={showLabels}
                        geometry={selectedObject.type === 'human' ? 'sphere' : 'box'}
                      />
                    ))
                  )}
                </group>
              )}
              
              <ContactShadows opacity={0.3} scale={10} blur={1} far={10} resolution={256} color="#000000" />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Suspense>
          </Canvas>
          
          <CameraControls />
          
          {/* Animation Controls */}
          {selectedObject?.type === 'abstract' && (
            <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
              <h4 className="font-medium mb-2">Animation</h4>
              <button
                onClick={() => setAnimationMode(animationMode === 'speed' ? null : 'speed')}
                className={`px-3 py-1 rounded ${
                  animationMode === 'speed' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {animationMode === 'speed' ? 'Stop' : 'Animate'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Word Info Window */}
      {selectedPart && (
        <WordInfoWindow
          part={selectedPart}
          languages={userSettings.preferredLanguages}
          onClose={() => setSelectedPart(null)}
        />
      )}
    </div>
  );
}