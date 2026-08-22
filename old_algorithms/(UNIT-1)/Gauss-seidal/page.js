'use client';
import { useState, useEffect, Suspense } from 'react';
import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import FullscreenToggle from '@/app/components/FullscreenToggle';
import ThemeToggle from '@/app/components/ThemeToggle';
import GaussSeidel from './algorithems.gauss-seidale-method';
import AlgorithmNavigation from '@/app/components/AlgorithmNavigation';
import { STATUS } from 'react-joyride';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';

const Joyride = dynamic(() => import('react-joyride').then(mod => mod.Joyride), { ssr: false });

const GaussSeidelSearchParamsWrapper = ({ setRunTour }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const tourParam = searchParams.get('tour');
    if (tourParam === 'true') {
      const hasCompletedTour = localStorage.getItem('gaussSeidelTourCompleted');
      if (hasCompletedTour !== 'true') {
        setRunTour(true);
      }
    }
  }, [searchParams, setRunTour]);

  return null;
};

const GaussSeidelPage = () => {
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    localStorage.removeItem('gaussSeidelTourCompleted');
  }, []);

  const steps = [
    {
      target: '.step-intro-1',
      content: 'Start by exploring the topic at hand. Understand its significance and applications in real-world scenarios, providing a foundation for deeper learning.',
      placement: 'bottom',
    },
    {
      target: '.step-intro-2',
      content: 'Familiarize yourself with the key formulas associated with the topic. This knowledge is crucial for grasping the underlying concepts and for practical applications.',
      placement: 'left',
    },
    {
      target: '.step-intro-3',
      content: 'Learn the systematic approach to solving problems related to the topic. Breaking down the procedure into clear steps will enhance your problem-solving skills.',
      placement: 'top',
    },
    {
      target: '.step-intro-4',
      content: 'Review example problems that demonstrate the concepts in action. Analyzing these examples will help you understand the application of theories in practical situations.',
      placement: 'top',
    },
    {
      target: '.step-intro-5',
      content: 'Finally, put your knowledge to the test with an algorithm calculator. This interactive tool allows you to experiment with different scenarios and solidify your understanding of the topic.',
      placement: 'top',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRunTour(false);
      if (typeof window !== 'undefined') {
        localStorage.setItem('gaussSeidelTourCompleted', 'true');
      }
    }
  };

  useEffect(() => {
    if (runTour) {
      const hasCompletedTour = localStorage.getItem('gaussSeidelTourCompleted');
      if (hasCompletedTour === 'true') {
        setRunTour(false);
      }
    }
  }, [runTour]);

  return (
    <>
      <Suspense fallback={<div>Loading Search Params...</div>}>
        <GaussSeidelSearchParamsWrapper setRunTour={setRunTour} />
      </Suspense>
      <Suspense fallback={<div>Loading Tour...</div>}>
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          scrollToFirstStep
          showSkipButton
          showProgress
          styles={{
            options: {
              zIndex: 10000,
              primaryColor: '#FF5733',
              textColor: '#333',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
            },
            buttonNext: {
              backgroundColor: '#FF5733',
            },
            buttonBack: {
              color: '#FF5733',
            },
          }}
          callback={handleJoyrideCallback}
          locale={{
            back: 'Back',
            close: 'Close',
            last: 'Finish',
            next: 'Next',
            skip: 'Skip',
          }}
        />
      </Suspense>

      <FullscreenToggle className="dark:bg-neutral-800 w-full min-h-screen">
        <div className="md:ml-[80px]">
          <section className="container mx-auto px-4 md:px-8 py-10 dark:bg-neutral-800 dark:text-white space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-neutral-700">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Gauss-Seidel Method
              </h1>
              <ThemeToggle />
            </div>

            {/* Overview */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed step-intro-1">
              The Gauss-Seidel method is an iterative technique used to solve a system of linear equations. It&apos;s particularly useful for large systems where direct methods may be computationally expensive. The method uses the most recent values of the variables as soon as they are available, allowing for potentially faster convergence.
            </p>

            {/* General Formulation */}
            <div className="pt-4 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
                General Formulation
              </h2>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 text-center">Given a system of linear equations:</p>
              <div className="w-full md:w-[80%] mx-auto p-4 bg-blue-50/60 dark:bg-neutral-900 border-t-4 border-blue-600 dark:border-blue-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm overflow-x-auto text-center step-intro-2">
                <BlockMath>
                  {`\\begin{cases} 
                    a_1x_1 + b_1y_1 + c_1z_1 = i \\\\
                    a_2x_2 + b_2y_2 + c_2z_2 = j \\\\
                    a_3x_3 + b_3y_3 + c_3z_3 = k 
                  \\end{cases}`}
                </BlockMath>
              </div>
            </div>

            {/* Steps of Gauss-Seidel */}
            <div className="pt-4 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
                Steps of the Gauss-Seidel Method
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-lg text-gray-700 dark:text-gray-300 pl-2 step-intro-3">
                <li className="leading-relaxed">
                  <strong>Rearrange the Equations:</strong> Solve each equation for one variable in terms of the others.
                </li>
                <li className="leading-relaxed">
                  <strong>Initial Guess:</strong> Start with an initial guess for the values of the variables <InlineMath>{`(x_1, y_1, z_1)`}</InlineMath>.
                </li>
                <li className="leading-relaxed">
                  <strong>Iterate:</strong> Substitute the known values into the rearranged equations to update the values of the variables.
                </li>
                <li className="leading-relaxed">
                  <strong>Convergence Check:</strong> Repeat the iteration until the values converge.
                </li>
              </ol>
            </div>

            <hr className="my-8 border-gray-300 dark:border-neutral-700" />

            {/* Example Section */}
            <div className="space-y-6 step-intro-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-neutral-700">
                Example
              </h2>
              
              <p className="text-lg text-gray-700 dark:text-gray-300">Consider the following system of equations:</p>
              
              <div className="w-full md:w-[80%] mx-auto p-5 bg-emerald-50/60 dark:bg-neutral-900 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm shadow-sm space-y-2 text-center">
                <BlockMath>
                  {`\\begin{cases} 
                    4x + y + z = 12 \\\\
                    x + 5y + 2z = 27 \\\\
                    2x + y + 6z = 18 
                  \\end{cases}`}
                </BlockMath>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 pt-1">Error Margin is 0.1</p>
              </div>

              {/* 1. Rearranging */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">1. Rearranging the Equations:</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                  <BlockMath math={"x = \\frac{12 - y - z}{4}"} />
                  <BlockMath math={"y = \\frac{27 - x - 2z}{5}"} />
                  <BlockMath math={"z = \\frac{18 - 2x - y}{6}"} />
                </div>
              </div>

              {/* 2. Initial Guess */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">2. Initial Guess:</h3>
                <p className="text-gray-700 dark:text-gray-300">Start with:</p>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm text-center">
                  <BlockMath>{`(x_0 = 0, y_0 = 0, z_0 = 0)`}</BlockMath>
                </div>
              </div>

              {/* Iterations */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white pt-2">Iterations:</h3>

              {/* First Iteration */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">First Iteration:</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                  <BlockMath math={"x_1 = \\frac{12 - 0 - 0}{4} = 3"} />
                  <BlockMath math={"y_1 = \\frac{27 - 3 - 0}{5} = 4.8"} />
                  <BlockMath math={"z_1 = \\frac{18 - 2(3) - 4.8}{6} = 1.2"} />
                </div>
              </div>

              {/* Second Iteration */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Second Iteration:</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                  <BlockMath math={"x_2 = \\frac{12 - 4.8 - 1.2}{4} \\approx 1.5"} />
                  <BlockMath math={"y_2 = \\frac{27 - 1.5 - 2(1.2)}{5} \\approx 4.62"} />
                  <BlockMath math={"z_2 = \\frac{18 - 2(1.5) - 4.62}{6} \\approx 1.73"} />
                </div>
              </div>

              {/* Third Iteration */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Third Iteration:</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                  <BlockMath math={"x_3 = \\frac{12 - 4.62 - 1.73}{4} \\approx 1.41"} />
                  <BlockMath math={"y_3 = \\frac{27 - 1.41 - 2(1.73)}{5} \\approx 4.43"} />
                  <BlockMath math={"z_3 = \\frac{18 - 2(1.41) - 4.43}{6} \\approx 1.79"} />
                </div>
              </div>

              {/* Fourth Iteration */}
              <div className="space-y-2 py-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fourth Iteration:</h3>
                <div className="w-full md:w-[80%] mx-auto p-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-sm space-y-2 text-center">
                  <BlockMath math={"x_4 = \\frac{12 - 4.43 - 1.79}{4} \\approx 1.445"} />
                  <BlockMath math={"y_4 = \\frac{27 - 1.445 - 2(1.79)}{5} \\approx 4.395"} />
                  <BlockMath math="z_4 = \frac{18 - 2(1.445) - 4.395}{6} \approx 1.785" />
                </div>
              </div>

              {/* Conclusion Box */}
              <div className="w-full md:w-[80%] mx-auto p-6 bg-emerald-50/70 dark:bg-emerald-950/30 border-t-4 border-emerald-600 dark:border-emerald-500 border-x border-b border-gray-200 dark:border-neutral-700 rounded-b-xl rounded-t-sm space-y-2 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Conclusion</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  The Gauss-Seidel method is simple to implement and can be very effective for certain types of systems. Its performance depends on the properties of the coefficient matrix; specifically, it works best when the matrix is diagonally dominant.
                </p>
              </div>
            </div>

            {/* Interactive Calculator Section */}
            <div className="step-intro-5 pt-8 border-t border-gray-300 dark:border-neutral-700">
              <GaussSeidel />
            </div>

            {/* Sequential Routing Navigation */}
            <AlgorithmNavigation />
          </section>
        </div>
      </FullscreenToggle>
    </>
  );
};

export default GaussSeidelPage;