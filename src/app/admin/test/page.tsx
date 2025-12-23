"use client"
import { TreeNode, TreeView } from '@/components/custom/TreeView'
import React, { useState } from 'react'

export default function page() {

  const [selectedNode, setSelectedNode] = useState<TreeNode | undefined>();

  return (
    <div>
      <TreeView
        showSearch
        data={[{
          id: 1,
          label: 'Node 1',
          children: [
            {
              id: 2,
              label: 'Node 1.1',
              children: [
                {
                  id: 3,
                  label: 'Node 1.1.1',
                },
                {
                  id: 4,
                  label: 'Node 1.1.2',
                },
              ],
            },
            {
              id: 5,
              label: 'Node 1.2',
            },
          ],
        }]}
        selectedNodeId={selectedNode?.id}
        onNodeClick={(node) => setSelectedNode(node)}
      />
    </div>
  )
}
