'use client';

import dynamic from 'next/dynamic';

const PlaygroundCanvasContainer = dynamic(
  () => import('./components/PlaygroundCanvasContainer'),
  { ssr: false }
);

export default function PlaygroundPage() {
  return (
    <main className="w-full h-full min-h-screen overflow-hidden">
      <PlaygroundCanvasContainer />
    </main>
  );
}