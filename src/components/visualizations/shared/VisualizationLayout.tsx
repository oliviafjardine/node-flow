import React from 'react';
import { ArrowLeft, RotateCcw, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VisualizationLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
  onReset?: () => void;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onStepForward?: () => void;
  onStepBack?: () => void;
  canStepBack?: boolean;
  canStepForward?: boolean;
  backLink: string;
  complexity?: {
    time: string;
    space: string;
  };
  operations?: string[];
}

const VisualizationLayout: React.FC<VisualizationLayoutProps> = ({
  title,
  description,
  children,
  controls,
  onReset,
  isPlaying = false,
  onPlayPause,
  onStepForward,
  onStepBack,
  canStepBack = false,
  canStepForward = false,
  backLink,
  complexity,
  operations = []
}) => {
  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={backLink}
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {backLink.includes('data-structures') ? 'Data Structures' : 'Algorithms'}
          </Link>
          
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-primary">{title}</h1>
            <p className="text-xl text-secondary max-w-4xl leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Visualization Area */}
          <div className="lg:col-span-3">
            <div className="bg-surface-elevated border border-subtle rounded-xl p-8">
              {/* Playback Controls */}
              {(onPlayPause || onStepForward || onStepBack || onReset) && (
                <div className="flex items-center justify-center gap-4 mb-8 p-4 bg-surface border border-subtle rounded-lg">
                  {onStepBack && (
                    <button
                      onClick={onStepBack}
                      disabled={!canStepBack}
                      className="w-10 h-10 bg-accent-light border border-accent/20 rounded-lg flex items-center justify-center hover:bg-accent-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <SkipBack className="w-5 h-5 text-accent" />
                    </button>
                  )}
                  
                  {onPlayPause && (
                    <button
                      onClick={onPlayPause}
                      className="w-12 h-12 bg-accent text-inverse rounded-lg flex items-center justify-center hover:bg-accent-hover transition-colors"
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </button>
                  )}
                  
                  {onStepForward && (
                    <button
                      onClick={onStepForward}
                      disabled={!canStepForward}
                      className="w-10 h-10 bg-accent-light border border-accent/20 rounded-lg flex items-center justify-center hover:bg-accent-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <SkipForward className="w-5 h-5 text-accent" />
                    </button>
                  )}
                  
                  {onReset && (
                    <button
                      onClick={onReset}
                      className="w-10 h-10 bg-surface-elevated border border-subtle rounded-lg flex items-center justify-center hover:bg-accent-light transition-colors ml-4"
                    >
                      <RotateCcw className="w-5 h-5 text-secondary" />
                    </button>
                  )}
                </div>
              )}

              {/* Visualization Content */}
              <div className="min-h-[400px] flex items-center justify-center">
                {children}
              </div>
            </div>

            {/* Custom Controls */}
            {controls && (
              <div className="mt-6 bg-surface-elevated border border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Controls</h3>
                {controls}
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Complexity */}
            {complexity && (
              <div className="bg-surface-elevated border border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Complexity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-secondary">Time:</span>
                    <span className="font-mono font-semibold text-accent">{complexity.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary">Space:</span>
                    <span className="font-mono font-semibold text-accent">{complexity.space}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Operations */}
            {operations.length > 0 && (
              <div className="bg-surface-elevated border border-subtle rounded-xl p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Operations</h3>
                <ul className="space-y-2">
                  {operations.map((operation, index) => (
                    <li key={index} className="text-sm text-secondary leading-relaxed">
                      • {operation}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Concepts */}
            <div className="bg-surface-elevated border border-subtle rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Key Concepts</h3>
              <div className="space-y-3 text-sm text-secondary">
                <div className="p-3 bg-accent-light border border-accent/20 rounded-lg">
                  <div className="font-medium text-accent mb-1">Interactive Learning</div>
                  <div>Click, drag, and interact with elements to understand how they work</div>
                </div>
                <div className="p-3 bg-success-light border border-success/20 rounded-lg">
                  <div className="font-medium text-success mb-1">Step-by-Step</div>
                  <div>Use controls to step through operations at your own pace</div>
                </div>
                <div className="p-3 bg-warning-light border border-warning/20 rounded-lg">
                  <div className="font-medium text-warning mb-1">Real-Time Feedback</div>
                  <div>See immediate results and complexity analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualizationLayout;
