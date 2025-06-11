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

// Algorithm Visualizations
import SortingAlgorithmsVisualizer from "./components/visualizations/SortingAlgorithms";
import BinarySearchVisualizer from "./components/visualizations/BinarySearch";

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

          {/* Algorithm Visualizations */}
          <Route path="/visualizations/sorting-algorithms" element={<SortingAlgorithmsVisualizer />} />
          <Route path="/visualizations/binary-search" element={<BinarySearchVisualizer />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
