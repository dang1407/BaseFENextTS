"use client";

import { TreeView, TreeNode, buildTree } from "@/components/custom/TreeView";
import { Folder, File, Home, Settings, Users } from "lucide-react";
import { useState } from "react";

/**
 * Example 1: Using TreeView with pre-structured tree data
 */
export function TreeViewExample1() {
  const [selectedNode, setSelectedNode] = useState<string | number>();

  // Dữ liệu đã có cấu trúc cây
  const treeData: TreeNode[] = [
    {
      id: 1,
      label: "Root Folder",
      icon: <Folder className="w-4 h-4" />,
      children: [
        {
          id: 2,
          label: "Documents",
          icon: <Folder className="w-4 h-4" />,
          children: [
            { id: 3, label: "Report.pdf", icon: <File className="w-4 h-4" /> },
            { id: 4, label: "Presentation.pptx", icon: <File className="w-4 h-4" /> },
          ],
        },
        {
          id: 5,
          label: "Images",
          icon: <Folder className="w-4 h-4" />,
          children: [
            { id: 6, label: "Photo1.jpg", icon: <File className="w-4 h-4" /> },
            { id: 7, label: "Photo2.png", icon: <File className="w-4 h-4" /> },
          ],
        },
      ],
    },
    {
      id: 8,
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      children: [
        { id: 9, label: "General", icon: <File className="w-4 h-4" /> },
        { id: 10, label: "Security", icon: <File className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">TreeView Example 1: Pre-structured Data</h2>
      <div className="border rounded-lg p-4 bg-white">
        <TreeView
          data={treeData}
          selectedNodeId={selectedNode}
          onNodeClick={(node) => {
            setSelectedNode(node.id);
            console.log("Selected node:", node);
          }}
          defaultExpandAll={false}
        />
      </div>
      {selectedNode && (
        <div className="mt-4 p-3 bg-green-50 rounded-md">
          <p className="text-sm text-green-800">Selected ID: {selectedNode}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Using TreeView with flat data (like database records)
 */
export function TreeViewExample2() {
  const [selectedNode, setSelectedNode] = useState<string | number>();

  // Dữ liệu dạng flat (như từ database)
  interface Category {
    category_id: number;
    name: string;
    parent_id?: number;
    description?: string;
  }

  const flatCategories: Category[] = [
    { category_id: 1, name: "Electronics", parent_id: undefined },
    { category_id: 2, name: "Computers", parent_id: 1 },
    { category_id: 3, name: "Laptops", parent_id: 2 },
    { category_id: 4, name: "Desktops", parent_id: 2 },
    { category_id: 5, name: "Phones", parent_id: 1 },
    { category_id: 6, name: "Smartphones", parent_id: 5 },
    { category_id: 7, name: "Feature Phones", parent_id: 5 },
    { category_id: 8, name: "Clothing", parent_id: undefined },
    { category_id: 9, name: "Men", parent_id: 8 },
    { category_id: 10, name: "Women", parent_id: 8 },
  ];

  // Chuyển đổi flat data thành tree structure
  const treeData = buildTree(
    flatCategories,
    'category_id',
    'parent_id',
    'name'
  );

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">TreeView Example 2: Flat Data with buildTree</h2>
      <div className="border rounded-lg p-4 bg-white">
        <TreeView
          data={treeData}
          selectedNodeId={selectedNode}
          onNodeClick={(node) => {
            setSelectedNode(node.id);
            console.log("Selected category:", node.data);
          }}
          defaultExpandAll={true}
        />
      </div>
      {selectedNode && (
        <div className="mt-4 p-3 bg-green-50 rounded-md">
          <p className="text-sm text-green-800">Selected Category ID: {selectedNode}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Organization Structure
 */
export function TreeViewExample3() {
  const [selectedNode, setSelectedNode] = useState<string | number>();

  interface Employee {
    id: number;
    name: string;
    position: string;
    manager_id?: number;
  }

  const employees: Employee[] = [
    { id: 1, name: "John Doe", position: "CEO", manager_id: undefined },
    { id: 2, name: "Jane Smith", position: "CTO", manager_id: 1 },
    { id: 3, name: "Bob Johnson", position: "CFO", manager_id: 1 },
    { id: 4, name: "Alice Brown", position: "Dev Lead", manager_id: 2 },
    { id: 5, name: "Charlie Wilson", position: "Senior Dev", manager_id: 4 },
    { id: 6, name: "Diana Lee", position: "Junior Dev", manager_id: 4 },
    { id: 7, name: "Eve Davis", position: "Accountant", manager_id: 3 },
  ];

  const orgTree = buildTree(
    employees.map(emp => ({
      ...emp,
      displayName: `${emp.name} - ${emp.position}`
    })),
    'id',
    'manager_id',
    'displayName'
  );

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-bold mb-4">TreeView Example 3: Organization Chart</h2>
      <div className="border rounded-lg p-4 bg-white">
        <TreeView
          data={orgTree}
          selectedNodeId={selectedNode}
          onNodeClick={(node) => {
            setSelectedNode(node.id);
            console.log("Selected employee:", node.data);
          }}
          defaultExpandAll={true}
        />
      </div>
    </div>
  );
}

/**
 * Combined Examples Page
 */
export default function TreeViewExamplesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">TreeView Component Examples</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <TreeViewExample1 />
        <TreeViewExample2 />
        <TreeViewExample3 />
      </div>
    </div>
  );
}
