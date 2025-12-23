"use client"
import { PageTitle } from '@/components/custom/PageTitle'
import { buildTree, TreeNode, TreeView } from '@/components/custom/TreeView'
import React, { useEffect, useState } from 'react'
import AdmRightDTO from '@/dtos/adminitrations/AdmRightDTO'
import { ApiService } from '@/utils/api-service'
import ApiUrl from '@/constants/ApiUrl'
import { ApiActionCode } from '@/constants/SharedResources'
import AdmFeature from '@/dtos/adminitrations/AdmFeature'
import { useLoading } from '@/components/custom/LoadingContext'
import { useHandleError } from '@/hooks/useHandleError'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import BuildRightConfig from '@/entities/admin/BuildConfigRight'
import AdmFunction from '@/dtos/adminitrations/AdmFunction'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

export default function Right() {
  const [features, setFeatures] = useState<AdmFeature[]>([]);
  const [featureTreeData, setFeatureTreeData] = useState<TreeNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<TreeNode | undefined>();
  const [buildConfigRight, setBuildConfigRight] = useState<BuildRightConfig[]>([]);
  const [functions, setFunctions] = useState<AdmFunction[]>([]);
  const { showLoading, hideLoading } = useLoading();
  const handleError = useHandleError();

  async function setup() {
    try {
      showLoading();
      const request = new AdmRightDTO();
      const response = await ApiService.post<AdmRightDTO>(
        ApiUrl.Right,
        ApiActionCode.SetupViewForm,
        request
      );
      setFeatures(response.FeatureWeb ?? []);
      setFeatureTreeData(buildTree(response.FeatureWeb ?? [], "feature_id", "parent_id", "name"));

    } catch (error: any) {
      handleError(error);
    } finally {
      hideLoading();
    }
  }

  async function getItemForView(featureId: number) {
    try {
      showLoading();
      const request = new AdmRightDTO();
      request.FeatureId = featureId;
      const response = await ApiService.post<AdmRightDTO>(
        ApiUrl.Right,
        "GetItemsForView",
        request
      );
      console.log(response)
      setBuildConfigRight(response.BuildRightConfigs ?? []);
      setFunctions(response.Functions ?? []);
    } catch (error: any) {
      handleError(error);
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    setup();
  }, []);

  // Check if a specific function is enabled for a specific item
  const isFunctionEnabled = (itemId: number | undefined, functionId: number | undefined): boolean => {
    const item = buildConfigRight.find(config => config.ItemID === itemId);
    return item?.FunctionIDs?.includes(functionId ?? 0) ?? false;
  };

  // Toggle function for an item
  const toggleFunction = (itemId: number | undefined, functionId: number | undefined) => {
    console.log(itemId, functionId)
    if (!itemId || !functionId) return;

    setBuildConfigRight(prev => prev.map(config => {
      if (config.ItemID === itemId) {
        const currentFunctions = config.FunctionIDs ?? [];
        const isEnabled = currentFunctions.includes(functionId);

        return {
          ...config,
          FunctionIDs: isEnabled
            ? currentFunctions.filter(id => id !== functionId)
            : [...currentFunctions, functionId]
        };
      }
      return config;
    }));
  };

  // Save changes
  const handleSave = async () => {
    try {
      showLoading();
      const request = new AdmRightDTO();
      request.FeatureId = selectedNode?.id;
      request.BuildRightConfigs = buildConfigRight;

      await ApiService.post<AdmRightDTO>(
        ApiUrl.Right,
        "SaveRights",
        request
      );

      // Show success message or refresh data
      alert("Lưu thành công!");
    } catch (error: any) {
      handleError(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="space-y-4">
      <PageTitle title="Phân quyền" />

      <div className="w-full">
        <TreeView
          data={featureTreeData}
          showSearch
          defaultExpandAll
          selectedNodeId={selectedNode?.id}
          onNodeClick={(node) => {
            setSelectedNode(node)
            getItemForView(node.id)
          }}
        />
      </div>

      {selectedNode && buildConfigRight.length > 0 && (
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center">
            <div></div>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </Button>
          </div>

          <div className="border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px] text-black">Nhóm người dùng</TableHead>
                  {functions.map((func) => (
                    <TableHead key={func.function_id} className="text-center text-black">
                      {func.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {buildConfigRight.map((config) => (
                  <TableRow key={config.ItemID}>
                    <TableCell>{config.Name}</TableCell>
                    {functions.map((func) => (
                      <TableCell key={func.function_id} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={isFunctionEnabled(config.ItemID, func.function_id)}
                            onCheckedChange={() => toggleFunction(config.ItemID, func.function_id)}
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {selectedNode && buildConfigRight.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Không có dữ liệu phân quyền cho mục này</p>
        </div>
      )}
    </div>
  )
}
