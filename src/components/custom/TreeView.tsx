"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown, Search, X, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface TreeNode {
  id: number;
  label: string;
  children?: TreeNode[];
  icon?: React.ReactNode;
  data?: any; // Additional data for the node
}

interface TreeViewProps {
  data: TreeNode[];
  onNodeClick?: (node: TreeNode) => void;
  selectedNodeId?: string | number;
  className?: string;
  defaultExpandAll?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  filterText?: string;
  onFilterChange?: (value: string) => void;
}

interface TreeNodeItemProps {
  node: TreeNode;
  level: number;
  onNodeClick?: (node: TreeNode) => void;
  selectedNodeId?: string | number;
  defaultExpanded?: boolean;
  filterText?: string;
  forceExpanded?: boolean;
}

// Helper function to check if node or its children match filter
function nodeMatchesFilter(node: TreeNode, filterText: string): boolean {
  if (!filterText) return true;

  const searchLower = filterText.toLowerCase();

  // Check if current node matches
  if (node.label.toLowerCase().includes(searchLower)) {
    return true;
  }

  // Check if any children match
  if (node.children) {
    return node.children.some(child => nodeMatchesFilter(child, filterText));
  }

  return false;
}

// Helper function to highlight matching text
function highlightText(text: string, filterText: string) {
  if (!filterText) return text;

  const parts = text.split(new RegExp(`(${filterText})`, 'gi'));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === filterText.toLowerCase() ? (
          <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

function TreeNodeItem({
  node,
  level,
  onNodeClick,
  selectedNodeId,
  defaultExpanded = false,
  filterText = "",
  forceExpanded = false,
}: TreeNodeItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  // Auto-expand if filter matches children
  const shouldExpand = forceExpanded || Boolean(filterText && hasChildren && node.children!.some(child => nodeMatchesFilter(child, filterText)));
  const expanded = isExpanded || shouldExpand;

  // Don't render if doesn't match filter
  if (filterText && !nodeMatchesFilter(node, filterText)) {
    return null;
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren && !shouldExpand) {
      setIsExpanded(!isExpanded);
    }
  };

  const handleClick = () => {
    onNodeClick?.(node);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 py-1.5 px-2 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${isSelected ? 'bg-green-100 text-green-700 font-medium' : ''
          }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        {/* Toggle button */}
        <button
          onClick={handleToggle}
          className={`flex items-center justify-center w-5 h-5 rounded hover:bg-gray-200 transition-colors ${!hasChildren ? 'invisible' : ''
            }`}
        >
          {hasChildren && (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )
          )}
        </button>

        {/* Icon */}
        {node.icon && (
          <span className="flex items-center justify-center w-5 h-5 text-gray-600">
            {node.icon}
          </span>
        )}

        {/* Label with highlight */}
        <span className="flex-1 text-sm">
          {highlightText(node.label, filterText)}
        </span>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              selectedNodeId={selectedNodeId}
              defaultExpanded={defaultExpanded}
              filterText={filterText}
              forceExpanded={shouldExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({
  data,
  onNodeClick,
  selectedNodeId,
  className = "",
  defaultExpandAll = false,
  showSearch = false,
  searchPlaceholder = "Tìm kiếm...",
  filterText: externalFilterText,
  onFilterChange
}: TreeViewProps) {
  const [internalFilterText, setInternalFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use external filter if provided, otherwise use internal
  const filterText = externalFilterText !== undefined ? externalFilterText : internalFilterText;
  const setFilterText = onFilterChange || setInternalFilterText;

  // Get selected node label for display
  const selectedNode = useMemo(() => {
    const findNode = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === selectedNodeId) return node;
        if (node.children) {
          const found = findNode(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findNode(data);
  }, [data, selectedNodeId]);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!filterText) return data;
    return data.filter(node => nodeMatchesFilter(node, filterText));
  }, [data, filterText]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle node selection
  const handleNodeClick = (node: TreeNode) => {
    onNodeClick?.(node);
    setIsOpen(false);
    setFilterText(""); // Clear search when selecting
  };

  // Toggle dropdown
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`w-full relative ${className}`} ref={dropdownRef}>
      {/* Input Trigger */}
      <div
        className="relative cursor-pointer"
        onClick={handleToggleDropdown}
      >
        <Input
          type="text"
          placeholder="Chọn một mục..."
          value={selectedNode?.label || ""}
          readOnly
          className="pr-10 cursor-pointer"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg">
          <div className="p-3">
            {/* Search Box */}
            {showSearch && (
              <div className="mb-3 relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    className="pl-10 pr-10 h-10"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {filterText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterText("");
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {filterText && (
                  <p className="text-xs text-gray-500 mt-1">
                    Tìm thấy {filteredData.length} kết quả
                  </p>
                )}
              </div>
            )}

            {/* Tree Nodes */}
            <div className="border rounded-lg p-2 bg-white max-h-[400px] overflow-y-auto">
              {filteredData.length > 0 ? (
                filteredData.map((node) => (
                  <TreeNodeItem
                    key={node.id}
                    node={node}
                    level={0}
                    onNodeClick={handleNodeClick}
                    selectedNodeId={selectedNodeId}
                    defaultExpanded={defaultExpandAll}
                    filterText={filterText}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Không tìm thấy kết quả</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to build tree from flat data with parent_id
export function buildTree<T>(
  flatData: T[],
  idKey: keyof T,
  parentIdKey: keyof T,
  labelKey: keyof T
): TreeNode[] {
  const map = new Map<any, TreeNode>();
  const roots: TreeNode[] = [];

  // First pass: create all nodes
  flatData.forEach((item) => {
    const node: TreeNode = {
      id: Number(item[idKey]),
      label: String(item[labelKey] || ''),
      children: [],
      data: item,
    };
    map.set(item[idKey], node);
  });

  // Second pass: build tree structure
  flatData.forEach((item) => {
    const node = map.get(item[idKey])!;
    const parentId = Number(item[parentIdKey]);

    if (parentId === null || parentId === undefined || isNaN(parentId)) {
      roots.push(node);
    } else {
      const parent = map.get(parentId);
      if (parent) {
        parent.children!.push(node);
      } else {
        // If parent not found, treat as root
        roots.push(node);
      }
    }
  });

  return roots;
}
