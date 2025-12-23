"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import adm_feature from "@/entities/authentications/adm_feature";
import ApiUrl from "@/constants/ApiUrl";
import AuthenticationDTO from "@/dtos/adminitrations/AuthenticationDTO";
import { useHandleError } from "@/hooks/useHandleError";
import { ApiService } from "@/utils/api-service";
import LocalStorageService from "@/utils/LocalStorageService";
import { MenuIcon } from '@/components/custom/MenuIcon';
import { useRouter, usePathname } from "next/navigation";

export function LeftMenu() {
  const [featureData, setFeatureData] = useState<adm_feature[]>([]);
  const [activeParent, setActiveParent] = useState<number | null>(null);
  const errorHandler = useHandleError();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const getUserMenu = async () => {
      try {
        const response = await ApiService.get<AuthenticationDTO>(
          ApiUrl.GetUserMenu,
          ""
        );
        LocalStorageService.setFeatureData(
          JSON.stringify(response.ListFeatures)
        );
        setFeatureData(response.ListFeatures ?? []);
      } catch (ex) {
        errorHandler(ex as Error);
      }
    };

    const featureDataString = LocalStorageService.getFeatureData();
    if (featureDataString) {
      try {
        const oldFeature = JSON.parse(featureDataString);
        setFeatureData(oldFeature);
      } catch {
        getUserMenu();
      }
    } else {
      getUserMenu();
    }
  }, []);

  // Tách menu cha và con
  const parentItems = featureData.filter((item) => !item.parent_id);
  const childItems = featureData.filter((item) => item.parent_id);

  // Nhóm các menu con theo parent_id
  const childItemsByParent = childItems.reduce<Record<number, adm_feature[]>>(
    (acc, item) => {
      if (item.parent_id) {
        if (!acc[item.parent_id]) {
          acc[item.parent_id] = [];
        }
        acc[item.parent_id].push(item);
      }
      return acc;
    },
    {}
  );

  return (
    <div className="flex flex-row">
      <TooltipProvider>
        {/* Cột icon bên trái */}
        <div className="flex flex-col items-center space-y-2 p-2 bg-gray-100 w-16">
          {parentItems.map((parent) => {
            const isMenuIconActive = childItemsByParent[parent.feature_id ?? 0]?.some((child) => child.url === pathname);
            return <Tooltip key={parent.feature_id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeParent === parent.feature_id ? "secondary" : "ghost"}
                  className={`w-12 h-12 p-0 flex items-center justify-center ${isMenuIconActive ? "bg-gray-300" : ""}`}
                  onClick={() =>
                    setActiveParent(
                      (activeParent === parent.feature_id) ? null : (parent.feature_id ?? 0)
                    )
                  }
                >
                  {/* TODO: thay icon thật từ parent.icon_name hoặc tương tự */}
                  <MenuIcon name={parent.icon ?? 'home'} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{parent.name}</TooltipContent>
            </Tooltip>
          })}
        </div>

        {/* Panel hiển thị menu con khi click với animation */}
        <div
          className={`bg-white shadow-md overflow-hidden transition-all duration-300 ease-in-out ${activeParent ? 'w-60 opacity-100' : 'w-0 opacity-0'
            }`}
        >
          {activeParent && (
            <div className="p-4 animate-slideIn">
              <h3 className="font-semibold mb-2">
                {parentItems.find((p) => p.feature_id === activeParent)?.name}
              </h3>
              <div className="flex flex-col space-y-2">
                {childItemsByParent[activeParent]?.map((child) => {
                  const isActive = pathname === child.url;
                  return <Button
                    key={child.feature_id}
                    variant="ghost"
                    className={`justify-start hover:bg-green-600 hover:text-white transition-colors ${isActive ? 'bg-green-600 text-white' : ''}`}

                    onClick={() => router.push(child.url ?? '')}
                  >
                    {child.name}
                  </Button>
                })}
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>
    </div>
  );
}
