import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/shared/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Algorithms from "./pages/Algorithms";
import DataStructures from "./pages/DataStructures";
import NotFound from "./pages/NotFound";

// Data Structure Visualizations
import ArrayVisualizer from "./components/visualizations/Arrays";
import LinkedListVisualizer from "./components/visualizations/LinkedLists";
import StackVisualizer from "./components/visualizations/Stacks";
import QueueVisualizer from "./components/visualizations/Queues";
import BinaryTreeVisualizer from "./components/visualizations/BinaryTrees";
import HashTablesVisualizer from "./components/visualizations/HashTables";
import GraphsVisualizer from "./components/visualizations/Graphs";
import TreesVisualizer from "./components/visualizations/Trees";
import HeapsVisualizer from "./components/visualizations/Heaps";

// Algorithm Visualizations
import SortingAlgorithmsVisualizer from "./components/visualizations/SortingAlgorithms";
import BinarySearchVisualizer from "./components/visualizations/BinarySearch";
import DivideAndConquerVisualizer from "./components/visualizations/DivideAndConquer";
import GraphTraversalsVisualizer from "./components/visualizations/GraphTraversals";
import Greedy1Visualizer from "./components/visualizations/Greedy1";
import Greedy2Visualizer from "./components/visualizations/Greedy2";
import DP1Visualizer from "./components/visualizations/DP1";
import DP2Visualizer from "./components/visualizations/DP2";
import DP3Visualizer from "./components/visualizations/DP3";
import DijkstraBellmanVisualizer from "./components/visualizations/DijkstraBellman";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<Algorithms />} />
          <Route path="/data-structures" element={<DataStructures />} />
          <Route path="/about" element={<About />} />

          {/* Data Structure Visualizations */}
          <Route path="/visualizations/arrays" element={<ArrayVisualizer />} />
          <Route path="/visualizations/linked-lists" element={<LinkedListVisualizer />} />
          <Route path="/visualizations/stacks" element={<StackVisualizer />} />
          <Route path="/visualizations/queues" element={<QueueVisualizer />} />
          <Route path="/visualizations/binary-trees" element={<BinaryTreeVisualizer />} />
            <Route path="/visualizations/hash-tables" element={<HashTablesVisualizer />} />
            <Route path="/visualizations/graphs" element={<GraphsVisualizer />} />
            <Route path="/visualizations/trees" element={<TreesVisualizer />} />
            <Route path="/visualizations/heaps" element={<HeapsVisualizer />} />

          {/* Algorithm Visualizations */}
          <Route path="/visualizations/sorting-algorithms" element={<SortingAlgorithmsVisualizer />} />
          <Route path="/visualizations/binary-search" element={<BinarySearchVisualizer />} />
            <Route path="/visualizations/divide-and-conquer" element={<DivideAndConquerVisualizer />} />
            <Route path="/visualizations/graph-traversals" element={<GraphTraversalsVisualizer />} />
            <Route path="/visualizations/greedy-1" element={<Greedy1Visualizer />} />
            <Route path="/visualizations/greedy-2" element={<Greedy2Visualizer />} />
            <Route path="/visualizations/dp-1" element={<DP1Visualizer />} />
            <Route path="/visualizations/dp-2" element={<DP2Visualizer />} />
            <Route path="/visualizations/dp-3" element={<DP3Visualizer />} />
            <Route path="/visualizations/dijkstra-bellman" element={<DijkstraBellmanVisualizer />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
